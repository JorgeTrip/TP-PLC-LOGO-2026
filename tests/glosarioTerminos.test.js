/**
 * Pruebas unitarias para el glosario de términos técnicos y tooltips.
 */
import { describe, it, expect } from 'vitest';
import { glosarioTerminos, enriquecerConGlosario } from '../src/dominio/glosarioTerminos.js';

describe('Glosario de Términos Técnicos', () => {
  it('debe contener definiciones clave de automatización y PLC LOGO!', () => {
    expect(glosarioTerminos['Siemens LOGO!']).toBeDefined();
    expect(glosarioTerminos['KOP']).toBeDefined();
    expect(glosarioTerminos['TON']).toBeDefined();
    expect(glosarioTerminos['Autorretención']).toBeDefined();
    expect(glosarioTerminos['Enclavamiento']).toBeDefined();
  });

  it('debe enriquecer un texto identificando términos técnicos y asignando data-tooltip', () => {
    const texto = 'El circuito usa KOP con temporizador TON y autorretención.';
    const enriquecido = enriquecerConGlosario(texto);

    expect(enriquecido).toContain('data-tooltip=');
    expect(enriquecido).toContain('class="termino-tecnico"');
    expect(enriquecido).toContain('KOP');
  });

  it('no debe alterar texto vacío o nulo', () => {
    expect(enriquecerConGlosario('')).toBe('');
    expect(enriquecerConGlosario(null)).toBe('');
  });
});
