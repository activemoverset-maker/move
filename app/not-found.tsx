import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="max-w-md w-full border-0 shadow-xl bg-white">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-green-700">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/services" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                View Our Services
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Need help? Contact us:</p>
            <a 
              href={`tel:${SITE_CONFIG.links.phone}`}
              className="text-primary hover:text-green-700 font-medium"
            >
              {SITE_CONFIG.links.phone}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
 
 
 