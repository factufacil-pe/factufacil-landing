import { test, expect, type Page } from '@playwright/test';

const BTN        = '#ff-chat-btn';
const PANEL      = '#ff-chat-panel';
const INPUT      = '#ff-input';
const SEND       = '#ff-send';
const MSGS       = '#ff-messages';
const CLOSE      = '#ff-panel-close';
const ICON_CHAT  = '#ff-icon-chat';
const ICON_CLOSE = '#ff-icon-close';

const CHAT_API = 'http://localhost:8000';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function openChat(page: Page) {
  await page.click(BTN);
  await expect(page.locator(PANEL)).toBeVisible();
}

async function sendMessage(page: Page, text: string) {
  await page.fill(INPUT, text);
  await page.click(SEND);
}

/**
 * Espera que el ciclo completo de send() termine:
 * fetch → sessionId → localStorage.setItem → appendBot → setLoading(false).
 * Cuando SEND vuelve a estar habilitado, todo eso ya ocurrió.
 */
async function waitForBotReply(page: Page) {
  await expect(page.locator(SEND)).toBeEnabled({ timeout: 30_000 });
}

// ── Grupo 1: UI pura (con API mockeada) ───────────────────────────────────────

test.describe('Chat widget — UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.route(`${CHAT_API}/chat`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session_id: 'mock-session-123',
          answer: 'Respuesta de prueba del asistente.',
          sources: [],
          message_count: 1,
        }),
      }),
    );

    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('ff_session'));
  });

  test('el botón flotante es visible en la página', async ({ page }) => {
    await expect(page.locator(BTN)).toBeVisible();
  });

  test('el panel está oculto por defecto', async ({ page }) => {
    await expect(page.locator(PANEL)).toBeHidden();
  });

  test('click en el botón abre el panel', async ({ page }) => {
    await page.click(BTN);
    await expect(page.locator(PANEL)).toBeVisible();
  });

  test('el ícono cambia al abrir', async ({ page }) => {
    await expect(page.locator(ICON_CHAT)).toBeVisible();
    await expect(page.locator(ICON_CLOSE)).toBeHidden();
    await page.click(BTN);
    await expect(page.locator(ICON_CHAT)).toBeHidden();
    await expect(page.locator(ICON_CLOSE)).toBeVisible();
  });

  test('segundo click cierra el panel', async ({ page }) => {
    await page.click(BTN);
    await expect(page.locator(PANEL)).toBeVisible();
    await page.click(BTN);
    await expect(page.locator(PANEL)).toBeHidden();
  });

  test('el botón X cierra el panel', async ({ page }) => {
    await page.click(BTN);
    await page.click(CLOSE);
    await expect(page.locator(PANEL)).toBeHidden();
  });

  test('se muestra el mensaje de bienvenida al abrir', async ({ page }) => {
    await openChat(page);
    await expect(page.locator(MSGS).locator('div').first()).toContainText('Hola');
  });

  test('el input recibe foco al abrir el panel', async ({ page }) => {
    await openChat(page);
    await expect(page.locator(INPUT)).toBeFocused();
  });

  test('no envía mensaje vacío', async ({ page }) => {
    await openChat(page);
    const before = await page.locator(`${MSGS} > div`).count();
    await page.click(SEND);
    // El count no debe cambiar (sin llamada a la API)
    await expect(page.locator(`${MSGS} > div`)).toHaveCount(before);
  });

  test('el input se limpia después de enviar', async ({ page }) => {
    await openChat(page);
    await page.fill(INPUT, 'probando');
    await page.click(SEND);
    // input.value = '' es síncrono dentro de send(), antes del await fetch
    await expect(page.locator(INPUT)).toHaveValue('');
  });

  test('Enter envía el mensaje y el bot responde', async ({ page }) => {
    await openChat(page);
    await page.fill(INPUT, 'hola desde enter');
    await page.press(INPUT, 'Enter');
    // Esperar que el ciclo completo termine (user + bot)
    await waitForBotReply(page);
    // El input debe estar vacío y el send habilitado
    await expect(page.locator(INPUT)).toHaveValue('');
    await expect(page.locator(SEND)).toBeEnabled();
  });

  test('botón enviar está deshabilitado mientras espera respuesta', async ({ page }) => {
    // Override con respuesta con delay para capturar el estado de carga
    await page.route(`${CHAT_API}/chat`, async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session_id: 'mock-session-123',
          answer: 'Respuesta demorada.',
          sources: [],
          message_count: 1,
        }),
      });
    });

    await openChat(page);
    await page.fill(INPUT, 'test loading');
    await page.click(SEND);

    await expect(page.locator(SEND)).toBeDisabled();
    await expect(page.locator(SEND)).toBeEnabled({ timeout: 5000 });
  });

  test('muestra la respuesta del bot en una burbuja', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, '¿qué planes tienen?');
    await waitForBotReply(page);
    await expect(page.locator(`${MSGS} > div`).last()).toContainText('Respuesta de prueba del asistente.');
  });

  test('el session_id se guarda en localStorage', async ({ page }) => {
    await openChat(page);
    await sendMessage(page, 'hola');
    await waitForBotReply(page);
    const sessionId = await page.evaluate(() => localStorage.getItem('ff_session'));
    expect(sessionId).toBe('mock-session-123');
  });

});

// ── Grupo 2: Integración real con API ─────────────────────────────────────────

test.describe('Chat widget — integración con API', () => {

  test.beforeEach(async ({ page }) => {
    const up = await page.request.get(`${CHAT_API}/health`).catch(() => null);
    if (!up || !up.ok()) test.skip();

    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('ff_session'));
    await openChat(page);
  });

  test('responde a una pregunta sobre planes', async ({ page }) => {
    await sendMessage(page, '¿Cuáles son los planes disponibles?');
    await waitForBotReply(page);
    await expect(page.locator(`${MSGS} > div`).last()).not.toContainText('no pude conectarme');
  });

  test('responde a una pregunta sobre precios', async ({ page }) => {
    await sendMessage(page, '¿Cuánto cuesta el plan PRO?');
    await waitForBotReply(page);
    await expect(page.locator(`${MSGS} > div`).last()).not.toContainText('no pude conectarme');
  });

  test('responde a una pregunta sobre SUNAT', async ({ page }) => {
    await sendMessage(page, '¿Está integrado con SUNAT?');
    await waitForBotReply(page);
    await expect(page.locator(`${MSGS} > div`).last()).not.toContainText('no pude conectarme');
  });

  test('guarda el session_id en localStorage después de la primera respuesta', async ({ page }) => {
    await sendMessage(page, '¿Qué es FactuFácil?');
    await waitForBotReply(page);
    const sessionId = await page.evaluate(() => localStorage.getItem('ff_session'));
    expect(sessionId).not.toBeNull();
    expect(sessionId!.length).toBeGreaterThan(10);
  });

  test('mantiene contexto entre dos mensajes de la misma sesión', async ({ page }) => {
    await sendMessage(page, '¿Cuáles son los planes?');
    await waitForBotReply(page);

    await sendMessage(page, '¿Y cuál de esos es el más barato?');
    await waitForBotReply(page);

    await expect(page.locator(`${MSGS} > div`).last()).not.toContainText('no pude conectarme');
  });

});
