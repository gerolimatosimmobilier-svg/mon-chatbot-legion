const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Remplace bien par ta vraie clé si celle-là est une ancienne
const genAI = new GoogleGenerativeAI("AIzaSyBFetZGfaxFcWEoCIClGaAXYpT2Q3qfmVo");

app.post('/chat', async (req, res) => {
    try {
        // On teste le modèle 'gemini-1.5-flash' qui est plus rapide et moderne
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds sur l'immobilier, Art 7 RPGA et Art 84 LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        // Ceci va nous dire EXACTEMENT pourquoi Google refuse dans les logs Render
        console.error("ERREUR GOOGLE AI:", error.message);
        res.status(500).json({ reply: "Erreur Google : " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
