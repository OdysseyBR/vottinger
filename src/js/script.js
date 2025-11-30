// -----------------------------
// Elementos (telas e controles)
// -----------------------------
const homeScreen = document.getElementById("home-screen");
const configScreen = document.getElementById("config-screen");
const simulationScreen = document.getElementById("simulation-screen");
const resultScreen = document.getElementById("result-screen");

// Home controls
const startBtn = document.getElementById("start-btn");

// Config controls
const iniciarSimulacaoBtn = document.getElementById("iniciar-simulacao");
const configBackBtn = document.getElementById("config-back-btn");

const categoriaSelect = document.getElementById("categoria");
const pautaSelect = document.getElementById("pauta");
const ladoPlayerSelect = document.getElementById("lado-player");
const qtEsquerdaInput = document.getElementById("qt-esquerda");
const qtDireitaInput = document.getElementById("qt-direita");

// Simulation / result elements
const simulationInfo = document.getElementById("simulation-info");
const simulationCard = document.getElementById("simulation-card");
const cardName = document.getElementById("card-name");
const cardMeta = document.getElementById("card-meta");
const cardVote = document.getElementById("card-vote");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const simulationLog = document.getElementById("simulation-log");

const resultText = document.getElementById("result-text");
const backToConfig = document.getElementById("back-to-config");
const backToHome = document.getElementById("back-to-home");

// Sounds
const audioSim = document.getElementById("audio-sim");
const audioNao = document.getElementById("audio-nao");

// -----------------------------
// Navegação entre telas
// -----------------------------
startBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    configScreen.classList.remove("hidden");
});

configBackBtn.addEventListener("click", () => {
    configScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

backToConfig && backToConfig.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    configScreen.classList.remove("hidden");
});

backToHome && backToHome.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

// -----------------------------
// Pautas
// -----------------------------
const pautasPorCategoria = {
    educacao: ["ajustar escolas", "remover escolas", "adicionar escolas", "melhorar escolas", "criar escolas"],
    seguranca: ["ajustar policiamento", "remover policiamento", "adicionar policiamento", "melhorar policiamento", "criar batalhão", "criar presidio"],
    saude: ["ajustar hospitais", "remover hospitais", "adicionar hospitais", "melhorar hospitais", "criar postos de saude"],
    infraestrutura: ["ajustar obras", "remover obras", "adicionar obras", "melhorar obras", "criar projetos de infraestrtura"],
    impostos: ["ajustar impostos", "remover impostos", "dimunuir impostos", "aumentar impostos", "criar imposto"],
    lixo: ["ajustar coleta de lixo", "remover coleta de lixo", "adicionar coleta lixo", "melhorar coleta de lixo", "criar coleta de lixo"],
    energia: ["ajustar rede elétrica", "remover rede elétrica", "adicionar rede elétrica", "melhorar rede elétrica", "criar usinas"],
    agua: ["ajustar abastecimento de água", "remover abastecimento de água", "adicionar abastecimento de água", "melhorar abastecimento de água", "criar reservatórios"],
    meioambiente: ["ajustar proteção ambiental", "remover proteção ambiental", "adicionar proteção ambiental", "melhorar proteção ambiental", "criar projetos"],
    transporte: ["ajustar linhas", "remover linhas", "adicionar linhas", "melhorar linhas", "criar terminais"],
    portos: ["ajustar porto", "remover porto", "adicionar porto", "melhorar porto", "criar porto"],
    aeroportos: ["ajustar aeroporto", "remover aeroporto", "adicionar aeroporto", "melhorar aeroporto", "criar aeroporto"],
    leis: ["ajustar leis", "remover leis", "adicionar leis", "melhorar leis", "criar leis"],
    orcamento: ["ajustar orçamento", "remover orçamento", "adicionar orçamento", "melhorar orçamento", "criar verbas"],
    bombeiros: ["ajustar bombeiros", "remover bombeiros", "adicionar bombeiros", "melhorar bombeiros", "criar batalhões"]
};

categoriaSelect.addEventListener("change", () => {
    const cat = categoriaSelect.value;
    pautaSelect.innerHTML = "";
    (pautasPorCategoria[cat] || []).forEach(p => {
        const o = document.createElement("option");
        o.value = p;
        o.textContent = p;
        pautaSelect.appendChild(o);
    });
});

