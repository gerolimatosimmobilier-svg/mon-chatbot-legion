const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Vérification de sécurité au démarrage
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERREUR CRITIQUE : La variable GEMINI_API_KEY est absente dans Render !");
}

const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // On force la v1beta qui a fonctionné dans ton curl
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        }, { apiVersion: 'v1beta' });

        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds sur l'immobilier, l'Art 7 du RPGA et l'Art 84 de la LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("DÉTAIL ERREUR:", error.message);
        res.status(500).json({ reply: "Souci d'autorisation avec Google. Vérifie la clé API dans Render." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur port ${PORT}`));
