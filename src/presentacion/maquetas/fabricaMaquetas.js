/**
 * Fábrica de gemelos visuales temáticos.
 * Despacha el renderizador específico para cada ejercicio.
 */
import { maquetaMotor4_1, maquetaMotor4_2, maquetaMotor4_3 } from './maquetaMotores.js';
import { maquetaPasillo4_4, maquetaCinta4_5, maquetaSeguridad4_6, maquetaAlarma4_7 } from './maquetaSistemas1.js';
import { maquetaEstacionamiento4_8, maquetaPorton4_9, maquetaTanque4_10, maquetaAlternancia4_11 } from './maquetaSistemas2.js';

export function renderizarMaquetaTematica(id, estado, salidas) {
  switch (id) {
    case '4.1': return maquetaMotor4_1(estado, salidas);
    case '4.2': return maquetaMotor4_2(estado, salidas);
    case '4.3': return maquetaMotor4_3(estado, salidas);
    case '4.4': return maquetaPasillo4_4(estado, salidas);
    case '4.5': return maquetaCinta4_5(estado, salidas);
    case '4.6': return maquetaSeguridad4_6(estado, salidas);
    case '4.7': return maquetaAlarma4_7(estado, salidas);
    case '4.8': return maquetaEstacionamiento4_8(estado, salidas);
    case '4.9': return maquetaPorton4_9(estado, salidas);
    case '4.10': return maquetaTanque4_10(estado, salidas);
    case '4.11': return maquetaAlternancia4_11(estado, salidas);
    default: return '';
  }
}
