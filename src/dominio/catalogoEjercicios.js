/**
 * Orquestador del catálogo consolidado de ejercicios de PLC LOGO! (4.1 a 4.11).
 * Capa de dominio puro.
 */
import { ejerciciosBloque1 } from './ejerciciosBloque1.js';
import { ejerciciosBloque2 } from './ejerciciosBloque2.js';
import { ejerciciosBloque3 } from './ejerciciosBloque3.js';
import { ejerciciosBloque4 } from './ejerciciosBloque4.js';

export const catalogoEjercicios = [
  ...ejerciciosBloque1,
  ...ejerciciosBloque2,
  ...ejerciciosBloque3,
  ...ejerciciosBloque4
];

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
