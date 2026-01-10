import apiClient from './client'

// Backend response type for list
interface BackendInvoiceListItem {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  status: string
  subtotal: number
  tax_amount: number
  total_amount: number
  paid_date: string | null
  description: string
}

// Backend response type for detail
interface BackendInvoiceDetail {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  status: string
  customer: {
    id: string
    name: string
    email: string
    address: string
  }
  line_items: Array<{
    description: string
    quantity: number
    unit_price: number
    amount: number
  }>
  subtotal: number
  cgst_amount: number
  sgst_amount: number
  total_amount: number
  paid_date: string | null
  payment_method: string | null
  notes: string
}

// Frontend types
export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidDate: string | null
  description: string
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface InvoiceDetail {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  customer: {
    id: string
    name: string
    email: string
    address: string
  }
  lineItems: InvoiceLineItem[]
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  totalAmount: number
  paidDate: string | null
  paymentMethod: string | null
  notes: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformInvoice = (data: BackendInvoiceListItem): Invoice => ({
  id: data.id,
  invoiceNumber: data.invoice_number,
  invoiceDate: data.invoice_date,
  dueDate: data.due_date,
  status: data.status as Invoice['status'],
  subtotal: data.subtotal,
  taxAmount: data.tax_amount,
  totalAmount: data.total_amount,
  paidDate: data.paid_date,
  description: data.description,
})

const transformInvoiceDetail = (data: BackendInvoiceDetail): InvoiceDetail => ({
  id: data.id,
  invoiceNumber: data.invoice_number,
  invoiceDate: data.invoice_date,
  dueDate: data.due_date,
  status: data.status as InvoiceDetail['status'],
  customer: data.customer,
  lineItems: data.line_items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    amount: item.amount,
  })),
  subtotal: data.subtotal,
  cgstAmount: data.cgst_amount,
  sgstAmount: data.sgst_amount,
  totalAmount: data.total_amount,
  paidDate: data.paid_date,
  paymentMethod: data.payment_method,
  notes: data.notes,
})

/**
 * Get user's invoices
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendInvoiceListItem>>('/invoices/')
  return response.data.results.map(transformInvoice)
}

/**
 * Get invoice detail
 */
export const getInvoiceDetail = async (invoiceId: string): Promise<InvoiceDetail> => {
  const response = await apiClient.get<BackendInvoiceDetail>(`/invoices/${invoiceId}/`)
  return transformInvoiceDetail(response.data)
}

/**
 * Get invoice PDF download URL
 */
export const getInvoicePdfUrl = (invoiceId: string): string => {
  return `${apiClient.defaults.baseURL}/invoices/${invoiceId}/pdf/`
}
