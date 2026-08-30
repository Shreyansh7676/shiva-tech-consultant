import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { makePageDocument } from './contentRegistry';

export default function usePageContent(pageId) {
  const fallback = useMemo(() => makePageDocument(pageId), [pageId]);
  const [page, setPage] = useState(fallback);

  useEffect(() => {
    let mounted = true;
    setPage(fallback);
    getDoc(doc(db, 'pageContent', pageId)).then((snapshot) => {
      if (!mounted || !snapshot.exists()) return;
      const remote = snapshot.data();
      const sections = Object.fromEntries(Object.entries(fallback.sections).map(([id, local]) => [id, { ...local, ...(remote.sections?.[id] || {}) }]));
      setPage({ ...fallback, ...remote, sections });
    }).catch(() => {});
    return () => { mounted = false; };
  }, [pageId, fallback]);

  return page.sections;
}
