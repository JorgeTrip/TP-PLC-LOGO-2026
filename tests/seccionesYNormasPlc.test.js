/**
 * Pruebas unitarias para validar las 7 secciones obligatorias por ejercicio,
 * ecuaciones lógicas, memorias técnicas de ingeniería y normas IEC 61131-3 KOP.
 */
import { describe, it, expect } from 'vitest';
import { catalogoEjercicios } from '../src/dominio/catalogoEjercicios.js';

describe('Cumplimiento de las 7 Secciones y Normas IEC 61131-3 KOP', () => {
  it('Todos los ejercicios (4.1 al 4.11) deben contener las 7 secciones en sus datos', () => {
    expect(catalogoEjercicios.length).toBe(11);

    catalogoEjercicios.forEach(ej => {
      // 1. Encabezado y Enunciado oficial
      expect(typeof ej.n, `Número de ejercicio en ${ej.n}`).toBe('string');
      expect(typeof ej.t, `Título de ejercicio en ${ej.n}`).toBe('string');
      expect(typeof ej.q, `Enunciado literal en ${ej.n}`).toBe('string');
      expect(ej.q.trim().length, `Longitud de enunciado en ${ej.n}`).toBeGreaterThan(20);

      // 2. Tabla I/O física (4 columnas)
      expect(Array.isArray(ej.io), `Tabla I/O en ${ej.n}`).toBe(true);
      expect(ej.io.length, `Cantidad de bornes en ${ej.n}`).toBeGreaterThan(0);

      // 3. Recursos internos de software (array definido)
      expect(Array.isArray(ej.soft), `Recursos soft en ${ej.n}`).toBe(true);

      // 4. Ecuaciones lógicas formales (array de strings no vacío)
      expect(Array.isArray(ej.eq), `Ecuaciones lógicas en ${ej.n}`).toBe(true);
      expect(ej.eq.length, `Ecuaciones en ${ej.n}`).toBeGreaterThan(0);
      ej.eq.forEach(eq => expect(typeof eq).toBe('string'));

      // 5. Solución adoptada (memoria técnica formal)
      expect(typeof ej.sol, `Solución adoptada en ${ej.n}`).toBe('string');
      expect(ej.sol.trim().length, `Longitud de memoria técnica en ${ej.n}`).toBeGreaterThan(40);

      // 6. Solución y análisis técnico didáctico
      expect(typeof ej.e, `Solución didáctica en ${ej.n}`).toBe('string');
      expect(ej.e.trim().length, `Longitud didáctica en ${ej.n}`).toBeGreaterThan(40);

      // 7. Diagrama Ladder KOP y Simulación
      expect(Array.isArray(ej.r), `Peldaños Ladder en ${ej.n}`).toBe(true);
      expect(typeof ej.ejecutar, `Función ejecutar en ${ej.n}`).toBe('function');
    });
  });

  it('Los diagramas Ladder KOP no deben contener bobinas ficticias de temporizadores o contadores', () => {
    catalogoEjercicios.forEach(ej => {
      ej.r.forEach((p, idx) => {
        // En IEC 61131-3, la bobina (p.o) no puede ser un temporizador (T1, T2) ni contador (C1)
        // si en la misma rama hay una caja en serie '[TON...]' o '[CTU...]'
        const tieneCajaSerie = (p.s || []).some(s => s.startsWith('[') && !s.includes('↓') && !s.includes('↑'));
        if (tieneCajaSerie) {
          expect(p.o, `En ej ${ej.n} peldaño ${idx}: ${p.o} no debe ser bobina ficticia de temporizador o contador`).not.toMatch(/^[TC]\d+$/);
        }
      });
    });
  });

  it('Ejercicios específicos 4.4, 4.7, 4.9, 4.10 y 4.11 cumplen las directivas técnicas de cátedra', () => {
    const e44 = catalogoEjercicios.find(e => e.n === '4.4');
    expect(e44.soft.some(s => s[1].includes('TP Retrig') || s[1].includes('Pulso redisparable'))).toBe(true);

    const e47 = catalogoEjercicios.find(e => e.n === '4.7');
    expect(e47.soft.some(s => s[0] === 'T2')).toBe(true);
    expect(e47.soft.some(s => s[0] === 'T5')).toBe(true);
    expect(e47.soft.some(s => s[0] === 'M2')).toBe(true);

    const e49 = catalogoEjercicios.find(e => e.n === '4.9');
    expect(e49.soft.some(s => (s[0] === 'SF001' || s[0] === 'B001') && (s[1].includes('Relé RS') || s[1].includes('Relé autoenclavador')))).toBe(true);
    expect(e49.soft.some(s => s[0] === 'SF004' || s[0] === 'B004')).toBe(true);

    const e410 = catalogoEjercicios.find(e => e.n === '4.10');
    expect(e410.io.some(row => row[0] === 'I4' && row[2] === 'NC')).toBe(true);

    const e411 = catalogoEjercicios.find(e => e.n === '4.11');
    expect(e411.soft.some(s => (s[0] === 'B001' || s[0] === 'SF001') && s[1].includes('Relé de impulsos'))).toBe(true);
  });
});
