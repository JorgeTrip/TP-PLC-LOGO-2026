/**
 * Catálogo de ejercicios de PLC LOGO!: Parte 2 (Ejercicios 4.7 a 4.11).
 * Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosParte2 = [
  {
    n: '4.7',
    t: 'Sistema de Alerta Multifunción',
    q: 'Lógica para un pulsador (I1): Presión simple: Q1 por 20s. Presión 2s: Alarma cabina Q2. Presión 5s: Parpadeo de emergencia (Q1 y Q2) a 0.5 Hz durante 2 min (incendio).',
    io: [
      ['I1', 'Pulsador multifunción N/A (Normal Abierto: discrimina tiempo de presión)'],
      ['Q1', 'Luz general / evacuación (enciende 20s en simple o parpadea en incendio)'],
      ['Q2', 'Alarma en cabina de seguridad (activa a los 2s o parpadea en incendio)'],
      ['T2', 'Temporizador TON (Timer On-Delay / Retardo a la conexión de 2 s para cabina)'],
      ['T5', 'Temporizador TON (Timer On-Delay / Retardo a la conexión de 5 s para incendio)'],
      ['M1–M4', 'Marcas internas M: M1 (TP 20s simple), M2 (alarma cabina), M3 (emergencia 120s), M4 (reloj asíncrono 0.5 Hz)']
    ],
    e: 'Presión < 2s dispara TP 20s para Q1 al soltar. Presión >= 2s activa Q2 (cabina). Presión >= 5s activa parpadeo síncrono 0.5 Hz (1s ON / 1s OFF) en Q1 y Q2 por 120s con prioridad.',
    i: [['I1', 'Pulsador multifunción', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Detección presión >= 2 s', s: ['I1', '[TON 2s]'], o: 'T2' },
      { c: 'Detección presión >= 5 s', s: ['I1', '[TON 5s]'], o: 'T5' },
      { c: 'Presión simple (soltar antes de 2 s)', s: ['[↓ I1]', '/T2', '[TP 20s]'], o: 'M1' },
      { c: 'Alarma cabina por pulsación 2 s', s: ['[↑ T2]', '[TP 20s]'], o: 'M2' },
      { c: 'Emergencia incendio 120 s', s: ['[↑ T5]', '[TP 120s]'], o: 'M3' },
      { c: 'Generador asíncrono 0.5 Hz (1 s ON / 1 s OFF)', s: ['M3', '[Async 1s/1s]'], o: 'M4' },
      { c: 'Luz principal / evacuación', p: [['M1'], ['M4']], o: 'Q1' },
      { c: 'Cabina / parpadeo de incendio', p: [['M2', '/M3'], ['M4']], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      if (I.I1) {
        S.presion = (S.presion || 0) + dt;
        if (S.presion >= 2 && !S.disparo2) { S.disparo2 = true; S.tCabina = 20; }
        if (S.presion >= 5 && !S.disparo5) {
          S.disparo5 = true; S.tEmergencia = 120; S.tReloj = 0;
        } else if (S.disparo5 && (S.tEmergencia || 0) > 0) {
          S.tReloj = (S.tReloj || 0) + dt;
        }
      } else {
        if (S.presion > 0 && S.presion < 2) S.tSimple = 20;
        S.presion = 0; S.disparo2 = false; S.disparo5 = false;
        if ((S.tEmergencia || 0) > 0) S.tReloj = (S.tReloj || 0) + dt;
      }
      const emergenciaActiva = (S.tEmergencia || 0) > 0;
      const cicloReloj = emergenciaActiva && Math.floor(S.tReloj || 0) % 2 === 0;
      S.info = S.presion > 0 ? `Presión continua: ${S.presion.toFixed(1)} s` : (emergenciaActiva ? `🔥 EMERGENCIA INCENDIO: ${S.tEmergencia.toFixed(0)} s` : '');
      const salidas = {
        Q1: Boolean(emergenciaActiva ? cicloReloj : (S.tSimple || 0) > 0),
        Q2: Boolean(emergenciaActiva ? cicloReloj : (S.tCabina || 0) > 0)
      };
      if (S.tSimple > 0) S.tSimple = Math.max(0, S.tSimple - dt);
      if (S.tCabina > 0) S.tCabina = Math.max(0, S.tCabina - dt);
      if (S.tEmergencia > 0) S.tEmergencia = Math.max(0, S.tEmergencia - dt);
      return salidas;
    }
  },
  {
    n: '4.8',
    t: 'Control de Acceso a Estacionamiento',
    q: 'Playa con capacidad para 50 vehículos. Controlar barrera entrada/salida y emisión de tickets. Al llegar a 50: bloquear entrada y activar cartel "COMPLETO" (Q3).',
    io: [
      ['I1', 'Sensor óptico de vehículo en entrada'],
      ['I2', 'Sensor óptico de vehículo en salida'],
      ['I3', 'Pulsador de Reset manual N/A (Normal Abierto: reinicia cupos a 0)'],
      ['Q1', 'Barrera motorizada de entrada (pulso TP 3s)'],
      ['Q2', 'Barrera motorizada de salida (pulso TP 3s)'],
      ['Q3', 'Cartel luminoso "COMPLETO"'],
      ['Q4', 'Dispensador de tickets (pulso TP 1s)'],
      ['C1', 'Contador CTUD (Count-Up/Down: contador bidireccional adelante/atrás 0–50)']
    ],
    e: 'Contador bidireccional 0–50. I1 suma si no está completo y abre barrera Q1 (3s) y ticket Q4 (1s). I2 resta y abre barrera Q2 (3s). A 50 se enciende Q3 y bloquea entrada.',
    i: [['I1', 'Auto entrada', 'p'], ['I2', 'Auto salida', 'p'], ['I3', 'Reset cupos', 'p']],
    o: ['Q1', 'Q2', 'Q3', 'Q4'],
    r: [
      { c: 'Barrera entrada con cupo disponible', s: ['I1', '/Q3', '[TP 3s]'], o: 'Q1' },
      { c: 'Emisión de ticket', s: ['I1', '/Q3', '[TP 1s]'], o: 'Q4' },
      { c: 'Barrera salida', s: ['I2', '[TP 3s]'], o: 'Q2' },
      { c: 'Contador bidireccional cupo 50', s: ['[UP/DOWN 0-50 · +=I1·/Q3 · -=I2 · R=I3]'], o: 'C1' },
      { c: 'Cartel luminoso COMPLETO', s: ['C1'], o: 'Q3' }
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
      const res = {
        Q1: Boolean((S.tBarreraIn || 0) > 0),
        Q2: Boolean((S.tBarreraOut || 0) > 0),
        Q3: Boolean(cupo >= 50),
        Q4: Boolean((S.tTicket || 0) > 0)
      };
      if (S.tBarreraIn > 0) S.tBarreraIn = Math.max(0, S.tBarreraIn - dt);
      if (S.tBarreraOut > 0) S.tBarreraOut = Math.max(0, S.tBarreraOut - dt);
      if (S.tTicket > 0) S.tTicket = Math.max(0, S.tTicket - dt);
      return res;
    }
  },
  {
    n: '4.9',
    t: 'Automatización de Portón Levadizo',
    q: 'Controlar portón con un único pulsador (I1): Ciclo Abrir - Parar - Cerrar - Parar. Finales de carrera I2 e I3 (ambos N/C) detienen motor en extremos.',
    io: [
      ['I1', 'Pulsador único de comando N/A (Normal Abierto: avanza la secuencia)'],
      ['I2', 'Final de carrera FC ABIERTO N/C (Normal Cerrado: abre al llegar al tope superior)'],
      ['I3', 'Final de carrera FC CERRADO N/C (Normal Cerrado: abre al llegar al tope inferior)'],
      ['Q1', 'Motor sentido abrir portón'],
      ['Q2', 'Motor sentido cerrar portón'],
      ['M0–M3', 'Marcas internas M: etapas secuenciales (0: cerrado, 1: abriendo, 2: abierto, 3: cerrando)']
    ],
    e: 'Máquina de 4 estados con marcas: 0 (Parado-cerrado), 1 (Abriendo), 2 (Parado-abierto), 3 (Cerrando). Cada flanco de I1 avanza ciclo; finales N/C llevan a paro de extremo.',
    i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Avance a apertura M1', s: ['M0', '[↑ I1]'], o: 'S M1' },
      { c: 'Paro apertura por I1 o fin carrera abierto', p: [['M1', '[↑ I1]'], ['M1', '/I2']], o: 'S M2' },
      { c: 'Avance a cierre M3', s: ['M2', '[↑ I1]'], o: 'S M3' },
      { c: 'Paro cierre por I1 o fin carrera cerrado', p: [['M3', '[↑ I1]'], ['M3', '/I3']], o: 'S M0' },
      { c: 'Motor abrir portón', s: ['M1'], o: 'Q1' },
      { c: 'Motor cerrar portón', s: ['M3'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      let estado = S.s !== undefined ? S.s : 0;
      if (detectarFlancoAscendente(S, 'btn', I.I1)) estado = (estado + 1) % 4;
      if (estado === 1 && !I.I2) estado = 2;
      if (estado === 3 && !I.I3) estado = 0;
      S.s = estado;
      const etiquetas = ['Parado (cerrado) - Próximo: ABRIR', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto) - Próximo: CERRAR', 'CERRANDO PORTÓN (Q2)'];
      S.info = etiquetas[estado];
      return { Q1: estado === 1, Q2: estado === 3 };
    }
  },
  {
    n: '4.10',
    t: 'Control de Nivel de Tanque con Bombas en Cascada',
    q: 'Tanque con dos bombas (Q1 y Q2). S1 (Nivel mínimo), S2 (Nivel crítico inferior), S3 (Nivel máximo). S1 arranca Q1; si baja a S2 arranca Q2. S3 apaga ambas. PE (I4, N/C) detención instantánea.',
    io: [
      ['I1', 'Sensor S1 (Flotante de nivel mínimo: arranca bomba principal Q1)'],
      ['I2', 'Sensor S2 (Flotante de nivel crítico inferior: suma bomba auxiliar Q2)'],
      ['I3', 'Sensor S3 (Flotante de nivel máximo: corta ambas bombas)'],
      ['I4', 'Pulsador PE (Parada de Emergencia tipo hongo N/C: Normal Cerrado fail-safe)'],
      ['Q1', 'Bomba principal de llenado'],
      ['Q2', 'Bomba auxiliar de refuerzo']
    ],
    e: 'Lógica de llenado en cascada: S1 arranca Q1 con autorretención; S2 suma Q2 con autorretención. S3 abre /I3 apagando ambas. PE (I4 N/C) desenergiza todo al instante.',
    i: [['I1', 'S1 Mínimo', 's'], ['I2', 'S2 Crítico', 's'], ['I3', 'S3 Máximo', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Bomba principal con autorretención', p: [['I1'], ['Q1']], s: ['/I3', 'I4'], o: 'Q1' },
      { c: 'Bomba auxiliar con autorretención', p: [['I2'], ['Q2']], s: ['/I3', 'I4'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      S.q1 = Boolean((I.I1 || S.q1) && !I.I3 && I.I4);
      S.q2 = Boolean((I.I2 || S.q2) && !I.I3 && I.I4);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA ACCIONADA' : `Bombas en marcha: ${S.q1 ? 'Q1' : ''}${S.q1 && S.q2 ? ' + ' : ''}${S.q2 ? 'Q2' : (!S.q1 ? 'Ninguna (Nivel adecuado)' : '')}`;
      return { Q1: S.q1, Q2: S.q2 };
    }
  },
  {
    n: '4.11',
    t: 'Alternancia de Bombas para Reparto de Carga',
    q: 'Control de dos bombas (Q1 y Q2) para igualar horas de uso. Entrada I1 (Flotante demanda N/A). Cada ciclo arranca la bomba que no trabajó en el ciclo anterior. Seguridad: PE (I4 N/C).',
    io: [
      ['I1', 'Sensor flotante de demanda N/A (Normal Abierto: activa ciclo de bombeo)'],
      ['I4', 'Pulsador PE (Parada de Emergencia tipo hongo N/C: Normal Cerrado fail-safe)'],
      ['Q1', 'Bomba 1 de impulsión cloacal'],
      ['Q2', 'Bomba 2 de impulsión cloacal'],
      ['F', 'Marca interna Toggle (Relé de impulsos biestable divisor de frecuencia para alternancia)']
    ],
    e: 'Relé de pulsos conmuta marca F en el flanco descendente de I1 (al finalizar bombeo). Q1 = I1 · /F · I4; Q2 = I1 · F · I4. PE corta ambas.',
    i: [['I1', 'Flotante demanda', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Conmutación de alternancia al descender demanda', s: ['[↓ I1]', '[Toggle]'], o: 'F' },
      { c: 'Bomba 1 habilitada en ciclo par', s: ['I1', '/F', 'I4'], o: 'Q1' },
      { c: 'Bomba 2 habilitada en ciclo impar', s: ['I1', 'F', 'I4'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      if (S.previoDemanda && !I.I1) S.f = !S.f;
      S.previoDemanda = Boolean(I.I1);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA' : `Turno asignado: ${S.f ? 'Bomba 2 (Q2)' : 'Bomba 1 (Q1)'}`;
      return {
        Q1: Boolean(I.I1 && !S.f && I.I4),
        Q2: Boolean(I.I1 && Boolean(S.f) && I.I4)
      };
    }
  }
];
