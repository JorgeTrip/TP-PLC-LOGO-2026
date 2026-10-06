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
    bloques: 'Relé autoenclavador (B001, menú Otros, para memoria general) y Retardo a la conexión (B002, menú Temporizadores, parametrizado en T = 5 s).',
    pines: 'B001: Terminal superior S (Set), terminal inferior R (Reset). B002: Terminal Trg (Disparo).',
    estructura: [
      'Renglón 1: Contacto NA I1 conectado al pin Set (S) del bloque Relé autoenclavador B001.',
      'Renglón 2: Contacto NA I2 conectado al pin Reset (R) del bloque B001.',
      'Renglón 3: Contacto NA B001 conectado al terminal de disparo Trg del bloque Retardo a la conexión B002 (5 s).',
      'Renglón 4: Contacto NA B001 en serie con contacto NC /B002 conectado a la bobina ( Q2 ).',
      'Renglón 5: Contacto NA B001 en serie con contacto NA B002 conectado a la bobina ( Q1 ).'
    ]
  },
  '4.4': {
    bloques: 'Interruptor de alumbrado para escalera (B001, menú Temporizadores, T = 15 s), Retardo a la conexión (B002, T = 10 s) y Relé autoenclavador (B003, menú Otros).',
    pines: 'B001: Terminal Trg. B002: Terminal Trg. B003: Terminales S (Set) y R (Reset).',
    estructura: [
      'Renglón 1: Contacto NA I1 conectado al terminal Trg del bloque Interruptor de alumbrado para escalera B001 (15 s).',
      'Renglón 2: Contacto NA B001 conectado a la bobina ( Q1 ).',
      'Renglón 3: Contacto NA B001 en serie con contacto NC /I1 conectado al pin Trg del bloque Retardo a la conexión B002 (10 s).',
      'Renglón 4: Contacto NA B002 conectado al pin Set (S) del bloque Relé autoenclavador B003.',
      'Renglón 5: Contacto NA I1 conectado al pin Reset (R) del bloque B003.',
      'Renglón 6: Contacto NA B003 conectado a la bobina ( Q2 ).'
    ]
  },
  '4.5': {
    bloques: 'Contador adelante/atrás (B001, menú Contadores, parámetros: On = 5, Off = 0).',
    pines: 'Terminal Cnt (Conteo ascendente), terminal R (Reset manual). Borne Dir sin conectar (0 por defecto para suma).',
    estructura: [
      'Renglón 1: Contacto NA Q1 en serie con contacto NC /I2 conectado al borne de conteo Cnt del bloque Contador B001.',
      'Renglón 2: Contacto NC /I3 conectado al borne de reset R del bloque B001.',
      'Renglón 3: Rama paralela de I1 y autorretención Q1 en serie con contacto NC /B001 hacia la bobina ( Q1 ).'
    ]
  },
  '4.6': {
    bloques: 'Ninguno. Se resuelve con lógica combinacional pura y autorretención en paralelo sobre marcas internas (M1, M2, M3 y bandera de bloqueo B).',
    estructura: [
      'Renglón 1 (Bloqueo B): Ramas en paralelo ante violación de orden [I1 · /M1], [I3 · /M2], pulsación simultánea [I1 · I2], [I1 · I3], [I2 · I3] y contacto de autorretención [B], en serie con contacto NC /I4 hacia la bobina ( B ).',
      'Renglón 2 (Paso 1): Paralelo de pulsador I2 y autorretención M1, en serie con corte seguro /I4 y /B hacia la bobina ( M1 ).',
      'Renglón 3 (Paso 2): Paralelo de avance [I1 · /I2 · M1] y autorretención M2, en serie con /I4 y /B hacia la bobina ( M2 ).',
      'Renglón 4 (Paso 3): Paralelo de avance [I3 · /I1 · M2] y autorretención M3, en serie con /I4 y /B hacia la bobina ( M3 ).',
      'Renglón 5 (Habilitación): Contacto NA M3 conectado a la bobina ( Q1 ).'
    ]
  }
};
