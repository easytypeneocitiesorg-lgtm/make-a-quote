import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0Mhh0hEOOD04UsRCuo7CDAjVmtw_zRS4",
  authDomain: "make-a-quote.firebaseapp.com",
  projectId: "make-a-quote",
  storageBucket: "make-a-quote.firebasestorage.app",
  messagingSenderId: "1035902900878",
  appId: "1:1035902900878:web:2f9d0ff314ebe4f79a07df",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("No ID provided");

  try {
    const docRef = doc(db, "quotes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return res.status(404).send("Quote not found");

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
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
