const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// On initialise l'API avec ta clé
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo");

app.post('/chat', async (req, res) => {
    try {
        // Test avec le nom de modèle "stable" sans numéro de version
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds sur l'immobilier, Art 7 RPGA et Art 84 LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("ERREUR 1 (gemini-pro):", error.message);
        
        // DEUXIÈME TENTATIVE : Si le premier échoue, on tente le flash
        try {
            const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await modelFlash.generateContent(req.body.message);
            res.json({ reply: result.response.text() });
        } catch (error2) {
            console.error("ERREUR 2 (gemini-1.5-flash-latest):", error2.message);
            res.status(500).json({ reply: "Désolé, Google refuse la connexion. Vérifie ta clé API." });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
