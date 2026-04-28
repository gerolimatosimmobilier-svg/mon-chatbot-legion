const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// On initialise l'API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // FORCE LA VERSION v1beta (indispensable selon ton test curl)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        }, { apiVersion: 'v1beta' });

        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds sur l'immobilier, l'Art 7 du RPGA et l'Art 84 de la LATC.
        Question : ${req.body.message}`;

        // Utilisation de la méthode la plus stable
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        // Log ultra-précis pour le debug dans Render
        console.error("ERREUR DÉTAILLÉE:", error.message);
        res.status(500).json({ reply: "Désolé, j'ai un petit souci technique. Réessaie dans une minute !" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
