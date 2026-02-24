import { test, expect } from '@playwright/test';

test.describe('Chat Intelligence Flow', () => {
    let conversations: any[] = [];

    test.beforeEach(async ({ page }) => {
        conversations = []; // Reset for each test

        // Set up persistent auth state
        await page.addInitScript(() => {
            window.localStorage.setItem('accessToken', 'mock-access');
            window.localStorage.setItem('refreshToken', 'mock-refresh');
            window.localStorage.setItem('user', JSON.stringify({
                id: 1,
                email: 'test@example.com',
                name: 'Test'
            }));
        });

        // Mock History & Chat API
        await page.route('**/api/documents/conversations', async (route) => {
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(conversations),
                });
            } else if (method === 'POST') {
                const newConv = {
                    id: 101,
                    title: 'New Chat',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    messages: [
                        { id: 1, type: 'question', content: 'What is RAG?', createdAt: new Date().toISOString() },
                        { id: 2, type: 'answer', content: 'Retrieval Augmented Generation...', sources: [], createdAt: new Date().toISOString() }
                    ]
                };
                // Add to our dynamic history
                conversations.push(newConv);

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(newConv),
                });
            }
        });

        await page.goto('/chat');
    });

    test('should start a new conversation and receive an answer', async ({ page }) => {
        // Wait for initial load
        await expect(page.locator('text=Ready to help')).toBeVisible();

        const input = page.getByPlaceholder('Type your question...');
        await input.fill('What is RAG?');
        await page.keyboard.press('Enter');

        // Verify answer appears
        await expect(page.locator('text=Retrieval Augmented Generation...')).toBeVisible();

        // Verify it's added to history sidebar (requires the dynamic mock to work)
        await expect(page.locator('text=New Chat')).toBeVisible();
    });

    test('should clear conversation history', async ({ page }) => {
        const input = page.getByPlaceholder('Type your question...');
        await input.fill('Hello');
        await page.keyboard.press('Enter');

        await expect(page.locator('text=Retrieval Augmented Generation...')).toBeVisible();

        // Click "Clear" button in header
        await page.getByRole('button', { name: 'Clear' }).click();

        // Confirm in dialog
        await page.getByRole('button', { name: 'Clear', exact: true }).click();

        // Verify messages are gone
        await expect(page.locator('text=Ready to help')).toBeVisible();
    });
});
