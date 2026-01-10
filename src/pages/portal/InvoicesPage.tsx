import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Receipt, Download, X, Eye, Calendar, CreditCard, CheckCircle } from 'lucide-react'
import { getInvoices, getInvoiceDetail, getInvoicePdfUrl, type InvoiceDetail } from '@/api/invoices'
import { formatCurrency, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useAuthStore } from '@/store/authStore'

export default function InvoicesPage() {
  const { accessToken } = useAuthStore()
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  })

  const { data: invoiceDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['invoiceDetail', selectedInvoiceId],
    queryFn: () => getInvoiceDetail(selectedInvoiceId!),
    enabled: !!selectedInvoiceId,
  })

  const handleDownload = (invoiceId: string) => {
    const url = getInvoicePdfUrl(invoiceId)
    window.open(`${url}?token=${accessToken}`, '_blank')
  }

  const handleViewDetail = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
  }

  const handleCloseModal = () => {
    setSelectedInvoiceId(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          Invoices
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and download your payment invoices
        </p>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-taupe-50">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blush-600" />
            All Invoices
          </h2>
        </div>
        {invoices && invoices.length > 0 ? (
          <div className="divide-y divide-border">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-taupe-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blush-100 rounded-lg">
                    <Receipt className="h-5 w-5 text-blush-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(invoice.invoiceDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      invoice.status === 'paid'
                        ? 'bg-sage-100 text-sage-700'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(invoice.id)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-taupe-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(invoice.id)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-taupe-100 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-taupe-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No invoices yet</p>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        All amounts include 18% GST (CGST 9% + SGST 9%)
      </p>

      {/* Invoice Detail Modal */}
      {selectedInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Invoice Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-taupe-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoadingDetail ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : invoiceDetail ? (
                <InvoiceDetailContent
                  invoice={invoiceDetail}
                  onDownload={() => handleDownload(invoiceDetail.id)}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Failed to load invoice details
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InvoiceDetailContent({
  invoice,
  onDownload,
}: {
  invoice: InvoiceDetail
  onDownload: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-foreground">
            {invoice.invoiceNumber}
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(invoice.invoiceDate)}
            </span>
            {invoice.paidDate && (
              <span className="flex items-center gap-1 text-sage-600">
                <CheckCircle className="h-4 w-4" />
                Paid {formatDate(invoice.paidDate)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm rounded-full capitalize ${
            invoice.status === 'paid'
              ? 'bg-sage-100 text-sage-700'
              : invoice.status === 'overdue'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      {invoice.customer && (
        <div className="p-4 bg-taupe-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Billed To</p>
          <p className="font-medium text-foreground">{invoice.customer.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
        </div>
      )}

      {/* Line Items */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-taupe-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Description
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                Price
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoice.lineItems.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-foreground">
                  {item.description}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground text-right">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border border-border rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">CGST (9%)</span>
          <span className="text-foreground">{formatCurrency(invoice.cgstAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">SGST (9%)</span>
          <span className="text-foreground">{formatCurrency(invoice.sgstAmount)}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-semibold text-foreground text-lg">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {invoice.paymentMethod && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4" />
          <span>Paid via {invoice.paymentMethod.toUpperCase()}</span>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="p-4 bg-taupe-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="text-sm text-foreground mt-1">{invoice.notes}</p>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={onDownload}
        className="w-full btn-elegant-primary flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </button>
    </div>
  )
}