// -----------------------------
// Geração de vereadores
function gerarNomeAleatorio() {
    const primeiros = ["Carlos","João","Marcos","Paulo","Lucas","Bruno","Henrique","Fábio","Eduardo","Rafael","Ana","Maria","Carla","Beatriz","Fernanda"];
    const ultimos = ["Silva","Souza","Almeida","Santos","Oliveira","Gomes","Lima","Barbosa","Azevedo","Monteiro","Leite"];
    return `${primeiros[Math.floor(Math.random()*primeiros.length)]} ${ultimos[Math.floor(Math.random()*ultimos.length)]}`;
}

function gerarVereadores(qEsq, qDir) {
    let list = [];
    for (let i = 0; i < qEsq; i++)
        list.push({ nome: gerarNomeAleatorio(), ideologia: "esquerda", conviccao: Math.random()*0.4+0.3 });

    for (let i = 0; i < qDir; i++)
        list.push({ nome: gerarNomeAleatorio(), ideologia: "direita", conviccao: Math.random()*0.4+0.3 });

    return list;
}

// -----------------------------
// Algoritmo de decisão
function calcularChance(v, categoria, acao, ladoPlayer) {
    let chance = 0.5;

    const catEsq = ["educacao","saude","meioambiente","transporte"];
    const catDir = ["seguranca","impostos","leis","orcamento"];

    if (v.ideologia === "esquerda") {
        if (catEsq.includes(categoria)) chance += 0.20;
        if (catDir.includes(categoria)) chance -= 0.12;
    } else {
        if (catDir.includes(categoria)) chance += 0.20;
        if (catEsq.includes(categoria)) chance -= 0.12;
    }

    if (acao.includes("adicionar") || acao.includes("criar") || acao.includes("melhorar"))
        chance += (v.ideologia === "esquerda" ? 0.15 : -0.10);

    if (acao.includes("remover") || acao.includes("ajustar"))
        chance += (v.ideologia === "direita" ? 0.75 : -0.10);

    if (v.ideologia === ladoPlayer) chance += 0.10;

    chance += (v.conviccao - 0.5) * 0.35;
    chance += (Math.random()*0.12 - 0.06);

    return Math.max(0.05, Math.min(chance, 0.95));
}

// ----------------------------------------
// HEMICICLO DINÂMICO AVANÇADO
// ----------------------------------------
const canvas = document.getElementById("hemiciclo-canvas");
const ctx = canvas.getContext("2d");

let cadeirasXY = []; // ← posições armazenadas
let animVoto = [];   // ← cores dinamicamente durante votação

function desenharHemiciclo(qEsq, qDir) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cadeirasXY = [];

    const total = qEsq + qDir;
    if (total === 0) return;

    const centroX = canvas.width / 2;
    const centroY = canvas.height * 1.15;
    const raio = canvas.width * 0.45;

    const angInicio = Math.PI;
    const angFim = 0;
    const step = (angFim - angInicio) / (total - 1);

    let idx = 0;

    // ESQUERDA
    for (let i = 0; i < qEsq; i++, idx++) {
        const ang = angInicio + step * idx;
        const x = centroX + raio * Math.cos(ang);
        const y = centroY + raio * Math.sin(ang);

        cadeirasXY.push({ x, y, ideologia: "esquerda" });

        ctx.beginPath();
        ctx.fillStyle = "#ff4fa8";
        ctx.arc(x, y, 14, 0, Math.PI*2);
        ctx.fill();
    }

    // DIREITA
    for (let i = 0; i < qDir; i++, idx++) {
        const ang = angInicio + step * idx;
        const x = centroX + raio * Math.cos(ang);
        const y = centroY + raio * Math.sin(ang);

        cadeirasXY.push({ x, y, ideologia: "direita" });

        ctx.beginPath();
        ctx.fillStyle = "#47b0ff";
        ctx.arc(x, y, 14, 0, Math.PI*2);
        ctx.fill();
    }
}

qtEsquerdaInput.addEventListener("input", () =>
    desenharHemiciclo(
        parseInt(qtEsquerdaInput.value) || 0,
        parseInt(qtDireitaInput.value) || 0
    )
);

qtDireitaInput.addEventListener("input", () =>
    desenharHemiciclo(
        parseInt(qtEsquerdaInput.value) || 0,
        parseInt(qtDireitaInput.value) || 0
    )
);

desenharHemiciclo(
    parseInt(qtEsquerdaInput.value) || 0,
    parseInt(qtDireitaInput.value) || 0
);

// Pinta o assento votado
function marcarCadeira(index, voto) {
    if (!cadeirasXY[index]) return;

    const c = cadeirasXY[index];
    ctx.beginPath();
    ctx.fillStyle = voto === "SIM" ? "#4FFF63" : "#ff3b3b";
    ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
    ctx.fill();
}

