/**
 * Especificación formal y simulación de Ejercicio 4.9: Portón Levadizo.
 * Mapeo 1:1 con bloques de función especial Relé Autoenclavador (RS) de LOGO!Soft (B001 a B004).
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
    ['B001', 'AND (flanco)', 'Detección de flanco de pulsación I1'],
    ['B002', 'Relé autoenclavador', 'Etapa 1: Reposo cerrado'],
    ['B003', 'Relé autoenclavador', 'Etapa 2: Abriendo'],
    ['B004', 'Relé autoenclavador', 'Etapa 3: Pausa / Tope abierto'],
    ['B005', 'Relé autoenclavador', 'Etapa 4: Cerrando']
  ],
  eq: [
    'B001 = AND_Flanco(I1)',
    'Set(B002) = M8 + B005 · (NOT(I3) + B001) ; Reset(B002) = B003',
    'Set(B003) = B002 · B001 ; Reset(B003) = NOT(I2) + B001',
    'Set(B004) = B003 · (NOT(I2) + B001) ; Reset(B004) = B005',
    'Set(B005) = B004 · B001 ; Reset(B005) = NOT(I3) + B001',
    'Q1 = B003 · NOT(Q2) ; Q2 = B005 · NOT(Q1)'
  ],
  sol: 'Esquema secuencial con mapeo 1:1 para LOGO!Soft Comfort basado en el bloque AND (flanco) B001 y 4 bloques Relé Autoenclavador RS (B002 a B005) según norma Grafcet. En LOGO!Soft, cada bloque RS dispone de terminales físicos independientes S y R. Para evitar carreras de escaneo, el orden de renglones asegura el Set de la etapa entrante antes del Reset de la saliente: R3 activa B003 antes del reset de B002 en R4; R5 activa B004 antes del reset de B003 en R6; y R7 activa B005 antes del reset de B004 en R8. Los motores Q1 y Q2 son comandados por B003 y B005 con interbloqueo cruzado /Q2 y /Q1.',
  e: '¿Cómo garantizar transiciones seguras en LOGO!Soft con relés autoenclavadores? Siguiendo el principio universal de Grafcet: activar la etapa siguiente antes de desactivar la previa. Al ordenar los peldaños para que el Set de la etapa entrante se procese antes del Reset de la saliente (por ejemplo, R5 activa la pausa B004 antes de que R6 apague la apertura B003), se asegura que el contacto de la etapa actual esté disponible para conmutar la memoria posterior sin carreras de escaneo. Los contactores de potencia Q1 y Q2 cuentan con interbloqueo cruzado /Q2 y /Q1.',
  i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
  o: ['Q1', 'Q2'],
  r: [
    { c: 'R1: Contacto NA I1 conectado a la entrada del bloque AND (flanco) B001', s: ['I1'], o: '[AND B001]' },
    { c: 'R2: Paralelo de inicialización M8 y fin de carrera [B005 · (/I3 + B001)] al pin Set (S) de B002', p: [['M8'], ['B005', '/I3'], ['B005', 'B001']], o: 'S B002' },
    { c: 'R3: Contactos en serie NA B002 y NA B001 conectados al pin Set (S) de B003', s: ['B002', 'B001'], o: 'S B003' },
    { c: 'R4: Contacto NA B003 conectado al pin Reset (R) de B002', s: ['B003'], o: 'R B002' },
    { c: 'R5: Contacto NA B003 en serie con el paralelo [/I2 + B001] conectado al pin Set (S) de B004', p: [['B003', '/I2'], ['B003', 'B001']], o: 'S B004' },
    { c: 'R6: Paralelo de contacto NC /I2 y NA B001 conectado al pin Reset (R) de B003', p: [['/I2'], ['B001']], o: 'R B003' },
    { c: 'R7: Contactos en serie NA B004 y NA B001 conectados al pin Set (S) de B005', s: ['B004', 'B001'], o: 'S B005' },
    { c: 'R8: Contacto NA B005 conectado al pin Reset (R) de B004', s: ['B005'], o: 'R B004' },
    { c: 'R9: Paralelo de contacto NC /I3 y NA B001 conectado al pin Reset (R) de B005', p: [['/I3'], ['B001']], o: 'R B005' },
    { c: 'R10: Contacto NA B003 en serie con enclavamiento NC /Q2 conectado a la bobina abrir ( Q1 )', s: ['B003', '/Q2'], o: 'Q1' },
    { c: 'R11: Contacto NA B005 en serie con enclavamiento NC /Q1 conectado a la bobina cerrar ( Q2 )', s: ['B005', '/Q1'], o: 'Q2' }
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
      // De cerrado a abriendo
      S.b2 = true; S.b1 = false;
    } else if (S.b2 && (!I.I2 || S.m5)) {
      // De abriendo a pausa (tope abierto) o parada por pulsación
      S.b3 = true; S.b2 = false;
    } else if (S.b3 && S.m5) {
      // De pausa a cerrando
      S.b4 = true; S.b3 = false;
    } else if (S.b4 && S.m5) {
      // Pulsación durante cerrando: volver a cerrado inmediatamente
      S.b1 = true; S.b4 = false;
    } else if (S.b4 && (!I.I3)) {
      // Fin de carrera inferior alcanzado: garantizar estado cerrado
      S.b1 = true; S.b4 = false;
    }

    const q1 = Boolean(S.b2 && !S.b4);
    const q2 = Boolean(S.b4 && !S.b2);
    const idx = S.b1 ? 0 : (S.b2 ? 1 : (S.b3 ? 2 : 3));
    S.s = idx;
    S.info = ['Parado (cerrado)', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto / pausa)', 'CERRANDO PORTÓN (Q2)'][idx];
    return {
      Q1: q1, Q2: q2,
      B001: Boolean(S.m5),
      B002: Boolean(S.b1),
      B003: Boolean(S.b2),
      B004: Boolean(S.b3),
      B005: Boolean(S.b4),
      M1: Boolean(S.b1),
      M2: Boolean(S.b2),
      M3: Boolean(S.b3),
      M4: Boolean(S.b4),
      M5: Boolean(S.m5),
      M6: Boolean(S.m6)
    };
  }
};
