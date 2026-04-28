const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    // TA CLÉ EST ICI DIRECTEMENT
    const API_KEY = "AIzaSyB_WuhWbQyb9oUMlPyx3Hy-p1YPcJkkHsM"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Tu es l'expert immobilier de Project Legion. Réponds à : ${req.body.message}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("ERREUR:", data.error.message);
            return res.status(500).json({ reply: "Erreur Google : " + data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply: reply });

    } catch (error) {
        res.status(500).json({ reply: "Erreur de connexion au serveur." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur port ${PORT}`));
