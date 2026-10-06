/**
 * Guías de construcción tutorial en LOGO!Soft Comfort: Ejercicios 4.1 a 4.6.
 * Capa de dominio.
 */

export const guiasLogoBloque1 = {
  '4.1': {
    bloques: 'Ninguno. Se resuelve con lógica combinacional pura.',
    elementos: 'Contacto normalmente abierto (NA), Contacto normalmente cerrado (NC), Bobina estándar ( ).',
    estructura: [
      'Renglón 1: Conectar en paralelo el contacto NA I1 con el contacto de autorretención NA Q1. A la salida de ese paralelo, conectar en serie el contacto NC I2 y rematar en la bobina ( Q1 ).'
    ],
    comportamiento: 'Parada dominante; presionar simultáneamente I1 e I2 debe mantener la bobina apagada por corte en serie de I2.'
  },
  '4.2': {
    bloques: 'Relé autoenclavador (B001, menú Otros).',
    pines: 'Terminal superior S (Set), terminal inferior R (Reset).',
    estructura: [
      'Renglón 1 (Línea Set): Contacto NA I1 conectado directamente al pin S del bloque B001.',
      'Renglón 2 (Línea Reset): Contacto NC /I2 conectado al pin R del bloque B001. Al ser I2 un pulsador físico NC (entrega 1 continuo en reposo), el contacto programado invertido envía 1 al reset únicamente cuando la línea se abre al presionarlo o ante corte de cable.',
      'Renglón 3 (Salida de potencia): Contacto NA B001 conectado a la bobina ( Q1 ).'
    ]
  },
  '4.3': {
    bloques: 'Relé autoenclavador (B001, para memoria general) y Retardo a la conexión (B002, menú Temporizadores, parametrizado en T = 5 s).',
    estructura: [
      'Renglón 1: Contacto NA I1 al pin S de B001. Contacto NA I2 al pin R de B001.',
      'Renglón 2: Contacto NA B001 conectado al terminal de disparo Trg del bloque Retardo a la conexión B002.',
      'Renglón 3 (Lámpara Q2): Contacto NA B001 en serie con contacto NC /B002 hacia la bobina ( Q2 ). Conduce durante los 5 segundos que dura el conteo.',
      'Renglón 4 (Motor Q1): Contacto NA B001 en serie con contacto NA B002 hacia la bobina ( Q1 ). Energiza al conmutar el temporizador.'
    ]
  },
  '4.4': {
    bloques: 'Interruptor de alumbrado para escalera (B001, menú Temporizadores, T = 15 s), Retardo a la conexión (B002, T = 10 s) y Relé autoenclavador (B003, menú Otros).',
    estructura: [
      'Renglón 1 (Luz de pasillo): Contacto NA I1 conectado al terminal Trg del bloque B001. Contacto NA B001 comanda la bobina ( Q1 ).',
      'Renglón 2 (Sincronismo pre-aviso): Contacto NA B001 en serie con contacto NC /I1 conectado al pin Trg del bloque B002. La presencia de /I1 garantiza que cualquier repulsación durante el ciclo resetee a cero el acumulador del temporizador.',
      'Renglón 3 (Enclavamiento testigo): Contacto NA B002 conectado al pin S de B003. Contacto NA I1 conectado al pin R de B003.',
      'Renglón 4 (Testigo Q2): Contacto NA B003 comanda la bobina ( Q2 ).'
    ]
  },
  '4.5': {
    bloques: 'Contador adelante/atrás (B001, menú Contadores, parámetros: On = 5, Off = 0).',
    estructura: [
      'Renglón 1 (Conteo condicionado): Contacto NA Q1 en serie con contacto NC /I2 conectado al borne de conteo Cnt de B001. Al ser I2 un sensor NC, el paso de una pieza abre el contacto físico y genera el flanco de subida en /I2, computando solo cuando el proceso marcha. El borne Dir queda sin conectar (nivel 0 por defecto para suma).',
      'Renglón 2 (Reset manual): Contacto NC /I3 conectado al terminal R del bloque B001.',
      'Renglón 3 (Motor de proceso): Rama paralela de I1 y sello Q1, en serie con contacto NC /B001 hacia la bobina ( Q1 ). Al llegar a 5 piezas, B001 abre y desenergiza la marcha.'
    ]
  },
  '4.6': {
    bloques: '4 bloques Relé autoenclavador (B001 para Falla/Bloqueo, B002 para Paso 1, B003 para Paso 2, B004 para Paso 3).',
    estructura: [
      'Renglón 1 (Set Bloqueo B001): Ramas en paralelo que detectan saltos o presiones simultáneas: [I1 · /B002], [I3 · /B003], [I1 · I2], [I1 · I3], [I2 · I3]. Conectan al pin S de B001. Pin R recibe el contacto NA I4.',
      'Renglón 2 (Paso 1): Contacto NA I2 en serie con contacto NC /B001 conectado al pin S de B002. Pin R recibe el paralelo I4 o B001.',
      'Renglón 3 (Paso 2): Contactos en serie I1, NC /I2 (pulsador previo liberado), NA B002 y NC /B001 conectados al pin S de B003. Pin R recibe I4 o B001.',
      'Renglón 4 (Paso 3): Contactos en serie I3, NC /I1, NA B003 y NC /B001 conectados al pin S de B004. Pin R recibe I4 o B001.',
      'Renglón 5 (Habilitación): Contacto NA B004 comanda la bobina ( Q1 ).'
    ]
  }
};
