/**
 * E2E Test Helpers
 * Common utilities for Playwright tests including Maildev integration
 */

import { Page, expect } from '@playwright/test'

// ===========================================
// Configuration
// ===========================================

export const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:8000',
  MAILDEV_URL: 'http://localhost:1080',
  ADMIN_URL: 'http://localhost:8000/admin/',

  // Test credentials - Manager
  MANAGER_EMAIL: 'nikhils.telephonic@gmail.com',
  MANAGER_PASSWORD: 'manager123',

  // Django Admin superuser
  ADMIN_EMAIL: 'admin@clubflow.com',
  ADMIN_PASSWORD: 'clubflow',
}

// ===========================================
// Email Helpers (Maildev Integration)
// ===========================================

export interface MaildevEmail {
  id: string
  from: Array<{ address: string; name: string }>
  to: Array<{ address: string; name: string }>
  subject: string
  text: string
  html: string
  date: string
}

/**
 * Get all emails from Maildev
 */
export async function getEmails(): Promise<MaildevEmail[]> {
  const response = await fetch(`${CONFIG.MAILDEV_URL}/email`)
  if (!response.ok) {
    throw new Error(`Failed to fetch emails: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Get emails for a specific email address
 */
export async function getEmailsFor(address: string): Promise<MaildevEmail[]> {
  const emails = await getEmails()
  return emails.filter(e =>
    e.to.some(recipient => recipient.address.toLowerCase() === address.toLowerCase())
  )
}

/**
 * Get the latest email for a specific address
 */
export async function getLatestEmailFor(address: string): Promise<MaildevEmail | null> {
  const emails = await getEmailsFor(address)
  if (emails.length === 0) return null
  // Sort by date descending and return the most recent
  return emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

/**
 * Clear all emails from Maildev
 */
export async function clearEmails(): Promise<void> {
  await fetch(`${CONFIG.MAILDEV_URL}/email/all`, { method: 'DELETE' })
}

/**
 * Wait for an email to arrive for a specific address
 */
export async function waitForEmail(
  address: string,
  options: { timeout?: number; pollInterval?: number } = {}
): Promise<MaildevEmail> {
  const { timeout = 10000, pollInterval = 500 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const email = await getLatestEmailFor(address)
    if (email) return email
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error(`No email received for ${address} within ${timeout}ms`)
}

/**
 * Extract a URL/link from email text using a pattern
 */
export function extractLink(emailText: string, pattern: RegExp): string | null {
  const match = emailText.match(pattern)
  return match ? match[0] : null
}

/**
 * Extract temporary password from staff invitation email
 */
export function extractTempPassword(emailText: string): string | null {
  const match = emailText.match(/Temporary Password:\s*(\S+)/i)
  return match ? match[1] : null
}

// ===========================================
// Authentication Helpers
// ===========================================

/**
 * Login to Django Admin
 */
export async function adminLogin(page: Page, email?: string, password?: string): Promise<void> {
  const adminEmail = email || CONFIG.ADMIN_EMAIL
  const adminPassword = password || CONFIG.ADMIN_PASSWORD

  await page.goto(`${CONFIG.ADMIN_URL}login/`)
  await page.fill('input[name="username"]', adminEmail)
  await page.fill('input[name="password"]', adminPassword)
  await page.click('input[type="submit"]')
  await page.waitForURL(`${CONFIG.ADMIN_URL}**`)
}

/**
 * Login to frontend as a user
 */
export async function frontendLogin(page: Page, email: string, password: string): Promise<void> {
  await page.goto(`${CONFIG.FRONTEND_URL}/login`)
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  // Wait for redirect away from login
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 })
}

/**
 * Login to Admin Dashboard (React frontend)
 */
export async function adminDashboardLogin(page: Page, email?: string, password?: string): Promise<void> {
  const loginEmail = email || CONFIG.MANAGER_EMAIL
  const loginPassword = password || CONFIG.MANAGER_PASSWORD

  await page.goto(`${CONFIG.FRONTEND_URL}/admin`)
  // If redirected to login, authenticate
  if (page.url().includes('/login')) {
    await page.fill('input[type="email"]', loginEmail)
    await page.fill('input[type="password"]', loginPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/admin/**', { timeout: 10000 })
  }
}

/**
 * Logout from frontend
 */
export async function frontendLogout(page: Page): Promise<void> {
  // Clear localStorage to logout
  await page.evaluate(() => {
    localStorage.clear()
  })
  await page.goto(`${CONFIG.FRONTEND_URL}/login`)
}

// ===========================================
// UI Helpers
// ===========================================

/**
 * Hide Django debug toolbar if present
 */
export async function hideDebugToolbar(page: Page): Promise<void> {
  await page.addStyleTag({
    content: '#djDebug { display: none !important; }'
  })
}

/**
 * Wait for toast notification and get its text
 */
export async function waitForToast(page: Page): Promise<string> {
  const toast = page.locator('[class*="toast"], [role="alert"]').first()
  await toast.waitFor({ state: 'visible', timeout: 5000 })
  return await toast.textContent() || ''
}

/**
 * Generate unique test email
 */
export function generateTestEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}@example.com`
}

/**
 * Generate unique test phone
 */
export function generateTestPhone(): string {
  return `98${Math.floor(10000000 + Math.random() * 90000000)}`
}

// ===========================================
// API Helpers
// ===========================================

/**
 * Make authenticated API call to backend
 */
export async function apiCall(
  endpoint: string,
  options: {
    method?: string
    body?: object
    token?: string
  } = {}
): Promise<Response> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${CONFIG.BACKEND_URL}/api/v1${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}
