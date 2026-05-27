# Ai Project

Este projeto é uma aplicação de chat com IA que utiliza o modelo Gemini 2.5 Flash para gerar respostas personalizadas.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

### Backend

Localizado na pasta `backend/`, este módulo é responsável por:
- Receber requisições de chat
- Interagir com a API do Gemini
- Gerenciar a memória do chat (histórico)
- Salvar as conversas no Firebase

#### Tecnologias Utilizadas
- Node.js
- Express
- Firebase Admin SDK
- Google GenAI SDK

#### Endpoints Disponíveis
- `POST /chat` - Envia uma mensagem e recebe uma resposta da IA
- `GET /status` - Verifica se o servidor está rodando

### Frontend

Localizado na pasta `Ai_Project/Ai_Project`, este módulo é responsável por:
- Interagir com o usuário
- Enviar mensagens para o backend
- Exibir as respostas da IA

#### Tecnologias Utilizadas
- HTML
- CSS
- JavaScript

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado
- Firebase CLI instalado
- Conta Google com acesso à API do Gemini

### Instalação
1. Clone o repositório:
```bash
git clone <repo_url>
cd Ai_Project
cd backend
npm install
```
2. Configure o Firebase:
```bash
firebase login
firebase init hosting
```
3. Adicione sua chave de API do Gemini no arquivo `.env`:
```env
GEMINI_API_KEY=YOUR_API_KEY
PORT=3001
```
4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Teste Local

Você pode testar o backend localmente sem iniciar o frontend:
```bash
npm run test
```
Isso executará o script `teste.js` que faz uma requisição de teste para o servidor.