import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { defaultImages } from './defaultImages';

const storagePathMap = {
  home: {
    type: 'slides',
    paths: ['site/home/slide-1.png', 'site/home/slide-2.png', 'site/home/slide-3.png']
  },
  techadv: {
    type: 'slides',
    paths: ['site/portfolio/tech-advisory/slide-1.png', 'site/portfolio/tech-advisory/slide-2.jpg', 'site/portfolio/tech-advisory/slide-3.png']
  },
  assetmanagement: {
    type: 'slides',
    paths: ['site/portfolio/asset-management/slide-1.png', 'site/portfolio/asset-management/slide-2.jpg', 'site/portfolio/asset-management/slide-3.png']
  },
  energyaudit: {
    type: 'slides',
    paths: ['site/portfolio/energy-audit/slide-1.jpg', 'site/portfolio/energy-audit/slide-2.jpg', 'site/portfolio/energy-audit/slide-3.png']
  },
  energymanagement: {
    type: 'slides',
    paths: ['site/portfolio/energy-management/slide-1.webp', 'site/portfolio/energy-management/slide-2.jpg', 'site/portfolio/energy-management/slide-3.webp']
  },
  projectmanagement: {
    type: 'slides',
    paths: ['site/portfolio/project-management/slide-1.png', 'site/portfolio/project-management/slide-2.png', 'site/portfolio/project-management/slide-3.png']
  },
  valuation: {
    type: 'slides',
    paths: ['site/portfolio/valuation/slide-1.png', 'site/portfolio/valuation/slide-2.png', 'site/portfolio/valuation/slide-3.jpg']
  },
  value: {
    type: 'slides',
    paths: ['site/portfolio/value-engineering/slide-1.jpg', 'site/portfolio/value-engineering/slide-2.png', 'site/portfolio/value-engineering/slide-3.jpg', 'site/portfolio/value-engineering/slide-4.png']
  },
  manufacturing: {
    type: 'panels',
    paths: {
      spm: 'site/portfolio/manufacturing/spm.jpg',
      airPollution: 'site/portfolio/manufacturing/air-pollution.png',
      structure: 'site/portfolio/manufacturing/structure.png',
      fabrication: 'site/portfolio/manufacturing/fabrication.png'
    }
  },
  gallery: {
    type: 'gallery',
    paths: [
      'site/gallery/photo-1.jpg',
      'site/gallery/photo-2.jpg',
      'site/gallery/photo-3.jpg',
      'site/gallery/photo-4.jpg',
      'site/gallery/photo-5.jpg',
      'site/gallery/photo-6.jpg',
      'site/gallery/photo-7.jpg',
      'site/gallery/photo-8.jpg',
      'site/gallery/photo-9.jpg'
    ]
  }
};

// Memory cache across page transitions
const urlCache = new Map();

export default function usePageImages(pageId) {
  const fallback = useMemo(() => defaultImages[pageId] || {}, [pageId]);
  const [images, setImages] = useState(() => urlCache.get(pageId) || fallback);

  useEffect(() => {
    let mounted = true;

    if (urlCache.has(pageId)) {
      setImages(urlCache.get(pageId));
      return;
    }

    async function resolveImages() {
      // 1. Try Firestore document first (if populated via automated script)
      try {
        const snapshot = await getDoc(doc(db, 'siteImages', pageId));
        if (snapshot.exists()) {
          const remote = snapshot.data();
          let merged = { ...fallback, ...remote };

          if (Array.isArray(fallback.slides) && Array.isArray(remote.slides)) {
            merged.slides = fallback.slides.map((defaultSrc, idx) => remote.slides[idx] || defaultSrc);
          } else if (fallback.panels && remote.panels) {
            merged.panels = { ...fallback.panels, ...remote.panels };
          } else if (Array.isArray(fallback.photos) && Array.isArray(remote.photos)) {
            merged.photos = remote.photos;
          }

          if (mounted) {
            urlCache.set(pageId, merged);
            setImages(merged);
            return;
          }
        }
      } catch {
        // Fall through to direct Storage resolution
      }

      // 2. Direct Storage resolution (supports manual drag-and-drop into Firebase Storage)
      const mapping = storagePathMap[pageId];
      if (!mapping || !storage) return;

      try {
        if (mapping.type === 'slides') {
          const resolvedSlides = await Promise.all(
            mapping.paths.map(async (storagePath, idx) => {
              try {
                return await getDownloadURL(ref(storage, storagePath));
              } catch {
                return fallback.slides?.[idx];
              }
            })
          );

          if (mounted && resolvedSlides.some(Boolean)) {
            const next = { ...fallback, slides: resolvedSlides };
            urlCache.set(pageId, next);
            setImages(next);
          }
        } else if (mapping.type === 'panels') {
          const resolvedPanels = { ...(fallback.panels || {}) };
          let foundAny = false;

          await Promise.all(
            Object.entries(mapping.paths).map(async ([panelKey, storagePath]) => {
              try {
                const url = await getDownloadURL(ref(storage, storagePath));
                resolvedPanels[panelKey] = url;
                foundAny = true;
              } catch {
                // Keep fallback
              }
            })
          );

          if (mounted && foundAny) {
            const next = { ...fallback, panels: resolvedPanels };
            urlCache.set(pageId, next);
            setImages(next);
          }
        } else if (mapping.type === 'gallery') {
          const resolvedPhotos = await Promise.all(
            mapping.paths.map(async (storagePath, idx) => {
              try {
                return await getDownloadURL(ref(storage, storagePath));
              } catch {
                return fallback.photos?.[idx];
              }
            })
          );

          if (mounted && resolvedPhotos.some(Boolean)) {
            const next = { ...fallback, photos: resolvedPhotos };
            urlCache.set(pageId, next);
            setImages(next);
          }
        }
      } catch (err) {
        console.warn(`[usePageImages] Could not resolve storage paths for ${pageId}:`, err);
      }
    }

    resolveImages();

    return () => {
      mounted = false;
    };
  }, [pageId, fallback]);

  return images;
}
