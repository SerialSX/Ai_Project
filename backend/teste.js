async function testarRP() {
    const resposta = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: "teste-rp-001", // O nome do "save" no banco de dados
            message: "Eu te falei onde a gente estava na última mensagem, você lembra?",
            customSystemPrompt: "Você é o Mister Compass, um personagem canônico do universo de Fundamental Paper Education."
        })
    });

    const dados = await resposta.json();
    console.log("Resposta do Bot:\n", dados.reply);
}

testarRP();