import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

// Nosso catálogo de personagens!
const characters = [
  {
    id: "compass-001",
    name: "Mister Compass",
    prompt: "Você é o Mister Compass, um personagem canônico do universo de Fundamental Paper Education. Aja e responda com a sua personalidade característica."
  },
  {
    id: "lyke-001",
    name: "Lyke",
    prompt: "Você é Lyke. Aja e interaja mantendo a sua personalidade característica e história de fundo."
  },
  {
    id: "solaris-001",
    name: "Solaris",
    prompt: "Você é Solaris. Mantenha a postura e a essência narrativa deste personagem."
  },
  {
    id: "kingeagle-001",
    name: "KingEagle",
    prompt: "Você é KingEagle. Mantenha suas características marcantes. Lembre-se: você não gosta de chá, recuse se lhe oferecerem."
  }
];

function App() {
  // Começamos com o Mister Compass selecionado por padrão
  const [activeChar, setActiveChar] = useState(characters[0]);
  
  const [messages, setMessages] = useState([
    { role: 'model', text: `Você iniciou o chat com ${characters[0].name}.` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Função que roda quando você clica em outro personagem no menu lateral
  const changeCharacter = (char) => {
    setActiveChar(char);
    // Limpamos a tela e avisamos que o bot trocou
    setMessages([{ role: 'model', text: `Chat alterado para ${char.name}. O que você deseja fazer?` }]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // O sessionId agora usa a ID do personagem! Assim o banco separa as conversas
          sessionId: `sessao-${activeChar.id}`, 
          message: userMessage,
          customSystemPrompt: activeChar.prompt // Puxa o prompt do personagem ativo
        })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '❌ Erro: ' + data.error }]);
      }
    } catch (error) {
      console.error("Erro no front-end:", error);
      setMessages(prev => [...prev, { role: 'model', text: '❌ Ocorreu um erro ao conectar com o servidor local.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-layout">
      {/* MENU LATERAL */}
      <div className="sidebar">
        <div className="sidebar-title">Personagens</div>
        <div className="char-list">
          {characters.map(char => (
            <button 
              key={char.id}
              className={`char-btn ${activeChar.id === char.id ? 'active' : ''}`}
              onClick={() => changeCharacter(char)}
            >
              {char.name}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div className="chat-container">
        <div className="chat-header">Conversando com: {activeChar.name}</div>

        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {isLoading && <div className="loading">{activeChar.name} está pensando...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Escreva para ${activeChar.name}...`}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App;