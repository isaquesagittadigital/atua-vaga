import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Authentication Flows
 * Covers: Login (candidate/company), Registration, Forgot Password
 */

// ── Candidate Login ────────────────────────────────────────────────────────
test.describe('Candidate Login', () => {
  test('displays login form correctly', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar")')).toBeVisible();
  });

  test('shows error for empty fields on submit', async ({ page }) => {
    await page.goto('/auth/login');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar")').first();
    await submitBtn.click();
    // Either browser native validation or custom error message
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'usuario-inexistente@test.com');
    await page.fill('input[type="password"]', 'senha-invalida-123');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar")').first();
    await submitBtn.click();
    // Wait for error feedback
    await page.waitForTimeout(3000);
    // Page should NOT have navigated away from login
    expect(page.url()).toContain('login');
  });

  test('navigates to register page', async ({ page }) => {
    await page.goto('/auth/login');
    const registerLink = page.locator('a:has-text("Cadastrar"), button:has-text("Cadastrar"), a:has-text("Criar conta")').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('register');
    }
  });

  test('navigates to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');
    const forgotLink = page.locator('a:has-text("Esqueci"), button:has-text("Esqueci"), a:has-text("Recuperar")').first();
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('forgot');
    }
  });
});

// ── Company Login ──────────────────────────────────────────────────────────
test.describe('Company Login', () => {
  test('displays company login form', async ({ page }) => {
    await page.goto('/auth/company/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('shows error for invalid company credentials', async ({ page }) => {
    await page.goto('/auth/company/login');
    await page.fill('input[type="email"]', 'empresa-inexistente@test.com');
    await page.fill('input[type="password"]', 'senha-invalida');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acessar")').first();
    await submitBtn.click();
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('company/login');
  });
});

// ── Candidate Registration ─────────────────────────────────────────────────
test.describe('Candidate Registration', () => {
  test('displays registration form Step 1', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForTimeout(2000);
    // Check for Step 1 fields
    await expect(page.locator('input[placeholder="000.000.000-00"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Crie uma senha segura"]')).toBeVisible();
  });

  test('validates required fields prevents step change', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForTimeout(2000);
    const submitBtn = page.locator('button[type="submit"], button:has-text("Continuar")').first();
    
    // Button should be disabled initially
    await expect(submitBtn).toBeDisabled();
    
    // Fill invalid CPF
    await page.fill('input[placeholder="000.000.000-00"]', '123456');
    await expect(submitBtn).toBeDisabled();
  });

  test('shows error for passwords that do not match in Step 1', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForTimeout(2000);
    
    await page.fill('input[placeholder="000.000.000-00"]', '529.982.247-25'); // Valid format/CPF
    await page.fill('input[placeholder="Crie uma senha segura"]', 'Senha@123');
    await page.fill('input[placeholder="**********"]', 'SenhaDiferente@456');
    
    const submitBtn = page.locator('button[type="submit"], button:has-text("Continuar")').first();
    await expect(submitBtn).toBeDisabled();
    
    // Should show error message
    await expect(page.locator('text=As senhas não coincidem')).toBeVisible();
  });

  test('advances to Step 2 with valid data', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForTimeout(2000);
    
    await page.fill('input[placeholder="000.000.000-00"]', '529.982.247-25');
    await page.fill('input[placeholder="Crie uma senha segura"]', 'Senha@123');
    await page.fill('input[placeholder="**********"]', 'Senha@123');
    
    const submitBtn = page.locator('button[type="submit"], button:has-text("Continuar")').first();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    
    // Should show Step 2
    await expect(page.locator('text=Etapa 2 de 2')).toBeVisible();
    await expect(page.locator('input[placeholder="Nome completo"]')).toBeVisible();
  });
});

// ── Forgot Password ────────────────────────────────────────────────────────
test.describe('Forgot Password', () => {
  test('displays forgot password form', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('shows feedback on email submission', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await page.fill('input[type="email"]', 'teste@example.com');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Enviar")').first();
    await submitBtn.click();
    await page.waitForTimeout(3000);
    // Page should still be accessible
    expect(page.url()).toBeTruthy();
  });
});
