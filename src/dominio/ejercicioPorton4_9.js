/**
 * Especificación formal y simulación de Ejercicio 4.9: Portón Levadizo.
 * Resuelto mediante bloques de función especial Relé Autoenclavador (RS) de LOGO!Soft.
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
    ['B001', 'Relé RS', 'Etapa 1: Reposo cerrado (Set por M8 en RUN)'],
    ['B002', 'Relé RS', 'Etapa 2: Abriendo (comanda motor Q1)'],
    ['B003', 'Relé RS', 'Etapa 3: Pausa o tope superior alcanzado'],
    ['B004', 'Relé RS', 'Etapa 4: Cerrando (comanda motor Q2)'],
    ['M5', 'Marca flanco', 'Pulso monoestable de 1 ciclo al pulsar I1'],
    ['M6', 'Marca memoria', 'Registro de estado previo de I1'],
    ['M8', 'Marca arranque', 'Inicialización en 1er scan para Set de B001']
  ],
  eq: [
    'M5 = I1 · NOT(M6) ; M6 = I1  (Detección flanco I1)',
    'B001_S = M8 + B004 · (NOT(I3) + M5) ; B001_R = B002',
    'B002_S = B001 · M5 ; B002_R = NOT(I2) + M5',
    'B003_S = B002 · (NOT(I2) + M5) ; B003_R = B004',
    'B004_S = B003 · M5 ; B004_R = NOT(I3) + M5',
    'Q1 = B002 · NOT(Q2) ; Q2 = B004 · NOT(Q1)'
  ],
  sol: 'Esquema secuencial resuelto mediante bloques de función especial Relé Autoenclavador (RS) nativos de LOGO!Soft Comfort (B001 a B004). Cada bloque representa de forma unívoca una de las cuatro etapas del ciclo: B001 (Reposo cerrado), B002 (Abriendo Q1), B003 (Pausa / Tope superior) y B004 (Cerrando Q2). El avance paso a paso se rige por el flanco positivo de I1 generado mediante la marca M5 (I1 · /M6) con registro en M6. En el arranque a RUN, la marca de primer scan M8 de Siemens LOGO! activa la entrada Set de B001. Las detenciones en los extremos emplean los finales de carrera físicos NC (I2 e I3) evaluados mediante contactos cerrados (/I2 y /I3) que conducen al abrirse el circuito a 0V. Los contactores de motor Q1 y Q2 son comandados por B002 y B004 con interbloqueo eléctrico cruzado.',
  e: '¿Cómo implementar un autómata secuencial en LOGO!Soft con relés autoenclavadores? Cada etapa se asigna a un bloque RS independiente: B001 (Reposo), B002 (Abriendo), B003 (Pausa) y B004 (Cerrando). El pulsador I1 genera un pulso monostable de un ciclo en M5 para avanzar de etapa sin rebotes. La entrada Set (S) de cada bloque se excita al cumplirse la condición de avance desde la etapa previa, mientras que la entrada Reset (R) apaga la etapa al ingresar a la siguiente o al alcanzar los finales de carrera. Los sensores I2 e I3, al ser físicamente NC, se leen negados (/I2 y /I3). Los contactores de salida Q1 y Q2 cuentan con interbloqueo recíproco.',
  i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
  o: ['Q1', 'Q2'],
  r: [
    { c: 'R1: Pulso de flanco positivo M5 = I1 · NOT(M6)', s: ['I1', '/M6'], o: 'M5' },
    { c: 'R2: Registro de estado de I1 para ciclo siguiente M6 = I1', s: ['I1'], o: 'M6' },
    { c: 'R3: Etapa 1 Reposo cerrado B001 (Set por M8 o fin de cierre, Reset por B002)', p: [['M8'], ['B004', '/I3'], ['B004', 'M5']], s: ['/B002'], o: '[RS B001]' },
    { c: 'R4: Etapa 2 Abriendo B002 (Set al pulsar en reposo, Reset por /I2 o pulsador M5)', s: ['B001', 'M5'], o: '[RS B002]' },
    { c: 'R5: Etapa 3 Pausa / Tope abierto B003 (Set al parar apertura, Reset por B004)', p: [['B002', '/I2'], ['B002', 'M5']], s: ['/B004'], o: '[RS B003]' },
    { c: 'R6: Etapa 4 Cerrando B004 (Set al pulsar en pausa, Reset por /I3 o pulsador M5)', s: ['B003', 'M5'], o: '[RS B004]' },
    { c: 'R7: Motor apertura Q1 comandado por etapa B002 con interbloqueo negado /Q2', s: ['B002', '/Q2'], o: 'Q1' },
    { c: 'R8: Motor cierre Q2 comandado por etapa B004 con interbloqueo negado /Q1', s: ['B004', '/Q1'], o: 'Q2' }
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
      B001: Boolean(S.b1), B002: Boolean(S.b2), B003: Boolean(S.b3), B004: Boolean(S.b4),
      M1: Boolean(S.b1), M2: Boolean(S.b2), M3: Boolean(S.b3), M4: Boolean(S.b4),
      M5: Boolean(S.m5), M6: Boolean(S.m6)
    };
  }
};
