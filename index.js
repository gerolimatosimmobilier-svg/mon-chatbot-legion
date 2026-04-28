const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// On initialise avec la clé d'environnement Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // Version "latest" pour éviter l'erreur 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Contexte légal : Art 7 RPGA (distances limites) et Art 84 LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        // On affiche l'erreur exacte dans Render pour le debug
        console.error("ERREUR GOOGLE AI:", error.message);
        res.status(500).json({ reply: "Petit souci de connexion avec Google... Réessaie dans un instant." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
