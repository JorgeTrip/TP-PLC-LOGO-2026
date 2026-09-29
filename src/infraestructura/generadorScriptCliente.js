/**
 * Generador del script cliente interactivo embebido en el HTML final.
 * Capa de infraestructura.
 */

export function generarScriptCliente() {
  return `
<script>
  function calcularAnchoElemento(el) {
    if (el.startsWith('[')) return Math.max(96, (el.length - 2) * 8 + 32);
    return 84;
  }
  function evaluaConduccionElemento(el, est) {
    if (el.startsWith('[')) {
      const k = el.slice(1, -1);
      return Boolean(est[k] !== undefined ? est[k] : est[el]);
    }
    const nc = el.startsWith('/');
    const n = nc ? el.slice(1) : el;
    const v = Boolean(est[n]);
    return nc ? !v : v;
  }
  function evaluarPeldaño(p, est) {
    const ramas = p.p && p.p.length > 0 ? p.p : [[]];
    const resRamas = [];
    let paraleloConduce = ramas.length === 1 && ramas[0].length === 0;
    for (const r of ramas) {
      const ramaEval = [];
      let fl = true;
      for (const el of r) {
        const c = evaluaConduccionElemento(el, est);
        const en = fl && c;
        ramaEval.push({ el, en, c });
        if (!c) fl = false;
      }
      resRamas.push(ramaEval);
      if (r.length > 0 && fl) paraleloConduce = true;
    }
    let flSerie = paraleloConduce;
    const resSerie = [];
    for (const el of (p.s || [])) {
      const c = evaluaConduccionElemento(el, est);
      const en = flSerie && c;
      resSerie.push({ el, en, c });
      if (!c) flSerie = false;
    }
    return { resRamas, paraleloConduce, resSerie, bobina: flSerie };
  }
  function renderLadderSvg(peldaños, est) {
    const ALTO_RAMA = 68, MARGEN_BOBINA = 60;
    const rungs = peldaños.map(p => {
      const ramas = p.p && p.p.length > 0 ? p.p : [[]];
      const pw = Math.max(...ramas.map(r => r.reduce((a, e) => a + calcularAnchoElemento(e), 0)), 0);
      const sw = (p.s || []).reduce((a, e) => a + calcularAnchoElemento(e), 0);
      return { p, ramas, pw, sw, req: 40 + pw + sw + MARGEN_BOBINA + 70 };
    });
    const anchoTot = Math.max(...rungs.map(r => r.req), 440);
    const RX = anchoTot - 20;
    let Y = 28, svg = '';
    rungs.forEach(({ p, ramas, pw }) => {
      const y0 = Y + 54, n = ramas.length, cx = anchoTot - 56;
      const ev = evaluarPeldaño(p, est);
      if (p.c) svg += '<text class="c" x="48" y="' + (Y + 16) + '">' + p.c + '</text>';
      ramas.forEach((b, i) => {
        const yF = y0 + i * ALTO_RAMA;
        const rEv = ev.resRamas[i] || [];
        const rAct = rEv.some(e => e.en);
        svg += '<path class="k' + (rAct ? ' energized' : '') + '" d="M40 ' + yF + 'H' + (40 + pw) + '"/>';
        let x = 40;
        b.forEach((e, idx) => {
          const item = rEv[idx], en = item ? item.en : false, cl = en ? ' energized' : '';
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
      svg += '<path class="k' + clS + '" d="M' + xS + ' ' + y0 + 'H' + (cx - 24) + '"/>';
      (p.s || []).forEach((e, idx) => {
        const item = ev.resSerie[idx], en = item ? item.en : false, cl = en ? ' energized' : '';
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
      const clB = ev.bobina ? ' energized' : '';
      svg += '<path class="k' + clB + '" d="M' + (cx + 24) + ' ' + y0 + 'H' + RX + 'M' + (cx - 10) + ' ' + (y0 - 15) + 'a15 15 0 0 0 0 30M' + (cx + 10) + ' ' + (y0 - 15) + 'a15 15 0 0 1 0 30"/><text class="t' + clB + '" x="' + cx + '" y="' + (y0 - 18) + '">' + p.o + '</text>';
      Y += n * ALTO_RAMA + 42;
    });
    return '<svg viewBox="0 0 ' + (anchoTot + 20) + ' ' + (Y + 20) + '" width="' + (anchoTot + 20) + '" height="' + (Y + 20) + '" class="ladder-svg"><path class="k rail" d="M40 20V' + (Y + 10) + 'M' + RX + ' 20V' + (Y + 10) + '"/>' + svg + '</svg>';
  }
</script>
`;
}
