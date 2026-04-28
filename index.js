const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Ici, on récupère la clé cachée dans Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Tu es l'expert immobilier de Project Legion en Suisse. 
        Réponds sur l'immobilier, Art 7 RPGA et Art 84 LATC.
        Question : ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("ERREUR:", error.message);
        res.status(500).json({ reply: "Désolé, je rencontre une erreur technique." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
