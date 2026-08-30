/* Run locally only: node scripts/manage-admin.js grant admin@example.com */
const path = require('path');
const { cert, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const [operation, email] = process.argv.slice(2);
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!['grant', 'revoke'].includes(operation) || !email || !serviceAccountPath) {
  console.error('Usage: FIREBASE_SERVICE_ACCOUNT_PATH=/path/key.json node scripts/manage-admin.js grant|revoke admin@example.com');
  process.exit(1);
}

const serviceAccount = require(path.resolve(serviceAccountPath));
initializeApp({ credential: cert(serviceAccount) });

(async () => {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const claims = { ...(user.customClaims || {}) };
  if (operation === 'grant') claims.admin = true;
  else delete claims.admin;
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`${operation === 'grant' ? 'Granted' : 'Revoked'} admin access for ${email}. The user must sign out and sign in again.`);
})().catch((error) => { console.error(error.message); process.exit(1); });
