/**
 * Evaluador de propagación de corriente lógica booleana para Live KOP Debugging.
 * Capa de aplicación.
 */

/**
 * Evalúa si un contacto individual conduce corriente según el estado actual.
 * @param {string} elemento - Símbolo del elemento (ej: 'I1', '/I2', '[TON 5s]').
 * @param {Object} estado - Mapa de estados booleanos de entradas, marcas y salidas.
 * @returns {boolean} True si el elemento conduce.
 */
export function evaluaConduccionElemento(elemento, estado) {
  if (elemento.startsWith('[')) {
    const clave = elemento.slice(1, -1);
    return Boolean(estado[clave] !== undefined ? estado[clave] : estado[elemento]);
  }
  const esInvertido = elemento.startsWith('/');
  const nombreVariable = esInvertido ? elemento.slice(1) : elemento;
  const valor = Boolean(estado[nombreVariable]);
  return esInvertido ? !valor : valor;
}

/**
 * Evalúa la propagación de corriente de izquierda a derecha en un peldaño Ladder.
 * @param {Object} peldaño - Definición del peldaño ({ p: [[]], s: [], o: '' }).
 * @param {Object} estado - Estado actual de variables lógicas.
 * @returns {Object} Resultado detallado de energización de cada componente del peldaño.
 */
export function evaluarEnergizacionPeldaño(peldaño, estado) {
  const ramas = peldaño.p && peldaño.p.length > 0 ? peldaño.p : [[]];
  const resultadoRamas = [];
  let alMenosUnaRamaConduce = ramas.length === 1 && ramas[0].length === 0;

  for (const rama of ramas) {
    const ramaEvaluada = [];
    let corrienteEnRama = true;

    for (const elemento of rama) {
      const conduce = evaluaConduccionElemento(elemento, estado);
      const energizado = corrienteEnRama && conduce;
      ramaEvaluada.push({ elemento, energizado, conduce });
      if (!conduce) corrienteEnRama = false;
    }

    resultadoRamas.push(ramaEvaluada);
    if (rama.length > 0 && corrienteEnRama) {
      alMenosUnaRamaConduce = true;
    }
  }

  const salidaParaleloEnergizada = alMenosUnaRamaConduce;
  let corrienteSerie = salidaParaleloEnergizada;
  const resultadoSerie = [];

  for (const elemento of (peldaño.s || [])) {
    const conduce = evaluaConduccionElemento(elemento, estado);
    const energizado = corrienteSerie && conduce;
    resultadoSerie.push({ elemento, energizado, conduce });
    if (!conduce) corrienteSerie = false;
  }

  const bobinaEnergizada = corrienteSerie;

  return {
    ramasParalelas: resultadoRamas,
    salidaParaleloEnergizada,
    elementosSerie: resultadoSerie,
    bobinaEnergizada
  };
}
