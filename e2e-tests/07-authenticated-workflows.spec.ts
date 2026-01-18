/**
 * Authenticated Role Workflow Tests
 * Uses storage state to maintain session across tests
 */

import { test, expect, Page, BrowserContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  MAILDEV_URL: 'http://localhost:1080',
  MANAGER_EMAIL: 'nikhils.telephonic@gmail.com',
  STAFF_EMAIL: 'nikhils.telephonic+1@gmail.com',
  STORAGE_STATE_FILE: 'test-results/.auth/manager.json',
}

// Maildev helpers
async function clearEmails(): Promise<void> {
  await fetch(`${CONFIG.MAILDEV_URL}/email/all`, { method: 'DELETE' })
}

async function getEmails(): Promise<any[]> {
  const response = await fetch(`${CONFIG.MAILDEV_URL}/email`)
  return response.json()
}

async function waitForEmailTo(address: string, timeout = 15000): Promise<any> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const emails = await getEmails()
    const email = emails.find(e =>
      e.to.some((t: any) => t.address.toLowerCase() === address.toLowerCase())
    )
    if (email) return email
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`No email received for ${address} within ${timeout}ms`)
}

function extractResetLink(emailText: string): { uid: string; token: string } | null {
  const match = emailText.match(/reset-password\?uid=([^&\s]+)&token=([^\s]+)/)
  if (match) {
    return { uid: match[1], token: match[2] }
  }
  return null
}

// ===========================================
// SETUP: Manager Authentication
// ===========================================

