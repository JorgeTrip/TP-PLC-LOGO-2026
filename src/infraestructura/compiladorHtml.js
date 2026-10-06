/**
 * Compilador y empaquetador del HTML autocontenido final.
 * Capa de infraestructura.
 */
import fs from 'fs';
import path from 'path';
import { estilosCss } from '../presentacion/estilosGlobales.js';
import { estilosModalChangelogCss } from '../presentacion/estilosModalChangelog.js';
import { estilosGuiaLogoCss } from '../presentacion/estilosGuiaLogo.js';
import { generarEncabezadoHtml } from './plantillaHtml.js';
import { generarModalChangelogHtml, generarScriptModalChangelog } from './generadorModalChangelog.js';
import { generarScriptCliente } from './generadorScriptCliente.js';
import { generarCodigoMaquetasCliente } from './generadorCodigoMaquetas.js';
import { generarCatalogoCliente } from './generadorCatalogoCliente.js';
import { generarScriptSimulacion } from './generadorScriptSimulacion.js';

function obtenerDatosChangelog() {
  try {
    const rutaChangelog = path.resolve('changelog.json');
    if (fs.existsSync(rutaChangelog)) {
      return JSON.parse(fs.readFileSync(rutaChangelog, 'utf-8'));
    }
  } catch (err) {
    console.warn('⚠️ No se pudo leer changelog.json, usando listado vacío:', err.message);
  }
  return [];
}

export function compilarDocumentoHtml() {
  const changelogData = obtenerDatosChangelog();
  const estilosCompletos = [estilosCss, estilosModalChangelogCss, estilosGuiaLogoCss].join('\n');
  const encabezado = generarEncabezadoHtml(estilosCompletos);
  const modalChangelogHtml = generarModalChangelogHtml(changelogData);
  const scriptCliente = generarScriptCliente();
  const scriptMaquetas = generarCodigoMaquetasCliente();
  const scriptCatalogo = generarCatalogoCliente();
  const scriptModalChangelog = generarScriptModalChangelog(changelogData);
  const scriptSimulacion = generarScriptSimulacion();

  return [
    encabezado,
    modalChangelogHtml,
    scriptCliente,
    scriptMaquetas,
    scriptCatalogo,
    scriptModalChangelog,
    scriptSimulacion
  ].join('\n');
}

export function compilarYGuardarHtml(rutasSalida) {
  const contenidoHtml = compilarDocumentoHtml();
  for (const ruta of rutasSalida) {
    const dir = path.dirname(ruta);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ruta, contenidoHtml, 'utf-8');
    console.log(`📦 Archivo compilado exitosamente: ${ruta}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('compiladorHtml.js')) {
  const dirActual = path.resolve('.');
  const rutaDestinoDist = path.join(dirActual, 'dist', 'TP_PLC_LOGO_2026.html');
  const rutaDestinoIndex = path.join(dirActual, 'dist', 'index.html');
  const rutaDestinoOriginal = path.resolve('..', '2026 - Julio Rossini', 'TP 1. PLC', 'TP_PLC_LOGO_2026.html');
  compilarYGuardarHtml([rutaDestinoDist, rutaDestinoIndex, rutaDestinoOriginal]);
}
