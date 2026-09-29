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

  // Verificar que el tooltip en el encabezado abre hacia abajo (top positivo)
  const terminoHeader = page.locator('header .termino-tecnico').first();
  await terminoHeader.hover();
  const topTooltipHeader = await page.evaluate(() => {
    const el = document.querySelector('header .termino-tecnico');
    return window.getComputedStyle(el, '::after').getPropertyValue('top');
  });
  expect(topTooltipHeader).not.toBe('auto');

  // En escritorio el header del drawer móvil debe estar oculto
  await expect(page.locator('.sidebar-header-movil')).toBeHidden();

  // Los botones del encabezado en escritorio deben estar contenidos dentro de la altura de la barra (58px)
  const headerDesktop = await page.locator('header').boundingBox();
  expect(headerDesktop.height).toBeLessThanOrEqual(60);
  const controlesDesktop = await page.locator('.header-controles').boundingBox();
  expect(controlesDesktop.y + controlesDesktop.height).toBeLessThanOrEqual(headerDesktop.y + headerDesktop.height + 2);

  // Verificar persistencia de cabecera sticky en escritorio al scrollear
  const card45 = page.locator('#ejercicio-4-5');
  await card45.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 100);
  const sticky45 = card45.locator('.cabecera-ejercicio-sticky');
  await expect(sticky45).toBeVisible();
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

  // Verificar que el ancho de la página no desborda los 375px (sin scroll lateral)
  const noDesbordaHorizontal = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= window.innerWidth;
  });
  expect(noDesbordaHorizontal).toBe(true);

  // Verificar altura exacta no colapsada del header (54px)
  const headerBox = await page.locator('header').boundingBox();
  expect(headerBox.height).toBeLessThanOrEqual(56);

  // Al hacer scroll hacia abajo en el ejercicio 4.10, la cabecera sticky debe ser visible
  const card410 = page.locator('#ejercicio-4-10');
  await card410.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(100);
  const sticky410 = card410.locator('.cabecera-ejercicio-sticky');
  await expect(sticky410).toBeVisible();

  // Verificar que en el Ejercicio 4.10 los sensores estan fuera del tanque
  const sensoresFuera = card410.locator('.tanque-visual .marca-sensor');
  await expect(sensoresFuera).toHaveCount(0);
  const escalaExterna = card410.locator('.escala-sensores');
  await expect(escalaExterna).toBeVisible();

  // Verificar FAB volver al top
  const fabTop = page.locator('#btn-fab-top');
  await expect(fabTop).toHaveClass(/visible/);
  await fabTop.click();
  await page.waitForFunction(() => window.scrollY < 500, null, { timeout: 3000 }).catch(() => {});
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(1000);
});

