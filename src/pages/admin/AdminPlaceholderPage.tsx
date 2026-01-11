import { Construction } from 'lucide-react'

interface AdminPlaceholderPageProps {
  title: string
  description?: string
}

export default function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <Construction className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="text-2xl font-display font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500 max-w-md">
        {description || 'This feature is coming soon. Check back later!'}
      </p>
    </div>
  )
}
