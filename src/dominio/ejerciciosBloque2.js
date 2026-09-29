/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 2 (Ejercicios 4.4, 4.5 y 4.6).
 * Explicaciones técnicas y didácticas exhaustivas. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosBloque2 = [
  {
    n: '4.4',
    t: 'Temporización de Pasillo (Luz de Cortesía)',
    q: 'Diseñar un sistema de iluminación temporizada. Al presionar I1 (N/A), Q1 se activa por 15 segundos. Pre-aviso: Q2 se enciende 5s antes del apagado y queda encendida hasta reinicio. Reiniciable por I1.',
    io: [
      ['I1', 'Pulsador N/A de pasillo / escalera (Normal Abierto)'],
      ['Q1', 'Luz principal de iluminación de pasillo'],
      ['Q2', 'Luz testigo de pre-aviso (indicador LED en llave de pared)'],
      ['T2', 'Temporizador TON (Timer On-Delay / Retardo a la conexión de 10 s para pre-aviso)']
    ],
    e: '¿Qué es un temporizador TOF (Timer Off-Delay / Retardo a la desconexión)? Es un bloque que mantiene encendida la salida tras desaparecer la señal de entrada. Al presionar I1, la luz Q1 enciende de inmediato. Al soltar I1, el temporizador cuenta 15 segundos antes de apagarla. ¿Qué significa reiniciable ("retriggerable")? Si un usuario vuelve a pulsar I1 mientras la luz está encendida, el temporizador vuelve a 0 y recomienza los 15 segundos desde el inicio. Para la luz testigo de pre-aviso (Q2): un segundo temporizador TON configurado en 10 s mide el tiempo transcurrido desde que se soltó I1 (15 s - 5 s = 10 s). Al cumplirse los 10 s, T2 activa Q2, que se autorretiene permanentemente hasta que una nueva pulsación de I1 reinicia el ciclo completo.',
    i: [['I1', 'Pulsador pasillo', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Luz principal mediante retardo a la desconexión TOF (15 s reiniciable)', s: ['I1', '[TOF 15s]'], o: 'Q1' },
      { c: 'Detección de pre-aviso a los 10 s desde que se soltó el pulsador', s: ['Q1', '/I1', '[TON 10s]'], o: 'T2' },
      { c: 'Testigo Q2 con autorretención; se borra al pulsar nuevamente I1', p: [['T2'], ['Q2']], s: ['/I1'], o: 'Q2' }
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
      ['I2', 'Sensor de pulsos N/C (Normal Cerrado: abre el circuito al detectar pieza)'],
      ['I3', 'Pulsador de Reset manual N/C (Normal Cerrado: restablece el contador)'],
      ['Q1', 'Motor del proceso productivo'],
      ['C1', 'Contador CTU (Count-Up / Contador ascendente con preselección en 5)']
    ],
    e: '¿Qué es un contador CTU (Count-Up / Contador ascendente)? Es un bloque que cuenta eventos o pulsos discretos. Cada vez que su entrada de conteo detecta una transición (flanco ascendente), incrementa su registro interno en 1. Al llegar al valor preseleccionado (5 pulsos), su contacto de salida C1 conmuta. ¿Cómo actúa el enclavamiento de seguridad? El motor Q1 arranca con autorretención y tiene en serie un contacto normalmente cerrado del contador (/C1). Al llegar al 5º pulso del sensor I2, el contacto /C1 se abre, rompiendo irreversiblemente el lazo de autorretención y deteniendo el motor. Mientras el contador permanezca en 5, el motor queda bloqueado y no puede re-arrancar con I1 hasta que el operario presione el botón de rearme I3 (Reset).',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Sensor pulsos', 'p', 1], ['I3', 'Reset contador', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'Motor con autorretención condicionado por el contacto cerrado del contador /C1', p: [['I1'], ['Q1']], s: ['/C1'], o: 'Q1' },
      { c: 'Contador ascendente CTU (5 pulsos) con entrada de reset manual /I3', s: ['/I2', '[CTU 5 · R=/I3]'], o: 'C1' }
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
      ['I1–I3', 'Pulsadores de la secuencia N/A (I2 primer paso, I1 segundo paso, I3 tercer paso)'],
      ['I4', 'Pulsador de Reset N/A (Normal Abierto: desbloqueo general y puesta a cero)'],
      ['Q1', 'Salida de autorización / habilitación segura'],
      ['B', 'Marca interna de Bloqueo (se activa ante cualquier pulsación fuera de orden)'],
      ['M1–M3', 'Marcas internas M (Etapas secuenciales de habilitación 1, 2 y 3)']
    ],
    e: '¿Qué es una secuencia lógica y qué es el interbloqueo ("interlock")? Es una máquina secuencial donde una etapa solo puede activarse si la etapa previa está activa. M1 memoriza el Paso 1 (I2); M2 solo puede energizarse si se presiona I1 teniendo M1 cerrado; y M3 solo energiza si se pulsa I3 teniendo M2 cerrado. ¿Cómo funciona la detección de orden incorrecto? Si un operario intenta saltarse pasos (pulsar I1 sin M1 activo, o pulsar I3 sin M2 activo), la corriente lógica se desvía inmediatamente hacia la bobina de Bloqueo B. Al energizarse B, sus contactos normalmente cerrados /B se abren en todas las ramas, congelando el sistema e impidiendo cualquier activación hasta que se presione el pulsador de Reset I4.',
    i: [['I1', 'Paso 2 (I1)', 'p'], ['I2', 'Paso 1 (I2)', 'p'], ['I3', 'Paso 3 (I3)', 'p'], ['I4', 'Reset secuencia', 'p']],
    o: ['Q1'],
    r: [
      { c: 'Bloqueo inmediato B ante cualquier pulsación que viole la secuencia', p: [['I1', '/M1'], ['I3', '/M2'], ['B']], s: ['/I4'], o: 'B' },
      { c: 'Paso 1: activación de I2 condicionada a ausencia de bloqueo', p: [['I2'], ['M1']], s: ['/I4', '/B'], o: 'M1' },
      { c: 'Paso 2: I1 condicionado por el contacto de paso 1 M1', p: [['I1', 'M1'], ['M2']], s: ['/I4', '/B'], o: 'M2' },
      { c: 'Paso 3: I3 condicionado por el contacto de paso 2 M2', p: [['I3', 'M2'], ['M3']], s: ['/I4', '/B'], o: 'M3' },
      { c: 'Habilitación de salida segura Q1 únicamente al completarse el Paso 3', s: ['M3'], o: 'Q1' }
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
