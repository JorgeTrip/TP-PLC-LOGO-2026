/**
 * Pruebas unitarias para las Guías de Construcción y Tutoriales de LOGO!Soft Comfort.
 */
import { describe, it, expect } from 'vitest';
import { catalogoGuiasLogo, obtenerGuiaLogo } from '../src/dominio/guiasLogo.js';
import { catalogoEjercicios } from '../src/dominio/catalogoEjercicios.js';

describe('Guías de Construcción Tutorial en LOGO!Soft Comfort', () => {
  it('debe contener guías para los 11 ejercicios de la guía oficial (4.1 a 4.11)', () => {
    catalogoEjercicios.forEach(ej => {
      const guia = obtenerGuiaLogo(ej.n);
      expect(guia, `El ejercicio ${ej.n} debe contar con su guía tutorial de LOGO!Soft`).toBeDefined();
      expect(guia.bloques).toBeTruthy();
      expect(Array.isArray(guia.estructura)).toBe(true);
      expect(guia.estructura.length).toBeGreaterThan(0);
    });
  });

  it('debe documentar en 4.1 la ausencia de bloques especiales y la parada dominante', () => {
    const g41 = obtenerGuiaLogo('4.1');
    expect(g41.bloques).toContain('Ninguno');
    expect(g41.comportamiento).toContain('Parada dominante');
    expect(g41.estructura[0]).toContain('Renglón 1');
  });

  it('debe documentar en 4.2 el Relé autoenclavador con pines S y R en LOGO!Soft', () => {
    const g42 = obtenerGuiaLogo('4.2');
    expect(g42.bloques).toContain('Relé autoenclavador');
    expect(g42.pines).toContain('Terminal superior S');
    expect(g42.pines).toContain('terminal inferior R');
  });

  it('debe documentar en 4.9 el orden secuencial Grafcet (Set de entrante antes de Reset de saliente)', () => {
    const g49 = obtenerGuiaLogo('4.9');
    expect(g49.comportamiento).toContain('Grafcet');
    expect(g49.estructura.length).toBe(11);
  });

  it('debe documentar en 4.10 la doctrina de cátedra sobre parada de emergencia fuera de programa', () => {
    const g410 = obtenerGuiaLogo('4.10');
    expect(g410.doctrina).toContain('parada de emergencia PE');
    expect(g410.doctrina).toContain('fuera del PLC');
  });

  it('debe documentar en 4.11 la alternancia mediante el bloque Relé de impulsos', () => {
    const g411 = obtenerGuiaLogo('4.11');
    expect(g411.bloques).toContain('Relé de impulsos');
    expect(g411.estructura[0]).toContain('Trg');
  });
});
