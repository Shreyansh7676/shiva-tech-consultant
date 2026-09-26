/*
 * Script: scripts/upload-images.js
 * Usage:
 *   Dry run:  node scripts/upload-images.js
 *   Upload:   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json node scripts/upload-images.js --apply [--overwrite]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from .env if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const apply = process.argv.includes('--apply');
const overwrite = process.argv.includes('--overwrite');
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const storageBucketName = process.env.STORAGE_BUCKET || process.env.VITE_STORAGE_BUCKET;

// Structured mapping of local carousel assets and gallery photos to Firebase Storage paths
const manifest = {
  home: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/images/3.png',
        storagePath: 'site/home/slide-1.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/New folder/Project Management Institute.png',
        storagePath: 'site/home/slide-2.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/New folder/Untitled-2.png',
        storagePath: 'site/home/slide-3.png',
        contentType: 'image/png'
      }
    ]
  },
  techadv: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/CarouselAdv/Untitled design(1).png',
        storagePath: 'site/portfolio/tech-advisory/slide-1.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/CarouselAdv/photo_2024-11-01_16-05-44.jpg',
        storagePath: 'site/portfolio/tech-advisory/slide-2.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/CarouselAdv/Beige Modern Cafe Brunch Event Flyer Business Instagram Post(1).png',
        storagePath: 'site/portfolio/tech-advisory/slide-3.png',
        contentType: 'image/png'
      }
    ]
  },
  assetmanagement: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/New folder/new.png',
        storagePath: 'site/portfolio/asset-management/slide-1.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/New folder/Brown and Cream Modern Collective Instagram Post (Facebook Post).jpg',
        storagePath: 'site/portfolio/asset-management/slide-2.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/CarouselAsset/unnamed.png',
        storagePath: 'site/portfolio/asset-management/slide-3.png',
        contentType: 'image/png'
      }
    ]
  },
  energyaudit: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/CarouselAudit/photo_2024-11-01_16-00-11.jpg',
        storagePath: 'site/portfolio/energy-audit/slide-1.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/CarouselAudit/photo_2024-11-01_15-59-47.jpg',
        storagePath: 'site/portfolio/energy-audit/slide-2.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/CarouselAudit/Beige Modern Cafe Brunch Event Flyer Business Instagram Post.png',
        storagePath: 'site/portfolio/energy-audit/slide-3.png',
        contentType: 'image/png'
      }
    ]
  },
  energymanagement: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/New folder/bee-certification-services-500x500.webp',
        storagePath: 'site/portfolio/energy-management/slide-1.webp',
        contentType: 'image/webp'
      },
      {
        localPath: 'src/New folder/photo_2024-10-27_21-59-43.jpg',
        storagePath: 'site/portfolio/energy-management/slide-2.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/New folder/bee-certification-services-500x500.webp',
        storagePath: 'site/portfolio/energy-management/slide-3.webp',
        contentType: 'image/webp'
      }
    ]
  },
  projectmanagement: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/New folder/Artboard 1.png',
        storagePath: 'site/portfolio/project-management/slide-1.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/CarouselProject/unnamed (2).png',
        storagePath: 'site/portfolio/project-management/slide-2.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/CarouselProject/unnamed.png',
        storagePath: 'site/portfolio/project-management/slide-3.png',
        contentType: 'image/png'
      }
    ]
  },
  valuation: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/CarouselValuation/Untitled design.png',
        storagePath: 'site/portfolio/valuation/slide-1.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/CarouselValuation/23232.png',
        storagePath: 'site/portfolio/valuation/slide-2.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/CarouselValuation/photo_2024-11-01_16-07-47.jpg',
        storagePath: 'site/portfolio/valuation/slide-3.jpg',
        contentType: 'image/jpeg'
      }
    ]
  },
  value: {
    type: 'slides',
    slides: [
      {
        localPath: 'src/New folder/photo_2024-10-25_21-19-17.jpg',
        storagePath: 'site/portfolio/value-engineering/slide-1.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/New folder/unnamed.png',
        storagePath: 'site/portfolio/value-engineering/slide-2.png',
        contentType: 'image/png'
      },
      {
        localPath: 'src/New folder/photo_2024-10-25_21-38-01.jpg',
        storagePath: 'site/portfolio/value-engineering/slide-3.jpg',
        contentType: 'image/jpeg'
      },
      {
        localPath: 'src/New folder/unnamed (1).png',
        storagePath: 'site/portfolio/value-engineering/slide-4.png',
        contentType: 'image/png'
      }
    ]
  },
  manufacturing: {
    type: 'panels',
    panels: {
      spm: {
        localPath: 'src/Portfolio/Manufacturing/photo_2024-11-02_14-01-32.jpg',
        storagePath: 'site/portfolio/manufacturing/spm.jpg',
        contentType: 'image/jpeg'
      },
      airPollution: {
        localPath: 'src/Portfolio/Manufacturing/apcd.png',
        storagePath: 'site/portfolio/manufacturing/air-pollution.png',
        contentType: 'image/png'
      },
      structure: {
        localPath: 'src/Portfolio/Manufacturing/lol.png',
        storagePath: 'site/portfolio/manufacturing/structure.png',
        contentType: 'image/png'
      },
      fabrication: {
        localPath: 'src/Portfolio/Manufacturing/lol(1).png',
        storagePath: 'site/portfolio/manufacturing/fabrication.png',
        contentType: 'image/png'
      }
    }
  },
  gallery: {
    type: 'gallery',
    photos: [
      { url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', storagePath: 'site/gallery/photo-1.jpg' },
      { url: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', storagePath: 'site/gallery/photo-2.jpg' },
      { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-3.jpg' },
      { url: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-4.jpg' },
      { url: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-5.jpg' },
      { url: 'https://images.unsplash.com/photo-1663616132598-e9a1ee3ad186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-6.jpg' },
      { url: 'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80', storagePath: 'site/gallery/photo-7.jpg' },
      { url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-8.jpg' },
      { url: 'https://plus.unsplash.com/premium_photo-1663012880499-47f1ca50459d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', storagePath: 'site/gallery/photo-9.jpg' }
    ]
  }
};

// Objects live at the bucket root (home/, gallery/, portfolio/). The manifest
// keeps a legacy "site/" prefix, which is stripped before uploading.
for (const config of Object.values(manifest)) {
  const items = config.type === 'gallery'
    ? config.photos
    : config.type === 'slides'
      ? config.slides
      : Object.values(config.panels || {});
  for (const item of items) {
    item.storagePath = item.storagePath.replace(/^site\//, '');
  }
}

async function main() {
  console.log('=== Firebase Storage Carousel & Gallery Image Migration ===');
  console.log(`Mode: ${apply ? 'APPLY (uploading & writing to Firestore)' : 'DRY RUN (no network changes)'}`);

  // Validate local files exist
  let missingCount = 0;
  let totalCarouselImages = 0;

  for (const [pageId, config] of Object.entries(manifest)) {
    if (config.type === 'gallery') continue;
    const items = config.type === 'slides' ? config.slides : Object.values(config.panels || {});
    for (const item of items) {
      totalCarouselImages++;
      const fullPath = path.join(__dirname, '..', item.localPath);
      if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] File missing: ${item.localPath}`);
        missingCount++;
      } else {
        const stats = fs.statSync(fullPath);
        item.size = stats.size;
      }
    }
  }

  if (missingCount > 0) {
    console.error(`Aborting: ${missingCount} files missing.`);
    process.exit(1);
  }

  console.log(`Validated all ${totalCarouselImages} local carousel images exist.`);
  console.log(`Configured ${manifest.gallery.photos.length} gallery images for migration.\n`);

  if (!apply) {
    console.log('Manifest Plan:');
    for (const [pageId, config] of Object.entries(manifest)) {
      console.log(`Page: [${pageId}] (Type: ${config.type})`);
      if (config.type === 'slides') {
        config.slides.forEach((s, idx) => {
          console.log(`  Slide ${idx + 1}: ${s.localPath} (${(s.size / 1024).toFixed(1)} KB) -> gs://${storageBucketName || '<bucket>'}/${s.storagePath}`);
        });
      } else if (config.type === 'panels') {
        for (const [panelId, p] of Object.entries(config.panels)) {
          console.log(`  Panel "${panelId}": ${p.localPath} (${(p.size / 1024).toFixed(1)} KB) -> gs://${storageBucketName || '<bucket>'}/${p.storagePath}`);
        }
      } else if (config.type === 'gallery') {
        config.photos.forEach((p, idx) => {
          console.log(`  Photo ${idx + 1}: ${p.url.slice(0, 50)}... -> gs://${storageBucketName || '<bucket>'}/${p.storagePath}`);
        });
      }
    }
    console.log('\nTo upload carousel & gallery images and populate Firestore documents, run:');
    console.log('FIREBASE_SERVICE_ACCOUNT_PATH=path/to/key.json node scripts/upload-images.js --apply');
    return;
  }

  // Running apply mode
  if (!serviceAccountPath) {
    console.error('Error: Set FIREBASE_SERVICE_ACCOUNT_PATH to run --apply.');
    process.exit(1);
  }

  const { cert, initializeApp } = require('firebase-admin/app');
  const { getFirestore, FieldValue } = require('firebase-admin/firestore');
  const { getStorage } = require('firebase-admin/storage');

  const serviceAccount = require(path.resolve(serviceAccountPath));
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucketName || `${serviceAccount.project_id}.appspot.com`
  });

  const bucket = getStorage().bucket();
  const db = getFirestore();

  console.log(`Connected to bucket: ${bucket.name}`);

  for (const [pageId, config] of Object.entries(manifest)) {
    console.log(`\nProcessing page: ${pageId}...`);
    const docRef = db.collection('siteImages').doc(pageId);
    const existingSnap = await docRef.get();

    if (existingSnap.exists && !overwrite) {
      console.log(`  Doc "siteImages/${pageId}" already exists. Use --overwrite to replace.`);
      continue;
    }

    const payload = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (config.type === 'slides') {
      const slideUrls = [];
      const storagePaths = [];
      for (const slide of config.slides) {
        const fullLocalPath = path.join(__dirname, '..', slide.localPath);
        const downloadToken = crypto.randomUUID();

        console.log(`  Uploading ${slide.localPath} -> ${slide.storagePath}...`);
        await bucket.upload(fullLocalPath, {
          destination: slide.storagePath,
          metadata: {
            contentType: slide.contentType,
            cacheControl: 'public, max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: downloadToken
            }
          }
        });

        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(slide.storagePath)}?alt=media&token=${downloadToken}`;
        slideUrls.push(downloadUrl);
        storagePaths.push(slide.storagePath);
      }
      payload.slides = slideUrls;
      payload.storagePaths = storagePaths;
    } else if (config.type === 'panels') {
      payload.panels = {};
      payload.storagePaths = {};
      for (const [panelId, p] of Object.entries(config.panels)) {
        const fullLocalPath = path.join(__dirname, '..', p.localPath);
        const downloadToken = crypto.randomUUID();

        console.log(`  Uploading ${p.localPath} -> ${p.storagePath}...`);
        await bucket.upload(fullLocalPath, {
          destination: p.storagePath,
          metadata: {
            contentType: p.contentType,
            cacheControl: 'public, max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: downloadToken
            }
          }
        });

        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(p.storagePath)}?alt=media&token=${downloadToken}`;
        payload.panels[panelId] = downloadUrl;
        payload.storagePaths[panelId] = p.storagePath;
      }
    } else if (config.type === 'gallery') {
      const photoUrls = [];
      const storagePaths = [];
      for (const item of config.photos) {
        const downloadToken = crypto.randomUUID();
        console.log(`  Fetching & uploading gallery image -> ${item.storagePath}...`);
        const response = await fetch(item.url);
        const arrayBuf = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        const file = bucket.file(item.storagePath);
        await file.save(buffer, {
          metadata: {
            contentType: 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: downloadToken
            }
          }
        });

        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(item.storagePath)}?alt=media&token=${downloadToken}`;
        photoUrls.push(downloadUrl);
        storagePaths.push(item.storagePath);
      }
      payload.photos = photoUrls;
      payload.storagePaths = storagePaths;
    }

    await docRef.set(payload);
    console.log(`  Saved siteImages/${pageId} in Firestore.`);
  }

  console.log('\nMigration complete!');
}

main().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
