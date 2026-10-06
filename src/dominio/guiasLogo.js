/**
 * Módulo unificador de Guías de Construcción y Tutoriales para LOGO!Soft Comfort.
 * Capa de dominio.
 */
import { guiasLogoBloque1 } from './guiasLogoBloque1.js';
import { guiasLogoBloque2 } from './guiasLogoBloque2.js';

export const catalogoGuiasLogo = {
  ...guiasLogoBloque1,
  ...guiasLogoBloque2
};

export function obtenerGuiaLogo(numeroEjercicio) {
  return catalogoGuiasLogo[numeroEjercicio] || null;
}
