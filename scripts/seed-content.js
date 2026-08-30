/* Dry run: node scripts/seed-content.js. Write: node scripts/seed-content.js --apply [--overwrite] */
const fs = require('fs');
const path = require('path');
const { cert, initializeApp } = require('firebase-admin/app');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const apply = process.argv.includes('--apply');
const overwrite = process.argv.includes('--overwrite');

if (!serviceAccountPath) { console.error('Set FIREBASE_SERVICE_ACCOUNT_PATH to a service-account JSON file.'); process.exit(1); }
const defaults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'defaultContent.json'), 'utf8'));
initializeApp({ credential: cert(require(path.resolve(serviceAccountPath))) });

(async () => {
  const db = getFirestore();
  for (const [pageId, page] of Object.entries(defaults)) {
    const ref = db.collection('pageContent').doc(pageId);
    const snapshot = await ref.get();
    if (snapshot.exists && !overwrite) { console.log(`skip ${pageId} (already exists)`); continue; }
    const sections = Object.fromEntries(Object.entries(page.sections).map(([id, section]) => [id, { html: section.html, revision: 0 }]));
    if (apply) await ref.set({ schemaVersion: 1, revision: 0, sections, updatedAt: FieldValue.serverTimestamp() });
    console.log(`${apply ? 'seed' : 'would seed'} ${pageId}`);
  }
})().catch((error) => { console.error(error.message); process.exit(1); });
