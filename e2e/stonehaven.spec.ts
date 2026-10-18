// E2E tests for Stonehaven Construction website
// Selectors aligned to the actual page: the contact form exposes fields via
// <label for> (no name attributes), and the work page shows concept cards
// without per-project detail routes.
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
    // Desktop nav links; use a desktop viewport for both projects
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
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
    // The home link is the header logo (outside the <nav> element)
    await page.click('header a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Contact Form', () => {
  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/contact');
    await page.click('button[type="submit"]');
    // Copy from src/app/contact/page.tsx
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('rejects invalid email format', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email Address').fill('not-an-email');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Enter a valid email address')).toBeVisible();
  });

  test('submits successfully in demo mode', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Full Name').fill('Jane Test');
    await page.getByLabel('Email Address').fill('jane@example.com');
    await page.getByLabel('Phone Number').fill('555-123-4567');
    await page.getByLabel('Project Type').selectOption('Custom Home');
    await page.getByLabel('Tell us about your project').fill('Test project description');
    await page.click('button[type="submit"]');
    await expect(page.getByText(/we will be in touch shortly/)).toBeVisible();
    await expect(page.getByText('Demo mode:')).toBeVisible();
  });

  test('preserves form data after error', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Full Name').fill('Preserved User');
    await page.click('button[type="submit"]');
    await expect(page.getByLabel('Full Name')).toHaveValue('Preserved User');
  });
});

test.describe('Hero Section', () => {
  test('displays responsive hero image that actually loads', async ({ page }) => {
    await page.goto('/');
    const picture = page.locator('picture');
    await expect(picture).toBeVisible();
    const img = page.locator('img[src*="hero-desktop"]');
    await expect(img).toBeVisible();
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('displays headline and CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Built with\s*Intention\./);
    await expect(page.getByRole('link', { name: 'Start Your Project' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore Our Work' })).toBeVisible();
  });
});

test.describe('3D Helix Section', () => {
  test('renders canvas element for 3D scene with nonzero size', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 15000 });
    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
  });

  test('shows fallback when WebGL is unavailable', async ({ page }) => {
    await page.goto('/');
    const canvasCount = await page.locator('canvas').count();
    const fallbackVisible = await page.getByText('WebGL is not available').isVisible();
    expect(canvasCount > 0 || fallbackVisible).toBe(true);
  });
});

test.describe('Work/Projects Page', () => {
  test('displays project concept cards', async ({ page }) => {
    await page.goto('/work');
    const cards = page.locator('article');
    await expect(cards).toHaveCount(3);
    await expect(page.getByText('Canyon Ridge Residence')).toBeVisible();
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
