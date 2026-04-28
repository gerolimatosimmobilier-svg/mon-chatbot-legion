const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// On utilise la variable d'environnement GEMINI_API_KEY que tu as configurée dans Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo");

app.post('/chat', async (req, res) => {
    try {
        // CHANGEMENT ICI : On utilise gemini-1.5-flash (le plus récent et rapide)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Tu es l'expert immobilier stratégique de Project Legion en Suisse. 
        Réponds de manière professionnelle sur l'immobilier, notamment sur les dérogations à l'art. 7 du RPGA et l'application de l'art. 84 de la LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("ERREUR GOOGLE AI:", error.message);
        res.status(500).json({ reply: "Désolé, j'ai une petite panne de cerveau. Réessaie dans une minute !" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
