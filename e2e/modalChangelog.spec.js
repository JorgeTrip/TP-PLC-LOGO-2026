/**
 * Pruebas End-to-End con Playwright para el modal de Historial de Cambios (CI/CD).
 * Valida apertura, visualización de versiones, búsqueda y accesibilidad.
 */
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Modal Historial de Cambios CI/CD', () => {
  test('Debe abrir el modal desde el sidebar, filtrar versiones y cerrarse correctamente', async ({ page }) => {
    const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
    await page.goto(`file://${rutaHtml}`);

    const btnAbrir = page.locator('#btn-abrir-changelog');
    await expect(btnAbrir).toBeVisible();
    await expect(btnAbrir).toContainText('Historial de Cambios');

    const modal = page.locator('#modal-changelog');
    await expect(modal).not.toHaveClass(/activo/);

    // Abrir modal
    await btnAbrir.click();
    await expect(modal).toHaveClass(/activo/);
    await expect(modal.locator('#modal-changelog-titulo')).toContainText('Historial de Cambios (CI/CD)');

    // Verificar que existen artículos de versiones renderizados
    const items = modal.locator('.item-changelog');
    const cantidadItems = await items.count();
    expect(cantidadItems).toBeGreaterThan(5);

    // Probar filtrado en tiempo real con el buscador
    const inputBuscar = modal.locator('#input-buscar-changelog');
    await inputBuscar.fill('1.15.4');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('1.15.4');

    // Limpiar búsqueda y verificar restauración de items
    await inputBuscar.fill('');
    await expect(items).toHaveCount(cantidadItems);

    // Cerrar modal con botón de cierre
    const btnCerrar = modal.locator('#btn-cerrar-changelog');
    await btnCerrar.click();
    await expect(modal).not.toHaveClass(/activo/);

    // Reabrir y cerrar con tecla Escape (WCAG 2.1 AA)
    await btnAbrir.click();
    await expect(modal).toHaveClass(/activo/);
    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/activo/);
  });
});