// -----------------------------
// Simulação dinâmica
async function rodarSimulacao() {
    const categoria = categoriaSelect.value;
    const pauta = pautaSelect.value;
    const ladoPlayer = ladoPlayerSelect.value;
    const qEsq = parseInt(qtEsquerdaInput.value);
    const qDir = parseInt(qtDireitaInput.value);

    const vereadores = gerarVereadores(qEsq, qDir);

    configScreen.classList.add("hidden");
    simulationScreen.classList.remove("hidden");

    simulationLog.innerHTML = "";
    simulationCard.classList.add("hidden");

    simulationInfo.innerHTML =
        `<p><strong>Pauta:</strong> ${pauta} — <strong>Categoria:</strong> ${categoria}</p>` +
        `<p><strong>Lado do jogador:</strong> ${ladoPlayer}</p><hr>`;

    let totalSim = 0;
    let totalNao = 0;
    const total = vereadores.length;

    progressFill.style.width = "0%";
    progressText.textContent = `0 / ${total}`;

    for (let i = 0; i < total; i++) {
        const v = vereadores[i];
        const chance = calcularChance(v, categoria, pauta, ladoPlayer);
        const voto = Math.random() < chance ? "SIM" : "NÃO";

        if (voto === "SIM") totalSim++;
        else totalNao++;

        // Atualiza card
        cardName.textContent = v.nome;
        cardMeta.textContent = v.ideologia.toUpperCase();
        cardVote.textContent = voto;
        cardVote.className = `card-vote ${voto === "SIM" ? "sim" : "nao"}`;

        simulationCard.classList.remove("hidden");
        simulationCard.style.opacity = 0;
        setTimeout(() => (simulationCard.style.opacity = 1), 40);

        // Som
        try {
            if (voto === "SIM") { audioSim.currentTime = 0; audioSim.play(); }
            else { audioNao.currentTime = 0; audioNao.play(); }
        } catch {}

        // Marca cadeira no hemiciclo
        marcarCadeira(i, voto);

        // Historico oculto
        const p = document.createElement("p");
        p.innerHTML = `<strong>${v.nome}</strong> (${v.ideologia}) — ${voto}`;
        simulationLog.appendChild(p);

        // Barra de progresso
        const pct = Math.round(((i + 1) / total) * 100);
        progressFill.style.width = `${pct}%`;
        progressText.textContent = `${i + 1} / ${total}`;

        await new Promise(r => setTimeout(r, 1000));

        simulationCard.style.opacity = 0;
        await new Promise(r => setTimeout(r, 200));
    }

    // Empate: presidente decide
    let presidenteVoto = null;

    if (totalSim === totalNao) {
        presidenteVoto = Math.random() < 0.5 ? "SIM" : "NÃO";
        if (presidenteVoto === "SIM") totalSim++;
        else totalNao++;

        cardName.textContent = "Presidente da Câmara";
        cardMeta.textContent = "Desempate";
        cardVote.textContent = presidenteVoto;
        cardVote.className = `card-vote ${presidenteVoto === "SIM" ? "sim" : "nao"}`;

        simulationCard.style.opacity = 1;

        try {
            if (presidenteVoto === "SIM") { audioSim.currentTime = 0; audioSim.play(); }
            else { audioNao.currentTime = 0; audioNao.play(); }
        } catch {}

        await new Promise(r => setTimeout(r, 900));
        simulationCard.style.opacity = 0;
        await new Promise(r => setTimeout(r, 200));
    }

    simulationScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const aprovado = totalSim > totalNao;

    resultText.innerHTML = `
        <h3>Pauta: ${pauta}</h3>
        <p><strong>SIM:</strong> ${totalSim}</p>
        <p><strong>NÃO:</strong> ${totalNao}</p>
        ${presidenteVoto ? `<p><strong>Presidente decidiu:</strong> ${presidenteVoto}</p>` : ""}
        <hr>
        <h2>Pauta <span style="color:${aprovado ? "var(--green)" : "#ff5b5b"}">${aprovado ? "APROVADA" : "REJEITADA"}</span></h2>
    `;
}

// -----------------------------
// Bind
iniciarSimulacaoBtn.addEventListener("click", () => {
    if (!categoriaSelect.value || !pautaSelect.value) {
        alert("Escolha categoria e pauta.");
        return;
    }
    rodarSimulacao();
});
