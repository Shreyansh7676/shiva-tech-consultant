import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BUCKET_ROOT,
  deleteObjectsAtPaths,
  fileExtension,
  formatBytes,
  isImage,
  joinPath,
  listFolder,
  parentFolder,
  renameObject,
  sanitizeFileName,
  uploadObject
} from '../storage/storageService';
import { refreshSiteImageReferences } from '../storage/siteImageSync';
import { clearImageCache } from '../content/usePageImages';

const ignoreSyncFailure = () => {};

const formatTimestamp = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const relativeFolderName = (folder, prefix) => (prefix && folder.startsWith(`${prefix}/`) ? folder.slice(prefix.length + 1) : folder);
const locationLabel = (prefix) => (prefix ? `${prefix}/` : 'the bucket root');

export default function ImageManager() {
  const [prefix, setPrefix] = useState(BUCKET_ROOT);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);

  const uploadInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceTargetRef = useRef('');

  const reportProgress = useCallback((snapshot) => {
    setProgress(snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0);
  }, []);

  const load = useCallback(async (target) => {
    setLoading(true);
    setError('');
    try {
      const result = await listFolder(target);
      setFolders(result.folders);
      setFiles(result.files);
      setPageToken(result.nextPageToken);
      setPrefix(result.prefix);
      setSelected(new Set());
    } catch (loadError) {
      setFolders([]);
      setFiles([]);
      setPageToken(null);
      setError(loadError?.message || 'Unable to read the bucket.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(prefix);
  }, [prefix, load]);

  const loadMore = async () => {
    if (!pageToken || loadingMore) return;
    setLoadingMore(true);
    setError('');
    try {
      const result = await listFolder(prefix, { pageToken });
      setFolders(result.folders);
      setFiles((current) => [...current, ...result.files]);
      setPageToken(result.nextPageToken);
    } catch (moreError) {
      setError(moreError?.message || 'Unable to load more objects.');
    } finally {
      setLoadingMore(false);
    }
  };

  const uploadFiles = useCallback(async (fileList) => {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    setBusy(true);
    setError('');
    setStatus('');
    let uploaded = 0;
    try {
      for (const file of picked) {
        const name = sanitizeFileName(file.name);
        if (!name) continue;
        const path = joinPath(prefix, name);
        await uploadObject(path, file, { onProgress: reportProgress });
        await refreshSiteImageReferences(path).catch(ignoreSyncFailure);
        uploaded += 1;
      }
      setStatus(`Uploaded ${uploaded} file${uploaded === 1 ? '' : 's'} to ${locationLabel(prefix)}.`);
      clearImageCache();
      await load(prefix);
    } catch (uploadError) {
      setError(uploadError?.message || 'Upload failed.');
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [prefix, load, reportProgress]);

  const handleReplace = async (event) => {
    const file = event.target.files?.[0];
    const target = replaceTargetRef.current;
    event.target.value = '';
    if (!file || !target) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await uploadObject(target, file, { onProgress: reportProgress });
      await refreshSiteImageReferences(target).catch(ignoreSyncFailure);
      setStatus(`Replaced ${target}.`);
      clearImageCache();
      await load(prefix);
    } catch (replaceError) {
      setError(replaceError?.message || 'Replace failed.');
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const startReplace = (file) => {
    replaceTargetRef.current = file.path;
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const startRename = async (file) => {
    const nextName = window.prompt('Rename file', file.name);
    if (!nextName || nextName === file.name) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const result = await renameObject(file.path, nextName);
      await refreshSiteImageReferences(result.path, file.path).catch(ignoreSyncFailure);
      setStatus(`Renamed to ${result.path}.`);
      clearImageCache();
      await load(prefix);
    } catch (renameError) {
      setError(renameError?.message || 'Rename failed.');
    } finally {
      setBusy(false);
    }
  };

  const removePaths = async (paths) => {
    if (!paths.length) return;
    if (!window.confirm(`Delete ${paths.length} object${paths.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const { deleted, failed } = await deleteObjectsAtPaths(paths);
      setStatus(`Deleted ${deleted.length} object${deleted.length === 1 ? '' : 's'}.`);
      if (failed.length) {
        setError(failed.map((entry) => `${entry.path}: ${entry.error?.message || 'failed'}`).join('; '));
      }
      clearImageCache();
      await load(prefix);
    } catch (deleteError) {
      setError(deleteError?.message || 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = async (file) => {
    if (!file.url) return;
    try {
      await navigator.clipboard.writeText(file.url);
      setStatus(`Copied the download URL for ${file.name}.`);
    } catch {
      setError('Clipboard access was blocked. Use Open to view the file instead.');
    }
  };

  const toggleSelected = (path) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const allSelected = files.length > 0 && files.every((file) => selected.has(file.path));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(files.map((file) => file.path)));
  const segments = useMemo(() => prefix.split('/').filter(Boolean), [prefix]);
  const parent = parentFolder(prefix);

  return (
    <section
      className={`admin-card storage-manager${dragging ? ' is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!busy) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!busy) uploadFiles(event.dataTransfer?.files);
      }}
    >
      <div className="storage-toolbar">
        <div>
          <p className="admin-eyebrow">Bucket objects</p>
          <h2>Image storage</h2>
        </div>
        <div className="storage-toolbar-actions">
          <button type="button" onClick={() => load(prefix)} disabled={busy || loading}>Refresh</button>
          <button type="button" onClick={() => uploadInputRef.current?.click()} disabled={busy}>Upload here</button>
          <button type="button" className="danger" onClick={() => removePaths([...selected])} disabled={busy || !selected.size}>
            Delete selected ({selected.size})
          </button>
        </div>
      </div>

      <nav className="storage-breadcrumbs" aria-label="Bucket path">
        <button
          type="button"
          className="storage-back"
          onClick={() => setPrefix(parent)}
          disabled={!prefix || busy}
          title={prefix ? `Back to ${locationLabel(parent)}` : 'Already at the bucket root'}
        >
          ← Back
        </button>
        <button type="button" onClick={() => setPrefix(BUCKET_ROOT)} disabled={!prefix || busy}>bucket</button>
        {segments.map((segment, index) => {
          const target = segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          return (
            <React.Fragment key={target}>
              <span>/</span>
              <button type="button" onClick={() => setPrefix(target)} disabled={isLast || busy}>{segment}</button>
            </React.Fragment>
          );
        })}
      </nav>

      {status && <p role="status" className="storage-status">{status}</p>}
      {error && <p role="alert" className="admin-warning">{error}</p>}
      {progress !== null && (
        <div className="storage-progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      )}

      {loading ? (
        <p className="storage-empty">Loading objects…</p>
      ) : (
        <div className="storage-table-wrap">
          <table className="storage-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={!files.length} aria-label="Select all files" /></th>
                <th>Preview</th>
                <th>Name</th>
                <th>Size</th>
                <th>Type</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {folders.map((folder) => (
                <tr key={folder}>
                  <td />
                  <td><span className="storage-file-icon">DIR</span></td>
                  <td>
                    <button type="button" className="storage-folder" onClick={() => setPrefix(folder)} disabled={busy}>
                      {relativeFolderName(folder, prefix)}/
                    </button>
                  </td>
                  <td>—</td>
                  <td>Folder</td>
                  <td>—</td>
                  <td />
                </tr>
              ))}
              {files.map((file) => (
                <tr key={file.path}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(file.path)}
                      onChange={() => toggleSelected(file.path)}
                      aria-label={`Select ${file.name}`}
                    />
                  </td>
                  <td>
                    {isImage(file.contentType, file.path) && file.url ? (
                      <img className="storage-thumb" src={file.url} alt={file.name} loading="lazy" />
                    ) : (
                      <span className="storage-file-icon">{(fileExtension(file.path) || 'file').slice(0, 4)}</span>
                    )}
                  </td>
                  <td>{file.name}</td>
                  <td>{file.size == null ? '—' : formatBytes(file.size)}</td>
                  <td>{file.contentType || 'unknown'}</td>
                  <td>{formatTimestamp(file.updated)}</td>
                  <td>
                    <div className="storage-actions">
                      <button type="button" onClick={() => copyUrl(file)} disabled={busy || !file.url}>Copy URL</button>
                      <a href={file.url || undefined} target="_blank" rel="noreferrer">Open</a>
                      <button type="button" onClick={() => startReplace(file)} disabled={busy}>Replace</button>
                      <button type="button" onClick={() => startRename(file)} disabled={busy}>Rename</button>
                      <button type="button" className="danger" onClick={() => removePaths([file.path])} disabled={busy}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!folders.length && !files.length && (
                <tr><td colSpan={7} className="storage-empty">This folder is empty. Drop files here to upload.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pageToken && !loading && (
        <div className="storage-more">
          <button type="button" onClick={loadMore} disabled={busy || loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <div className="storage-dropzone">Drop files here to upload into <strong>{locationLabel(prefix)}</strong></div>

      <input
        ref={uploadInputRef}
        type="file"
        multiple
        hidden
        onChange={(event) => {
          uploadFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <input ref={replaceInputRef} type="file" hidden onChange={handleReplace} />
    </section>
  );
}
