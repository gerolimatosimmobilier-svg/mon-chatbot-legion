const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// Initialisation avec ta clé
const genAI = new GoogleGenerativeAI("AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo");

app.post('/chat', async (req, res) => {
    try {
        // Changement pour gemini-pro (le plus compatible)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Tu es l'expert immobilier stratégique de Project Legion en Suisse. 
        Réponds sur l'immobilier, Art 7 RPGA et Art 84 LATC. 
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ reply: "Erreur de connexion. Réessaie dans 1 minute." });
    }
});

app.listen(3000, () => console.log("Chatbot prêt sur le port 3000 !"));