test.describe.serial('Manager Authentication Setup', () => {
  const managerPassword = 'TestManager123!'

  test('1. Request password reset for manager', async ({ page }) => {
    await clearEmails()

    await page.goto(`${CONFIG.FRONTEND_URL}/forgot-password`)
    await page.fill('input[type="email"]', CONFIG.MANAGER_EMAIL)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    console.log('Password reset requested for:', CONFIG.MANAGER_EMAIL)
  })

  test('2. Get reset email and set new password', async ({ page }) => {
    const email = await waitForEmailTo(CONFIG.MANAGER_EMAIL)
    console.log('Reset email received:', email.subject)

    const resetInfo = extractResetLink(email.text || '')
    expect(resetInfo).toBeTruthy()

    if (resetInfo) {
      await page.goto(`${CONFIG.FRONTEND_URL}/reset-password?uid=${resetInfo.uid}&token=${resetInfo.token}`)
      await page.waitForTimeout(1000)

      // Fill both password fields
      const passwordInputs = page.locator('input[type="password"]')
      const count = await passwordInputs.count()

      if (count >= 2) {
        await passwordInputs.nth(0).fill(managerPassword)
        await passwordInputs.nth(1).fill(managerPassword)
      } else if (count === 1) {
        await passwordInputs.nth(0).fill(managerPassword)
      }

      await page.click('button[type="submit"]')
      await page.waitForTimeout(2000)

      console.log('Password reset completed')
    }
  })

  test('3. Login and save session state', async ({ page, context }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/login`)
    await page.fill('input[type="email"]', CONFIG.MANAGER_EMAIL)
    await page.fill('input[type="password"]', managerPassword)
    await page.click('button[type="submit"]')

    // Wait for successful redirect
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 })
    console.log('Login successful, URL:', page.url())

    // Save storage state for reuse
    const storageDir = path.dirname(CONFIG.STORAGE_STATE_FILE)
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }
    await context.storageState({ path: CONFIG.STORAGE_STATE_FILE })
    console.log('Session state saved to:', CONFIG.STORAGE_STATE_FILE)
  })
})

// ===========================================
// MANAGER DASHBOARD TESTS (with auth)
// ===========================================

test.describe('Manager Dashboard Access', () => {
  // Use saved auth state
  test.use({
    storageState: CONFIG.STORAGE_STATE_FILE,
  })

  test('Dashboard - Main page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin`)
    await page.waitForTimeout(2000)

    // Should NOT be on login page
    expect(page.url()).not.toContain('/login')

    // Take screenshot
    await page.screenshot({ path: 'test-results/auth-manager-dashboard.png', fullPage: true })

    // Look for dashboard elements
    const pageContent = await page.content()
    console.log('Dashboard URL:', page.url())
    console.log('Has Dashboard text:', pageContent.includes('Dashboard') || pageContent.includes('dashboard'))
  })

  test('Customers page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/customers`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-customers.png', fullPage: true })

    const heading = page.locator('h1, h2').first()
    const headingText = await heading.textContent().catch(() => '')
    console.log('Customers page heading:', headingText)
  })

  test('Memberships page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/memberships`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-memberships.png', fullPage: true })
  })

  test('Schedule page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/schedule`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-schedule.png', fullPage: true })
  })

  test('Bookings page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/bookings`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-bookings.png', fullPage: true })
  })

  test('Check-in page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/check-in`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-checkin.png', fullPage: true })

    // Check for check-in specific elements
    const hasCardInput = await page.locator('input[placeholder*="card" i], input[placeholder*="scan" i]').count() > 0
    console.log('Has card/scan input:', hasCardInput)
  })

  test('Trials page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/trials`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-trials.png', fullPage: true })
  })

  test('Messages page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/messages`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-messages.png', fullPage: true })
  })

  test('Invoices page loads', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/invoices`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-invoices.png', fullPage: true })
  })

  test('Staff page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/staff`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-staff.png', fullPage: true })

    // Check for staff invite button
    const hasInviteButton = await page.locator('button:has-text("Invite"), a:has-text("Invite")').count() > 0
    console.log('Has invite button:', hasInviteButton)
  })

  test('Settings page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/settings`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-settings.png', fullPage: true })
  })

  test('Reports page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/reports`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-reports.png', fullPage: true })
  })

  test('Class Types page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/class-types`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-classtypes.png', fullPage: true })
  })

  test('Membership Plans page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/membership-plans`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-plans.png', fullPage: true })
  })

  test('Trainers page loads (owner-only)', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/trainers`)
    await page.waitForTimeout(2000)

    expect(page.url()).not.toContain('/login')
    await page.screenshot({ path: 'test-results/auth-manager-trainers.png', fullPage: true })
  })
})

// ===========================================
// MANAGER OPERATIONS TESTS
// ===========================================

test.describe('Manager Operations', () => {
  test.use({
    storageState: CONFIG.STORAGE_STATE_FILE,
  })

  test('Can view customer list', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/customers`)
    await page.waitForTimeout(2000)

    // Look for customer table or list
    const hasTable = await page.locator('table, [role="table"]').count() > 0
    const hasList = await page.locator('[class*="list"], [class*="grid"]').count() > 0

    console.log('Has customer table:', hasTable)
    console.log('Has customer list:', hasList)

    // Count visible customer rows
    const rows = await page.locator('tbody tr, [class*="customer"]').count()
    console.log('Customer rows visible:', rows)
  })

  test('Can view trial bookings list', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/trials`)
    await page.waitForTimeout(2000)

    const trialCards = await page.locator('[class*="card"], tbody tr').count()
    console.log('Trial entries visible:', trialCards)
  })

  test('Can view contact messages list', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/messages`)
    await page.waitForTimeout(2000)

    const messageCards = await page.locator('[class*="card"], tbody tr').count()
    console.log('Message entries visible:', messageCards)
  })

  test('Can access staff invite modal', async ({ page }) => {
    await page.goto(`${CONFIG.FRONTEND_URL}/admin/staff`)
    await page.waitForTimeout(2000)

    // Click invite button
    const inviteButton = page.locator('button:has-text("Invite"), a:has-text("Invite")')
    if (await inviteButton.count() > 0) {
      await inviteButton.first().click()
      await page.waitForTimeout(1000)

      // Check for modal
      const hasModal = await page.locator('[role="dialog"], [class*="modal"]').count() > 0
      console.log('Invite modal opened:', hasModal)

      await page.screenshot({ path: 'test-results/auth-manager-invite-modal.png', fullPage: true })
    }
  })
})

// ===========================================
// SUMMARY
// ===========================================

test.afterAll(async () => {
  console.log('\n' + '='.repeat(60))
  console.log('AUTHENTICATED WORKFLOW TESTS COMPLETED')
  console.log('='.repeat(60))
  console.log('\nScreenshots saved with "auth-" prefix in test-results/')
  console.log('='.repeat(60) + '\n')
})
