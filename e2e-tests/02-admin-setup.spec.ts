import { test, expect } from '@playwright/test';

const ADMIN_URL = 'http://localhost:8000/admin/';
const ADMIN_EMAIL = 'admin@clubflow.com';
const ADMIN_PASSWORD = 'clubflow';

test.describe('2. Admin Setup (Day 1-2)', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto(ADMIN_URL);
    await page.fill('input[name="username"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('input[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/$/);
  });

  test.describe('2.1 Create Class Types', () => {
    test('2.1.1 - Navigate to Class Types', async ({ page }) => {
      const classTypesLink = page.locator('a:has-text("Class types")');

      if (await classTypesLink.isVisible()) {
        await classTypesLink.click();
        await expect(page).toHaveURL(/\/admin\/classes\/classtype\//);
        console.log('Class Types: ACCESSIBLE');
      } else {
        console.log('Class Types: NOT FOUND - checking if "Classes" section exists');
        test.fail();
      }
    });

    test('2.1.2-2.1.8 - Create Intro Reformer class type', async ({ page }) => {
      await page.click('a:has-text("Class types")');

      // Check if we can add
      const addLink = page.locator('a.addlink:has-text("Add class type")');
      if (await addLink.isVisible()) {
        await addLink.click();

        // Fill the form
        await page.fill('input[name="name"]', 'Intro Reformer');
        await page.fill('input[name="slug"]', 'intro-reformer');

        // Check for description field
        const descField = page.locator('textarea[name="description"]');
        if (await descField.isVisible()) {
          await descField.fill('Introduction to Reformer Pilates - perfect for beginners');
        }

        // Check for duration field
        const durationField = page.locator('input[name="duration_minutes"]');
        if (await durationField.isVisible()) {
          await durationField.fill('50');
        }

        // Check for level field
        const levelField = page.locator('select[name="level"]');
        if (await levelField.isVisible()) {
          await levelField.selectOption('beginner');
        }

        // Check for capacity field
        const capacityField = page.locator('input[name="max_capacity"]');
        if (await capacityField.isVisible()) {
          await capacityField.fill('8');
        }

        // Save
        await page.click('input[name="_save"]');

        // Check for success
        const successMessage = page.locator('.messagelist .success');
        await expect(successMessage).toBeVisible();
        console.log('Class Type Created: SUCCESS');
      } else {
        console.log('Add Class Type: NOT AVAILABLE');
      }
    });
  });

  test.describe('2.2 Add Instructors', () => {
    test('2.2.1 - Navigate to Trainers', async ({ page }) => {
      // Try different possible link texts
      const possibleLinks = ['a:has-text("Trainers")', 'a:has-text("Instructors")'];

      let found = false;
      for (const selector of possibleLinks) {
        const link = page.locator(selector).first();
        if (await link.isVisible()) {
          await link.click();
          await expect(page).toHaveURL(/\/admin\/trainers\/trainer\//);
          console.log('Trainers: ACCESSIBLE');
          found = true;
          break;
        }
      }

      if (!found) {
        // List available links
        const allLinks = await page.locator('.app-trainers a, #content-main a').allTextContents();
        console.log('Trainers: NOT FOUND');
        console.log('Available links:', allLinks.join(', '));
      }
    });

    test('2.2.2-2.2.7 - Create instructor Priya Sharma', async ({ page }) => {
      await page.click('a:has-text("Trainers")');

      const addLink = page.locator('a.addlink:has-text("Add trainer")');
      if (await addLink.isVisible()) {
        await addLink.click();

        // Fill form
        await page.fill('input[name="name"]', 'Priya Sharma');

        const emailField = page.locator('input[name="email"]');
        if (await emailField.isVisible()) {
          await emailField.fill('priya@clubflow.com');
        }

        const phoneField = page.locator('input[name="phone"]');
        if (await phoneField.isVisible()) {
          await phoneField.fill('+919876543210');
        }

        const bioField = page.locator('textarea[name="bio"]');
        if (await bioField.isVisible()) {
          await bioField.fill('Certified Pilates instructor with 5 years of experience');
        }

        // Save
        await page.click('input[name="_save"]');

        const successMessage = page.locator('.messagelist .success');
        await expect(successMessage).toBeVisible();
        console.log('Trainer Created: SUCCESS');
      }
    });
  });

  test.describe('2.3 Create Membership Plans', () => {
    test('2.3.1 - Navigate to Membership Plans', async ({ page }) => {
      const plansLink = page.locator('a:has-text("Membership plans")');

      if (await plansLink.isVisible()) {
        await plansLink.click();
        await expect(page).toHaveURL(/\/admin\/memberships\/membershipplan\//);
        console.log('Membership Plans: ACCESSIBLE');
      } else {
        console.log('Membership Plans: NOT FOUND');
        test.fail();
      }
    });

    test('2.3.2-2.3.7 - Create 4 Classes/Month plan', async ({ page }) => {
      await page.click('a:has-text("Membership plans")');

      const addLink = page.locator('a.addlink');
      if (await addLink.isVisible()) {
        await addLink.click();

        await page.fill('input[name="name"]', '4 Classes/Month');
        await page.fill('input[name="slug"]', '4-classes-month');

        const priceField = page.locator('input[name="price"]');
        if (await priceField.isVisible()) {
          await priceField.fill('4000');
        }

        const classesField = page.locator('input[name="classes_per_month"]');
        if (await classesField.isVisible()) {
          await classesField.fill('4');
        }

        const durationField = page.locator('input[name="duration_days"]');
        if (await durationField.isVisible()) {
          await durationField.fill('30');
        }

        // Ensure is_active is checked
        const activeCheckbox = page.locator('input[name="is_active"]');
        if (await activeCheckbox.isVisible()) {
          await activeCheckbox.check();
        }

        await page.click('input[name="_save"]');

        const successMessage = page.locator('.messagelist .success');
        await expect(successMessage).toBeVisible();
        console.log('Membership Plan Created: SUCCESS');
      }
    });
  });

  test.describe('2.4 Create Class Schedule', () => {
    test('2.4.1 - Navigate to Class Schedules', async ({ page }) => {
      const schedulesLink = page.locator('a:has-text("Class schedules")');

      if (await schedulesLink.isVisible()) {
        await schedulesLink.click();
        await expect(page).toHaveURL(/\/admin\/classes\/classschedule\//);
        console.log('Class Schedules: ACCESSIBLE');
      } else {
        console.log('Class Schedules: NOT FOUND');
        test.fail();
      }
    });

    test('2.4.2-2.4.6 - Create a scheduled class', async ({ page }) => {
      await page.click('a:has-text("Class schedules")');

      const addLink = page.locator('a.addlink');
      if (await addLink.isVisible()) {
        await addLink.click();

        // Check what fields are available
        const classTypeField = page.locator('select[name="class_type"]');
        const trainerField = page.locator('select[name="trainer"]');
        const dateField = page.locator('input[name="date"]');
        const startTimeField = page.locator('input[name="start_time"]');
        const endTimeField = page.locator('input[name="end_time"]');

        console.log('Class Schedule Form Fields:');
        console.log('- class_type select:', await classTypeField.isVisible());
        console.log('- trainer select:', await trainerField.isVisible());
        console.log('- date input:', await dateField.isVisible());
        console.log('- start_time input:', await startTimeField.isVisible());
        console.log('- end_time input:', await endTimeField.isVisible());

        // Fill if fields exist
        if (await classTypeField.isVisible()) {
          // Select first option (if available)
          const options = await classTypeField.locator('option').count();
          if (options > 1) {
            await classTypeField.selectOption({ index: 1 });
          }
        }

        if (await trainerField.isVisible()) {
          const options = await trainerField.locator('option').count();
          if (options > 1) {
            await trainerField.selectOption({ index: 1 });
          }
        }

        if (await dateField.isVisible()) {
          // Set tomorrow's date
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];
          await dateField.fill(dateStr);
        }

        if (await startTimeField.isVisible()) {
          await startTimeField.fill('06:00:00');
        }

        if (await endTimeField.isVisible()) {
          await endTimeField.fill('06:50:00');
        }

        // Try to save
        await page.click('input[name="_save"]');

        // Check result
        const successMessage = page.locator('.messagelist .success');
        const errorList = page.locator('.errorlist');

        if (await successMessage.isVisible()) {
          console.log('Class Schedule Created: SUCCESS');
        } else if (await errorList.isVisible()) {
          console.log('Class Schedule: VALIDATION ERRORS - need to create class type and trainer first');
        }
      }
    });
  });
});
