/**
 * Orquestador del catálogo consolidado de ejercicios de PLC LOGO! (4.1 a 4.11).
 * Capa de dominio puro.
 */
import { ejerciciosParte1 } from './ejerciciosParte1.js';
import { ejerciciosParte2 } from './ejerciciosParte2.js';

export const catalogoEjercicios = [...ejerciciosParte1, ...ejerciciosParte2];

/**
 * Obtiene la definición de un ejercicio por su identificador (ej: '4.1').
 * @param {string} id - Identificador numérico del ejercicio.
 * @returns {Object} Definición completa del ejercicio.
 */
export function obtenerEjercicioPorId(id) {
  const ejercicio = catalogoEjercicios.find(e => e.n === id);
  if (!ejercicio) {
    throw new Error(`Ejercicio no encontrado: ${id}`);
  }
  return ejercicio;
}
