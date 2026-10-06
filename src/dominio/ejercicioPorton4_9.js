/**
 * Especificación formal y simulación de Ejercicio 4.9: Portón Levadizo.
 * Mapeo 1:1 con bloques de función especial Relé Autoenclavador (RS) de LOGO!Soft (SF001 a SF004).
 * Capa de dominio puro (IEC 61131-3 / Siemens LOGO! KOP).
 */

export const ejercicioPorton4_9 = {
  n: '4.9',
  t: 'Automatización de Portón Levadizo',
  q: 'Controlar un portón con un único pulsador (I1): El ciclo debe ser: Abrir - Parar - Cerrar - Parar. Utilizar finales de carrera (I2 e I3, ambos N/C) para detener el motor en los extremos.',
  io: [
    ['I1', 'Pulsador de comando paso a paso', 'NA', 'Se presiona el pulsador'],
    ['I2', 'Fin de carrera superior (tope abierto)', 'NC', 'Portón fuera de tope (abre a 0 en tope alto)'],
    ['I3', 'Fin de carrera inferior (tope cerrado)', 'NC', 'Portón fuera de tope (abre a 0 en tope bajo)'],
    ['Q1', 'Contactor de motor - Sentido Abrir', 'Digital / Relé', 'Salida energizada (portón en ascenso)'],
    ['Q2', 'Contactor de motor - Sentido Cerrar', 'Digital / Relé', 'Salida energizada (portón en descenso)']
  ],
  soft: [
    ['SF001', 'Relé RS', 'Etapa 1: Reposo cerrado (pin S: M8 / cierre; pin R: SF002)'],
    ['SF002', 'Relé RS', 'Etapa 2: Abriendo (pin S: pulsar en reposo; pin R: tope /I2 o freno)'],
    ['SF003', 'Relé RS', 'Etapa 3: Pausa / Tope abierto (pin S: freno/tope; pin R: SF004)'],
    ['SF004', 'Relé RS', 'Etapa 4: Cerrando (pin S: pulsar en pausa; pin R: tope /I3 o freno)'],
    ['M5', 'Marca flanco', 'Pulso monoestable de 1 ciclo al presionar pulsador I1'],
    ['M6', 'Marca memoria', 'Registro de estado de I1 para ciclo siguiente'],
    ['M8', 'Marca arranque', 'Inicialización en 1er scan para entrada Set de SF001']
  ],
  eq: [
    'M5 = I1 · NOT(M6) ; M6 = I1  (Detección flanco I1)',
    'SF001_S = M8 + SF004 · (NOT(I3) + M5) ; SF001_R = SF002',
    'SF002_S = SF001 · M5 ; SF002_R = NOT(I2) + M5',
    'SF003_S = SF002 · (NOT(I2) + M5) ; SF003_R = SF004',
    'SF004_S = SF003 · M5 ; SF004_R = NOT(I3) + M5',
    'Q1 = SF002 · NOT(Q2) ; Q2 = SF004 · NOT(Q1)'
  ],
  sol: 'Esquema secuencial con mapeo 1:1 para LOGO!Soft Comfort basado en 4 bloques de función especial Relé Autoenclavador RS (SF001 a SF004). En LOGO!Soft, cada bloque RS dispone de dos terminales físicos independientes: entrada S (Set, patita superior) y entrada R (Reset, patita media). Para servir de guía exacta de cableado, el diagrama desglosa cada terminal: SF001 (S) recibe el pulso de arranque M8 o el fin de cierre condicionado por el final de carrera cerrado /I3 o pulsador M5, mientras que SF001 (R) se conecta a la activación de SF002. Para SF002 (Abriendo), S recibe SF001 · M5 y R recibe el tope abierto /I2 o pulsador M5. Para SF003 (Pausa), S recibe la detención de apertura y R recibe SF004. Para SF004 (Cerrando), S recibe SF003 · M5 y R recibe el tope cerrado /I3 o pulsador M5. Los motores Q1 y Q2 son excitados por SF002 y SF004 con interbloqueo negado cruzado.',
  e: '¿Cómo cablear el portón en LOGO!Soft con relés autoenclavadores? Cada etapa se resuelve con un bloque RS independiente (SF001 a SF004). En LOGO!Soft no se puede apagar un bloque RS abriendo la línea de Set; debe cablearse obligatoriamente su patita de Reset (R). Por ello, el diagrama Ladder detalla la línea de entrada a cada pin: las líneas impares comandan el Set (S) para activar la etapa, y las líneas pares comandan el Reset (R) para apagarla al avanzar a la siguiente o pisar los finales de carrera N/C (/I2 y /I3). Los contactores de potencia Q1 y Q2 cuentan con interbloqueo cruzado /Q2 y /Q1.',
  i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
  o: ['Q1', 'Q2'],
  r: [
    { c: 'R1: Pulso de flanco positivo M5 = I1 · NOT(M6)', s: ['I1', '/M6'], o: 'M5' },
    { c: 'R2: Registro de estado de I1 para ciclo siguiente M6 = I1', s: ['I1'], o: 'M6' },
    { c: 'R3: Entrada Set (S) de SF001 (Reposo): inicialización M8 o fin de cierre', p: [['M8'], ['SF004', '/I3'], ['SF004', 'M5']], o: 'SF001 (S)' },
    { c: 'R4: Entrada Reset (R) de SF001 (Reposo): apagado al iniciar apertura SF002', s: ['SF002'], o: 'SF001 (R)' },
    { c: 'R5: Entrada Set (S) de SF002 (Abriendo): arranque al pulsar en reposo', s: ['SF001', 'M5'], o: 'SF002 (S)' },
    { c: 'R6: Entrada Reset (R) de SF002 (Abriendo): detención por tope /I2 o pulsador M5', p: [['/I2'], ['M5']], o: 'SF002 (R)' },
    { c: 'R7: Entrada Set (S) de SF003 (Pausa): detención de apertura por tope /I2 o M5', p: [['SF002', '/I2'], ['SF002', 'M5']], o: 'SF003 (S)' },
    { c: 'R8: Entrada Reset (R) de SF003 (Pausa): apagado al iniciar cierre SF004', s: ['SF004'], o: 'SF003 (R)' },
    { c: 'R9: Entrada Set (S) de SF004 (Cerrando): arranque al pulsar en pausa', s: ['SF003', 'M5'], o: 'SF004 (S)' },
    { c: 'R10: Entrada Reset (R) de SF004 (Cerrando): detención por tope /I3 o pulsador M5', p: [['/I3'], ['M5']], o: 'SF004 (R)' },
    { c: 'R11: Motor apertura Q1 gobernado por etapa SF002 con interbloqueo negado /Q2', s: ['SF002', '/Q2'], o: 'Q1' },
    { c: 'R12: Motor cierre Q2 gobernado por etapa SF004 con interbloqueo negado /Q1', s: ['SF004', '/Q1'], o: 'Q2' }
  ],
  ejecutar: (S, I) => {
    if (!S.iniciado) {
      S.b1 = true; S.b2 = false; S.b3 = false; S.b4 = false;
      S.m6 = Boolean(I.I1); S.iniciado = true;
    }
    const pulsoI1 = Boolean(I.I1 && !S.m6);
    S.m5 = pulsoI1;
    S.m6 = Boolean(I.I1);

    if (S.b1 && S.m5) {
      S.b2 = true; S.b1 = false;
    } else if (S.b2 && (!I.I2 || S.m5)) {
      S.b3 = true; S.b2 = false;
    } else if (S.b3 && S.m5) {
      S.b4 = true; S.b3 = false;
    } else if (S.b4 && (!I.I3 || S.m5)) {
      S.b1 = true; S.b4 = false;
    }

    const q1 = Boolean(S.b2 && !S.b4);
    const q2 = Boolean(S.b4 && !S.b2);
    const idx = S.b1 ? 0 : (S.b2 ? 1 : (S.b3 ? 2 : 3));
    S.s = idx;
    S.info = ['Parado (cerrado)', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto / pausa)', 'CERRANDO PORTÓN (Q2)'][idx];
    return {
      Q1: q1, Q2: q2,
      SF001: Boolean(S.b1), SF002: Boolean(S.b2), SF003: Boolean(S.b3), SF004: Boolean(S.b4),
      B001: Boolean(S.b1), B002: Boolean(S.b2), B003: Boolean(S.b3), B004: Boolean(S.b4),
      M1: Boolean(S.b1), M2: Boolean(S.b2), M3: Boolean(S.b3), M4: Boolean(S.b4),
      M5: Boolean(S.m5), M6: Boolean(S.m6)
    };
  }
};
