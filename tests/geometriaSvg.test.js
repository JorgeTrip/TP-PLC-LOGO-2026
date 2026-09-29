/**
 * Pruebas automatizadas de geometría y colisiones de diagramas Ladder SVG.
 * Valida la no-intersección de cajas delimitadoras (Bounding Boxes).
 */
import { describe, it, expect } from 'vitest';
import { calcularLayoutLadder, detectarColisiones } from '../src/aplicacion/calculadorLayout.js';
import { catalogoEjercicios } from '../src/dominio/catalogoEjercicios.js';

describe('Motor SVG Ladder: Geometría y Cero Colisiones', () => {
  it('debe calcular alturas de peldaño con holgura suficiente (mínimo 65px por rama)', () => {
    for (const ejercicio of catalogoEjercicios) {
      const layout = calcularLayoutLadder(ejercicio.r);
      for (const peldaño of layout.peldaños) {
        expect(peldaño.altoRama).toBeGreaterThanOrEqual(65);
        expect(peldaño.despejeComentario).toBeGreaterThanOrEqual(14);
      }
    }
  });

  it('no debe presentar colisiones entre textos, comentarios y cajas en ningún ejercicio', () => {
    for (const ejercicio of catalogoEjercicios) {
      const layout = calcularLayoutLadder(ejercicio.r);
      const colisiones = detectarColisiones(layout.elementosVisuales);
      if (colisiones.length > 0) {
        console.error(`Colisiones en ${ejercicio.n} (${ejercicio.t}):`, colisiones);
      }
      expect(colisiones).toHaveLength(0);
    }
  });

  it('debe asegurar que las cajas de bloques contengan holgadamente su texto interno', () => {
    for (const ejercicio of catalogoEjercicios) {
      const layout = calcularLayoutLadder(ejercicio.r);
      for (const elemento of layout.elementosVisuales) {
        if (elemento.tipo === 'bloque') {
          const anchoMinimoEstimado = elemento.texto.length * 7.5 + 20;
          expect(elemento.ancho).toBeGreaterThanOrEqual(anchoMinimoEstimado);
        }
      }
    }
  });

  it('debe ubicar las bobinas con holgura respecto a los elementos en serie previos', () => {
    for (const ejercicio of catalogoEjercicios) {
      const layout = calcularLayoutLadder(ejercicio.r);
      for (const peldaño of layout.peldaños) {
        const distanciaBobina = peldaño.posicionBobinaX - peldaño.finElementosSerieX;
        expect(distanciaBobina).toBeGreaterThanOrEqual(30);
      }
    }
  });
});
