const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // On utilise gemini-1.5-flash avec v1beta
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        }, { apiVersion: 'v1beta' });

        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds de manière pro sur l'immobilier, l'Art 7 du RPGA et l'Art 84 de la LATC.
        Question du client : ${req.body.message}`;

        // Structure simplifiée pour éviter le refus de Google
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        // On log l'erreur précise pour savoir exactement POURQUOI Google refuse
        console.error("DÉTAIL ERREUR GOOGLE:", error);
        res.status(500).json({ reply: "Erreur de configuration Google. Vérifie les logs Render." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
