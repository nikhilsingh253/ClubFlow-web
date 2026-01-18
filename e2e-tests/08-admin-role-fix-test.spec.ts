/**
 * Admin Role Detection Fix Test
 * Verifies that manager/staff users are redirected to admin dashboard after login
 */

import { test, expect } from '@playwright/test'

const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  MAILDEV_URL: 'http://localhost:1080',
  MANAGER_EMAIL: 'nikhils.telephonic@gmail.com',
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

test.describe.serial('Admin Role Detection Fix', () => {
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

  test('3. Login as manager and verify redirect to admin dashboard', async ({ page }) => {
    // Clear any existing auth state
    await page.goto(`${CONFIG.FRONTEND_URL}/login`)
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await page.fill('input[type="email"]', CONFIG.MANAGER_EMAIL)
    await page.fill('input[type="password"]', managerPassword)
    await page.click('button[type="submit"]')

    // Wait for navigation after login
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 })

    const currentUrl = page.url()
    console.log('After login, URL:', currentUrl)

    // THE KEY TEST: Manager should be redirected to /admin, NOT /portal
    expect(currentUrl).toContain('/admin')
    expect(currentUrl).not.toContain('/portal')

    // Take screenshot as proof
    await page.screenshot({ path: 'test-results/admin-role-fix-verified.png', fullPage: true })

    // Verify dashboard content is visible (not login page or access denied)
    const pageContent = await page.content()
    const hasDashboardContent =
      pageContent.includes('Dashboard') ||
      pageContent.includes('dashboard') ||
      pageContent.includes('Admin')

    console.log('Dashboard content visible:', hasDashboardContent)
    expect(hasDashboardContent).toBe(true)
  })

  test('4. Verify admin navigation works after re-login', async ({ page }) => {
    // Login again since session doesn't persist between tests
    await page.goto(`${CONFIG.FRONTEND_URL}/login`)
    await page.fill('input[type="email"]', CONFIG.MANAGER_EMAIL)
    await page.fill('input[type="password"]', managerPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 })

    // Now navigate to admin dashboard
    await page.goto(`${CONFIG.FRONTEND_URL}/admin`)
    await page.waitForTimeout(2000)

    // Should stay on admin page, not redirect to login
    const currentUrl = page.url()
    console.log('Admin dashboard URL:', currentUrl)

    expect(currentUrl).not.toContain('/login')
    expect(currentUrl).toContain('/admin')

    await page.screenshot({ path: 'test-results/admin-navigation-verified.png', fullPage: true })
  })
})

test.afterAll(async () => {
  console.log('\n' + '='.repeat(60))
  console.log('ADMIN ROLE DETECTION FIX TEST COMPLETED')
  console.log('='.repeat(60))
  console.log('\nIf test 3 passed, the fix is working correctly.')
  console.log('Manager users now redirect to /admin instead of /portal')
  console.log('='.repeat(60) + '\n')
})
