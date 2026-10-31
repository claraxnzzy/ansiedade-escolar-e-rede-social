// SELECIONAR AS PÁGINAS E O MENU

const pages = [...document.querySelectorAll('.page')];

const navLinks = [...document.querySelectorAll('.nav-link')];

const nav = document.getElementById('mainNav');

const menuToggle = document.getElementById('menuToggle');


// FUNÇÃO PARA TROCAR DE PÁGINA

function showPage(id) {

  pages.forEach(page => {
    page.classList.toggle('active', page.id === id);
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === id);
  });

  nav.classList.remove('open');

  menuToggle.setAttribute('aria-expanded', 'false');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


// BOTÕES DO MENU

navLinks.forEach(link => {

  link.addEventListener('click', () => {
    showPage(link.dataset.page);
  });

});


// BOTÕES DE NAVEGAÇÃO DENTRO DAS PÁGINAS

document.querySelectorAll('[data-go]').forEach(button => {

  button.addEventListener('click', () => {
    showPage(button.dataset.go);
  });

});


// VOLTAR PARA A PÁGINA INICIAL

document.querySelector('.brand').addEventListener('click', event => {

  event.preventDefault();

  showPage('inicio');

});


// MENU PARA CELULAR

menuToggle.addEventListener('click', () => {

  const opened = nav.classList.toggle('open');

  menuToggle.setAttribute('aria-expanded', String(opened));

});


// CORES DOS GRÁFICOS

const palette = [
  '#4169c9',
  '#cf4527',
  '#f4a12e',
  '#459b37'
];


// FUNÇÃO PARA DESENHAR OS GRÁFICOS

function drawPie(canvasId, legendId, values, labels, colors) {

  const canvas = document.getElementById(canvasId);

  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;

  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = rect.width;

  const h = rect.height;

  const cx = w / 2;

  const cy = h / 2;

  const radius = Math.min(w, h) * .43;

  let start = -Math.PI / 2;


  values.forEach((value, index) => {

    const slice = (value / values.reduce((a,b) => a+b,0)) * Math.PI * 2;

    ctx.beginPath();

    ctx.moveTo(cx, cy);

    ctx.arc(cx, cy, radius, start, start + slice);

    ctx.closePath();

    ctx.fillStyle = colors[index];

    ctx.fill();

    ctx.strokeStyle = '#fff';

    ctx.lineWidth = 2;

    ctx.stroke();


    // PORCENTAGEM DENTRO DO GRÁFICO

    const mid = start + slice / 2;

    const tx = cx + Math.cos(mid) * radius * .59;

    const ty = cy + Math.sin(mid) * radius * .59;

    ctx.fillStyle = '#fff';

    ctx.font = '700 13px Mali, sans-serif';

    ctx.textAlign = 'center';

    ctx.textBaseline = 'middle';

    ctx.fillText(
      value.toFixed(1).replace('.', ',') + '%',
      tx,
      ty
    );

    start += slice;

  });


  // LEGENDA DO GRÁFICO

  document.getElementById(legendId).innerHTML = labels.map((label, i) =>

    `<span class="legend-item">
      <i class="legend-dot" style="background:${colors[i]}"></i>
      ${label}
    </span>`

  ).join('');

}


// CRIAR OS DOIS GRÁFICOS

function renderCharts() {

  // GRÁFICO 1: DIFICULDADE DE CONCENTRAÇÃO

  drawPie(
    'focusChart',
    'focusLegend',

    [29.3, 51.2, 17.1, 2.4],

    [
      'Nunca · 29,3%',
      'Às vezes · 51,2%',
      'Frequentemente · 17,1%',
      'Sempre · 2,4%'
    ],

    palette
  );


  // GRÁFICO 2: TEMPO NAS REDES SOCIAIS

  drawPie(
    'timeChart',
    'timeLegend',

    [57.6, 42.4],

    [
      'Mais de 3 horas/dia · 57,6%',
      'Menos de 1 hora/dia · 42,4%'
    ],

    [
      palette[0],
      palette[1]
    ]

  );

}


// MOSTRAR OS GRÁFICOS QUANDO A PÁGINA CARREGAR

window.addEventListener('load', renderCharts);


// ATUALIZAR OS GRÁFICOS QUANDO A TELA MUDAR DE TAMANHO

window.addEventListener('resize', renderCharts);