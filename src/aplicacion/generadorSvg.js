/**
 * Generador de código SVG para diagramas Ladder (KOP) con soporte de Live Debugging.
 * Capa de aplicación.
 */
import { calcularLayoutLadder, calcularAnchoElemento } from './calculadorLayout.js';
import { evaluarEnergizacionPeldaño } from './evaluadorCorriente.js';

function renderizarElemento(el, x, y, energizado) {
  const claseEnergizado = energizado ? ' energized' : '';
  if (el.startsWith('[')) {
    const w = calcularAnchoElemento(el);
    const texto = el.slice(1, -1);
    return `<rect class="b${claseEnergizado}" x="${x + 6}" y="${y - 18}" width="${w - 12}" height="36" rx="6"/><text class="t${claseEnergizado}" x="${x + w / 2}" y="${y + 5}">${texto}</text>`;
  }
  const esNc = el.startsWith('/');
  const nombre = esNc ? el.slice(1) : el;
  const diagonal = esNc ? `<path class="k${claseEnergizado}" d="M${x + 22} ${y + 14}L${x + 62} ${y - 14}"/>` : '';
  return `<rect x="${x + 24}" y="${y - 16}" width="36" height="32" fill="#0b1220"/><path class="k${claseEnergizado}" d="M${x + 26} ${y - 15}v30M${x + 58} ${y - 15}v30"/>${diagonal}<text class="t${claseEnergizado}" x="${x + 42}" y="${y - 18}">${nombre}</text>`;
}

export function generarSvgLadder(peldaños, estadoLogico = {}) {
  const layout = calcularLayoutLadder(peldaños);
  const RX = layout.anchoTotal - 20;
  let svgCuerpo = '';
  let Y = 28;

  peldaños.forEach((p, idx) => {
    const metricas = layout.peldaños[idx];
    const y0 = Y + 54;
    const n = metricas.cantRamas;
    const cx = metricas.posicionBobinaX;
    const evaluacion = evaluarEnergizacionPeldaño(p, estadoLogico);
    const ramas = p.p && p.p.length > 0 ? p.p : [[]];
    const pw = Math.max(...ramas.map(r => r.reduce((a, e) => a + calcularAnchoElemento(e), 0)), 0);

    if (p.c) {
      svgCuerpo += `<text class="c" x="48" y="${Y + 16}">${p.c}</text>`;
    }

    ramas.forEach((b, i) => {
      const yFila = y0 + i * metricas.altoRama;
      const ramaEval = evaluacion.ramasParalelas[i] || [];
      const ramaActiva = ramaEval.some(e => e.energizado);
      const claseRama = ramaActiva ? ' energized' : '';

      svgCuerpo += `<path class="k${claseRama}" d="M40 ${yFila}H${40 + pw}"/>`;
      let x = 40;
      b.forEach((e, idxEl) => {
        const itemEval = ramaEval[idxEl];
        const en = itemEval ? itemEval.energizado : false;
        svgCuerpo += renderizarElemento(e, x, yFila, en);
        x += calcularAnchoElemento(e);
      });
    });

    if (n > 1) {
      const claseBusV = evaluacion.salidaParaleloEnergizada ? ' energized' : '';
      svgCuerpo += `<path class="k${claseBusV}" d="M40 ${y0}V${y0 + (n - 1) * metricas.altoRama}M${40 + pw} ${y0}V${y0 + (n - 1) * metricas.altoRama}"/>`;
    }

    let xSerie = 40 + pw;
    const claseSerieInicio = evaluacion.salidaParaleloEnergizada ? ' energized' : '';
    svgCuerpo += `<path class="k${claseSerieInicio}" d="M${xSerie} ${y0}H${cx - 24}"/>`;

    (p.s || []).forEach((e, idxS) => {
      const itemEval = evaluacion.elementosSerie[idxS];
      const en = itemEval ? itemEval.energizado : false;
      svgCuerpo += renderizarElemento(e, xSerie, y0, en);
      xSerie += calcularAnchoElemento(e);
    });

    const claseBobina = evaluacion.bobinaEnergizada ? ' energized' : '';
    svgCuerpo += `<path class="k${claseBobina}" d="M${cx + 24} ${y0}H${RX}M${cx - 10} ${y0 - 15}a15 15 0 0 0 0 30M${cx + 10} ${y0 - 15}a15 15 0 0 1 0 30"/><text class="t${claseBobina}" x="${cx}" y="${y0 - 18}">${p.o}</text>`;

    Y += n * metricas.altoRama + 42;
  });

  return `<svg viewBox="0 0 ${layout.anchoTotal} ${Y + 20}" width="${layout.anchoTotal}" height="${Y + 20}" class="ladder-svg"><path class="k rail" d="M40 20V${Y + 10}M${RX} 20V${Y + 10}"/>${svgCuerpo}</svg>`;
}
