/**
 * Pruebas unitarias de simulación lógica de PLC: Ejercicios 4.7 a 4.11.
 * Valida discriminación temporal, contadores bidireccionales, máquinas de estados y bombas.
 */
import { describe, it, expect } from 'vitest';
import { obtenerEjercicioPorId } from '../src/dominio/catalogoEjercicios.js';

describe('Simulación Lógica PLC: Ejercicios 4.7 a 4.11', () => {
  it('4.7: Alerta Multifunción con discriminación por tiempo de pulsación', () => {
    const ej = obtenerEjercicioPorId('4.7');
    // Caso 1: Pulsación simple (< 2 s)
    let s1 = {};
    ej.ejecutar(s1, { I1: true }, 0.8);
    let res1 = ej.ejecutar(s1, { I1: false }, 0.05);
    expect(res1.Q1).toBe(true);  // Q1 activo por 20s
    expect(res1.Q2).toBe(false);

    // Caso 2: Presión de 2 segundos (2 s <= t < 5 s) -> Alarma cabina al soltar
    let s2 = {};
    ej.ejecutar(s2, { I1: true }, 2.5);
    expect(s2.m2).toBeFalsy(); // Sin disparo espurio mientras se mantiene pulsado
    let res2 = ej.ejecutar(s2, { I1: false }, 0.05); // Al soltar
    expect(res2.Q2).toBe(true);

    // Caso 3: Presión de 5 segundos -> Parpadeo de emergencia 0.5 Hz (1s ON / 1s OFF)
    let s3 = {};
    ej.ejecutar(s3, { I1: true }, 5.1);
    let res3On = ej.ejecutar(s3, { I1: false }, 0.5); // Dentro del primer segundo: ON
    expect(res3On.Q1).toBe(true);
    expect(res3On.Q2).toBe(true);
    let res3Off = ej.ejecutar(s3, { I1: false }, 1.0); // Segundo siguiente: OFF
    expect(res3Off.Q1).toBe(false);
    expect(res3Off.Q2).toBe(false);
  });

  it('4.8: Control de Estacionamiento 50 autos y cartel COMPLETO', () => {
    const ej = obtenerEjercicioPorId('4.8');
    const estado = {};
    // Entrada de un auto
    let res = ej.ejecutar(estado, { I1: true, I2: false, I3: false }, 0.05);
    expect(res.Q1).toBe(true); // Barrera entrada
    expect(res.Q4).toBe(true); // Emisión ticket
    expect(estado.c).toBe(1);
    // Avanzar tiempo para que la barrera de entrada se cierre
    ej.ejecutar(estado, { I1: false, I2: false, I3: false }, 4.0);
    expect(estado.tBarreraIn).toBe(0);

    // Simular que alcanza los 50 autos
    estado.c = 50;
    res = ej.ejecutar(estado, { I1: false, I2: false, I3: false }, 0.05);
    expect(res.Q3).toBe(true); // Cartel COMPLETO

    // Intento de entrada con cupo lleno debe estar bloqueado
    res = ej.ejecutar(estado, { I1: true, I2: false, I3: false }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q4).toBe(false);
    expect(estado.c).toBe(50);
    ej.ejecutar(estado, { I1: false, I2: false, I3: false }, 0.05);

    // Salida de un auto (I2)
    res = ej.ejecutar(estado, { I1: false, I2: true, I3: false }, 0.05);
    expect(res.Q2).toBe(true); // Barrera salida
    expect(estado.c).toBe(49);
    ej.ejecutar(estado, { I1: false, I2: false, I3: false }, 0.05);
    res = ej.ejecutar(estado, { I1: false, I2: false, I3: false }, 0.05);
    expect(res.Q3).toBe(false); // Ya no está completo
  });

  it('4.9: Portón Levadizo Ciclo Abrir - Parar - Cerrar - Parar', () => {
    const ej = obtenerEjercicioPorId('4.9');
    const estado = {};
    // Inicio: Portón cerrado (I3 accionado N/C = 0, I2 en reposo N/C = 1)
    let res = ej.ejecutar(estado, { I1: false, I2: true, I3: false }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);

    // 1º Pulso: Abrir (Q1)
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: false }, 0.05);
    ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05); // Se despegó de I3
    expect(res.Q1).toBe(true);

    // 2º Pulso a mitad de carrera: Parar
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);

    // 3º Pulso: Cerrar (Q2)
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(res.Q2).toBe(true);
    expect(res.M4).toBe(true);

    // 4º Pulso durante el cierre: Debe detenerse en M1 sin disparar carrera a M2
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: true }, 0.05);
    ej.ejecutar(estado, { I1: false, I2: true, I3: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);
    expect(res.M1).toBe(true);
    expect(res.M2).toBe(false);

    // Llega a fin de carrera cerrado (I3 se acciona = 0)
    res = ej.ejecutar(estado, { I1: false, I2: true, I3: false }, 0.05);
    expect(res.Q2).toBe(false);
    expect(res.M1).toBe(true);
  });

  it('4.10: Control de Nivel de Tanque con Bombas en Cascada y Parada PE', () => {
    const ej = obtenerEjercicioPorId('4.10');
    const estado = {};
    // Reposo: I4 (PE) N/C = 1
    let res = ej.ejecutar(estado, { I1: false, I2: false, I3: false, I4: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);

    // Nivel baja a S1 (I1) -> Arranca Bomba Principal Q1
    res = ej.ejecutar(estado, { I1: true, I2: false, I3: false, I4: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);

    // Nivel sigue bajando a S2 (I2) -> Arranca Bomba Auxiliar Q2
    res = ej.ejecutar(estado, { I1: true, I2: true, I3: false, I4: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(true);

    // Se alcanza S3 (nivel máximo) -> Ambas bombas se apagan
    res = ej.ejecutar(estado, { I1: false, I2: false, I3: true, I4: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);

    // Prueba de Parada de Emergencia (PE I4 pasa a 0)
    ej.ejecutar(estado, { I1: true, I2: true, I3: false, I4: true }, 0.05);
    res = ej.ejecutar(estado, { I1: false, I2: false, I3: false, I4: false }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);
  });

  it('4.11: Alternancia de Bombas para Reparto de Carga', () => {
    const ej = obtenerEjercicioPorId('4.11');
    const estado = {};
    // Ciclo 1: Demanda I1 activa -> Bomba Q1
    let res = ej.ejecutar(estado, { I1: true, I4: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
    // Fin ciclo 1: I1 pasa a 0
    res = ej.ejecutar(estado, { I1: false, I4: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(false);

    // Ciclo 2: Siguiente demanda I1 -> Debe arrancar Bomba Q2
    res = ej.ejecutar(estado, { I1: true, I4: true }, 0.05);
    expect(res.Q1).toBe(false);
    expect(res.Q2).toBe(true);
    // Fin ciclo 2
    res = ej.ejecutar(estado, { I1: false, I4: true }, 0.05);

    // Ciclo 3: Vuelve a arrancar Q1
    res = ej.ejecutar(estado, { I1: true, I4: true }, 0.05);
    expect(res.Q1).toBe(true);
    expect(res.Q2).toBe(false);
  });
});
