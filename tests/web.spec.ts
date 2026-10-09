import { test, expect } from '@playwright/test';

const articleUrl = process.env.KUMPARAN_ARTICLE_URL || '/umi-tusiana/bukan-sekadar-angka-analisis-statistik-membantu-bisnis-menentukan-arah-usahanya-28KQBr5v1aZ';

test.describe('Kumparan - public website', () => {
  test('WEB-001: homepage loads and primary navigation is usable', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/kumparan/i);
    await expect(page.getByText('Masuk', { exact: true })).toBeVisible();
    await expect(page.getByText('Buat Tulisan', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/Cari di sini/i)).toBeVisible();
  });

  test('WEB-002: search input accepts a keyword and shows search state', async ({ page }) => {
    await page.goto('/');
    const search = page.getByPlaceholder(/Cari di sini/i);
    await search.fill('data');
    await search.press('Enter');
    await expect(page).toHaveURL(/\/search\/data/i);
    await expect(page.getByText(/Hasil Pencarian/i)).toBeVisible();
  });

  test('WEB-003: article content is rendered and contains story paragraphs', async ({ page }) => {
    await page.goto(articleUrl);
    await expect(page.getByRole('heading', { name: /Bukan Sekadar Angka/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('main p').first()).toBeVisible({ timeout: 15_000 });
  });

  test('WEB-004: unauthenticated user is prevented from performing protected interactions', async ({ page }) => {
    await page.goto(articleUrl);
    const like = page.getByRole('button', { name: /suka|like/i }).first();
    if (await like.count()) {
      await like.click();
      await expect(page.getByText(/masuk|login/i).first()).toBeVisible();
    } else {
      test.info().annotations.push({ type: 'note', description: 'Like control was not exposed as a button in the current DOM.' });
    }
  });

  test('WEB-005: share/report controls are visible without submitting a report', async ({ page }) => {
    await page.goto(articleUrl);
    const body = page.locator('body');
    await expect(body).toContainText(/bagikan|share/i);
    await expect(body).toContainText(/laporkan|report/i);
  });

  test('WEB-006: mobile viewport keeps core navigation usable', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile project only');
    await page.goto('/');
    await expect(page).toHaveTitle(/kumparan/i);
    await expect(page.getByPlaceholder(/Cari di sini/i)).toBeVisible();
  });
});

test.describe('Kumparan - authentication dependency', () => {
  test('AUTH-001: active account can log in and log out', async ({ page }) => {
    test.skip(!process.env.KUMPARAN_EMAIL || !process.env.KUMPARAN_PASSWORD,
      'Requires recruiter-provided active test credentials. Do not commit credentials.');
    await page.goto('/');
    await page.getByText('Masuk', { exact: true }).click();
    // The current public flow may use Google/Facebook authentication.
    // If the supplied test environment exposes email/password fields, fill them here.
    const email = page.getByLabel(/email/i);
    const password = page.getByLabel(/password|kata sandi/i);
    test.skip(!(await email.count()) || !(await password.count()),
      'Current kumparan login UI does not expose email/password fields. Verify supported auth flow with product owner.');
    await email.fill(process.env.KUMPARAN_EMAIL!);
    await password.fill(process.env.KUMPARAN_PASSWORD!);
    await page.getByRole('button', { name: /masuk|login/i }).click();
    await expect(page.getByText(/keluar|logout/i)).toBeVisible({ timeout: 15_000 });
    await page.getByText(/keluar|logout/i).click();
    await expect(page.getByText('Masuk', { exact: true })).toBeVisible();
  });

  test('AUTH-002: invalid account is rejected with a clear error', async ({ page }) => {
    test.skip(true, 'Blocked by current authentication mechanism: test requires an invalid account and a supported credential-based login flow.');
  });
});
