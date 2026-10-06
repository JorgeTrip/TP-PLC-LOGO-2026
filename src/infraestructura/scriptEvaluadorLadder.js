/**
 * Generador de script cliente para evaluación de ramas, conducción y análisis de salidas KOP.
 * Capa de infraestructura.
 */

export function generarScriptEvaluadorLadder() {
  return `
  function calcularAnchoElemento(el) {
    if (el.startsWith('[')) return Math.max(96, (el.length - 2) * 8 + 32);
    return 84;
  }
  function evaluaConduccionElemento(el, est) {
    if (el.startsWith('[')) {
      if (el.includes('↓')) {
        const k = el.replace(/[\\[\\]↓\\s]/g, '');
        return Boolean(est['flancoBaja_' + k] !== undefined ? est['flancoBaja_' + k] : est[k]);
      }
      if (el.includes('↑')) {
        const k = el.replace(/[\\[\\]↑\\s]/g, '');
        return Boolean(est['flancoSube_' + k] !== undefined ? est['flancoSube_' + k] : est[k]);
      }
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
  function parsearSalidaLadder(o) {
    if (!o) return { esBloque: false, nom: '', pin: '', grupo: null };
    const s = String(o).trim();
    if (s.startsWith('[') && s.endsWith(']')) {
      const int = s.slice(1, -1).trim();
      if (int.startsWith('Trg ')) {
        const nom = int.slice(4).trim();
        return { esBloque: true, pin: 'Trg', nom: nom, grupo: nom };
      }
      const matchTipo = int.match(/^(TON|TP|TP_Retrig|Barrido|AND|CTU|Async)\\s+(.+)$/);
      if (matchTipo) {
        const pin = matchTipo[1] === 'Async' ? 'En' : (matchTipo[1] === 'CTU' ? 'Cnt' : (matchTipo[1] === 'AND' ? 'IN' : 'Trg'));
        return { esBloque: true, pin, nom: int, grupo: matchTipo[2].split('|')[0].trim() };
      }
      return { esBloque: true, pin: 'IN', nom: int, grupo: int };
    }
    const matchSR = s.match(/^(S|R)\\s+(.+)$/);
    if (matchSR) {
      return { esBloque: true, pin: matchSR[1], nom: matchSR[2], grupo: matchSR[2] };
    }
    const matchParentesis = s.match(/^(.+?)\\s*\\((S|R|Cnt|Dir|Trg)\\)$/);
    if (matchParentesis) {
      return { esBloque: true, pin: matchParentesis[2], nom: matchParentesis[1], grupo: matchParentesis[1] };
    }
    return { esBloque: false, nom: s, pin: '', grupo: null };
  }
`;
}
