const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 1. L'INTERFACE VISUELLE (Ce que les clients voient sur Webador)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Litos Coach</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f9; margin: 0; display: flex; flex-direction: column; height: 100vh; }
            #chat-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 80%; padding: 12px; border-radius: 15px; font-size: 14px; line-height: 1.4; }
            .bot { background: #c1a059; color: white; align-self: flex-start; border-bottom-left-radius: 2px; }
            .user { background: #333; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
            #input-area { padding: 20px; background: white; display: flex; gap: 10px; border-top: 1px solid #ddd; }
            input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; outline: none; }
            button { background: #c1a059; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div style="background:#333; color:#c1a059; padding:15px; text-align:center; font-weight:bold;">LITOS COACH - Expert Immobilier</div>
        <div id="chat-container">
            <div class="msg bot">Bonjour ! Je suis votre coach Litos. Comment puis-je vous aider dans votre projet de vente en Suisse Romande ?</div>
        </div>
        <div id="input-area">
            <input type="text" id="user-input" placeholder="Posez votre question...">
            <button onclick="sendMessage()">Envoyer</button>
        </div>
        <script>
            async function sendMessage() {
                const input = document.getElementById('user-input');
                const container = document.getElementById('chat-container');
                if(!input.value) return;
                
                const userMsg = input.value;
                container.innerHTML += '<div class="msg user">' + userMsg + '</div>';
                input.value = '';

                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({message: userMsg})
                });
                const data = await response.json();
                container.innerHTML += '<div class="msg bot">' + data.reply + '</div>';
                container.scrollTop = container.scrollHeight;
            }
        </script>
    </body>
    </html>
    `);
});

// 2. L'INTELLIGENCE DU CHAT
app.post('/chat', async (req, res) => {
    const API_KEY = "AIzaSyB_WuhWbQyb9oUMlPyx3Hy-p1YPcJkkHsM"; // TA CLÉ EN DUR
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Tu es l'expert immobilier Litos. Réponds uniquement sur l'immobilier en Suisse Romande (Art 7 RPGA, Art 84 LATC, vente sans commission). Question : " + req.body.message }] }]
            })
        });
        const data = await response.json();
        res.json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) {
        res.json({ reply: "Désolé, je rencontre une petite erreur technique." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Serveur Litos prêt !'));
