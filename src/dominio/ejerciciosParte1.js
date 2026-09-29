/**
 * Catálogo de ejercicios de PLC LOGO!: Parte 1 (Ejercicios 4.1 a 4.6).
 * Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosParte1 = [
  {
    n: '4.1',
    t: 'Control de Motor con Retención',
    q: 'Implementar el arranque y parada de un motor utilizando lógica de autorretención. Entradas: I1 (Marcha N/A), I2 (Parada N/A). Salida: Q1 (Motor).',
    io: [
      ['I1', 'Pulsador de marcha N/A (Normal Abierto: 0 en reposo, 1 al presionar)'],
      ['I2', 'Pulsador de parada N/A (Normal Abierto: 0 en reposo, 1 al presionar)'],
      ['Q1', 'Motor (Salida a relé / contactor)']
    ],
    e: 'Q1 se realimenta con contacto propio en paralelo con I1. La parada I2 (N/A) va en serie como contacto invertido (/I2). Parada dominante.',
    i: [['I1', 'Marcha', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1'],
    r: [{ c: 'Q1 = (I1 + Q1) · /I2', p: [['I1'], ['Q1']], s: ['/I2'], o: 'Q1' }],
    ejecutar: (S, I) => {
      S.q = Boolean((I.I1 || S.q) && !I.I2);
      return { Q1: S.q };
    }
  },
  {
    n: '4.2',
    t: 'Control de Motor con Bobina Set-Reset',
    q: 'Realizar la misma función que el ejercicio anterior, pero utilizando un relé autoenclavador (bloque Set-Reset). Entradas: I1 (Arranque N/A), I2 (Detención N/C). Salida: Q1 (Motor).',
    io: [
      ['I1', 'Pulsador de arranque N/A (Normal Abierto: 0 en reposo, 1 al presionar)'],
      ['I2', 'Pulsador de detención N/C (Normal Cerrado: 1 en reposo, 0 al pulsar por seguridad fail-safe)'],
      ['Q1', 'Motor (Salida comandada por bloque biestable Set-Reset)']
    ],
    e: 'Relé autoenclavador SR: I1 setea Q1. I2 es N/C (1 en reposo, 0 al pulsar); el contacto invertido /I2 se cierra al pulsar y activa el Reset. Reset dominante.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Detención', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'Set: orden de arranque', s: ['I1'], o: 'S Q1' },
      { c: 'Reset: detención física N/C (/I2 cierra al pulsar)', s: ['/I2'], o: 'R Q1' }
    ],
    ejecutar: (S, I) => {
      if (!I.I2) S.q = false;
      else if (I.I1) S.q = true;
      else S.q = Boolean(S.q);
      return { Q1: S.q };
    }
  },
  {
    n: '4.3',
    t: 'Encendido Retardado con Pre-aviso',
    q: 'El motor debe activarse con un retardo de 5 segundos tras la orden de marcha. Entradas: I1 (Arranque N/A), I2 (Parada N/A). Salidas: Q1 (Motor), Q2 (Lámpara de aviso). Q2 enciende únicamente durante el conteo previo.',
    io: [
      ['I1', 'Pulsador de arranque N/A (Normal Abierto)'],
      ['I2', 'Pulsador de parada N/A (Normal Abierto)'],
      ['Q1', 'Motor (Actuador principal)'],
      ['Q2', 'Lámpara testigo de pre-aviso de maniobra'],
      ['M1', 'Marca interna M (Memoria / relé interno de orden de marcha)'],
      ['T1', 'Temporizador TON (Timer On-Delay / Retardo a la conexión de 5 s)']
    ],
    e: 'M1 memoriza la marcha. El TON de 5s cuenta mientras M1 está activo. Q2 = M1 · /T1 (enciende solo durante el conteo previo). Cumplidos los 5s, T1 enciende Q1 y apaga Q2.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Memoria de orden de marcha', p: [['I1'], ['M1']], s: ['/I2'], o: 'M1' },
      { c: 'Temporizador retardo 5 s', s: ['M1', '[TON 5s]'], o: 'T1' },
      { c: 'Arranque de motor', s: ['M1', 'T1'], o: 'Q1' },
      { c: 'Lámpara de pre-aviso durante conteo', s: ['M1', '/T1'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      S.m = Boolean((I.I1 || S.m) && !I.I2);
      S.t = S.m ? (S.t || 0) + dt : 0;
      const cumplido = S.t >= 5;
      S.info = S.m ? `Conteo: ${Math.min(S.t, 5).toFixed(1)} / 5.0 s` : 'En espera de marcha';
      return { Q1: Boolean(S.m && cumplido), Q2: Boolean(S.m && !cumplido) };
    }
  },
  {
    n: '4.4',
    t: 'Temporización de Pasillo (Luz de Cortesía)',
    q: 'Diseñar un sistema de iluminación temporizada. Al presionar I1 (N/A), Q1 se activa por 15 segundos. Pre-aviso: Q2 se enciende 5s antes del apagado y queda encendida hasta reinicio. Reiniciable por I1.',
    io: [
      ['I1', 'Pulsador N/A (Normal Abierto de pasillo / escalera)'],
      ['Q1', 'Luz principal de pasillo'],
      ['Q2', 'Luz testigo de pre-aviso en pulsador'],
      ['T2', 'Temporizador TON (Timer On-Delay / Retardo a la conexión de 10 s para pre-aviso)']
    ],
    e: 'Al pulsar I1 se activa Q1 por 15s. A los 10s (5s antes de apagarse Q1), Q2 enciende y se autorretiene. Pulsar I1 reinicia el conteo y borra Q2.',
    i: [['I1', 'Pulsador pasillo', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Luz de pasillo (15 s retriggerable)', s: ['I1', '[TOF 15s]'], o: 'Q1' },
      { c: 'Pre-aviso a los 10 s', s: ['Q1', '/I1', '[TON 10s]'], o: 'T2' },
      { c: 'Testigo con autorretención y reinicio', p: [['T2'], ['Q2']], s: ['/I1'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      if (I.I1) {
        S.t = 0; S.activo = true; S.q2 = false;
      } else if (S.activo) {
        S.t = (S.t || 0) + dt;
        if (S.t >= 10) S.q2 = true;
        if (S.t >= 15) S.activo = false;
      }
      S.info = S.activo ? `Tiempo: ${(S.t || 0).toFixed(1)} / 15.0 s` : (S.q2 ? 'Testigo en espera de reinicio' : 'Apagado');
      return { Q1: Boolean(S.activo), Q2: Boolean(S.q2) };
    }
  },
  {
    n: '4.5',
    t: 'Desconexión por Conteo de Pulsos',
    q: 'Detener un proceso tras un número determinado de eventos. I1 (N/A): Arranca motor Q1. I2 (N/C): Pulsos de conteo (a 5 pulsos apaga el motor). I3 (N/C): Reset manual del contador.',
    io: [
      ['I1', 'Pulsador de arranque N/A (Normal Abierto)'],
      ['I2', 'Sensor de pulsos N/C (Normal Cerrado: abre al detectar pieza)'],
      ['I3', 'Pulsador de Reset manual N/C (Normal Cerrado: restablece contador)'],
      ['Q1', 'Motor del proceso'],
      ['C1', 'Contador CTU (Count-Up / Contador ascendente con preselección en 5)']
    ],
    e: 'CTU cuenta flancos de /I2 y se resetea con /I3. Al alcanzar 5, /C1 corta la autorretención de Q1. No se puede arrancar sin resetear.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Sensor pulsos', 'p', 1], ['I3', 'Reset contador', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'Motor con autorretención cortado por contador', p: [['I1'], ['Q1']], s: ['/C1'], o: 'Q1' },
      { c: 'Contador de eventos preselección 5', s: ['/I2', '[CTU 5 · R=/I3]'], o: 'C1' }
    ],
    ejecutar: (S, I) => {
      if (detectarFlancoAscendente(S, 'pulso', !I.I2)) S.c = (S.c || 0) + 1;
      if (!I.I3) S.c = 0;
      S.q = Boolean((I.I1 || S.q) && !((S.c || 0) >= 5));
      S.info = `Pulsos registrados: ${S.c || 0} / 5${(S.c || 0) >= 5 ? ' (LÍMITE ALCANZADO)' : ''}`;
      return { Q1: S.q };
    }
  },
  {
    n: '4.6',
    t: 'Secuencia Lógica de Seguridad',
    q: 'Activar Q1 solo si se sigue orden estricto: 1º I2 -> 2º I1 -> 3º I3. Si el orden es incorrecto, el sistema se bloquea. I4 (N/A) resetea bloqueo o secuencia.',
    io: [
      ['I1–I3', 'Pulsadores de secuencia N/A (Normal Abierto: I2 primer paso, I1 segundo, I3 tercero)'],
      ['I4', 'Pulsador de Reset N/A (Normal Abierto: desbloqueo y puesta a cero)'],
      ['Q1', 'Salida de autorización segura'],
      ['B', 'Marca interna de Bloqueo (se activa ante cualquier pulsación fuera de orden)'],
      ['M1–M3', 'Marcas internas M (Etapas secuenciales de habilitación 1, 2 y 3)']
    ],
    e: 'M1, M2 y M3 memorizan pasos I2 -> I1 -> I3 con interbloqueo. Pulsar fuera de secuencia energiza B y bloquea todo. I4 resetea.',
    i: [['I1', 'Paso 2 (I1)', 'p'], ['I2', 'Paso 1 (I2)', 'p'], ['I3', 'Paso 3 (I3)', 'p'], ['I4', 'Reset secuencia', 'p']],
    o: ['Q1'],
    r: [
      { c: 'Bloqueo por secuencia incorrecta', p: [['I1', '/M1'], ['I3', '/M2'], ['B']], s: ['/I4'], o: 'B' },
      { c: 'Paso 1: activación de I2', p: [['I2'], ['M1']], s: ['/I4', '/B'], o: 'M1' },
      { c: 'Paso 2: I1 condicionado por M1', p: [['I1', 'M1'], ['M2']], s: ['/I4', '/B'], o: 'M2' },
      { c: 'Paso 3: I3 condicionado por M2', p: [['I3', 'M2'], ['M3']], s: ['/I4', '/B'], o: 'M3' },
      { c: 'Habilitación de salida segura', s: ['M3'], o: 'Q1' }
    ],
    ejecutar: (S, I) => {
      const { m1, m2, m3 } = S;
      S.b = Boolean(((I.I1 && !m1) || (I.I3 && !m2) || S.b) && !I.I4);
      S.m1 = Boolean((I.I2 || m1) && !I.I4 && !S.b);
      S.m2 = Boolean(((I.I1 && S.m1) || m2) && !I.I4 && !S.b);
      S.m3 = Boolean(((I.I3 && S.m2) || m3) && !I.I4 && !S.b);
      const pasoActual = S.m3 ? 3 : (S.m2 ? 2 : (S.m1 ? 1 : 0));
      S.info = S.b ? '⚠️ SISTEMA BLOQUEADO (Orden incorrecto) - Pulsar I4' : `Paso activo: ${pasoActual} de 3`;
      return { Q1: Boolean(S.m3) };
    }
  }
];
