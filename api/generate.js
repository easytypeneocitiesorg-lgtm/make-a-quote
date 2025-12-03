import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createCanvas } from 'canvas';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase only once
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Generate image as Base64
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 800, 400);
  ctx.fillStyle = '#000';
  ctx.font = '40px sans-serif';
  ctx.fillText(text, 50, 200);

  const base64Image = canvas.toDataURL('image/png');

  // Store in Firestore
  const id = uuidv4();
  await db.collection('quotes').doc(id).set({ text, imageBase64: base64Image });

  // Return link to dynamic quote page
  res.status(200).json({ url: `/api/quote/${id}` });
}
