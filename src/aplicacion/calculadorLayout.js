/**
 * Calculador de topología geométrica y detección de colisiones 2D para diagramas Ladder SVG.
 * Capa de aplicación.
 */

/**
 * Calcula el ancho necesario para un elemento de peldaño.
 * @param {string} elemento - Texto del elemento (ej: 'I1', '/I2', '[TON 5s]').
 * @returns {number} Ancho en píxeles.
 */
export function calcularAnchoElemento(elemento) {
  if (elemento.startsWith('[')) {
    return Math.max(96, (elemento.length - 2) * 8 + 32);
  }
  return 84;
}

/**
 * Calcula la suma de anchos de una rama de elementos.
 * @param {string[]} rama - Lista de elementos.
 * @returns {number} Ancho total.
 */
export function calcularAnchoRama(rama) {
  return (rama || []).reduce((acc, el) => acc + calcularAnchoElemento(el), 0);
}

/**
 * Extrae los elementos visuales y calcula las dimensiones del diagrama Ladder.
 * @param {Array} peldaños - Definición de peldaños del ejercicio.
 * @returns {Object} Layout calculado con peldaños, cajas y elementos visuales.
 */
export function calcularLayoutLadder(peldaños) {
  const ALTO_RAMA = 68;
  const MARGEN_SUPERIOR_COMENTARIO = 42;
  const DESPEJE_COMENTARIO = 16;
  const MARGEN_BOBINA = 60;

  const rungsConMetricas = peldaños.map(p => {
    const ramas = p.p && p.p.length > 0 ? p.p : [[]];
    const anchoParalelo = Math.max(...ramas.map(calcularAnchoRama), 0);
    const anchoSerie = calcularAnchoRama(p.s || []);
    const finSerie = 40 + anchoParalelo + anchoSerie;
    return { p, ramas, anchoParalelo, anchoSerie, finSerie, anchoRequerido: finSerie + MARGEN_BOBINA + 70 };
  });

  const anchoTotal = Math.max(...rungsConMetricas.map(r => r.anchoRequerido), 440);
  const elementosVisuales = [];
  const resultadoPeldaños = [];
  let yActual = 28;

  rungsConMetricas.forEach(({ p, ramas, anchoParalelo, anchoSerie, finSerie }) => {
    const yComentario = yActual;
    const yPrimerContacto = yComentario + MARGEN_SUPERIOR_COMENTARIO;
    const cantRamas = ramas.length;
    const cxBobina = anchoTotal - 56;

    // Elemento visual: Comentario
    if (p.c) {
      elementosVisuales.push({
        tipo: 'comentario',
        texto: p.c,
        x: 48,
        y: yComentario - 8,
        ancho: p.c.length * 7.5,
        alto: 14
      });
    }

    // Elementos de ramas paralelas
    ramas.forEach((rama, idxRama) => {
      const yFila = yPrimerContacto + idxRama * ALTO_RAMA;
      let x = 40;
      rama.forEach(el => {
        const w = calcularAnchoElemento(el);
        if (el.startsWith('[')) {
          elementosVisuales.push({
            tipo: 'bloque',
            texto: el.slice(1, -1),
            x: x + 6,
            y: yFila - 18,
            ancho: w - 12,
            alto: 36
          });
        } else {
          const texto = el.startsWith('/') ? el.slice(1) : el;
          elementosVisuales.push({
            tipo: 'contacto',
            texto,
            x: x + 24,
            y: yFila - 24,
            ancho: 36,
            alto: 38
          });
        }
        x += w;
      });
    });

    // Elementos en serie
    let xSerie = 40 + anchoParalelo;
    (p.s || []).forEach(el => {
      const w = calcularAnchoElemento(el);
      if (el.startsWith('[')) {
        elementosVisuales.push({
          tipo: 'bloque',
          texto: el.slice(1, -1),
          x: xSerie + 6,
          y: yPrimerContacto - 18,
          ancho: w - 12,
          alto: 36
        });
      } else {
        const texto = el.startsWith('/') ? el.slice(1) : el;
        elementosVisuales.push({
          tipo: 'contacto',
          texto,
          x: xSerie + 24,
          y: yPrimerContacto - 24,
          ancho: 36,
          alto: 38
        });
      }
      xSerie += w;
    });

    // Elemento visual: Bobina
    elementosVisuales.push({
      tipo: 'bobina',
      texto: p.o,
      x: cxBobina - 20,
      y: yPrimerContacto - 22,
      ancho: 40,
      alto: 38
    });

    resultadoPeldaños.push({
      altoRama: ALTO_RAMA,
      despejeComentario: DESPEJE_COMENTARIO,
      posicionBobinaX: cxBobina,
      finElementosSerieX: finSerie,
      yPrimerContacto,
      cantRamas
    });

    yActual += cantRamas * ALTO_RAMA + 38;
  });

  return {
    peldaños: resultadoPeldaños,
    elementosVisuales,
    anchoTotal: anchoTotal + 20,
    altoTotal: yActual + 20
  };
}

/**
 * Detecta colisiones entre elementos visuales rectangulares.
 * @param {Array} elementos - Lista de elementos visuales con Bounding Boxes.
 * @returns {Array} Lista de pares en colisión.
 */
export function detectarColisiones(elementos) {
  const colisiones = [];
  const delta = 2;

  for (let i = 0; i < elementos.length; i++) {
    for (let j = i + 1; j < elementos.length; j++) {
      const a = elementos[i];
      const b = elementos[j];

      const seSolapan = !(
        a.x + a.ancho + delta <= b.x ||
        b.x + b.ancho + delta <= a.x ||
        a.y + a.alto + delta <= b.y ||
        b.y + b.alto + delta <= a.y
      );

      if (seSolapan) {
        colisiones.push({ elementoA: a, elementoB: b });
      }
    }
  }

  return colisiones;
}
