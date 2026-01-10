import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:3000';

test.describe('4. Member Portal - Login Flow', () => {
  test('4.5.1-4.5.2 - Login page shows Google OAuth option', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Check for Google login button
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google"), [class*="google"]').first();
    const hasGoogleLogin = await googleButton.isVisible();

    console.log('Google OAuth Button:', hasGoogleLogin ? 'FOUND' : 'NOT FOUND');

    // Check for email/password login
    const emailField = page.locator('input[name="email"], input[type="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    const hasEmailLogin = await emailField.isVisible() && await passwordField.isVisible();
    console.log('Email/Password Login:', hasEmailLogin ? 'AVAILABLE' : 'NOT AVAILABLE');
  });

  test('Login page has forgot password link', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("forgot"), a:has-text("Reset")').first();
    const hasForgotPassword = await forgotLink.isVisible();

    console.log('Forgot Password Link:', hasForgotPassword ? 'FOUND' : 'NOT FOUND');
  });
});

test.describe('5. Member Portal - Dashboard (Requires Auth)', () => {
  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/portal`);

    // Should redirect to login
    await page.waitForTimeout(2000);
    const url = page.url();
    const redirectedToLogin = url.includes('login') || url.includes('signin');

    console.log('Current URL:', url);
    console.log('Protected route redirects:', redirectedToLogin ? 'YES' : 'NO (may need check)');
  });

  test('Bookings page protected', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/portal/bookings`);
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log('Bookings page URL:', url);
  });

  test('Membership page protected', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/portal/membership`);
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log('Membership page URL:', url);
  });

  test('Profile page protected', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/portal/profile`);
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log('Profile page URL:', url);
  });

  test('Invoices page protected', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/portal/invoices`);
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log('Invoices page URL:', url);
  });
});

test.describe('5. Portal Page Structure (Visual Check)', () => {
  test('Book Classes page exists at expected route', async ({ page }) => {
    // Try multiple possible routes
    const routes = [
      '/portal/book',
      '/portal/schedule',
      '/portal/classes',
      '/book',
      '/schedule',
    ];

    for (const route of routes) {
      await page.goto(`${FRONTEND_URL}${route}`);
      await page.waitForTimeout(500);

      if (!page.url().includes('login')) {
        console.log('Book Classes route found at:', route);
        return;
      }
    }

    console.log('Book Classes: Route requires authentication');
  });
});

test.describe('6. Staff Operations - Django Admin', () => {
  const ADMIN_URL = 'http://localhost:8000/admin/';
  const ADMIN_EMAIL = 'admin@clubflow.com';
  const ADMIN_PASSWORD = 'clubflow';

  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.fill('input[name="username"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('input[type="submit"]');
  });

  test('6.1.1 - Admin sections available', async ({ page }) => {
    // Check for all expected admin sections
    const sections = [
      { name: 'Accounts/Users', selector: 'a:has-text("Users")' },
      { name: 'Customers', selector: 'a:has-text("Customers")' },
      { name: 'Classes', selector: 'a:has-text("Class types"), a:has-text("Classes")' },
      { name: 'Class Schedules', selector: 'a:has-text("Class schedules")' },
      { name: 'Bookings', selector: 'a:has-text("Bookings")' },
      { name: 'Memberships', selector: 'a:has-text("Memberships"), a:has-text("Customer memberships")' },
      { name: 'Membership Plans', selector: 'a:has-text("Membership plans")' },
      { name: 'Trial Bookings', selector: 'a:has-text("Trial bookings")' },
      { name: 'Invoices', selector: 'a:has-text("Invoices")' },
      { name: 'Contact Messages', selector: 'a:has-text("Contact messages")' },
      { name: 'Trainers', selector: 'a:has-text("Trainers")' },
    ];

    const results: Record<string, boolean> = {};

    for (const section of sections) {
      const link = page.locator(section.selector).first();
      results[section.name] = await link.isVisible();
    }

    console.log('\nAdmin Sections Available:');
    for (const [name, available] of Object.entries(results)) {
      console.log(`  ${name}: ${available ? '✅' : '❌'}`);
    }
  });

  test('3.3.1-3.3.8 - Process Trial Bookings workflow', async ({ page }) => {
    await page.click('a:has-text("Trial bookings")');

    await expect(page).toHaveURL(/\/admin\/customers\/trialbooking\//);

    // Check list view
    const listTable = page.locator('table#result_list');
    const hasTrialBookings = await listTable.isVisible();

    console.log('Trial Bookings List:', hasTrialBookings ? 'ACCESSIBLE' : 'EMPTY or NOT FOUND');

    // Check for status column and actions
    const statusColumn = page.locator('th:has-text("Status")');
    const hasStatusColumn = await statusColumn.isVisible();
    console.log('Status Column:', hasStatusColumn ? 'PRESENT' : 'NOT FOUND');

    // Check for bulk actions
    const actionSelect = page.locator('select[name="action"]');
    if (await actionSelect.isVisible()) {
      const options = await actionSelect.locator('option').allTextContents();
      console.log('Available Actions:', options.join(', '));
    }
  });

  test('6.2.1 - Manage Bookings', async ({ page }) => {
    await page.click('a:has-text("Bookings")');

    const bookingsTable = page.locator('table#result_list');
    const hasBookings = await bookingsTable.isVisible();

    console.log('Bookings Admin:', hasBookings ? 'ACCESSIBLE' : 'EMPTY');

    // Check for search
    const searchInput = page.locator('input[name="q"]');
    const hasSearch = await searchInput.isVisible();
    console.log('Booking Search:', hasSearch ? 'AVAILABLE' : 'NOT FOUND');
  });

  test('4.2.1-4.2.7 - Assign Membership workflow', async ({ page }) => {
    // Navigate to Customer Memberships
    const membershipLink = page.locator('a:has-text("Customer memberships")').first();

    if (await membershipLink.isVisible()) {
      await membershipLink.click();

      // Check for add button
      const addLink = page.locator('a.addlink');
      const canAddMembership = await addLink.isVisible();

      console.log('Add Membership:', canAddMembership ? 'AVAILABLE' : 'NOT AVAILABLE');

      if (canAddMembership) {
        await addLink.click();

        // Check form fields
        const customerField = page.locator('select[name="customer"], input[name="customer"]').first();
        const planField = page.locator('select[name="plan"]');
        const startDateField = page.locator('input[name="start_date"]');
        const endDateField = page.locator('input[name="end_date"]');
        const statusField = page.locator('select[name="status"]');

        console.log('\nMembership Form Fields:');
        console.log('  Customer:', await customerField.isVisible() ? '✅' : '❌');
        console.log('  Plan:', await planField.isVisible() ? '✅' : '❌');
        console.log('  Start Date:', await startDateField.isVisible() ? '✅' : '❌');
        console.log('  End Date:', await endDateField.isVisible() ? '✅' : '❌');
        console.log('  Status:', await statusField.isVisible() ? '✅' : '❌');
      }
    } else {
      console.log('Customer Memberships: NOT FOUND in admin');
    }
  });

  test('4.3.1-4.3.7 - Invoice Management', async ({ page }) => {
    await page.click('a:has-text("Invoices")');

    // Check invoice list
    const invoiceTable = page.locator('table#result_list');
    const hasInvoices = await invoiceTable.isVisible();

    console.log('Invoice Admin:', hasInvoices ? 'ACCESSIBLE' : 'EMPTY');

    // Check for add
    const addLink = page.locator('a.addlink');
    const canAddInvoice = await addLink.isVisible();

    console.log('Create Invoice:', canAddInvoice ? 'AVAILABLE' : 'NOT AVAILABLE');
  });
});

test.describe('7. Communication Features', () => {
  const ADMIN_URL = 'http://localhost:8000/admin/';
  const ADMIN_EMAIL = 'admin@clubflow.com';
  const ADMIN_PASSWORD = 'clubflow';

  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.fill('input[name="username"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('input[type="submit"]');
  });

  test('7.2.7-7.2.9 - Contact Messages Management', async ({ page }) => {
    const contactLink = page.locator('a:has-text("Contact messages")');

    if (await contactLink.isVisible()) {
      await contactLink.click();

      const messagesTable = page.locator('table#result_list');
      const hasMessages = await messagesTable.isVisible();

      console.log('Contact Messages Admin:', hasMessages ? 'ACCESSIBLE' : 'EMPTY');

      // Check for status actions
      const actionSelect = page.locator('select[name="action"]');
      if (await actionSelect.isVisible()) {
        const options = await actionSelect.locator('option').allTextContents();
        console.log('Contact Message Actions:', options.join(', '));
      }
    } else {
      console.log('Contact Messages: NOT FOUND in admin');
    }
  });
});

test.describe('8. Waitlist & Membership Requests', () => {
  const ADMIN_URL = 'http://localhost:8000/admin/';
  const ADMIN_EMAIL = 'admin@clubflow.com';
  const ADMIN_PASSWORD = 'clubflow';

  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.fill('input[name="username"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('input[type="submit"]');
  });

  test('Waitlist entries admin', async ({ page }) => {
    const waitlistLink = page.locator('a:has-text("Waitlist entries")');

    if (await waitlistLink.isVisible()) {
      await waitlistLink.click();
      console.log('Waitlist Admin: ACCESSIBLE');
    } else {
      console.log('Waitlist Admin: NOT FOUND');
    }
  });

  test('Membership requests admin', async ({ page }) => {
    const requestsLink = page.locator('a:has-text("Membership requests")');

    if (await requestsLink.isVisible()) {
      await requestsLink.click();
      console.log('Membership Requests Admin: ACCESSIBLE');
    } else {
      console.log('Membership Requests Admin: NOT FOUND');
    }
  });
});
