/**
 * Generador del script cliente interactivo con motor SVG Ladder KOP para LOGO!Soft.
 * Capa de infraestructura.
 */
import { generarScriptEvaluadorLadder } from './scriptEvaluadorLadder.js';

export function generarScriptCliente() {
  const scriptEvaluador = generarScriptEvaluadorLadder();

  return `
<script>
${scriptEvaluador}

  function renderLadderSvg(peldaños, est) {
    const ALTO_RAMA = 68, MARGEN_BOBINA = 50, ANCHO_BLOQUE = 140;
    const rungs = peldaños.map(p => {
      const ramas = p.p && p.p.length > 0 ? p.p : [[]];
      const pw = Math.max(...ramas.map(r => r.reduce((a, e) => a + calcularAnchoElemento(e), 0)), 0);
      const sw = (p.s || []).reduce((a, e) => a + calcularAnchoElemento(e), 0);
      const salidaInfo = parsearSalidaLadder(p.o);
      const extraW = salidaInfo.esBloque ? (ANCHO_BLOQUE + 20) : 70;
      return { p, ramas, pw, sw, salidaInfo, req: 40 + pw + sw + MARGEN_BOBINA + extraW };
    });

    const anchoTot = Math.max(...rungs.map(r => r.req), 470);
    const RX = anchoTot - 20, BX = RX - ANCHO_BLOQUE - 12;
    let Y = 28;

    const datosRungs = rungs.map(r => {
      const y0 = Y + 54, n = r.ramas.length, ev = evaluarPeldaño(r.p, est);
      const info = { ...r, y0, n, ev, yTop: Y };
      Y += n * ALTO_RAMA + 42;
      return info;
    });

    // Detectar grupos contiguos de bloques que comparten nombre
    const grupos = [];
    let i = 0;
    while (i < datosRungs.length) {
      const rActual = datosRungs[i];
      if (rActual.salidaInfo.esBloque && rActual.salidaInfo.grupo) {
        let j = i + 1;
        while (j < datosRungs.length && datosRungs[j].salidaInfo.esBloque && datosRungs[j].salidaInfo.grupo === rActual.salidaInfo.grupo) {
          j++;
        }
        if (j - i > 1) {
          grupos.push({ inicio: i, fin: j - 1, nom: rActual.salidaInfo.grupo });
          i = j;
          continue;
        }
      }
      i++;
    }

    let svg = '';

    // Renderizar lógica de contactos de cada peldaño
    datosRungs.forEach((r, idx) => {
      const { p, ramas, pw, y0, n, ev, salidaInfo } = r;
      if (p.c) svg += '<text class="c" x="48" y="' + (r.yTop + 16) + '">' + p.c + '</text>';

      ramas.forEach((b, ri) => {
        const yF = y0 + ri * ALTO_RAMA, rEv = ev.resRamas[ri] || [];
        const rAct = rEv.some(e => e.en);
        svg += '<path class="k' + (rAct ? ' energized' : '') + '" d="M40 ' + yF + 'H' + (40 + pw) + '"/>';
        let x = 40;
        b.forEach((e, bi) => {
          const item = rEv[bi], en = item ? item.en : false, cl = en ? ' energized' : '';
          const w = calcularAnchoElemento(e);
          if (e.startsWith('[')) {
            svg += '<rect class="b' + cl + '" x="' + (x + 6) + '" y="' + (yF - 18) + '" width="' + (w - 12) + '" height="36" rx="6"/><text class="t' + cl + '" x="' + (x + w/2) + '" y="' + (yF + 5) + '">' + e.slice(1, -1) + '</text>';
          } else {
            const nc = e.startsWith('/'), nom = nc ? e.slice(1) : e;
            const diag = nc ? '<path class="k' + cl + '" d="M' + (x + 22) + ' ' + (yF + 14) + 'L' + (x + 62) + ' ' + (yF - 14) + '"/>' : '';
            svg += '<rect x="' + (x + 24) + '" y="' + (yF - 16) + '" width="' + 36 + '" height="32" fill="#0b1220"/><path class="k' + cl + '" d="M' + (x + 26) + ' ' + (yF - 15) + 'v30M' + (x + 58) + ' ' + (yF - 15) + 'v30"/>' + diag + '<text class="t' + cl + '" x="' + (x + 42) + '" y="' + (yF - 18) + '">' + nom + '</text>';
          }
          x += w;
        });
      });

      if (n > 1) {
        const clV = ev.paraleloConduce ? ' energized' : '';
        svg += '<path class="k' + clV + '" d="M40 ' + y0 + 'V' + (y0 + (n - 1) * ALTO_RAMA) + 'M' + (40 + pw) + ' ' + y0 + 'V' + (y0 + (n - 1) * ALTO_RAMA) + '"/>';
      }

      let xS = 40 + pw;
      const clS = ev.paraleloConduce ? ' energized' : '';
      const cx = anchoTot - 64;
      const xLlegada = salidaInfo.esBloque ? BX : (cx - 24);
      svg += '<path class="k' + clS + '" d="M' + xS + ' ' + y0 + 'H' + xLlegada + '"/>';

      (p.s || []).forEach((e, si) => {
        const item = ev.resSerie[si], en = item ? item.en : false, cl = en ? ' energized' : '';
        const w = calcularAnchoElemento(e);
        if (e.startsWith('[')) {
          svg += '<rect class="b' + cl + '" x="' + (xS + 6) + '" y="' + (y0 - 18) + '" width="' + (w - 12) + '" height="36" rx="6"/><text class="t' + cl + '" x="' + (xS + w/2) + '" y="' + (y0 + 5) + '">' + e.slice(1, -1) + '</text>';
        } else {
          const nc = e.startsWith('/'), nom = nc ? e.slice(1) : e;
          const diag = nc ? '<path class="k' + cl + '" d="M' + (xS + 22) + ' ' + (y0 + 14) + 'L' + (xS + 62) + ' ' + (y0 - 14) + '"/>' : '';
          svg += '<rect x="' + (xS + 24) + '" y="' + (y0 - 16) + '" width="' + 36 + '" height="32" fill="#0b1220"/><path class="k' + cl + '" d="M' + (xS + 26) + ' ' + (y0 - 15) + 'v30M' + (xS + 58) + ' ' + (y0 - 15) + 'v30"/>' + diag + '<text class="t' + cl + '" x="' + (xS + 42) + '" y="' + (y0 - 18) + '">' + nom + '</text>';
        }
        xS += w;
      });

      // Si es bobina estándar
      if (!salidaInfo.esBloque) {
        const clB = ev.bobina ? ' energized' : '';
        svg += '<path class="k' + clB + '" d="M' + (cx - 10) + ' ' + (y0 - 15) + 'a15 15 0 0 0 0 30M' + (cx + 10) + ' ' + (y0 - 15) + 'a15 15 0 0 1 0 30"/>';
        svg += '<text class="t' + clB + '" x="' + cx + '" y="' + (y0 - 18) + '">' + salidaInfo.nom + '</text>';
        svg += '<path class="k' + clB + '" d="M' + (cx + 24) + ' ' + y0 + 'H' + RX + '"/>';
      }
    });

    // Renderizar cajas de bloques especiales
    const peldañosEnGrupo = new Set();
    grupos.forEach(g => {
      for (let k = g.inicio; k <= g.fin; k++) peldañosEnGrupo.add(k);
      const rIni = datosRungs[g.inicio], rFin = datosRungs[g.fin];
      const yBox = rIni.y0 - 22, hBox = (rFin.y0 - rIni.y0) + 44, yMid = (rIni.y0 + rFin.y0) / 2;
      const algunAct = datosRungs.slice(g.inicio, g.fin + 1).some(d => d.ev.bobina);
      const clBox = algunAct ? ' energized' : '';

      svg += '<rect class="b' + clBox + '" x="' + BX + '" y="' + yBox + '" width="' + ANCHO_BLOQUE + '" height="' + hBox + '" rx="8"/>';
      svg += '<text class="t' + clBox + '" x="' + (BX + ANCHO_BLOQUE/2) + '" y="' + (yMid - 2) + '" font-weight="bold">' + g.nom + '</text>';
      svg += '<text class="t" x="' + (BX + ANCHO_BLOQUE/2) + '" y="' + (yMid + 14) + '" font-size="10" fill="#94a3b8">LOGO! Bloque</text>';

      // Rótulos de pines de entrada a la izquierda
      for (let k = g.inicio; k <= g.fin; k++) {
        const rk = datosRungs[k];
        const clPin = rk.ev.bobina ? ' energized' : '';
        svg += '<rect x="' + BX + '" y="' + (rk.y0 - 8) + '" width="24" height="16" fill="rgba(56,189,248,0.15)" rx="3"/>';
        svg += '<text class="t' + clPin + '" x="' + (BX + 12) + '" y="' + (rk.y0 + 4) + '" font-size="11" font-weight="bold">' + rk.salidaInfo.pin + '</text>';
      }
      // Conexión derecha al riel
      svg += '<path class="k' + clBox + '" d="M' + (BX + ANCHO_BLOQUE) + ' ' + yMid + 'H' + RX + '"/>';
    });

    // Bloques especiales individuales (no agrupados contiguamente)
    datosRungs.forEach((r, idx) => {
      if (r.salidaInfo.esBloque && !peldañosEnGrupo.has(idx)) {
        const clB = r.ev.bobina ? ' energized' : '';
        const yBox = r.y0 - 20, hBox = 40;
        svg += '<rect class="b' + clB + '" x="' + BX + '" y="' + yBox + '" width="' + ANCHO_BLOQUE + '" height="' + hBox + '" rx="8"/>';
        svg += '<rect x="' + BX + '" y="' + (r.y0 - 8) + '" width="24" height="16" fill="rgba(56,189,248,0.15)" rx="3"/>';
        svg += '<text class="t' + clB + '" x="' + (BX + 12) + '" y="' + (r.y0 + 4) + '" font-size="11" font-weight="bold">' + r.salidaInfo.pin + '</text>';
        svg += '<text class="t' + clB + '" x="' + (BX + ANCHO_BLOQUE/2 + 8) + '" y="' + (r.y0 + 4) + '" font-size="11">' + r.salidaInfo.nom + '</text>';
        svg += '<path class="k' + clB + '" d="M' + (BX + ANCHO_BLOQUE) + ' ' + r.y0 + 'H' + RX + '"/>';
      }
    });

    return '<svg viewBox="0 0 ' + (anchoTot + 20) + ' ' + (Y + 20) + '" width="' + (anchoTot + 20) + '" height="' + (Y + 20) + '" class="ladder-svg"><path class="k rail" d="M40 20V' + (Y + 10) + 'M' + RX + ' 20V' + (Y + 10) + '"/>' + svg + '</svg>';
  }
</script>
`;
}
