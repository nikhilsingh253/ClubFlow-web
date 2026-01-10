import { test, expect } from '@playwright/test';

const ADMIN_URL = 'http://localhost:8000/admin/';
const ADMIN_EMAIL = 'admin@clubflow.com';
const ADMIN_PASSWORD = 'clubflow';

// Helper to login
async function adminLogin(page: any) {
  await page.goto(ADMIN_URL);
  await page.fill('input[name="username"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('input[type="submit"]');
  await expect(page).toHaveURL(/\/admin\/$/);
}

// Helper to hide debug toolbar if present
async function hideDebugToolbar(page: any) {
  const hideButton = page.locator('#djHideToolBarButton');
  if (await hideButton.isVisible()) {
    await hideButton.click();
    await page.waitForTimeout(500);
  }
}

test.describe.serial('Seed Sample Data', () => {
  test('1. Create Class Types', async ({ page }) => {
    await adminLogin(page);
    await hideDebugToolbar(page);

    // Navigate to Class Types
    await page.click('a:has-text("Class types")');
    await page.waitForLoadState('networkidle');

    const classTypes = [
      { name: 'Intro Reformer', slug: 'intro-reformer', description: 'Perfect introduction to Pilates for beginners. Learn the fundamentals of Reformer exercises.', level: 'beginner', duration: 50, capacity: 8 },
      { name: 'Foundation', slug: 'foundation', description: 'Build upon the basics with this intermediate-level class. Focus on core strength and flexibility.', level: 'intermediate', duration: 50, capacity: 8 },
      { name: 'Advanced Flow', slug: 'advanced-flow', description: 'Challenging sequences for experienced practitioners. Requires strong foundation in Pilates.', level: 'advanced', duration: 55, capacity: 6 },
    ];

    for (const ct of classTypes) {
      // Check if already exists
      const existingRow = page.locator(`td:has-text("${ct.name}")`);
      if (await existingRow.count() > 0) {
        console.log(`Class Type "${ct.name}" already exists, skipping`);
        continue;
      }

      await page.click('a.addlink');
      await page.waitForLoadState('networkidle');
      await hideDebugToolbar(page);

      await page.fill('input[name="name"]', ct.name);
      await page.fill('input[name="slug"]', ct.slug);

      const descField = page.locator('textarea[name="description"]');
      if (await descField.isVisible()) await descField.fill(ct.description);

      const levelField = page.locator('select[name="level"]');
      if (await levelField.isVisible()) await levelField.selectOption(ct.level);

      const durationField = page.locator('input[name="duration_minutes"]');
      if (await durationField.isVisible()) await durationField.fill(ct.duration.toString());

      const capacityField = page.locator('input[name="max_capacity"]');
      if (await capacityField.isVisible()) await capacityField.fill(ct.capacity.toString());

      // Check is_active
      const activeCheckbox = page.locator('input[name="is_active"]');
      if (await activeCheckbox.isVisible()) await activeCheckbox.check();

      await page.click('input[name="_save"]');
      await page.waitForLoadState('networkidle');

      console.log(`Created Class Type: ${ct.name}`);
    }

    console.log('✅ Class Types seeded');
  });

  test('2. Create Trainers', async ({ page }) => {
    await adminLogin(page);
    await hideDebugToolbar(page);

    // Navigate to Trainers
    await page.click('a:has-text("Trainers")');
    await page.waitForLoadState('networkidle');

    const trainers = [
      { name: 'Priya Sharma', email: 'priya@clubflow.com', phone: '+919876543210', bio: 'Certified Pilates instructor with 5 years of experience. Specializes in Reformer and rehabilitation.', experience: 5 },
      { name: 'Rahul Verma', email: 'rahul@clubflow.com', phone: '+919876543211', bio: 'Former professional dancer turned Pilates instructor. Expert in movement and flexibility.', experience: 3 },
      { name: 'Anita Desai', email: 'anita@clubflow.com', phone: '+919876543212', bio: 'Senior instructor with certifications in Classical and Contemporary Pilates. Passionate about wellness.', experience: 8 },
    ];

    for (const trainer of trainers) {
      // Check if already exists
      const existingRow = page.locator(`td:has-text("${trainer.name}")`);
      if (await existingRow.count() > 0) {
        console.log(`Trainer "${trainer.name}" already exists, skipping`);
        continue;
      }

      await page.click('a.addlink');
      await page.waitForLoadState('networkidle');
      await hideDebugToolbar(page);

      await page.fill('input[name="name"]', trainer.name);

      const emailField = page.locator('input[name="email"]');
      if (await emailField.isVisible()) await emailField.fill(trainer.email);

      const phoneField = page.locator('input[name="phone"]');
      if (await phoneField.isVisible()) await phoneField.fill(trainer.phone);

      const bioField = page.locator('textarea[name="bio"]');
      if (await bioField.isVisible()) await bioField.fill(trainer.bio);

      const expField = page.locator('input[name="years_experience"]');
      if (await expField.isVisible()) await expField.fill(trainer.experience.toString());

      // Check is_active
      const activeCheckbox = page.locator('input[name="is_active"]');
      if (await activeCheckbox.isVisible()) await activeCheckbox.check();

      await page.click('input[name="_save"]');
      await page.waitForLoadState('networkidle');

      console.log(`Created Trainer: ${trainer.name}`);
    }

    console.log('✅ Trainers seeded');
  });

  test('3. Create Membership Plans', async ({ page }) => {
    await adminLogin(page);
    await hideDebugToolbar(page);

    // Navigate to Membership Plans
    await page.click('a:has-text("Membership plans")');
    await page.waitForLoadState('networkidle');

    const plans = [
      { name: '4 Classes/Month', slug: '4-classes-month', description: 'Perfect for beginners - 4 classes per month with flexible scheduling.', price: 4000, classes: 4, duration: 30 },
      { name: '8 Classes/Month', slug: '8-classes-month', description: 'Our most popular plan - 8 classes per month for regular practice.', price: 7000, classes: 8, duration: 30 },
      { name: 'Unlimited', slug: 'unlimited', description: 'For the dedicated practitioner - unlimited classes all month long.', price: 12000, classes: 30, duration: 30 },
    ];

    for (const plan of plans) {
      // Check if already exists
      const existingRow = page.locator(`td:has-text("${plan.name}")`);
      if (await existingRow.count() > 0) {
        console.log(`Membership Plan "${plan.name}" already exists, skipping`);
        continue;
      }

      await page.click('a.addlink');
      await page.waitForLoadState('networkidle');
      await hideDebugToolbar(page);

      await page.fill('input[name="name"]', plan.name);
      await page.fill('input[name="slug"]', plan.slug);

      const descField = page.locator('textarea[name="description"]');
      if (await descField.isVisible()) await descField.fill(plan.description);

      const priceField = page.locator('input[name="price"]');
      if (await priceField.isVisible()) await priceField.fill(plan.price.toString());

      const classesField = page.locator('input[name="classes_per_month"]');
      if (await classesField.isVisible()) await classesField.fill(plan.classes.toString());

      const durationField = page.locator('input[name="duration_days"]');
      if (await durationField.isVisible()) await durationField.fill(plan.duration.toString());

      // Check is_active
      const activeCheckbox = page.locator('input[name="is_active"]');
      if (await activeCheckbox.isVisible()) await activeCheckbox.check();

      await page.click('input[name="_save"]');
      await page.waitForLoadState('networkidle');

      console.log(`Created Membership Plan: ${plan.name}`);
    }

    console.log('✅ Membership Plans seeded');
  });

  test('4. Create Studio Configuration', async ({ page }) => {
    await adminLogin(page);
    await hideDebugToolbar(page);

    // Navigate to Studio Configuration
    const studioConfigLink = page.locator('a:has-text("Studio configuration")');
    if (await studioConfigLink.isVisible()) {
      await studioConfigLink.click();
      await page.waitForLoadState('networkidle');

      // Check if config already exists
      const existingRow = page.locator('table#result_list tbody tr');
      if (await existingRow.count() > 0) {
        console.log('Studio Configuration already exists, skipping');
        return;
      }

      const addLink = page.locator('a.addlink');
      if (await addLink.isVisible()) {
        await addLink.click();
        await page.waitForLoadState('networkidle');
        await hideDebugToolbar(page);

        // Fill studio details
        await page.fill('input[name="name"]', 'FitRit Pilates Studio');

        const addressField = page.locator('input[name="address_line1"]');
        if (await addressField.isVisible()) await addressField.fill('123 MG Road, Block A');

        const address2Field = page.locator('input[name="address_line2"]');
        if (await address2Field.isVisible()) await address2Field.fill('Near City Mall');

        const cityField = page.locator('input[name="city"]');
        if (await cityField.isVisible()) await cityField.fill('Gurgaon');

        const stateField = page.locator('input[name="state"]');
        if (await stateField.isVisible()) await stateField.fill('Haryana');

        const pincodeField = page.locator('input[name="pincode"]');
        if (await pincodeField.isVisible()) await pincodeField.fill('122001');

        const phoneField = page.locator('input[name="phone"]');
        if (await phoneField.isVisible()) await phoneField.fill('+91-124-4567890');

        const emailField = page.locator('input[name="email"]');
        if (await emailField.isVisible()) await emailField.fill('info@fitrit.com');

        const gstinField = page.locator('input[name="gstin"]');
        if (await gstinField.isVisible()) await gstinField.fill('06AABCT1234F1ZH');

        const hsnField = page.locator('input[name="hsn_sac_code"]');
        if (await hsnField.isVisible()) await hsnField.fill('999293');

        await page.click('input[name="_save"]');
        await page.waitForLoadState('networkidle');

        console.log('Created Studio Configuration');
      }
    } else {
      console.log('Studio Configuration not found in admin');
    }

    console.log('✅ Studio Configuration seeded');
  });

  test('5. Create Class Schedules for Next Week', async ({ page }) => {
    await adminLogin(page);
    await hideDebugToolbar(page);

    // Navigate to Class Schedules
    await page.click('a:has-text("Class schedules")');
    await page.waitForLoadState('networkidle');

    // Generate dates for next 7 days
    const schedules = [];
    const times = ['06:00', '09:00', '11:00', '17:00', '19:00'];

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Add 2-3 classes per day
      const numClasses = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < numClasses; j++) {
        schedules.push({
          date: dateStr,
          startTime: times[j],
          endTime: times[j].replace(':00', ':50'),
        });
      }
    }

    // Create first 5 schedules (to keep test reasonable)
    for (let i = 0; i < Math.min(5, schedules.length); i++) {
      const schedule = schedules[i];

      await page.click('a.addlink');
      await page.waitForLoadState('networkidle');
      await hideDebugToolbar(page);

      // Select class type (first available)
      const classTypeField = page.locator('select[name="class_type"]');
      if (await classTypeField.isVisible()) {
        const options = await classTypeField.locator('option').count();
        if (options > 1) {
          await classTypeField.selectOption({ index: (i % (options - 1)) + 1 });
        }
      }

      // Select trainer (first available)
      const trainerField = page.locator('select[name="trainer"]');
      if (await trainerField.isVisible()) {
        const options = await trainerField.locator('option').count();
        if (options > 1) {
          await trainerField.selectOption({ index: (i % (options - 1)) + 1 });
        }
      }

      // Set date
      const dateField = page.locator('input[name="date"]');
      if (await dateField.isVisible()) {
        await dateField.fill(schedule.date);
      }

      // Set times
      const startTimeField = page.locator('input[name="start_time"]');
      if (await startTimeField.isVisible()) {
        await startTimeField.fill(schedule.startTime + ':00');
      }

      const endTimeField = page.locator('input[name="end_time"]');
      if (await endTimeField.isVisible()) {
        await endTimeField.fill(schedule.endTime + ':00');
      }

      // Set location
      const locationField = page.locator('input[name="location"]');
      if (await locationField.isVisible()) {
        await locationField.fill('Studio A');
      }

      await page.click('input[name="_save"]');
      await page.waitForLoadState('networkidle');

      console.log(`Created Schedule: ${schedule.date} ${schedule.startTime}`);
    }

    console.log('✅ Class Schedules seeded');
  });
});
