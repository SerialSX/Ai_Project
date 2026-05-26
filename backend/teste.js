async function testarRP() {
    const resposta = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "O que você está fazendo pelos corredores?",
            customSystemPrompt: "Você é o Mister Compass, um personagem canônico do universo de Fundamental Paper Education. Aja e responda com a sua personalidade característica."
        })
    });

    const dados = await resposta.json();
    console.log("Resposta do Bot:\n", dados.reply);
}

testarRP();