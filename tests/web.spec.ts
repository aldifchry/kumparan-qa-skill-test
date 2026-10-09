import { test, expect } from '@playwright/test';

const articleUrl =
  process.env.KUMPARAN_ARTICLE_URL ||
  '/umi-tusiana/bukan-sekadar-angka-analisis-statistik-membantu-bisnis-menentukan-arah-usahanya-28KQBr5v1aZ';

const accessBlockedMessage =
  "Sorry, you don't have permission to access this website.";

async function skipIfAccessBlocked(page: import('@playwright/test').Page) {
  const bodyText = await page.locator('body').innerText().catch(() => '');

  if (bodyText.includes(accessBlockedMessage)) {
    test.skip(true, 'Website access is restricted in the current test environment.');
  }
}

test.describe('Kumparan - public website', () => {
  test('WEB-001: homepage loads and primary navigation is usable', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/kumparan/i);

    await expect(
      page.getByText('Masuk', { exact: true }).first()
    ).toBeVisible();

    if (isMobile) {
      await expect(
        page.getByText('Beranda', { exact: true }).first()
      ).toBeVisible();

      await expect(
        page.locator('a[href="/search"]').first()
      ).toBeVisible();
    } else {
      await expect(
        page.getByText('Buat Tulisan', { exact: true })
      ).toBeVisible();
    }
  });

  test('WEB-002: search page accepts a keyword', async ({
    page,
    isMobile,
  }) => {
    // Open the search route directly because desktop and mobile
    // expose different navigation layouts.
    await page.goto('/search');
    await skipIfAccessBlocked(page);

    const search = page.getByPlaceholder(/Cari di sini/i);
    await expect(search).toBeVisible({ timeout: 15_000 });

    await search.fill('data');
    await expect(search).toHaveValue('data');
  });

  test('WEB-003: article page renders the expected story content', async ({
    page,
  }) => {
    const response = await page.goto(articleUrl);
    await skipIfAccessBlocked(page);

    test.skip(
      response?.status() === 403,
      'Article access is blocked with HTTP 403.'
    );

    expect(response?.status(), 'Article page should return a successful response').toBeLessThan(400);

    await expect(
      page.getByRole('heading', { name: /Bukan Sekadar Angka/i }).first()
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.locator('main p').filter({ hasText: /\S/ }).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('WEB-004: unauthenticated user is prompted to log in before liking an article', async ({
    page,
  }) => {
    const response = await page.goto(articleUrl);
    await skipIfAccessBlocked(page);

    test.skip(
      response?.status() === 403,
      'Article access is blocked with HTTP 403.'
    );

    const likeButton = page.getByRole('button', {
      name: /suka|like/i,
    }).first();

    test.skip(
      !(await likeButton.count()),
      'Like control is not exposed as an accessible button on this page.'
    );

    await likeButton.click();

    await expect(
      page.getByText(/masuk|login/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('WEB-005: report control is visible without submitting a report', async ({
    page,
  }) => {
    const response = await page.goto(articleUrl);
    await skipIfAccessBlocked(page);

    test.skip(
      response?.status() === 403,
      'Article access is blocked with HTTP 403.'
    );

    expect(response?.status(), 'Article page should return a successful response').toBeLessThan(400);

    await expect(
      page.getByRole('heading', { name: /Bukan Sekadar Angka/i }).first()
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.getByText('Laporkan tulisan', { exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test('WEB-006: mobile viewport exposes core navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile project only');

    await page.goto('/');
    await expect(page).toHaveTitle(/kumparan/i);

    await expect(
      page.getByText('Beranda', { exact: true }).first()
    ).toBeVisible();

    await expect(
      page.locator('a[href="/search"]').first()
    ).toBeVisible();
  });
});

test.describe('Kumparan - authentication dependency', () => {
  test('AUTH-001: authorized test account can log in and log out', async ({
    page,
  }) => {
    test.skip(
      !process.env.KUMPARAN_EMAIL || !process.env.KUMPARAN_PASSWORD,
      'Requires authorized test credentials supplied through environment variables.'
    );

    await page.goto('/');
    await page.getByText('Masuk', { exact: true }).click();

    const email = page.getByLabel(/email/i);
    const password = page.getByLabel(/password|kata sandi/i);

    test.skip(
      !(await email.count()) || !(await password.count()),
      'Login page does not expose email/password fields. Confirm the supported authentication flow.'
    );

    await email.fill(process.env.KUMPARAN_EMAIL!);
    await password.fill(process.env.KUMPARAN_PASSWORD!);

    await page.getByRole('button', { name: /masuk|login/i }).click();

    await expect(
      page.getByText(/keluar|logout/i)
    ).toBeVisible({ timeout: 15_000 });

    await page.getByText(/keluar|logout/i).click();

    await expect(
      page.getByText('Masuk', { exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test('AUTH-002: invalid credentials are rejected', async () => {
    test.skip(
      true,
      'Requires a confirmed credential-based login flow and an approved test account strategy.'
    );
  });
});
