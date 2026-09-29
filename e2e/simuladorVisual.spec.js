/**
 * Prueba End-to-End con Playwright para la plataforma interactiva del TP PLC 2026.
 * Valida la renderización visual de diagramas Ladder, maquetas y reactividad.
 */
import { test, expect } from '@playwright/test';
import path from 'path';

test('Debe cargar la plataforma y renderizar los 11 ejercicios con diagramas Ladder y controles', async ({ page }) => {
  const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
  await page.goto(`file://${rutaHtml}`);

  // Verificar título del encabezado
  await expect(page.locator('header h1')).toContainText('TP PLC Siemens LOGO! 2026');

  // Verificar que existen 11 tarjetas de ejercicios con cabecera sticky de enunciado
  const tarjetas = page.locator('#contenedor-ejercicios section.card');
  await expect(tarjetas).toHaveCount(11);

  const cabecerasSticky = page.locator('.cabecera-ejercicio-sticky');
  await expect(cabecerasSticky).toHaveCount(11);

  // Verificar que cada cabecera contiene el enunciado (.q)
  const primerEnunciado = cabecerasSticky.first().locator('.q');
  await expect(primerEnunciado).toBeVisible();

  // Verificar que cada ejercicio tiene su SVG Ladder renderizado
  const svgs = page.locator('svg.ladder-svg');
  await expect(svgs).toHaveCount(11);

  // Verificar tooltips en enlaces de ejercicios de la barra lateral
  const enlaceConTooltip = page.locator('.sidebar-link[href="#ejercicio-4-1"]');
  await expect(enlaceConTooltip).toHaveAttribute('data-tooltip', /4\.1/);

  // Verificar presencia de términos técnicos interactivos con data-tooltip
  const terminosTecnicos = page.locator('.termino-tecnico');
  const cantidadTerminos = await terminosTecnicos.count();
  expect(cantidadTerminos).toBeGreaterThan(5);
});

test('Debe optimizar la experiencia en móvil con drawer lateral y controles táctiles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
  await page.goto(`file://${rutaHtml}`);

  // En móvil el botón de menú debe estar visible
  const btnMenu = page.locator('#btn-menu-movil');
  await expect(btnMenu).toBeVisible();

  const sidebar = page.locator('#sidebar-principal');
  await expect(sidebar).not.toHaveClass(/abierto/);

  // Abrir menú drawer
  await btnMenu.click();
  await expect(sidebar).toHaveClass(/abierto/);

  // Al hacer clic en un ejercicio, debe cerrar el drawer automáticamente
  const enlace42 = sidebar.locator('a[href="#ejercicio-4-2"]');
  await enlace42.click();
  await expect(sidebar).not.toHaveClass(/abierto/);
});

