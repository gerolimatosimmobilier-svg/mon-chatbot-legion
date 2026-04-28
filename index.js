const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// INITIALISATION CRUCIALE : On force la version v1beta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // On utilise le nom exact de ton curl : gemini-1.5-flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        }, { apiVersion: 'v1beta' }); // <--- C'est ça qui manquait !

        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Contexte : Art 7 RPGA et Art 84 LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("ERREUR GOOGLE AI:", error.message);
        res.status(500).json({ reply: "Connexion établie mais Google refuse la requête. Vérifie les logs Render." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
