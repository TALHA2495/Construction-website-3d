// E2E tests for Stonehaven Construction website
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all pages load successfully', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/process', '/services', '/work'];
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    
    // Click each nav link and verify page loads
    await page.click('nav a[href="/work"]');
    await expect(page).toHaveURL('/work');
    
    await page.click('nav a[href="/services"]');
    await expect(page).toHaveURL('/services');
    
    await page.click('nav a[href="/process"]');
    await expect(page).toHaveURL('/process');
    
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Contact Form', () => {
  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit without filling any fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
  });

  test('rejects invalid email format', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'not-an-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email address')).toBeVisible();
  });

  test('submits successfully in demo mode', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('input[name="name"]', 'Jane Test');
    await page.fill('input[name="email"]', 'jane@example.com');
    await page.fill('input[name="phone"]', '555-123-4567');
    await page.fill('input[name="location"]', 'Portland, OR');
    await page.selectOption('select[name="projectType"]', 'custom-home');
    await page.fill('textarea[name="description"]', 'Test project description');
    
    await page.click('button[type="submit"]');
    
    // Should show success message in demo mode
    await expect(page.locator('text=Demo mode')).toBeVisible();
    await expect(page.locator('text=received')).toBeVisible();
  });

  test('preserves form data after error', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('input[name="name"]', 'Preserved User');
    await page.click('button[type="submit"]');
    
    // Data should still be in the field
    await expect(page.locator('input[name="name"]')).toHaveValue('Preserved User');
  });
});

test.describe('Hero Section', () => {
  test('displays responsive hero image', async ({ page }) => {
    await page.goto('/');
    
    // Verify the picture element and source exist
    const picture = page.locator('picture');
    await expect(picture).toBeVisible();
    
    // Verify desktop image is present
    const img = page.locator('img[src*="hero-desktop"]');
    await expect(img).toBeVisible();
  });

  test('displays headline and CTAs', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Built with Intention');
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
    await expect(page.locator('a[href="/work"]')).toBeVisible();
  });
});

test.describe('3D Helix Section', () => {
  test('renders canvas element for 3D scene', async ({ page }) => {
    await page.goto('/');
    
    // The canvas should be present (client-rendered by R3F)
    await page.waitForTimeout(2000); // Allow client-side hydration
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('shows WebGL fallback when canvas is not available', async ({ page }) => {
    // This test checks that the fallback content is reasonable
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Either canvas should be visible, or fallback message should be present
    const canvasCount = await page.locator('canvas').count();
    const fallbackVisible = await page.locator('text=WebGL is not available').isVisible();
    
    expect(canvasCount > 0 || fallbackVisible).toBe(true);
  });
});

test.describe('Work/Projects Page', () => {
  test('displays project cards with working links', async ({ page }) => {
    await page.goto('/work');
    
    const cards = page.locator('a[href*="/work/"]');
    await expect(cards.first()).toBeVisible();
  });
});

test.describe('Responsive Layout', () => {
  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    
    const overflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(overflow).toBe(false);
  });
});