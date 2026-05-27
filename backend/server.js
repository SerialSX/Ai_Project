import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. INICIALIZA O FIREBASE COM A SUA CHAVE
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore(); // Conexão com o banco!

// 2. INICIALIZA A IA
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/status', (req, res) => {
    res.json({ message: 'Servidor rodando e pronto para o RP!' });
});

app.post('/chat', async (req, res) => {
    try {
        // Agora precisamos de um sessionId (o ID do chat atual)
        const { sessionId, message, customSystemPrompt } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ error: 'Falta o sessionId para carregar a memória!' });
        }

        // 3. PUXA A MEMÓRIA DO FIREBASE
        const chatRef = db.collection('chats').doc(sessionId);
        const doc = await chatRef.get();
        
        let history = [];
        if (doc.exists) {
            history = doc.data().messages || [];
        }

        // 4. PREPARA O CONTEXTO PARA A IA
        // A IA precisa saber quem falou o quê. 'user' é você, 'model' é o bot.
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        // Adiciona a sua mensagem nova no final da lista
        contents.push({ role: 'user', parts: [{ text: message }] });

        // 5. CHAMA A IA ENVIANDO TODO O HISTÓRICO
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents, // Mandando o array completo de memória!
            config: {
                systemInstruction: customSystemPrompt || "Você é um assistente.",
                temperature: 1.2, 
                maxOutputTokens: 1024, // Aumentei o limite pra não cortar o texto!
            }
        });

        const replyText = response.text;

        // 6. SALVA O NOVO CAPÍTULO DO RP NO FIREBASE
        history.push({ role: 'user', text: message });
        history.push({ role: 'model', text: replyText });
        await chatRef.set({ messages: history });

        res.json({ reply: replyText });
        
    } catch (error) {
        console.error("Erro na API:", error);
        res.status(500).json({ error: 'Deu ruim na comunicação com a IA' });
    }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`[OK] Servidor rodando na porta ${PORT}`);
    console.log(`[Aviso] Pressione Ctrl + C para encerrar.`);
});

server.on('error', (error) => {
    console.error('[ERRO NO SERVIDOR]:', error);
});
process.on('uncaughtException', (err) => {
    console.error('[ERRO FATAL NÃO TRATADO]:', err);
});