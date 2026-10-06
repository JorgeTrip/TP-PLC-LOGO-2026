/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 3 (Ejercicios 4.7, 4.8 y 4.9).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';
import { ejercicioPorton4_9 } from './ejercicioPorton4_9.js';

export const ejerciciosBloque3 = [
  {
    n: '4.7',
    t: 'Sistema de Alerta Multifunción',
    q: 'Diseñar una lógica para un pulsador (I1) con tres funciones según el tiempo de presión: Presión simple: Enciende Q1 por 20 segundos. Presión 2 segundos: Activa alarma en cabina de seguridad (Q2). Presión 5 segundos: Activa parpadeo de emergencia (Q1 y Q2) a 0.5 Hz durante 2 minutos (Alarma de Incendio).',
    io: [
      ['I1', 'Pulsador multifunción de operador', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Luminaria general / evacuación', 'Digital / Relé', 'Salida energizada (20 s fija o parpadeo)'],
      ['Q2', 'Alarma en cabina de control', 'Digital / Relé', 'Salida energizada (fija en 2s o parpadeo)']
    ],
    soft: [
      ['B001', 'Retardo a la conexión', 'Medición de tiempo para cabina (2 s)'],
      ['B002', 'Retardo a la conexión', 'Medición de tiempo para incendio (5 s)'],
      ['B003', 'AND (flanco)', 'Detección de liberación al soltar I1'],
      ['B004', 'Relé de barrido', 'Salida de impulsos de luz general (20 s)'],
      ['B005', 'Relé autoenclavador', 'Enclavamiento de alarma en cabina'],
      ['B006', 'Relé de barrido', 'Salida de impulsos de emergencia por incendio (120 s)'],
      ['B007', 'Generador asíncrono', 'Oscilador simétrico a 0.5 Hz (1 s ON / 1 s OFF)']
    ],
    eq: [
      'B003 = AND_Flanco(NOT(I1))',
      'Set(B005) = B003 · B001 · NOT(B002) ; Reset(B005) = B002',
      'B004_Trg = B003 · NOT(B001)',
      'B001_Trg = I1 (TON, PT = 2 s) ; B002_Trg = I1 (TON, PT = 5 s)',
      'B006_Trg = B002 (Barrido, PT = 120 s)',
      'B007_En = B006 (Asíncrono, TH = 1 s, TL = 1 s)',
      'Q1 = B004 + B007',
      'Q2 = (B005 · NOT(B006)) + B007'
    ],
    sol: 'Discriminación temporal inmune a carreras de escaneo. Para evitar que la desactivación de los temporizadores al soltar I1 borre el tiempo acumulado antes de evaluarlo, los renglones de decisión por flanco descendente se ejecutan antes de los bloques TON en el ciclo de scan: R1 detecta la liberación con el bloque AND (flanco) B003; R2 enclava la alarma en cabina B005 si B001 estaba activo sin alcanzar B002, y R4 dispara la luz general B004 (20 s) si no se alcanzó B001. Superados 5 s continuos, B002 activa el relé de barrido de emergencia B006 (120 s), resetea B005 y activa el oscilador asíncrono B007 a 0.5 Hz modulando Q1 y Q2.',
    e: '¿Cómo resolver la carrera de escaneo al evaluar el tiempo de pulsación? En PLC, al soltar I1 (1 a 0), un TON se apaga de inmediato. Si las decisiones se ubican antes de los temporizadores en el orden del scan, el autómata evalúa la liberación a través de B003 con el estado aún activo de B001 y B002. Así, soltar con 2 s <= t < 5 s enclava cabina B005 sin disparar la luz de 20 s. Al llegar a 5 s, B002 activa la emergencia de 2 min B006 y el oscilador a 0.5 Hz B007.',
    i: [['I1', 'Pulsador multifunción', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Detección de liberación al soltar I1 mediante bloque AND (flanco) B003', s: ['/I1'], o: '[AND B003]' },
      { c: 'R2: Entrada Set (S) en relé autoenclavador B005 (cabina) por pulso B003', s: ['B003', 'B001', '/B002'], o: 'S B005' },
      { c: 'R3: Entrada Reset (R) en B005 desactivando cabina al escalar a incendio', s: ['B002'], o: 'R B005' },
      { c: 'R4: Disparo de pulso de luz B004 (20 s) al liberar sin alcanzar 2 s', s: ['B003', '/B001'], o: '[Barrido B004 | 20s]' },
      { c: 'R5: Medición de tiempo continuo 2 s en bloque Retardo a la conexión B001', s: ['I1'], o: '[TON B001 | 2s]' },
      { c: 'R6: Medición de tiempo continuo 5 s en bloque Retardo a la conexión B002', s: ['I1'], o: '[TON B002 | 5s]' },
      { c: 'R7: Disparo de emergencia por incendio B006 (120 s) al alcanzar 5 s', s: ['B002'], o: '[Barrido B006 | 120s]' },
      { c: 'R8: Generador de impulsos asíncrono B007 (0.5 Hz) habilitado por B006', s: ['B006'], o: '[Async B007 | 1s/1s]' },
      { c: 'R9: Salida de luz general Q1 gobernada por pulso simple B004 o parpadeo B007', p: [['B004'], ['B007']], o: 'Q1' },
      { c: 'R10: Salida de alarma Q2 gobernada por cabina [B005 · /B006] o parpadeo B007', p: [['B005', '/B006'], ['B007']], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      const soltoI1 = S.eraI1 && !I.I1;
      S.eraI1 = Boolean(I.I1);
      if (I.I1) {
        S.presion = (S.presion || 0) + dt;
        if (S.presion >= 5 && !S.disparo5) {
          S.disparo5 = true; S.m2 = false; S.tEmergencia = 120; S.tReloj = 0;
        } else if (S.disparo5 && (S.tEmergencia || 0) > 0) {
          S.tReloj = (S.tReloj || 0) + dt;
        }
      } else {
        if (S.presion > 0 && S.presion < 2) S.tSimple = 20;
        else if (S.presion >= 2 && S.presion < 5) S.m2 = true;
        S.presion = 0; S.disparo2 = false; S.disparo5 = false;
        if ((S.tEmergencia || 0) > 0) S.tReloj = (S.tReloj || 0) + dt;
      }
      const emergencia = (S.tEmergencia || 0) > 0;
      const cicloReloj = emergencia && Math.floor(S.tReloj || 0) % 2 === 0;
      S.info = S.presion > 0 ? `Presión continua: ${S.presion.toFixed(1)} s` : (emergencia ? `🔥 EMERGENCIA INCENDIO: ${S.tEmergencia.toFixed(0)} s` : (S.m2 ? 'Alarma cabina activa' : ''));
      if (S.tSimple > 0) S.tSimple = Math.max(0, S.tSimple - dt);
      if (S.tEmergencia > 0) S.tEmergencia = Math.max(0, S.tEmergencia - dt);
      const b4 = (S.tSimple || 0) > 0;
      const b5 = Boolean(S.m2);
      return {
        Q1: Boolean(emergencia ? cicloReloj : b4),
        Q2: Boolean(emergencia ? cicloReloj : b5),
        B001: Boolean(S.presion >= 2),
        B002: Boolean(S.presion >= 5 || emergencia),
        B003: Boolean(soltoI1),
        B004: b4,
        B005: b5,
        B006: emergencia,
        B007: Boolean(emergencia && cicloReloj)
      };
    }
  },
  {
    n: '4.8',
    t: 'Control de Acceso a Estacionamiento',
    q: 'Gestionar una playa con capacidad para 50 vehículos. Controlar barrera de entrada/salida y emisión de tickets. Al llegar a 50, bloquear entrada y activar cartel "COMPLETO" (Q3).',
    io: [
      ['I1', 'Sensor de carril de entrada', 'NA', 'Vehículo posicionado en la entrada'],
      ['I2', 'Sensor de carril de salida', 'NA', 'Vehículo posicionado en la salida'],
      ['I3', 'Pulsador de reset manual de cupos', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Motor de barrera de entrada', 'Digital / Relé', 'Salida energizada (abre barrera por 3 s)'],
      ['Q2', 'Motor de barrera de salida', 'Digital / Relé', 'Salida energizada (abre barrera por 3 s)'],
      ['Q3', 'Cartel luminoso "COMPLETO"', 'Digital / Relé', 'Salida energizada al alcanzar 50 vehículos'],
      ['Q4', 'Dispensador de tickets', 'Digital / Relé', 'Salida energizada (emite ticket por 1 s)']
    ],
    soft: [
      ['B001', 'Contador adelante/atrás', 'Balance vehicular neto (Limit = 50)'],
      ['B002', 'Relé de barrido', 'Temporización apertura barrera entrada Q1 (3 s)'],
      ['B003', 'Relé de barrido', 'Temporización emisión de ticket Q4 (1 s)'],
      ['B004', 'Relé de barrido', 'Temporización apertura barrera salida Q2 (3 s)']
    ],
    eq: [
      'B001_Cnt = (I1 · NOT(B001)) + I2',
      'B001_Dir = I2',
      'B001_R = I3',
      'Q3 = B001  (Activo cuando valor actual >= 50)',
      'Q1 = Barrido(I1 · NOT(B001), 3 s) ; Q4 = Barrido(I1 · NOT(B001), 1 s)',
      'Q2 = Barrido(I2, 3 s)'
    ],
    sol: 'Gestión de capacidad basada en el bloque nativo de Siemens LOGO! Contador adelante/atrás (B001) prefijado en 50 unidades. LOGO! posee una única entrada de pulsos Cnt y un borne de dirección Dir (0 = incremento, 1 = decremento). El borne Cnt recibe en paralelo los pulsos de ingreso con cupo libre (I1 · NOT B001) y los de egreso (I2), mientras que Dir es excitado por I2 para descontar del balance. Al llegar a 50 vehículos, B001 enciende el cartel Q3 e inhibe nuevos ingresos. Los relés de barrido gobiernan las barreras B002/B004 (3 s) y ticket B003 (1 s).',
    e: '¿Cómo opera el contador adelante/atrás nativo de Siemens LOGO!? En LOGO! el bloque no dispone de entradas CU y CD separadas, sino de una entrada de conteo Cnt y un borne de dirección Dir. Los pulsos de ingreso (I1 · /B001) y egreso (I2) se conectan en paralelo a Cnt, mientras que el sensor I2 comanda Dir para restar rodados. Al alcanzar 50 vehículos, B001 activa el cartel Q3 e inhibe el ingreso.',
    i: [['I1', 'Auto entrada', 'p'], ['I2', 'Auto salida', 'p'], ['I3', 'Reset cupos', 'p']],
    o: ['Q1', 'Q2', 'Q3', 'Q4'],
    r: [
      { c: 'R1: Entrada de pulsos Cnt en Contador B001 (PV=50) desde ingreso (/B001) o egreso I2', p: [['I1', '/B001'], ['I2']], o: 'B001 (Cnt)' },
      { c: 'R2: Selección de dirección Dir en Contador B001 desde sensor de egreso I2 (resta)', s: ['I2'], o: 'B001 (Dir)' },
      { c: 'R3: Reset manual del contador B001 desde pulsador I3', s: ['I3'], o: 'B001 (R)' },
      { c: 'R4: Cartel COMPLETO Q3 activado por salida del contador B001', s: ['B001'], o: 'Q3' },
      { c: 'R5: Apertura de barrera de entrada B002 (3 s) por pulso en entrada', s: ['I1', '/B001'], o: '[Barrido B002 | 3s]' },
      { c: 'R6: Accionamiento de barrera de entrada Q1', s: ['B002'], o: 'Q1' },
      { c: 'R7: Emisión de ticket B003 (1 s) por vehículo ingresante', s: ['I1', '/B001'], o: '[Barrido B003 | 1s]' },
      { c: 'R8: Dispensador de ticket Q4', s: ['B003'], o: 'Q4' },
      { c: 'R9: Apertura de barrera de salida B004 (3 s) por vehículo saliente', s: ['I2'], o: '[Barrido B004 | 3s]' },
      { c: 'R10: Accionamiento de barrera de salida Q2', s: ['B004'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      const entrada = detectarFlancoAscendente(S, 'in', I.I1);
      const salida = detectarFlancoAscendente(S, 'out', I.I2);
      let cupo = S.c !== undefined ? S.c : 0;
      if (entrada && cupo < 50) { cupo++; S.tBarreraIn = 3; S.tTicket = 1; }
      if (salida) { S.tBarreraOut = 3; if (cupo > 0) cupo--; }
      if (I.I3) cupo = 0;
      S.c = cupo;
      S.info = `Ocupación: ${cupo} / 50 vehículos${cupo >= 50 ? ' [CARTEL COMPLETO ACTIVADO]' : ''}`;
      const completo = cupo >= 50;
      const res = {
        Q1: Boolean((S.tBarreraIn || 0) > 0),
        Q2: Boolean((S.tBarreraOut || 0) > 0),
        Q3: completo,
        Q4: Boolean((S.tTicket || 0) > 0),
        B001: completo,
        B002: Boolean((S.tBarreraIn || 0) > 0),
        B003: Boolean((S.tTicket || 0) > 0),
        B004: Boolean((S.tBarreraOut || 0) > 0),
        C1: completo,
        TP1: Boolean((S.tBarreraIn || 0) > 0),
        TP2: Boolean((S.tBarreraOut || 0) > 0),
        TP3: Boolean((S.tTicket || 0) > 0)
      };
      if (S.tBarreraIn > 0) S.tBarreraIn = Math.max(0, S.tBarreraIn - dt);
      if (S.tBarreraOut > 0) S.tBarreraOut = Math.max(0, S.tBarreraOut - dt);
      if (S.tTicket > 0) S.tTicket = Math.max(0, S.tTicket - dt);
      return res;
    }
  },
  ejercicioPorton4_9
];
