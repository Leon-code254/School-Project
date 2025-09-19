import { test, expect } from '@playwright/test';

test.describe('Cross-browser compatibility tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Login form should be accessible and functional', async ({ page }) => {
    // Test form submission
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check if navigation was successful
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Navigation menu should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopMenu = await page.isVisible('nav');
    expect(desktopMenu).toBeTruthy();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const hamburgerMenu = await page.isVisible('button[aria-label="menu"]');
    expect(hamburgerMenu).toBeTruthy();
  });

  test('Tables should be responsive and scrollable on mobile', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if table container has horizontal scroll
    const tableContainer = await page.$('.MuiTableContainer-root');
    const hasScroll = await tableContainer?.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(hasScroll).toBeTruthy();
  });

  test('High contrast mode should work', async ({ page }) => {
    // Toggle high contrast mode
    await page.click('button[aria-label="toggle high contrast mode"]');

    // Check if the theme was applied
    const isDark = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'high-contrast';
    });
    expect(isDark).toBeTruthy();
  });

  test('Keyboard navigation should work', async ({ page }) => {
    // Press Tab to navigate through elements
    await page.keyboard.press('Tab');
    
    // Check if the skip link is focused
    const skipLink = await page.$('text="Skip to main content"');
    const isFocused = await skipLink?.evaluate((el) => {
      return document.activeElement === el;
    });
    expect(isFocused).toBeTruthy();
  });

  test('Images should have proper fallbacks', async ({ page }) => {
    // Disable images
    await page.route('**/*.{png,jpg,jpeg,webp}', (route) => route.abort());

    // Check if alt text is displayed
    const images = await page.$$('img');
    for (const img of images) {
      const altText = await img.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });

  test('Forms should have proper validation across browsers', async ({ page }) => {
    await page.goto('http://localhost:3000/users/create');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check if validation messages are displayed
    const errorMessages = await page.$$('.MuiFormHelperText-root');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('Charts and data visualizations should have fallbacks', async ({ page }) => {
    // Disable JavaScript for chart rendering
    await page.route('**/chart.js', (route) => route.abort());

    // Check if fallback content is displayed
    const fallbackContent = await page.isVisible('[data-testid="chart-fallback"]');
    expect(fallbackContent).toBeTruthy();
  });
});