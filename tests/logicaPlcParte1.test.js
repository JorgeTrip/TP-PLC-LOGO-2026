/**
 * Pruebas unitarias de simulación lógica de PLC: Ejercicios 4.1 a 4.6.
 * Valida autorretenciones, bloques SR, temporizaciones y secuencias de seguridad.
 */
import { describe, it, expect } from 'vitest';
import { obtenerEjercicioPorId } from '../src/dominio/catalogoEjercicios.js';

describe('Simulación Lógica PLC: Ejercicios 4.1 a 4.6', () => {
  it('4.1: Control de Motor con Retención y Parada Dominante', () => {
    const ej = obtenerEjercicioPorId('4.1');
    const estado = {};
    // Reposo
    expect(ej.ejecutar(estado, { I1: false, I2: false }, 0.05).Q1).toBe(false);
    // Pulso marcha I1
    expect(ej.ejecutar(estado, { I1: true, I2: false }, 0.05).Q1).toBe(true);
    // Soltar marcha (autorretención)
    expect(ej.ejecutar(estado, { I1: false, I2: false }, 0.05).Q1).toBe(true);
    // Parada I2
    expect(ej.ejecutar(estado, { I1: false, I2: true }, 0.05).Q1).toBe(false);
    // Parada dominante (marcha y parada simultáneas)
    expect(ej.ejecutar(estado, { I1: true, I2: true }, 0.05).Q1).toBe(false);
  });

  it('4.2: Control con Relé Set-Reset y pulsador N/C', () => {
    const ej = obtenerEjercicioPorId('4.2');
    const estado = {};
    // Reposo: I2 N/C entrega 1 en reposo
    expect(ej.ejecutar(estado, { I1: false, I2: true }, 0.05).Q1).toBe(false);
    // Pulso arranque I1
    expect(ej.ejecutar(estado, { I1: true, I2: true }, 0.05).Q1).toBe(true);
    // Soltar I1
    expect(ej.ejecutar(estado, { I1: false, I2: true }, 0.05).Q1).toBe(true);
    // Accionar detención I2 (I2 cae a 0)
    expect(ej.ejecutar(estado, { I1: false, I2: false }, 0.05).Q1).toBe(false);
    // Reset dominante (I1=1 con I2=0 presionado)
    expect(ej.ejecutar(estado, { I1: true, I2: false }, 0.05).Q1).toBe(false);
  });

  it('4.3: Encendido Retardado 5s con Pre-aviso Q2', () => {
    const ej = obtenerEjercicioPorId('4.3');
    const estado = {};
    // Iniciar marcha
    let res = ej.ejecutar(estado, { I1: true, I2: false }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(true); // Pre-aviso encendido
    // Soltar marcha y avanzar 3 segundos
    for (let t = 0; t < 3; t += 0.5) {
      res = ej.ejecutar(estado, { I1: false, I2: false }, 0.5);
      expect(res.Q1).toBe(false);
      expect(res.Q2).toBe(true);
    }
    // Avanzar hasta completar 5 segundos
    for (let t = 3; t < 5.5; t += 0.5) {
      res = ej.ejecutar(estado, { I1: false, I2: false }, 0.5);
    }
    expect(res.Q1).toBe(true);  // Motor arranca
    expect(res.Q2).toBe(false); // Pre-aviso se apaga
    // Parada
    res = ej.ejecutar(estado, { I1: false, I2: true }, 0.05);
    expect(res.Q1).toBe(false);
  });

  it('4.4: Luz de Pasillo 15s con Testigo Q2 y Reinicio', () => {
    const ej = obtenerEjercicioPorId('4.4');
    const estado = {};
    // Pulsar I1
    let res = ej.ejecutar(estado, { I1: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
    // Soltar y avanzar 9 segundos
    for (let t = 0; t < 9; t += 1) {
      res = ej.ejecutar(estado, { I1: false }, 1);
    }
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
    // Avanzar a 11 segundos (pasó los 10s: Q2 se enciende)
    res = ej.ejecutar(estado, { I1: false }, 2);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(true);
    // Redisparo a los 11s: repulsar I1 apaga testigo y reinicia cuenta a 0
    res = ej.ejecutar(estado, { I1: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
    expect(estado.t).toBe(0);
    // Soltar y avanzar a 16 segundos (Q1 se apaga, Q2 queda encendida)
    res = ej.ejecutar(estado, { I1: false }, 16);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(true);
    // Reinicio final: pulsar I1 apaga testigo y reinicia Q1
    res = ej.ejecutar(estado, { I1: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
  });

  it('4.5: Conteo de 5 Pulsos y Reset Manual N/C', () => {
    const ej = obtenerEjercicioPorId('4.5');
    const estado = {};
    // I2 e I3 son N/C (1 en reposo). Con motor parado, pulsar I2 no debe contar
    ej.ejecutar(estado, { I1: false, I2: false, I3: true }, 0.05);
    ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(estado.c || 0).toBe(0);

    // Arrancar motor Q1
    let res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(true);
    res = ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(true);
    // 4 pulsos de I2 durante la marcha
    for (let i = 0; i < 4; i++) {
      ej.ejecutar(estado, { I1: false, I2: false, I3: true }, 0.05);
      res = ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
      expect(res.Q1).toBe(true);
    }
    // Pulso 5: motor debe apagarse
    ej.ejecutar(estado, { I1: false, I2: false, I3: true }, 0.05);
    res = ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(false);
    // Intento de re-arranque sin reset debe fallar
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(false);
    // Reset I3 (pasa a 0)
    ej.ejecutar(estado, { I1: false, I2: true, I3: false }, 0.05);
    // Ahora sí puede arrancar de nuevo
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(true);
  });

  it('4.6: Secuencia Estricta (I2 -> I1 -> I3) y Bloqueo', () => {
    const ej = obtenerEjercicioPorId('4.6');
    // Secuencia válida
    let estValido = {};
    ej.ejecutar(estValido, { I1: false, I2: true, I3: false, I4: false }, 0.05);
    ej.ejecutar(estValido, { I1: false, I2: false, I3: false, I4: false }, 0.05);
    ej.ejecutar(estValido, { I1: true, I2: false, I3: false, I4: false }, 0.05);
    ej.ejecutar(estValido, { I1: false, I2: false, I3: false, I4: false }, 0.05);
    let resVal = ej.ejecutar(estValido, { I1: false, I2: false, I3: true, I4: false }, 0.05);
    expect(resVal.Q1).toBe(true);

    // Secuencia inválida: pulsar I1 primero debe activar bloqueo
    let estInvalido = {};
    let resInv = ej.ejecutar(estInvalido, { I1: true, I2: false, I3: false, I4: false }, 0.05);
    expect(resInv.Q1).toBe(false);
    expect(estInvalido.b).toBe(true);
    // Intentar seguir la secuencia no debe habilitar salida
    ej.ejecutar(estInvalido, { I1: false, I2: true, I3: false, I4: false }, 0.05);
    ej.ejecutar(estInvalido, { I1: false, I2: false, I3: true, I4: false }, 0.05);
    expect(estInvalido.Q1).toBeFalsy();
    // Reset I4 desbloquea
    ej.ejecutar(estInvalido, { I1: false, I2: false, I3: false, I4: true }, 0.05);
    expect(estInvalido.b).toBe(false);

    // Intento de vulneración por pulsación simultánea (I1, I2, I3 a la vez)
    let estSimultaneo = {};
    ej.ejecutar(estSimultaneo, { I1: true, I2: true, I3: true, I4: false }, 0.05);
    expect(estSimultaneo.b).toBe(true);
    expect(estSimultaneo.Q1).toBeFalsy();
  });
});
