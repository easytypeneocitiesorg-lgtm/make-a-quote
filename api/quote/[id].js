import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase only once
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('No ID provided');

  const doc = await db.collection('quotes').doc(id).get();
  if (!doc.exists) return res.status(404).send('Quote not found');

  const { text, imageBase64 } = doc.data();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Quote</title>
  <meta property="og:title" content="${text}" />
  <meta property="og:image" content="${imageBase64}" />
  <meta property="og:type" content="website" />
</head>
<body>
  <h1>${text}</h1>
  <img src="${imageBase64}" alt="Quote Image" />
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
