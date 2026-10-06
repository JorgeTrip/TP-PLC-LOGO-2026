/**
 * Guías de construcción tutorial en LOGO!Soft Comfort: Ejercicios 4.7 a 4.11.
 * Capa de dominio.
 */

export const guiasLogoBloque2 = {
  '4.7': {
    bloques: 'Retardo a la conexión B001 (2 s) y B002 (5 s). AND (flanco) B003 (menú Otros). Relé de barrido (Salida de impulsos) B004 (20 s) y B006 (120 s). Relé autoenclavador B005. Generador de impulsos asíncrono B007 (TH = 1 s, TL = 1 s).',
    estructura: [
      'Renglón 1 y 2 (Medición de pulsación): Contacto NA I1 conectado en paralelo a los pines Trg de B001 y B002.',
      'Renglón 3 (Detección de liberación): Contacto NC /I1 conectado a la entrada del bloque AND (flanco) B003, generando un pulso de un ciclo al soltar.',
      'Renglón 4 (Pulsación simple): Contacto NA B003 en serie con contacto NC /B001 conectado al pin Trg de B004 (20 s).',
      'Renglón 5 (Alarma cabina): Contacto NA B003 en serie con NA B001 y NC /B002 conectado al pin S de B005. Pin R conectado a la salida de B002 (se resetea si se alcanzan los 5 s).',
      'Renglón 6 (Emergencia incendio): Contacto NA B002 conectado al pin Trg de B006 (120 s). Contacto NA B006 conectado al pin de habilitación En de B007 (0.5 Hz).',
      'Renglón 7 (Salida Q1): Paralelo de contactos NA B004 y NA B007 comanda la bobina ( Q1 ).',
      'Renglón 8 (Salida Q2): Paralelo de [B005 · /B006] y NA B007 comanda la bobina ( Q2 ).'
    ]
  },
  '4.8': {
    bloques: 'Contador adelante/atrás (B001, Limit = 50, menú Contadores) y 3 bloques Relé de barrido (Salida de impulsos) (B002 de 3 s, B003 de 1 s, B004 de 3 s, menú Temporizadores).',
    estructura: [
      'Renglón 1 (Pulsos Cnt): Paralelo entre la entrada con cupo [I1 · /B001] y la salida de vehículos [I2], conectado al borne Cnt de B001.',
      'Renglón 2 (Dirección Dir): Contacto NA I2 conectado directamente al pin Dir de B001 (resta cuando un auto sale).',
      'Renglón 3 (Reset): Contacto NA I3 conectado al pin R de B001.',
      'Renglón 4 (Cartel Q3): Contacto NA B001 comanda la bobina ( Q3 ).',
      'Renglón 5 (Barrera entrada y ticket): Contactos serie I1 y NC /B001 conectados en paralelo a los pines Trg de B002 (3 s) y B003 (1 s). Sus contactos NA comandan respectivamente ( Q1 ) y ( Q4 ).',
      'Renglón 6 (Barrera salida): Contacto NA I2 conectado al pin Trg de B004 (3 s). Su contacto NA comanda ( Q2 ).'
    ]
  },
  '4.9': {
    bloques: 'AND (flanco) (B001, menú Otros) y 4 bloques Relé autoenclavador (B002: Reposo, B003: Abriendo, B004: Pausa, B005: Cerrando).',
    estructura: [
      'Renglón 1 (Detección de pulsación): Contacto NA I1 conectado a la entrada del bloque AND (flanco) B001.',
      'Renglón 2 (Set B002): Paralelo de inicialización M8 y fin de carrera [B005 · (/I3 + B001)] al pin S de B002.',
      'Renglón 3 (Set B003): Contactos en serie B002 y B001 conectados al pin S de B003.',
      'Renglón 4 (Reset B002): Contacto NA B003 conectado al pin R de B002.',
      'Renglón 5 (Set B004): Contacto NA B003 en serie con el paralelo de [/I2 + B001] conectado al pin S de B004.',
      'Renglón 6 (Reset B003): Paralelo de contacto NC /I2 y NA B001 conectado al pin R de B003.',
      'Renglón 7 (Set B005): Contactos en serie B004 y B001 conectados al pin S de B005.',
      'Renglón 8 (Reset B004): Contacto NA B005 conectado al pin R de B004.',
      'Renglón 9 (Reset B005): Paralelo de contacto NC /I3 y NA B001 conectado al pin R de B005.',
      'Renglón 10 y 11 (Comando motores con interbloqueo cruzado): Contacto NA B003 en serie con NC /Q2 hacia ( Q1 ); contacto NA B005 en serie con NC /Q1 hacia ( Q2 ).'
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
