import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Carrega as variáveis de ambiente do seu .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa a IA com a chave
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rota de status para teste
app.get('/status', (req, res) => {
    res.json({ message: 'Servidor rodando e pronto para o RP!' });
});

// Nossa rota principal de Chat e RP
app.post('/chat', async (req, res) => {
    try {
        const { message, customSystemPrompt } = req.body;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: customSystemPrompt || "Você é um assistente genérico.",
                temperature: 1.2, 
                maxOutputTokens: 600, 
            }
        });

        res.json({ reply: response.text });
        
    } catch (error) {
        console.error("Erro na API:", error);
        res.status(500).json({ error: 'Deu ruim na comunicação com a IA' });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`[OK] Servidor rodando na porta ${PORT}`);
    console.log(`[Aviso] Pressione Ctrl + C para encerrar.`);
});

// Captura erros específicos do Express (ex: a porta 3000 já estar em uso)
server.on('error', (error) => {
    console.error('[ERRO NO SERVIDOR]:', error);
});

// Captura qualquer outro erro global que derrube o Node em silêncio
process.on('uncaughtException', (err) => {
    console.error('[ERRO FATAL NÃO TRATADO]:', err);
});