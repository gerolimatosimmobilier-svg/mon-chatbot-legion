const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Récupère la clé depuis Render ou utilise la tienne par défaut
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo";
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // On utilise le nom de modèle complet pour éviter l'erreur 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Tu es l'expert immobilier stratégique de Project Legion en Suisse. 
        Réponds sur l'immobilier, Art 7 RPGA et Art 84 LATC. 
        Question : ${req.body.message}`;

        // Utilisation de la méthode la plus directe
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("ERREUR GOOGLE AI:", error.message);
        
        // Si gemini-1.5-flash échoue, on tente une dernière fois avec gemini-pro
        try {
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await fallbackModel.generateContent(req.body.message);
            res.json({ reply: result.response.text() });
        } catch (fallbackError) {
            res.status(500).json({ reply: "Désolé, j'ai encore un petit souci de connexion avec Google." });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
