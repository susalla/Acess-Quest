// Base de Dados dos Bugs Expandida
        const bancoDeBugs = {
            "1": {
                problema: "Imagem sem Texto Alternativo",
                impacto: "Usuários de leitores de tela não conseguem compreender o conteúdo da imagem.",
                wcag: "1.1.1 – Non-text Content",
                correcao: '<img src="produto.jpg" alt="Notebook Dell Inspiron">'
            },
            "2": {
                problema: "Botão com Baixo Contraste",
                impacto: "Pessoas com baixa visão ou dificuldades visuais podem não conseguir identificar o conteúdo.",
                wcag: "1.4.3 – Contrast (Minimum)",
                correcao: '/* Utilizar cores com contraste de pelo menos 4.5:1 */\nbutton {\n  background-color: #0056b3;\n  color: #ffffff;\n}'
            },
            "3": {
                problema: "Campo sem Label",
                impacto: "Leitores de tela não conseguem informar ao usuário qual dado deve ser preenchido.",
                wcag: "3.3.2 – Labels or Instructions",
                correcao: '<label for="nome">Seu nome:</label>\n<input id="nome" type="text">'
            },
            "4": {
                problema: "Link Genérico",
                impacto: "Usuários de leitores de tela não conseguem compreender a finalidade da navegação ao listar os links.",
                wcag: "2.4.4 – Link Purpose",
                correcao: '<a href="#">Ver detalhes do Notebook Dell</a>'
            },
            "5": {
                problema: "Elemento Não Navegável por Teclado",
                impacto: "Usuários que dependem exclusivamente do teclado não focarão neste elemento.",
                wcag: "2.1.1 – Keyboard",
                correcao: '<button onclick="inscrever()">Inscrever-se</button>'
            },
            "6": {
                problema: "Botão sem Rótulo Acessível",
                impacto: "O leitor de tela anuncia apenas 'botão'. O usuário não saberá que serve para buscar.",
                wcag: "4.1.2 – Name, Role, Value",
                correcao: '<button aria-label="Buscar produtos">🔍</button>'
            },
            "7": {
                problema: "Informação Transmitida Apenas por Cor",
                impacto: "Usuários daltônicos ou com telas monocromáticas não saberão qual item está esgotado.",
                wcag: "1.4.1 – Use of Color",
                correcao: '<span style="color: red;">Fone (Esgotado)</span>'
            },
            "8": {
                problema: "Salto na Hierarquia de Cabeçalhos",
                impacto: "Quebra o modelo mental de navegação estrutural usado por leitores de tela. Nunca pule do H3 direto para o H5.",
                wcag: "1.3.1 – Info and Relationships",
                correcao: '<h4>Especificações Técnicas</h4>'
            }
        };

        let pontuacao = 0;
        let bugsEncontrados = 0;
        
        // Aumentamos o total de bugs e atualizamos o HTML para refletir a contagem máxima
        const totalBugs = 8; 
        document.getElementById('bugs-encontrados').nextSibling.textContent = "/8"; 
        
        let tempoRestante = 300; // Mantivemos 5 minutos
        let timerInterval;

// Elementos da Interface
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaConclusao = document.getElementById('tela-conclusao');
const modalFeedback = document.getElementById('modal-feedback');
const areaDesafio = document.getElementById('area-desafio');

// Iniciar Jogo
document.getElementById('btn-iniciar').addEventListener('click', () => {
    telaInicial.classList.replace('ativa', 'oculta');
    telaJogo.classList.replace('oculta', 'ativa');
    iniciarTemporizador();
});

// Lógica de Cliques na Área do Desafio
areaDesafio.addEventListener('click', (evento) => {
    const elementoClicado = evento.target;

    // Se o elemento possui a classe "bug" e ainda não foi resolvido
    if (elementoClicado.classList.contains('bug')) {
        const bugId = elementoClicado.getAttribute('data-bug-id');
        tratarAcerto(bugId, elementoClicado);
    } else {
        // Se clicou em qualquer outra coisa dentro da área (chute errado)
        tratarErro();
    }
});

function tratarAcerto(bugId, elementoHtml) {
    // Evita duplo clique no mesmo bug
    elementoHtml.classList.remove('bug');
    elementoHtml.style.outline = "3px solid #5cb85c"; // Destaca verde

    // Atualiza status
    pontuacao += 10;
    bugsEncontrados++;
    atualizarPainel();

    // Carrega dados no Modal
    const dados = bancoDeBugs[bugId];
    document.getElementById('feedback-problema').innerText = dados.problema;
    document.getElementById('feedback-impacto').innerText = dados.impacto;
    document.getElementById('feedback-wcag').innerText = dados.wcag;
    
    // Usamos textContent no código para evitar que o HTML seja renderizado no navegador
    document.getElementById('feedback-correcao').textContent = dados.correcao;

    modalFeedback.showModal();

    if (bugsEncontrados === totalBugs) {
        finalizarJogo();
    }
}

function tratarErro() {
    pontuacao -= 5;
    atualizarPainel();
    // Um leve flash vermelho para indicar erro visualmente
    areaDesafio.style.backgroundColor = "#ffe6e6";
    setTimeout(() => areaDesafio.style.backgroundColor = "transparent", 200);
}

function atualizarPainel() {
    document.getElementById('pontuacao').innerText = pontuacao;
    document.getElementById('bugs-encontrados').innerText = bugsEncontrados;
    document.getElementById('barra-progresso').style.width = `${(bugsEncontrados / totalBugs) * 100}%`;
}

// Fechar Modal
document.getElementById('btn-continuar').addEventListener('click', () => {
    modalFeedback.close();
});

// Temporizador
function iniciarTemporizador() {
    timerInterval = setInterval(() => {
        tempoRestante--;
        const minutos = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
        const segundos = (tempoRestante % 60).toString().padStart(2, '0');
        document.getElementById('temporizador').innerText = `${minutos}:${segundos}`;

        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            finalizarJogo(true); // True indica que acabou por tempo
        }
    }, 1000);
}

function finalizarJogo(tempoEsgotado = false) {
    clearInterval(timerInterval);
    modalFeedback.close();
    telaJogo.classList.replace('ativa', 'oculta');
    telaConclusao.classList.replace('oculta', 'ativa');
    
    document.getElementById('pontuacao-final').innerText = pontuacao;
    if (tempoEsgotado) {
        document.querySelector('#tela-conclusao h1').innerText = "TEMPO ESGOTADO";
    }
}