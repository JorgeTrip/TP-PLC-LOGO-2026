/**
 * Pruebas unitarias para el componente y generador del Modal de Historial de Cambios (CI/CD).
 */
import { describe, it, expect } from 'vitest';
import { generarModalChangelogHtml, generarScriptModalChangelog } from '../src/infraestructura/generadorModalChangelog.js';
import { compilarDocumentoHtml } from '../src/infraestructura/compiladorHtml.js';

describe('Modal de Historial de Cambios (CI/CD)', () => {
  const datosPrueba = [
    {
      version: '1.16.0',
      fecha: '2026-10-06',
      tipo: 'feat',
      titulo: 'Se agrega modal de Historial de Cambios',
      cambios: ['Se añade botón en sidebar', 'Se implementa modal interactivo']
    },
    {
      version: '1.15.4',
      fecha: '2026-10-06',
      tipo: 'fix',
      titulo: 'Correcciones de autorretención',
      cambios: ['Ajuste de marcas']
    }
  ];

  it('debe generar la estructura HTML accesible del modal con metadatos de versiones', () => {
    const html = generarModalChangelogHtml(datosPrueba);

    expect(html).toContain('id="modal-changelog"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('id="btn-cerrar-changelog"');
    expect(html).toContain('id="input-buscar-changelog"');
    expect(html).toContain('id="btn-exportar-changelog-json"');
    expect(html).toContain('2 versiones');
    expect(html).toContain('Última: v1.16.0');
  });

  it('debe generar el script cliente con los datos embebidos para navegación offline', () => {
    const script = generarScriptModalChangelog(datosPrueba);

    expect(script).toContain('<script>');
    expect(script).toContain('1.16.0');
    expect(script).toContain('alternarModal');
    expect(script).toContain('renderizarItems');
    expect(script).toContain('btnExportar');
  });

  it('debe compilar el documento HTML integrando el botón en sidebar y el modal', () => {
    const htmlCompilado = compilarDocumentoHtml();

    expect(htmlCompilado).toContain('id="btn-abrir-changelog"');
    expect(htmlCompilado).toContain('class="btn-sidebar-changelog"');
    expect(htmlCompilado).toContain('id="modal-changelog"');
    expect(htmlCompilado).toContain('modal-changelog-overlay');
  });
});
