import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the login API
        await page.route('**/api/auth/login', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'mock-access-token',
                    refresh_token: 'mock-refresh-token',
                    user_id: 1,
                    email: 'test@example.com',
                    role: 'USER'
                }),
            });
        });

        // Mock the register API
        await page.route('**/api/auth/register', async (route) => {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'mock-access-token',
                    refresh_token: 'mock-refresh-token',
                    user_id: 1,
                    email: 'test@example.com',
                    role: 'USER'
                }),
            });
        });

        await page.goto('/login');
    });

    test('should register a new user successfully', async ({ page }) => {
        // Navigate to register via link
        await page.getByRole('link', { name: 'Sign up' }).click();
        await expect(page).toHaveURL(/\/register/);

        // Fill registration form
        await page.locator('input[type="text"]').fill('Test User');
        await page.locator('input[type="email"]').fill('test@example.com');
        await page.locator('input[type="password"]').nth(0).fill('password123');
        await page.locator('input[type="password"]').nth(1).fill('password123');

        // Click register button
        await page.getByRole('button', { name: 'Sign up' }).click();

        // Should redirect to documents page after successful registration
        await expect(page).toHaveURL(/\/documents/);
        await expect(page.locator('text=Welcome to Docura')).toBeVisible();
    });

    test('should login successfully', async ({ page }) => {
        await page.getByPlaceholder('you@example.com').fill('test@example.com');
        await page.getByPlaceholder('••••••••').fill('password123');

        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        // Should redirect to documents page
        await expect(page).toHaveURL(/\/documents/);
        await expect(page.locator('text=Welcome back')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.getByPlaceholder('you@example.com').fill('test@example.com');
        await page.getByPlaceholder('••••••••').fill('password123');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        await expect(page).toHaveURL(/\/documents/);

        // Open profile dropdown - use getByLabel for better robustness
        const profileBtn = page.getByRole('button', { name: 'User profile' });
        await expect(profileBtn).toBeVisible();
        await profileBtn.click();

        // Click logout button (also has aria-label="Logout" now)
        const logoutBtn = page.getByRole('button', { name: 'Logout' });
        await expect(logoutBtn).toBeVisible();
        await logoutBtn.click();

        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator('text=Sign in to your account')).toBeVisible();
    });
});
