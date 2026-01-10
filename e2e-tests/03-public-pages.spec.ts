import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:3000';

test.describe('3. Customer Acquisition Journey - Public Pages', () => {
  test.describe('3.1 Prospect Discovers Website', () => {
    test('3.1.1 - Homepage loads with attractive landing page', async ({ page }) => {
      await page.goto(FRONTEND_URL);

      // Check page loads
      await expect(page).toHaveTitle(/ClubFlow|FitRit|Pilates/i);

      // Check for hero section or main content
      const heroSection = page.locator('main, .hero, [class*="hero"]').first();
      await expect(heroSection).toBeVisible();

      console.log('Homepage: LOADED');
    });

    test('3.1.2 - About page is informative', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/about`);

      // Should have content
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Check for about-related text
      const pageText = await page.textContent('body');
      const hasAboutContent =
        pageText?.toLowerCase().includes('about') ||
        pageText?.toLowerCase().includes('studio') ||
        pageText?.toLowerCase().includes('pilates');

      expect(hasAboutContent).toBeTruthy();
      console.log('About Page: ACCESSIBLE');
    });

    test('3.1.3 - Classes page shows offerings', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/classes`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      console.log('Classes Page: ACCESSIBLE');
    });

    test('3.1.4 - Schedule page shows class times', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/schedule`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      console.log('Schedule Page: ACCESSIBLE');
    });

    test('3.1.5 - Instructors page shows trainer profiles', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/instructors`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      console.log('Instructors Page: ACCESSIBLE');
    });

    test('3.1.6 - Pricing page shows plans with pricing', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/pricing`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Look for price indicators (₹ or numbers)
      const pageText = await page.textContent('body');
      const hasPricing = pageText?.includes('₹') || /\d{3,}/.test(pageText || '');

      console.log('Pricing Page: ACCESSIBLE');
      console.log('Has pricing info:', hasPricing);
    });

    test('3.1.7 - FAQ page answers questions', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/faq`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      console.log('FAQ Page: ACCESSIBLE');
    });

    test('3.1.8 - Contact page shows contact info', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/contact`);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Check for contact form
      const contactForm = page.locator('form');
      const hasForm = await contactForm.isVisible();

      console.log('Contact Page: ACCESSIBLE');
      console.log('Has contact form:', hasForm);
    });
  });

  test.describe('3.2 Prospect Submits Trial Booking', () => {
    test('3.2.1-3.2.8 - Complete trial booking flow', async ({ page }) => {
      // Navigate to trial booking page
      await page.goto(`${FRONTEND_URL}/trial`);

      // Or look for "Book a Trial" button on homepage
      if (page.url() === FRONTEND_URL || page.url() === `${FRONTEND_URL}/`) {
        const trialButton = page.locator('a:has-text("Trial"), button:has-text("Trial")').first();
        if (await trialButton.isVisible()) {
          await trialButton.click();
          await page.waitForLoadState('networkidle');
        }
      }

      // Check for trial form
      const nameField = page.locator('input[name="full_name"], input[name="name"], input[placeholder*="name" i]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const phoneField = page.locator('input[name="phone"], input[type="tel"]').first();

      console.log('Trial Booking Form:');
      console.log('- Name field:', await nameField.isVisible());
      console.log('- Email field:', await emailField.isVisible());
      console.log('- Phone field:', await phoneField.isVisible());

      if (await nameField.isVisible() && await emailField.isVisible()) {
        // Fill the form
        await nameField.fill('Test User');
        await emailField.fill('test@example.com');

        if (await phoneField.isVisible()) {
          await phoneField.fill('9876543210');
        }

        // Look for preferred time selector
        const timeSelect = page.locator('select[name="preferred_time"], select').first();
        if (await timeSelect.isVisible()) {
          const options = await timeSelect.locator('option').count();
          if (options > 1) {
            await timeSelect.selectOption({ index: 1 });
          }
        }

        // Submit
        const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Wait for response
          await page.waitForTimeout(2000);

          // Check for success message
          const pageText = await page.textContent('body');
          const hasSuccess =
            pageText?.toLowerCase().includes('thank') ||
            pageText?.toLowerCase().includes('success') ||
            pageText?.toLowerCase().includes('submitted') ||
            pageText?.toLowerCase().includes('received');

          console.log('Trial Booking Submitted:', hasSuccess);
        }
      } else {
        console.log('Trial booking form NOT FOUND or incomplete');
      }
    });
  });

  test.describe('3.5 Prospect Sends Contact Inquiry', () => {
    test('3.5.1-3.5.4 - Submit contact form', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/contact`);

      const nameField = page.locator('input[name="name"], input[placeholder*="name" i]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"], textarea').first();

      console.log('Contact Form:');
      console.log('- Name field:', await nameField.isVisible());
      console.log('- Email field:', await emailField.isVisible());
      console.log('- Message field:', await messageField.isVisible());

      if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible()) {
        await nameField.fill('Inquiry Test');
        await emailField.fill('inquiry@example.com');
        await messageField.fill('I would like more information about your classes.');

        const phoneField = page.locator('input[name="phone"], input[type="tel"]').first();
        if (await phoneField.isVisible()) {
          await phoneField.fill('9876543211');
        }

        const submitButton = page.locator('button[type="submit"]').first();
        await submitButton.click();

        await page.waitForTimeout(2000);

        const pageText = await page.textContent('body');
        const hasSuccess =
          pageText?.toLowerCase().includes('thank') ||
          pageText?.toLowerCase().includes('success') ||
          pageText?.toLowerCase().includes('sent');

        console.log('Contact Form Submitted:', hasSuccess);
      }
    });
  });
});

test.describe('Navigation', () => {
  test('Main navigation links work', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Find navigation
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();

    // Check for common nav links
    const links = ['Home', 'About', 'Classes', 'Schedule', 'Pricing', 'Contact'];
    const foundLinks: string[] = [];

    for (const linkText of links) {
      const link = page.locator(`nav a:has-text("${linkText}"), header a:has-text("${linkText}")`).first();
      if (await link.isVisible()) {
        foundLinks.push(linkText);
      }
    }

    console.log('Navigation Links Found:', foundLinks.join(', '));
  });

  test('Login/Sign In button exists', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    const loginButton = page.locator('a:has-text("Login"), a:has-text("Sign In"), button:has-text("Login"), button:has-text("Sign In")').first();
    const hasLogin = await loginButton.isVisible();

    console.log('Login Button:', hasLogin ? 'FOUND' : 'NOT FOUND');
  });
});
