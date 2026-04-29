const express = require('express');
const cors = require('cors');

const app = express();

// AUTORISATIONS POUR WEBADOR
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    // On dit au navigateur que ce site PEUT être affiché dans une iframe
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    next();
});

// 1. L'INTERFACE VISUELLE
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: sans-serif; margin: 0; background: #fdfcf9; display: flex; flex-direction: column; height: 100vh; }
            header { background: #333; color: #c1a059; padding: 15px; text-align: center; font-weight: bold; border-bottom: 3px solid #c1a059; }
            #chat { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 85%; padding: 10px 15px; border-radius: 15px; font-size: 14px; }
            .bot { background: #c1a059; color: white; align-self: flex-start; }
            .user { background: #eee; color: #333; align-self: flex-end; }
            .input-box { padding: 15px; display: flex; gap: 10px; border-top: 1px solid #ddd; background: white; }
            input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; outline: none; }
            button { background: #333; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; }
        </style>
    </head>
    <body>
        <header>LITOS COACH</header>
        <div id="chat">
            <div class="msg bot">Bonjour ! Je suis votre expert Litos. Posez-moi vos questions sur la vente de votre bien ou la législation (Art. 7 RPGA / Art. 84 LATC).</div>
        </div>
        <div class="input-box">
            <input type="text" id="userInput" placeholder="Écrivez ici...">
            <button onclick="send()">Envoyer</button>
        </div>

        <script>
            async function send() {
                const input = document.getElementById('userInput');
                const chat = document.getElementById('chat');
                if (!input.value) return;

                const text = input.value;
                chat.innerHTML += '<div class="msg user">' + text + '</div>';
                input.value = '';

                try {
                    const res = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await res.json();
                    chat.innerHTML += '<div class="msg bot">' + data.reply + '</div>';
                    chat.scrollTop = chat.scrollHeight;
                } catch (e) {
                    chat.innerHTML += '<div class="msg bot">Erreur de connexion.</div>';
                }
            }
        </script>
    </body>
    </html>
    `);
});

// 2. LE MOTEUR IA
app.post('/chat', async (req, res) => {
    const API_KEY = "AIzaSyB_WuhWbQyb9oUMlPyx3Hy-p1YPcJkkHsM";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Tu es l'expert immobilier Litos. Réponds sur l'immobilier en Suisse (Art 7 RPGA, Art 84 LATC). Question : " + req.body.message }] }]
            })
        });
        const data = await response.json();
        res.json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) {
        res.json({ reply: "Désolé, réessayez." });
    }
});

app.listen(process.env.PORT || 10000);
