import React, { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getPageDefinition, makePageDocument, pageRegistry } from '../content/contentRegistry';
import { sanitizeRichHtml } from '../content/RichContent';
import ImageManager from './ImageManager';
import './admin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setStatus('Unable to sign in with those credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = async () => {
    if (!email) {
      setStatus('Enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('Password-reset email sent.');
    } catch {
      setStatus('Unable to send a password-reset email.');
    }
  };

  return <main className="admin-login"><form onSubmit={submit} className="admin-card"><h1>Admin dashboard</h1><p>Sign in with your administrator email and password.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label><button disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button><button type="button" className="admin-link" onClick={reset}>Forgot password?</button>{status && <p role="status">{status}</p>}</form></main>;
}

function ContentEditor({ onDirtyChange }) {
  const [pageId, setPageId] = useState(pageRegistry[0].id);
  const [sectionId, setSectionId] = useState(pageRegistry[0].sections[0].id);
  const [page, setPage] = useState(() => makePageDocument(pageRegistry[0].id));
  const [draft, setDraft] = useState('');
  const [savedHtml, setSavedHtml] = useState('');
  const [sectionRevision, setSectionRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const definition = useMemo(() => getPageDefinition(pageId), [pageId]);
  const dirty = draft !== savedHtml;

  const loadPage = async (nextPageId, requestedSectionId) => {
    setLoading(true);
    setStatus('');
    const fallback = makePageDocument(nextPageId);
    const activeSection = requestedSectionId || getPageDefinition(nextPageId).sections[0].id;

    try {
      const snapshot = await getDoc(doc(db, 'pageContent', nextPageId));
      const remote = snapshot.exists() ? snapshot.data() : {};
      const sections = Object.fromEntries(Object.entries(fallback.sections).map(([id, local]) => [id, { ...local, ...(remote.sections?.[id] || {}) }]));
      const loaded = { ...fallback, ...remote, sections };
      setPage(loaded);
      setSectionId(activeSection);
      setDraft(loaded.sections[activeSection].html);
      setSavedHtml(loaded.sections[activeSection].html);
      setSectionRevision(loaded.sections[activeSection].revision || 0);
    } catch {
      setStatus('Unable to load Firestore content. Showing the built-in content until the connection is restored.');
      setPage(fallback);
      setSectionId(activeSection);
      setDraft(fallback.sections[activeSection].html);
      setSavedHtml(fallback.sections[activeSection].html);
      setSectionRevision(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(pageId, sectionId);
    // Load only on first render. Dropdown handlers explicitly load future pages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    const warning = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warning);
    return () => window.removeEventListener('beforeunload', warning);
  }, [dirty]);

  const handleEditorInit = (_event, editor) => {
    // TinyMCE normalizes saved HTML while initializing. Its normalized initial
    // value is the baseline; it must never lock page selection by itself.
    const initialHtml = editor.getContent();
    setDraft(initialHtml);
    setSavedHtml(initialHtml);
  };

  const submit = async () => {
    setSaving(true);
    setStatus('');
    const cleanHtml = sanitizeRichHtml(draft);

    try {
      await runTransaction(db, async (transaction) => {
        const contentRef = doc(db, 'pageContent', pageId);
        const snapshot = await transaction.get(contentRef);

        if (!snapshot.exists()) {
          const seeded = makePageDocument(pageId);
          seeded.sections[sectionId] = { html: cleanHtml, revision: 1 };
          transaction.set(contentRef, { ...seeded, updatedAt: serverTimestamp() });
          return;
        }

        const current = snapshot.data();
        const currentRevision = current.sections?.[sectionId]?.revision || 0;
        if (currentRevision !== sectionRevision) throw new Error('conflict');
        transaction.update(contentRef, {
          [`sections.${sectionId}.html`]: cleanHtml,
          [`sections.${sectionId}.revision`]: currentRevision + 1,
          revision: (current.revision || 0) + 1,
          updatedAt: serverTimestamp()
        });
      });

      setDraft(cleanHtml);
      setSavedHtml(cleanHtml);
      setSectionRevision((value) => value + 1);
      setPage((current) => ({ ...current, sections: { ...current.sections, [sectionId]: { html: cleanHtml, revision: sectionRevision + 1 } } }));
      setStatus('Changes submitted successfully. You can select another page or section.');
    } catch (error) {
      setStatus(error.message === 'conflict' ? 'This section changed elsewhere. Refresh the page, copy your draft if needed, and reload the latest content.' : 'Save failed. Your changes remain in the editor.');
    } finally {
      setSaving(false);
    }
  };

  const choosePage = (event) => {
    if (dirty || saving) return;
    const nextPageId = event.target.value;
    setPageId(nextPageId);
    loadPage(nextPageId, getPageDefinition(nextPageId).sections[0].id);
  };

  const chooseSection = (event) => {
    if (dirty || saving) return;
    const nextSectionId = event.target.value;
    setSectionId(nextSectionId);
    setDraft(page.sections[nextSectionId].html);
    setSavedHtml(page.sections[nextSectionId].html);
    setSectionRevision(page.sections[nextSectionId].revision || 0);
    setStatus('');
  };

  return <section className="admin-card admin-editor"><div className="admin-selectors"><label>Webpage<select value={pageId} onChange={choosePage} disabled={dirty || saving}>{pageRegistry.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label><label>Page section<select value={sectionId} onChange={chooseSection} disabled={dirty || saving}>{definition.sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}</select></label><a href={definition.path} target="_blank" rel="noreferrer">View public page</a></div>{dirty && <p className="admin-warning">Submit changes before choosing another webpage or section.</p>}{loading ? <p>Loading content…</p> : <Editor key={`${pageId}-${sectionId}-${sectionRevision}`} apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'} initialValue={savedHtml} onInit={handleEditorInit} onEditorChange={setDraft} init={{ height: 520, menubar: false, plugins: 'advlist autolink lists link table preview fullscreen wordcount', toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | removeformat | preview fullscreen', content_style: 'body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.55; }', valid_elements: 'p,br,strong/b,em/i,u,h1,h2,h3,h4,ul,ol,li,a[href|target|rel],blockquote,table,thead,tbody,tr,th[colspan|rowspan],td[colspan|rowspan]' }} />}<div className="admin-actions"><button onClick={submit} disabled={!dirty || saving || loading}>{saving ? 'Submitting…' : 'Submit changes'}</button>{status && <p role="status">{status}</p>}</div></section>;
}

export default function AdminDashboard() {
  const [user, setUser] = useState(undefined);
  const [admin, setAdmin] = useState(false);
  const [view, setView] = useState('content');
  const [dirty, setDirty] = useState(false);

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser || null);
    if (!nextUser) {
      setAdmin(false);
      return;
    }
    try {
      const token = await nextUser.getIdTokenResult();
      setAdmin(token.claims.admin === true);
    } catch {
      setAdmin(false);
    }
  }), []);

  if (user === undefined) return <main className="admin-login"><p>Checking authentication…</p></main>;
  if (!user) return <AdminLogin />;
  if (!admin) return <main className="admin-login"><section className="admin-card"><h1>Access denied</h1><p>This signed-in account is not an administrator.</p><button onClick={() => signOut(auth)}>Sign out</button></section></main>;

  const changeView = (next) => {
    if (next === view) return;
    if (view === 'content' && dirty && !window.confirm('You have unsaved content changes. Switch to images and discard them?')) return;
    setDirty(false);
    setView(next);
  };

  return <main className="admin-shell"><header><div><p className="admin-eyebrow">Administration</p><h1>{view === 'content' ? 'Website content' : 'Image storage'}</h1><p>{user.email}</p></div><div className="admin-header-actions"><nav className="admin-tabs"><button type="button" className={view === 'content' ? 'is-active' : ''} onClick={() => changeView('content')}>Content</button><button type="button" className={view === 'images' ? 'is-active' : ''} onClick={() => changeView('images')}>Images</button></nav><button className="admin-outline" onClick={() => signOut(auth)}>Sign out</button></div></header>{view === 'content' ? <ContentEditor onDirtyChange={setDirty} /> : <ImageManager />}</main>;
}
