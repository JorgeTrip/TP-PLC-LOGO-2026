/**
 * Guías de construcción tutorial en LOGO!Soft Comfort: Ejercicios 4.7 a 4.11.
 * Capa de dominio.
 */

export const guiasLogoBloque2 = {
  '4.7': {
    bloques: 'Retardo a la conexión B001 (2 s) y B002 (5 s). AND (flanco) B003 (menú Otros). Relé de barrido B004 (20 s) y B006 (120 s). Relé autoenclavador B005. Generador asíncrono B007 (TH = 1 s, TL = 1 s).',
    estructura: [
      'Renglón 1: Contacto NC /I1 conectado al bloque AND (flanco) B003 (pulso de un ciclo al soltar).',
      'Renglón 2: Contactos en serie NA B003, NA B001 y NC /B002 conectados al pin Set (S) del relé autoenclavador B005.',
      'Renglón 3: Contacto NA B002 conectado al pin Reset (R) de B005 (desactiva cabina si escala a incendio).',
      'Renglón 4: Contacto NA B003 en serie con contacto NC /B001 conectado al terminal Trg del relé de barrido B004 (20 s).',
      'Renglón 5: Contacto NA I1 conectado al terminal Trg del bloque Retardo a la conexión B001 (2 s).',
      'Renglón 6: Contacto NA I1 conectado al terminal Trg del bloque Retardo a la conexión B002 (5 s).',
      'Renglón 7: Contacto NA B002 conectado al terminal Trg del relé de barrido B006 (120 s).',
      'Renglón 8: Contacto NA B006 conectado al pin En del Generador de impulsos asíncrono B007 (1 s / 1 s).',
      'Renglón 9: Conexión en paralelo de contactos NA B004 y NA B007 hacia la bobina ( Q1 ).',
      'Renglón 10: Conexión en paralelo de la rama [NA B005 · NC /B006] y el contacto NA B007 hacia la bobina ( Q2 ).'
    ]
  },
  '4.8': {
    bloques: 'Contador adelante/atrás (B001, Limit = 50, menú Contadores) y 3 bloques Relé de barrido (Salida de impulsos) (B002 de 3 s, B003 de 1 s, B004 de 3 s, menú Temporizadores).',
    estructura: [
      'Renglón 1: Rama paralela entre entrada con cupo [I1 · /B001] y egreso I2 conectada al borne de conteo Cnt de B001.',
      'Renglón 2: Contacto NA I2 conectado al borne de dirección Dir de B001 (1 = resta).',
      'Renglón 3: Contacto NA I3 conectado al borne de puesta a cero R de B001.',
      'Renglón 4: Contacto NA B001 conectado a la bobina del cartel ( Q3 ).',
      'Renglón 5: Contacto NA I1 en serie con contacto NC /B001 conectado al terminal Trg del relé de barrido B002 (3 s).',
      'Renglón 6: Contacto NA B002 conectado a la bobina de barrera entrada ( Q1 ).',
      'Renglón 7: Contacto NA I1 en serie con contacto NC /B001 conectado al terminal Trg del relé de barrido B003 (1 s).',
      'Renglón 8: Contacto NA B003 conectado a la bobina de expendedor de tickets ( Q4 ).',
      'Renglón 9: Contacto NA I2 conectado al terminal Trg del relé de barrido B004 (3 s).',
      'Renglón 10: Contacto NA B004 conectado a la bobina de barrera salida ( Q2 ).'
    ]
  },
  '4.9': {
    bloques: 'AND (flanco) (B001, menú Otros) y 4 bloques Relé autoenclavador (B002: Reposo, B003: Abriendo, B004: Pausa, B005: Cerrando).',
    estructura: [
      'Renglón 1: Contacto NA I1 conectado a la entrada del bloque AND (flanco) B001.',
      'Renglón 2: Paralelo de inicialización M8 y fin de carrera [B005 · (/I3 + B001)] al pin Set (S) de B002.',
      'Renglón 3: Contactos en serie NA B002 y NA B001 conectados al pin Set (S) de B003.',
      'Renglón 4: Contacto NA B003 conectado al pin Reset (R) de B002.',
      'Renglón 5: Contacto NA B003 en serie con el paralelo [/I2 + B001] conectado al pin Set (S) de B004.',
      'Renglón 6: Paralelo de contacto NC /I2 y NA B001 conectado al pin Reset (R) de B003.',
      'Renglón 7: Contactos en serie NA B004 y NA B001 conectados al pin Set (S) de B005.',
      'Renglón 8: Contacto NA B005 conectado al pin Reset (R) de B004.',
      'Renglón 9: Paralelo de contacto NC /I3 y NA B001 conectado al pin Reset (R) de B005.',
      'Renglón 10: Contacto NA B003 en serie con enclavamiento NC /Q2 conectado a la bobina abrir ( Q1 ).',
      'Renglón 11: Contacto NA B005 en serie con enclavamiento NC /Q1 conectado a la bobina cerrar ( Q2 ).'
    ],
    comportamiento: 'Orden secuencial Grafcet: Set de etapa entrante antes de Reset de saliente. Nota de representación KOP: Para prevenir carreras de escaneo, las órdenes de activación y desactivación de una misma etapa se procesan en renglones intercalados; en LOGO!Soft Comfort se disponen los cuatro bloques biestables B002 a B005 y se conectan directamente los conductores a sus respectivos terminales físicos S (patita superior) y R (patita media).'
  },
  '4.10': {
    bloques: 'Ninguno. Lógica de autorretención con prioridad de corte unificada.',
    doctrina: 'La parada de emergencia PE se cablea electromecánicamente en serie fuera del PLC; dentro del programa, I4 actúa como contacto de seguridad abierto (1 en reposo) para desarmar autorretenciones.',
    estructura: [
      'Renglón 1 (Bomba 1): Contacto NA I4 en serie con contacto NC /I3 y con el paralelo de arranque [I1 + Q1], rematando en la bobina ( Q1 ).',
      'Renglón 2 (Bomba 2): Contacto NA I4 en serie con contacto NC /I3 y con el paralelo de refuerzo [I2 + Q2], rematando en la bobina ( Q2 ).'
    ]
  },
  '4.11': {
    bloques: 'Relé de impulsos (B001, menú Otros).',
    estructura: [
      'Renglón 1 (Conmutación biestable): Contacto NA I1 conectado directamente al pin de disparo Trg del bloque Relé de impulsos B001. Conmuta alternativamente su salida entre 0 y 1 con cada flanco ascendente de demanda.',
      'Renglón 2 (Bomba 1): Contactos en serie NA I4, NA I1 y NA B001 rematando en la bobina ( Q1 ). Conduce en los ciclos impares.',
      'Renglón 3 (Bomba 2): Contactos en serie NA I4, NA I1 y NC /B001 rematando en la bobina ( Q2 ). Conduce en los ciclos pares.'
    ]
  }
};
