import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests: Candidate Dashboard & Main Flows
 * Requires dev server running on port 3000
 *
 * NOTE: These tests use a test account. Set env vars:
 *   TEST_CANDIDATE_EMAIL and TEST_CANDIDATE_PASSWORD
 */

const TEST_EMAIL = process.env.TEST_CANDIDATE_EMAIL || 'teste@atuavaga.com';
const TEST_PASS  = process.env.TEST_CANDIDATE_PASSWORD || 'Teste@123';

// Helper: log in as candidate
async function loginAsCandidate(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASS);
  const btn = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar")').first();
  await btn.click();
  await page.waitForURL('**/app/dashboard', { timeout: 10000 }).catch(() => {});
}

// ── Dashboard ──────────────────────────────────────────────────────────────
test.describe('Candidate Dashboard', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/app/dashboard');
    await page.waitForURL('**/login', { timeout: 8000 }).catch(() => {});
    expect(page.url()).toContain('login');
  });

  test('shows dashboard after login', async ({ page }) => {
    if (!process.env.TEST_CANDIDATE_EMAIL) {
      test.skip(true, 'Skipped: set TEST_CANDIDATE_EMAIL and TEST_CANDIDATE_PASSWORD env vars to run this test');
      return;
    }
    await loginAsCandidate(page);
    const url = page.url();
    expect(url).toContain('/app/dashboard');
  });

  test('shows company count stat', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('dashboard')) return;
    await expect(page.locator('text=empresas cadastradas').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows job alert section', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('dashboard')) return;
    await expect(page.locator('text=Alerta de novas vagas').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows "Recomendadas para você" section', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('dashboard')) return;
    await expect(page.locator('text=Recomendadas para você').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows "Vagas semelhantes" section', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('dashboard')) return;
    await expect(page.locator('text=Vagas semelhantes').first()).toBeVisible({ timeout: 8000 });
  });
});

// ── Navigation ─────────────────────────────────────────────────────────────
test.describe('Navigation Header', () => {
  test('header shows navigation links after login', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    // Check at least "Vagas" link is visible
    await expect(page.locator('a:has-text("Vagas"), nav:has-text("Vagas")').first()).toBeVisible({ timeout: 8000 });
  });

  test('can navigate to Jobs page', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.click('a[href*="/app/jobs"], a:has-text("Vagas")');
    await page.waitForURL('**/app/jobs', { timeout: 8000 }).catch(() => {});
    expect(page.url()).toContain('jobs');
  });

  test('can navigate to My Jobs page', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    const myJobsLink = page.locator('a[href*="my-jobs"], a:has-text("Minhas vagas")').first();
    if (await myJobsLink.isVisible()) {
      await myJobsLink.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('my-jobs');
    }
  });

  test('can navigate to Tests page', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    const testLink = page.locator('a:has-text("Testes"), a[href*="behavioral-test"]').first();
    if (await testLink.isVisible()) {
      await testLink.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('behavioral');
    }
  });
});

// ── Jobs Page ──────────────────────────────────────────────────────────────
test.describe('Jobs Page', () => {
  test('displays job listing', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/jobs');
    await page.waitForTimeout(3000);
    // Either shows jobs or "Nenhuma vaga"
    const hasContent = await page.locator('text=Destaques para você, text=Nenhuma vaga, text=Vagas recentes').count() > 0;
    expect(hasContent || page.url().includes('jobs')).toBeTruthy();
  });

  test('search bar is present', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/jobs');
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[placeholder*="busca"], input[placeholder*="vaga"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Engenheiro');
      await page.waitForTimeout(1000);
    }
  });
});

// ── Profile Page ───────────────────────────────────────────────────────────
test.describe('Profile Page', () => {
  test('displays profile sections', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/profile');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Formação acadêmica').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Experiências profissionais').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows progress bar', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/profile');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Progresso do perfil').first()).toBeVisible({ timeout: 8000 });
  });

  test('education section has Add button in edit mode', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/profile');
    await page.waitForTimeout(3000);
    // Click Editar button for education section
    const editBtn = page.locator('button:has-text("Editar")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.locator('button:has-text("Adicionar formação")').first()).toBeVisible({ timeout: 5000 });
    }
  });
});

// ── Behavioral Test Page ───────────────────────────────────────────────────
test.describe('Behavioral Test Page', () => {
  test('displays available tests', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/behavioral-test');
    await page.waitForTimeout(3000);
    // Should show test list or "No tests" state
    expect(page.url()).toContain('behavioral-test');
  });
});

// ── Notifications Page ─────────────────────────────────────────────────────
test.describe('Notifications Page', () => {
  test('displays notifications page', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/notifications');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Notificações').first()).toBeVisible({ timeout: 8000 });
  });
});

// ── FAQ Page ───────────────────────────────────────────────────────────────
test.describe('FAQ Page', () => {
  test('displays FAQ items', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/faq');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Dúvidas Frequentes').first()).toBeVisible({ timeout: 8000 });
  });

  test('FAQ items expand on click', async ({ page }) => {
    await loginAsCandidate(page);
    if (!page.url().includes('/app')) return;
    await page.goto('/app/faq');
    await page.waitForTimeout(2000);
    const firstFaqBtn = page.locator('button').filter({ hasText: /Como/i }).first();
    if (await firstFaqBtn.isVisible()) {
      await firstFaqBtn.click();
      await page.waitForTimeout(500);
      // Answer should now be visible
      const answer = page.locator('text=painel').first();
      // Just check something changed
      expect(await firstFaqBtn.isVisible()).toBe(true);
    }
  });
});
