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
// Pautas por categoria (kept)
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
  const opts = pautasPorCategoria[cat] || [];
  opts.forEach(p => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    pautaSelect.appendChild(o);
  });
});

// -----------------------------
// Gerar vereadores (nomes & convicção)
function gerarNomeAleatorio() {
  const primeiros = ["Carlos","João","Marcos","Paulo","Lucas","Bruno","Henrique","Fábio","Eduardo","Rafael","Ana","Maria","Carla","Beatriz","Fernanda"];
  const ultimos = ["Silva","Souza","Almeida","Santos","Oliveira","Gomes","Lima","Barbosa","Azevedo","Monteiro","Leite"];
  return `${primeiros[Math.floor(Math.random()*primeiros.length)]} ${ultimos[Math.floor(Math.random()*ultimos.length)]}`;
}

function gerarVereadores(qEsq, qDir) {
  const list = [];
  for (let i=0;i<qEsq;i++){
    list.push({ nome: gerarNomeAleatorio(), ideologia: "esquerda", conviccao: Math.random()*0.4+0.3 });
  }
  for (let j=0;j<qDir;j++){
    list.push({ nome: gerarNomeAleatorio(), ideologia: "direita", conviccao: Math.random()*0.4+0.3 });
  }
  return list;
}

// -----------------------------
// Algoritmo de decisão (refinado)
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

  if (acao.includes("adicionar") || acao.includes("criar") || acao.includes("melhorar")) {
    if (v.ideologia === "esquerda") chance += 0.15; else chance -= 0.10;
  }
  if (acao.includes("remover") || acao.includes("ajustar")) {
    if (v.ideologia === "direita") chance += 0.15; else chance -= 0.10;
  }

  if (v.ideologia === ladoPlayer) chance += 0.10;

  // convicção personal
  chance += (v.conviccao - 0.5) * 0.35;

  // ruído leve
  chance += (Math.random()*0.12 - 0.06);

  return Math.max(0.05, Math.min(chance, 0.95));
}

// -----------------------------
// Simulação: 1 vereador por vez + som + progresso
async function rodarSimulacao() {
  const categoria = categoriaSelect.value;
  const pauta = pautaSelect.value;
  const ladoPlayer = ladoPlayerSelect.value;
  const qEsq = Math.max(0, parseInt(qtEsquerdaInput.value) || 0);
  const qDir = Math.max(0, parseInt(qtDireitaInput.value) || 0);

  const vereadores = gerarVereadores(qEsq, qDir);

  // reset UI
  configScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  simulationScreen.classList.remove("hidden");
  simulationLog.classList.add("log-hidden");
  simulationLog.innerHTML = "";

  simulationInfo.innerHTML = `<p><strong>Pauta:</strong> ${pauta} — <strong>Categoria:</strong> ${categoria} — <strong>Seu lado:</strong> ${ladoPlayer}</p><hr>`;

  let totalSim = 0;
  let totalNao = 0;
  const total = vereadores.length;

  // show first state
  progressFill.style.width = `0%`;
  progressText.textContent = `0 / ${total}`;

  for (let i = 0; i < total; i++) {
    const v = vereadores[i];
    const chance = calcularChance(v, categoria, pauta, ladoPlayer);
    const voto = Math.random() < chance ? "SIM" : "NÃO";

    if (voto === "SIM") totalSim++; else totalNao++;

    // update card
    cardName.textContent = v.nome;
    cardMeta.textContent = `${v.ideologia.toUpperCase()}`;
    cardVote.textContent = voto;
    cardVote.className = `card-vote ${voto === "SIM" ? "sim" : "nao"}`;

    // reveal card (fade)
    simulationCard.classList.remove("hidden");
    simulationCard.style.opacity = 0;
    setTimeout(()=> simulationCard.style.opacity = 1, 40);

    // play sound (try/catch to avoid errors if files missing)
    try {
      if (voto === "SIM") { audioSim.currentTime = 0; audioSim.play(); }
      else { audioNao.currentTime = 0; audioNao.play(); }
    } catch(e){ /* ignore playback errors */ }

    // append to hidden log (keeps history but not focus)
    const logP = document.createElement("p");
    logP.innerHTML = `<strong>${v.nome}</strong> (${v.ideologia}) — ${voto}`;
    simulationLog.appendChild(logP);
    // update progress bar
    const pct = Math.round(((i+1)/total)*100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `${i+1} / ${total}`;

    // wait (1s per your choice)
    await new Promise(r => setTimeout(r, 1000));

    // brief fade out
    simulationCard.style.opacity = 0;
    await new Promise(r => setTimeout(r, 200));
  }

  // EMPATE → PRESIDENTE
  let presidenteVoto = null;
  if (totalSim === totalNao) {
    // determine president vote using simple weighted rule: slight prefer stability (random)
    presidenteVoto = Math.random() < 0.5 ? "SIM" : "NÃO";
    if (presidenteVoto === "SIM") totalSim++; else totalNao++;

    // show president card briefly
    cardName.textContent = "Presidente da Câmara";
    cardMeta.textContent = "Decisão de desempate";
    cardVote.textContent = presidenteVoto;
    cardVote.className = `card-vote ${presidenteVoto === "SIM" ? "sim" : "nao"}`;
    simulationCard.style.opacity = 1;

    try {
      if (presidenteVoto === "SIM") { audioSim.currentTime = 0; audioSim.play(); }
      else { audioNao.currentTime = 0; audioNao.play(); }
    } catch(e){}

    await new Promise(r => setTimeout(r, 900));
    simulationCard.style.opacity = 0;
    await new Promise(r => setTimeout(r, 200));
  }

  // show result
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
// Iniciar bind
iniciarSimulacaoBtn.addEventListener("click", () => {
  if (!categoriaSelect.value || !pautaSelect.value) {
    alert("Escolha categoria e pauta.");
    return;
  }
  rodarSimulacao();
});
