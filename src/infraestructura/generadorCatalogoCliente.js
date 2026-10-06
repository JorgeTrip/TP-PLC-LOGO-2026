/**
 * Generador de la definición de catálogo de ejercicios para el cliente.
 * Capa de infraestructura.
 */
import { catalogoEjercicios } from '../dominio/catalogoEjercicios.js';
import { obtenerGuiaLogo } from '../dominio/guiasLogo.js';

export function generarCatalogoCliente() {
  const serializados = catalogoEjercicios.map(ej => {
    return `  {
    n: ${JSON.stringify(ej.n)},
    t: ${JSON.stringify(ej.t)},
    q: ${JSON.stringify(ej.q)},
    io: ${JSON.stringify(ej.io)},
    soft: ${JSON.stringify(ej.soft || [])},
    eq: ${JSON.stringify(ej.eq || [])},
    sol: ${JSON.stringify(ej.sol || '')},
    e: ${JSON.stringify(ej.e)},
    guiaLogo: ${JSON.stringify(obtenerGuiaLogo(ej.n))},
    i: ${JSON.stringify(ej.i)},
    o: ${JSON.stringify(ej.o)},
    r: ${JSON.stringify(ej.r)},
    ejecutar: ${ej.ejecutar.toString()}
  }`;
  });

  return `
<script>
  function detectarFlancoAscendente(estado, clave, valorActual) {
    const k = '_flanco_' + clave;
    const f = Boolean(valorActual && !estado[k]);
    estado[k] = Boolean(valorActual);
    return f;
  }
  const catalogoEjerciciosPlc = [
${serializados.join(',\n')}
  ];
</script>
`;
}
