import { collection, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normalizePath } from './storageService';

const COLLECTION = 'siteImages';

// Each siteImages/{pageId} document stores a download URL next to the storage
// path it came from. The shapes differ per page type:
//   slides  -> { slides: [url],  storagePaths: [path] }
//   gallery -> { photos: [url],  storagePaths: [path] }
//   panels  -> { panels: {key: url}, storagePaths: {key: path} }
//
// usePageImages prefers those stored URLs, so after a bucket write the URLs
// (and, for a move, the stored paths) must be refreshed to match the object.
export async function refreshSiteImageReferences(path, previousPath = '') {
  if (!db || !storage) return { updated: 0 };

  const targetPath = normalizePath(path);
  const sourcePath = previousPath ? normalizePath(previousPath) : targetPath;
  if (!targetPath) return { updated: 0 };

  let nextUrl;
  try {
    nextUrl = await getDownloadURL(ref(storage, targetPath));
  } catch {
    return { updated: 0 };
  }

  const matches = (storedPath) => {
    const stored = normalizePath(storedPath);
    return stored === targetPath || (sourcePath !== targetPath && stored === sourcePath);
  };
  const isSource = (storedPath) => sourcePath !== targetPath && normalizePath(storedPath) === sourcePath;

  const syncArray = (urls, paths) => {
    const nextUrls = urls.slice();
    const nextPaths = paths.slice();
    let changed = false;

    paths.forEach((storedPath, index) => {
      if (!matches(storedPath)) return;
      if (nextUrls[index] !== nextUrl) {
        nextUrls[index] = nextUrl;
        changed = true;
      }
      if (isSource(storedPath)) {
        nextPaths[index] = targetPath;
        changed = true;
      }
    });

    return changed ? { urls: nextUrls, paths: nextPaths } : null;
  };

  const snapshot = await getDocs(collection(db, COLLECTION));
  const updates = [];

  snapshot.forEach((document) => {
    const data = document.data() || {};
    const patch = {};

    if (Array.isArray(data.slides) && Array.isArray(data.storagePaths)) {
      const next = syncArray(data.slides, data.storagePaths);
      if (next) {
        patch.slides = next.urls;
        patch.storagePaths = next.paths;
      }
    } else if (Array.isArray(data.photos) && Array.isArray(data.storagePaths)) {
      const next = syncArray(data.photos, data.storagePaths);
      if (next) {
        patch.photos = next.urls;
        patch.storagePaths = next.paths;
      }
    } else if (
      data.panels && typeof data.panels === 'object' &&
      data.storagePaths && typeof data.storagePaths === 'object' && !Array.isArray(data.storagePaths)
    ) {
      const nextPanels = { ...data.panels };
      const nextPaths = { ...data.storagePaths };
      let changed = false;

      Object.entries(data.storagePaths).forEach(([key, storedPath]) => {
        if (!matches(storedPath)) return;
        if (nextPanels[key] !== nextUrl) {
          nextPanels[key] = nextUrl;
          changed = true;
        }
        if (isSource(storedPath)) {
          nextPaths[key] = targetPath;
          changed = true;
        }
      });

      if (changed) {
        patch.panels = nextPanels;
        patch.storagePaths = nextPaths;
      }
    }

    if (Object.keys(patch).length) updates.push({ ref: document.ref, patch });
  });

  for (const update of updates) {
    await updateDoc(update.ref, { ...update.patch, updatedAt: serverTimestamp() });
  }

  return { updated: updates.length };
}
