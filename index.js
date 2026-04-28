const express = require('express');
const cors = require('cors'); // Ajout indispensable
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Autorise ton site Webador à parler au serveur Render
app.use(cors()); 
app.use(express.json());

// Initialisation avec ta clé
const genAI = new GoogleGenerativeAI("AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo");

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Tu es l'expert immobilier stratégique de Project Legion en Suisse. 
        Réponds de manière professionnelle sur l'immobilier, notamment sur les dérogations à l'art. 7 du RPGA (distances aux limites) et l'application de l'art. 84 de la LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ reply: "Désolé, j'ai une petite panne de cerveau. Réessaie dans une minute !" });
    }
});

// Utilisation du port dynamique pour Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Chatbot prêt sur le port ${PORT} !`));
