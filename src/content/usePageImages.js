import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { defaultImages } from './defaultImages';
import { isImage, listFolder } from '../storage/storageService';

// Where each page's images live in the bucket. `slides`/`photos` folders are
// discovered at runtime, so the number of images follows whatever is currently
// in the bucket (uploaded or removed from the admin panel). `panels` keeps its
// named slots because those are addressed individually.
const sourceMap = {
  home: { type: 'slides', folder: 'home' },
  techadv: { type: 'slides', folder: 'portfolio/tech-advisory' },
  assetmanagement: { type: 'slides', folder: 'portfolio/asset-management' },
  energyaudit: { type: 'slides', folder: 'portfolio/energy-audit' },
  energymanagement: { type: 'slides', folder: 'portfolio/energy-management' },
  projectmanagement: { type: 'slides', folder: 'portfolio/project-management' },
  valuation: { type: 'slides', folder: 'portfolio/valuation' },
  value: { type: 'slides', folder: 'portfolio/value-engineering' },
  manufacturing: {
    type: 'panels',
    paths: {
      spm: 'portfolio/manufacturing/spm.jpg',
      airPollution: 'portfolio/manufacturing/air-pollution.png',
      structure: 'portfolio/manufacturing/structure.png',
      fabrication: 'portfolio/manufacturing/fabrication.png'
    }
  },
  gallery: { type: 'photos', folder: 'gallery' }
};

// Storage lists objects lexicographically, so slide-10 would sort before
// slide-2. Compare the names numerically-aware instead.
const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });

// Memory cache across page transitions.
const urlCache = new Map();

function mergeStored(fallback, remote) {
  const merged = { ...fallback, ...remote };

  if (Array.isArray(fallback.slides) && Array.isArray(remote.slides)) {
    const length = Math.max(fallback.slides.length, remote.slides.length);
    merged.slides = Array.from({ length }, (_, index) => remote.slides[index] || fallback.slides[index]);
  } else if (fallback.panels && remote.panels) {
    merged.panels = { ...fallback.panels, ...remote.panels };
  } else if (Array.isArray(fallback.photos) && Array.isArray(remote.photos)) {
    merged.photos = remote.photos;
  }

  return merged;
}

async function discoverFolder(folder) {
  const { files } = await listFolder(folder);

  return files
    .filter((file) => isImage(file.contentType, file.path))
    .sort(byName)
    .map((file) => file.url)
    .filter(Boolean);
}

async function resolvePanels(paths) {
  const resolved = {};
  let found = false;

  await Promise.all(Object.entries(paths).map(async ([key, storagePath]) => {
    try {
      resolved[key] = await getDownloadURL(ref(storage, storagePath));
      found = true;
    } catch {
      // Leave this slot on the bundled default.
    }
  }));

  return found ? resolved : null;
}

export default function usePageImages(pageId) {
  const fallback = useMemo(() => defaultImages[pageId] || {}, [pageId]);
  const [images, setImages] = useState(() => urlCache.get(pageId) || fallback);

  useEffect(() => {
    let mounted = true;

    if (urlCache.has(pageId)) {
      setImages(urlCache.get(pageId));
      return undefined;
    }

    const source = sourceMap[pageId];
    if (!source || !storage) return undefined;

    const commit = (next) => {
      if (!mounted) return;
      urlCache.set(pageId, next);
      setImages(next);
    };

    async function resolve() {
      try {
        if (source.type === 'slides' || source.type === 'photos') {
          const urls = await discoverFolder(source.folder);
          if (urls.length) {
            commit(source.type === 'slides' ? { ...fallback, slides: urls } : { ...fallback, photos: urls });
            return;
          }
        } else if (source.type === 'panels') {
          const panels = await resolvePanels(source.paths);
          if (panels) {
            commit({ ...fallback, panels: { ...(fallback.panels || {}), ...panels } });
            return;
          }
        }
      } catch {
        // Bucket not readable — fall through to the stored document.
      }

      try {
        const snapshot = await getDoc(doc(db, 'siteImages', pageId));
        if (snapshot.exists()) commit(mergeStored(fallback, snapshot.data()));
      } catch {
        // Keep the bundled defaults.
      }
    }

    resolve();

    return () => {
      mounted = false;
    };
  }, [pageId, fallback]);

  return images;
}
