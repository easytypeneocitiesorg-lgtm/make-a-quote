export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("No ID provided");

  const projectId = "make-a-quote";
  const apiKey = "AIzaSyC0Mhh0hEOOD04UsRCuo7CDAjVmtw_zRS4";

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/quotes/${id}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return res.status(404).send("Quote not found");
      throw new Error("Firestore request failed");
    }

    const data = await response.json();
    const fields = data.fields;
    const text = fields.text.stringValue;
    const imageBase64 = fields.imageBase64.stringValue;

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
