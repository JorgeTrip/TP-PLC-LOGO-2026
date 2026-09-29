/**
 * Pruebas unitarias del Evaluador de Corriente Lógica (Live KOP Debugging).
 * Valida la propagación booleana de energía a través de ramas y contactos.
 */
import { describe, it, expect } from 'vitest';
import { evaluarEnergizacionPeldaño } from '../src/aplicacion/evaluadorCorriente.js';

describe('Live KOP: Evaluador de Corriente Lógica', () => {
  it('debe propagar corriente a través de rama paralela y contacto serie', () => {
    const peldaño = {
      p: [['I1'], ['Q1']],
      s: ['/I2'],
      o: 'Q1'
    };

    // Caso A: I1 accionado, I2 en reposo (0)
    const estadoA = { I1: true, I2: false, Q1: false };
    const resA = evaluarEnergizacionPeldaño(peldaño, estadoA);
    expect(resA.ramasParalelas[0][0].energizado).toBe(true);  // I1 conduce
    expect(resA.ramasParalelas[1][0].energizado).toBe(false); // Q1 no conduce
    expect(resA.salidaParaleloEnergizada).toBe(true);         // Riel paralelo pasa corriente
    expect(resA.elementosSerie[0].energizado).toBe(true);     // /I2 conduce
    expect(resA.bobinaEnergizada).toBe(true);                 // Q1 energizada

    // Caso B: Retención activa (I1 soltado, Q1 activo, I2 en reposo)
    const estadoB = { I1: false, I2: false, Q1: true };
    const resB = evaluarEnergizacionPeldaño(peldaño, estadoB);
    expect(resB.ramasParalelas[0][0].energizado).toBe(false);
    expect(resB.ramasParalelas[1][0].energizado).toBe(true);  // Q1 retiene
    expect(resB.salidaParaleloEnergizada).toBe(true);
    expect(resB.elementosSerie[0].energizado).toBe(true);
    expect(resB.bobinaEnergizada).toBe(true);

    // Caso C: Parada I2 pulsada (1) -> Corta la corriente antes de la bobina
    const estadoC = { I1: true, I2: true, Q1: true };
    const resC = evaluarEnergizacionPeldaño(peldaño, estadoC);
    expect(resC.salidaParaleloEnergizada).toBe(true);
    expect(resC.elementosSerie[0].energizado).toBe(false);    // /I2 abierto
    expect(resC.bobinaEnergizada).toBe(false);                // Bobina apagada
  });

  it('debe evaluar correctamente bloques de función especiales energizados', () => {
    const peldaño = {
      s: ['M1', '[TON 5s]'],
      o: 'T1'
    };
    const estadoActivo = { M1: true, 'TON 5s': true };
    const res = evaluarEnergizacionPeldaño(peldaño, estadoActivo);
    expect(res.elementosSerie[0].energizado).toBe(true);
    expect(res.elementosSerie[1].energizado).toBe(true);
    expect(res.bobinaEnergizada).toBe(true);
  });
});
