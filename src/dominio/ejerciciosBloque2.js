/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 2 (Ejercicios 4.4, 4.5 y 4.6).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosBloque2 = [
  {
    n: '4.4',
    t: 'Temporización de Pasillo (Luz de Cortesía)',
    q: 'Diseñar un sistema de iluminación temporizada. Al presionar I1 (N/A), la salida Q1 se activa por 15 segundos. Pre-aviso: Una luz testigo (Q2) se enciende 5 segundos antes de que Q1 se apague y queda encendida hasta que el sistema se reinicie. Reiniciable: Si se presiona I1 durante el ciclo, el tiempo vuelve a empezar.',
    io: [
      ['I1', 'Pulsador de pasillo / escalera', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Luminaria principal de pasillo', 'Digital / Relé', 'Salida energizada durante 15 s'],
      ['Q2', 'Testigo de pre-aviso', 'Digital / Relé', 'Salida energizada desde t=10s hasta el reinicio']
    ],
    soft: [
      ['T1', 'TP Retrig (15 s)', 'Temporización iluminación principal Q1'],
      ['T2', 'TON (10 s)', 'Detección de aviso previo a los 10 s'],
      ['M1', 'Relé RS', 'Enclava testigo Q2 hasta rearme I1']
    ],
    eq: [
      'T1 = TP_Retrig(I1, 15 s)',
      'Q1 = T1',
      'T2_IN = Q1  (TON, PT = 10 s)',
      'Set(M1) = T2',
      'Reset(M1) = I1',
      'Q2 = M1'
    ],
    sol: 'Automatismo basado en un temporizador de pulso redisparable parametrizado en 15 segundos para la carga principal Q1. Cada pulsación sobre I1 reinicia la cuenta a cero sin importar el tiempo de presión física. La energización de Q1 comanda en paralelo un temporizador TON calibrado en 10 segundos, determinando la ventana previa de 5 segundos respecto del apagado. Cumplido este plazo, T2 enclava la marca M1 encendiendo el testigo Q2, el cual permanece encendido tras extinguirse Q1 hasta que una nueva pulsación en I1 resetea M1 y reinicia el ciclo.',
    e: '¿Qué es un temporizador de pulso redisparable (relé de escalera)? Es una función donde cada pulso de entrada reinicia el tiempo fijado desde cero, garantizando que mantener presionado el pulsador no distorsione el intervalo total de 15 segundos. ¿Cómo se articula el pre-aviso de 5 segundos antes del corte? La propia salida Q1 excita un bloque TON calibrado a 10 segundos (15 s - 5 s). Al vencer los 10 s, T2 enclava la marca RS M1 encendiendo el testigo Q2. Cuando Q1 se apaga a los 15 s, Q2 permanece encendida de forma memorizada hasta que un nuevo usuario presiona I1, reseteando M1 e iniciando un nuevo ciclo.',
    i: [['I1', 'Pulsador pasillo', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Disparo de pulso redisparable T1 (15 s) por pulsación de I1', s: ['I1'], o: '[TP_Retrig T1 | 15s]' },
      { c: 'R2: Accionamiento directo de luminaria principal Q1', s: ['T1'], o: 'Q1' },
      { c: 'R3: Habilitación de temporizador TON T2 (10 s) desde Q1', s: ['Q1'], o: '[TON T2 | 10s]' },
      { c: 'R4: Enclavamiento del testigo M1 al cumplirse T2', s: ['T2'], o: 'S M1' },
      { c: 'R5: Rearme y apagado del testigo mediante pulsador I1', s: ['I1'], o: 'R M1' },
      { c: 'R6: Comando de luz testigo Q2 desde marca memorizada M1', s: ['M1'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      const pulsoI1 = detectarFlancoAscendente(S, 'pasillo', I.I1);
      if (pulsoI1 || (I.I1 && !S.activo)) {
        S.t = 0;
        S.activo = true;
        S.m1 = false;
      } else if (S.activo) {
        S.t = (S.t || 0) + dt;
        if (S.t >= 10) S.m1 = true;
        if (S.t >= 15) S.activo = false;
      }
      if (I.I1) S.m1 = false;
      S.info = S.activo ? `Tiempo: ${(S.t || 0).toFixed(1)} / 15.0 s` : (S.m1 ? 'Testigo en espera de reinicio' : 'Apagado');
      return { Q1: Boolean(S.activo), Q2: Boolean(S.m1), T1: Boolean(S.activo), T2: Boolean(S.activo && S.t >= 10), M1: Boolean(S.m1) };
    }
  },
  {
    n: '4.5',
    t: 'Desconexión por Conteo de Pulsos',
    q: 'Implementar un sistema que detenga un proceso tras un número determinado de eventos. I1 (N/A): Arranca el motor (Q1). I2 (N/C): Genera pulsos de conteo. Tras 5 pulsos, el motor se apaga. I3 (N/C): Reset manual del contador.',
    io: [
      ['I1', 'Pulsador de arranque', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Sensor de conteo de piezas', 'NC', 'En reposo (abre a 0 ante el paso de cada pieza)'],
      ['I3', 'Pulsador de reset manual', 'NC', 'En reposo (abre a 0 al pulsarlo por seguridad)'],
      ['Q1', 'Motor de proceso productivo', 'Digital / Relé', 'Salida energizada durante el ciclo']
    ],
    soft: [
      ['C1', 'CTU (PV=5)', 'Acumula 5 piezas y corta marcha de Q1']
    ],
    eq: [
      'C1_CU = Flanco_Ascendente(NOT(I2)) · Q1',
      'C1_R = NOT(I3)',
      'Q1 = (I1 + Q1) · NOT(C1)'
    ],
    sol: 'Proceso productivo gobernado por autorretención combinada con corte automático por límite de eventos. El pulsador I1 energiza el motor Q1 en serie con un contacto cerrado del contador C1. Para evitar registros espurios con la máquina detenida, la entrada de conteo CU se condiciona en serie con un contacto abierto de Q1: los pulsos generados por el captor de paso I2 (físicamente NC, evaluado negado) solo incrementan la cuenta durante la marcha efectiva del proceso. Al alcanzar 5 registros, la salida C1 conmuta a nivel alto, interrumpe la autorretención de Q1 y detiene el proceso. El sistema queda bloqueado frente a nuevas órdenes de arranque hasta que el operario acciona el pulsador de rearme I3 (NC).',
    e: '¿Por qué condicionar la entrada de conteo con Q1 y cómo interactúa con I2? Condicionar la entrada CU con un contacto abierto de marcha Q1 garantiza que solo se computen piezas cuando el motor está en movimiento, evitando descalibrar el lote por manipulaciones manuales o ruidos con la máquina parada. El captor I2 es normal cerrado por seguridad (1 en reposo) y abre a 0 al pasar una pieza; en Ladder se programa invertido /I2 en serie con Q1. Al alcanzar 5 pulsos (PV=5), el contacto /C1 abre la autorretención de Q1 y detiene el motor.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Sensor pulsos', 'p', 1], ['I3', 'Reset contador', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'R1: Registro de conteo CU condicionado a marcha Q1 y reset manual en bloque CTU C1 (PV=5)', s: ['Q1', '/I2'], o: '[CTU C1 | PV=5 | R=/I3]' },
      { c: 'R2: Motor Q1 con autorretención y corte por contacto /C1', p: [['I1'], ['Q1']], s: ['/C1'], o: 'Q1' }
    ],
    ejecutar: (S, I) => {
      if (S.q && detectarFlancoAscendente(S, 'pulso', !I.I2)) S.c = (S.c || 0) + 1;
      else if (!S.q) detectarFlancoAscendente(S, 'pulso', !I.I2);
      if (!I.I3) S.c = 0;
      const limite = (S.c || 0) >= 5;
      S.q = Boolean((I.I1 || S.q) && !limite);
      S.info = `Pulsos registrados: ${S.c || 0} / 5${limite ? ' (LÍMITE ALCANZADO)' : (!S.q ? ' (Motor detenido - conteo en pausa)' : '')}`;
      return { Q1: S.q, C1: limite };
    }
  },
  {
    n: '4.6',
    t: 'Secuencia Lógica de Seguridad',
    q: 'Activar la salida Q1 solo si se sigue un orden estricto de activación de entradas: 1. Primero Entrada 2 (I2). 2. Luego Entrada 1 (I1). 3. Finalmente Entrada 3 (I3). Si el orden es incorrecto, el sistema se bloquea. Se requiere un pulsador I4 (N/A) para resetear el bloqueo o la secuencia en cualquier momento.',
    io: [
      ['I1', 'Pulsador Paso 2 de secuencia', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador Paso 1 de secuencia', 'NA', 'Se presiona el pulsador'],
      ['I3', 'Pulsador Paso 3 de secuencia', 'NA', 'Se presiona el pulsador'],
      ['I4', 'Pulsador de reset general / desbloqueo', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Salida de habilitación segura', 'Digital / Relé', 'Salida energizada tras secuencia exitosa']
    ],
    soft: [
      ['M1', 'Relé RS', 'Memoriza ejecución válida Paso 1 (I2)'],
      ['M2', 'Relé RS', 'Memoriza Paso 2 (I1 con M1)'],
      ['M3', 'Relé RS', 'Memoriza Paso 3 (I3) y habilita Q1'],
      ['B', 'Relé RS', 'Bandera de bloqueo ante error']
    ],
    eq: [
      'Set(B) = (I1 · NOT(M1)) + (I3 · NOT(M2)) + (I2 · I1) + (I1 · I3) + (I2 · I3)',
      'Reset(B) = I4',
      'Set(M1) = I2 · NOT(B) ; Reset(M1) = I4 + B',
      'Set(M2) = I1 · NOT(I2) · M1 · NOT(B) ; Reset(M2) = I4 + B',
      'Set(M3) = I3 · NOT(I1) · M2 · NOT(B) ; Reset(M3) = I4 + B',
      'Q1 = M3'
    ],
    sol: 'Máquina secuencial escalonada con lazo de interbloqueo preventivo y protección contra accionamientos simultáneos. Cada etapa condiciona estrictamente el acceso a la siguiente: M1 memoriza la pulsación inicial de I2; M2 exige M1 activo con I2 ya liberado al pulsar I1; y M3 exige M2 activo con I1 liberado al pulsar I3, habilitando la salida segura Q1. Cualquier accionamiento irregular (presionar I1 sin M1, I3 sin M2 o pulsar múltiples entradas simultáneamente) activa la marca de bloqueo B, la cual abre sus contactos normalmente cerrados e inmoviliza el control. El pulsador I4 restablece las marcas de etapa y extingue el bloqueo.',
    e: '¿Cómo prevenir la vulneración de una secuencia de seguridad ante entradas simultáneas? En el renglón 1 se evalúa el bloqueo preventivo B: si se detectan dos o más pulsadores activos a la vez o un avance sin la etapa previa, B se enclava de inmediato. Asimismo, cada paso exige que el pulsador anterior ya esté liberado (/I2 en paso 2 y /I1 en paso 3). El contacto /B corta todas las líneas de avance. Solo el rearme voluntario mediante I4 resetea el bloqueo y limpia las memorias para reiniciar desde el Paso 1.',
    i: [['I1', 'Paso 2 (I1)', 'p'], ['I2', 'Paso 1 (I2)', 'p'], ['I3', 'Paso 3 (I3)', 'p'], ['I4', 'Reset secuencia', 'p']],
    o: ['Q1'],
    r: [
      { c: 'R1: Detección y memoria de bloqueo B ante error de secuencia o pulsación simultánea', p: [['I1', '/M1'], ['I3', '/M2'], ['I1', 'I2'], ['I1', 'I3'], ['I2', 'I3']], s: ['/I4'], o: 'B' },
      { c: 'R2: Paso 1: habilitación de marca M1 al pulsar I2', p: [['I2']], s: ['/I4', '/B'], o: 'M1' },
      { c: 'R3: Paso 2: habilitación de marca M2 por I1 con I2 liberado y M1 activo', p: [['I1', '/I2', 'M1']], s: ['/I4', '/B'], o: 'M2' },
      { c: 'R4: Paso 3: habilitación de marca M3 por I3 con I1 liberado y M2 activo', p: [['I3', '/I1', 'M2']], s: ['/I4', '/B'], o: 'M3' },
      { c: 'R5: Salida de habilitación segura Q1 gobernada por etapa M3', s: ['M3'], o: 'Q1' }
    ],
    ejecutar: (S, I) => {
      const { m1, m2, m3 } = S;
      const simultaneidad = (I.I1 && I.I2) || (I.I1 && I.I3) || (I.I2 && I.I3);
      S.b = Boolean(((I.I1 && !m1) || (I.I3 && !m2) || simultaneidad || S.b) && !I.I4);
      S.m1 = Boolean((I.I2 || m1) && !I.I4 && !S.b);
      S.m2 = Boolean(((I.I1 && !I.I2 && S.m1) || m2) && !I.I4 && !S.b);
      S.m3 = Boolean(((I.I3 && !I.I1 && S.m2) || m3) && !I.I4 && !S.b);
      const pasoActual = S.m3 ? 3 : (S.m2 ? 2 : (S.m1 ? 1 : 0));
      S.info = S.b ? '⚠️ SISTEMA BLOQUEADO (Orden incorrecto / simultáneo) - Pulsar I4' : `Paso activo: ${pasoActual} de 3`;
      return { Q1: Boolean(S.m3), M1: S.m1, M2: S.m2, M3: S.m3, B: S.b };
    }
  }
];
