/**
 * Pruebas unitarias para la Tabla de Asignación de Entradas y Salidas (I/O)
 * y Recursos Internos de Software según especificación canónica industrial.
 */
import { describe, it, expect } from 'vitest';
import { catalogoEjercicios } from '../src/dominio/catalogoEjercicios.js';

describe('Estructura canónica de Asignación de I/O y Recursos de Software', () => {
  it('Todos los ejercicios deben tener tabla de I/O con bornes estrictamente físicos (I o Q)', () => {
    catalogoEjercicios.forEach(ej => {
      expect(Array.isArray(ej.io), `El ejercicio ${ej.n} debe tener array io`).toBe(true);
      expect(ej.io.length).toBeGreaterThan(0);

      ej.io.forEach(([borne, senal, tipo, vale1], idx) => {
        expect(typeof borne).toBe('string');
        expect(typeof senal).toBe('string');
        expect(typeof tipo).toBe('string');
        expect(typeof vale1).toBe('string');

        // Regla estricta: Solo bornes físicos I o Q (nunca T, C, M, B, F en tabla I/O)
        expect(borne).toMatch(/^[IQ]\d+$/, `En ej ${ej.n}, borne '${borne}' debe ser físico (I o Q)`);

        // Tipo de contacto o salida
        expect(['NA', 'NC', 'Digital / Relé']).toContain(tipo);

        // Señal y condición no vacías
        expect(senal.trim().length).toBeGreaterThan(3);
        expect(vale1.trim().length).toBeGreaterThan(3);
      });
    });
  });

  it('Los recursos de software deben estar en soft y tener estructura canónica de 3 columnas', () => {
    catalogoEjercicios.forEach(ej => {
      if (ej.soft && ej.soft.length > 0) {
        ej.soft.forEach(([id, tipoBloque, funcionLogica]) => {
          expect(typeof id).toBe('string');
          expect(typeof tipoBloque).toBe('string');
          expect(typeof funcionLogica).toBe('string');

          expect(id.trim().length).toBeGreaterThan(0);
          expect(tipoBloque.trim().length).toBeGreaterThan(1);
          expect(funcionLogica.trim().length).toBeGreaterThan(5);
        });
      }
    });
  });

  it('Ejercicios con temporizadores o marcas deben declararlos en soft y no en io', () => {
    const ej43 = catalogoEjercicios.find(e => e.n === '4.3');
    expect(ej43.soft.some(s => s[0] === 'B002' || s[0] === 'T1')).toBe(true);
    expect(ej43.io.some(row => row[0] === 'B002' || row[0] === 'T1')).toBe(false);

    const ej45 = catalogoEjercicios.find(e => e.n === '4.5');
    expect(ej45.soft.some(s => s[0] === 'B001' || s[0] === 'C1')).toBe(true);
    expect(ej45.io.some(row => row[0] === 'B001' || row[0] === 'C1')).toBe(false);
  });
});
