import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (!initializeApp.length) {
  initializeApp({
    credential: require("firebase-admin").credential.applicationDefault(),
    projectId: "make-a-quote"
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("No ID provided");

  const docRef = db.collection("quotes").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) return res.status(404).send("Quote not found");

  const { text, imageBase64 } = docSnap.data();

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

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
