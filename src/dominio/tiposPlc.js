/**
 * Tipos y funciones auxiliares puras para el procesamiento de lógica de PLC.
 * Capa de dominio aislada de frameworks y UI.
 */

/**
 * Detecta un flanco ascendente en una señal booleana.
 * @param {Object} estado - Estado persistente de la simulación.
 * @param {string} clave - Clave identificadora del flanco.
 * @param {boolean} valorActual - Valor booleano actual.
 * @returns {boolean} True si hubo transición de false a true.
 */
export function detectarFlancoAscendente(estado, clave, valorActual) {
  const claveInterna = `_flanco_${clave}`;
  const flanco = Boolean(valorActual && !estado[claveInterna]);
  estado[claveInterna] = Boolean(valorActual);
  return flanco;
}

/**
 * Detecta un flanco descendente en una señal booleana.
 * @param {Object} estado - Estado persistente de la simulación.
 * @param {string} clave - Clave identificadora del flanco.
 * @param {boolean} valorActual - Valor booleano actual.
 * @returns {boolean} True si hubo transición de true a false.
 */
export function detectarFlancoDescendente(estado, clave, valorActual) {
  const claveInterna = `_flanco_${clave}`;
  const previo = estado[claveInterna] !== undefined ? estado[claveInterna] : false;
  const flanco = Boolean(previo && !valorActual);
  estado[claveInterna] = Boolean(valorActual);
  return flanco;
}
