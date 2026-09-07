import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'SkillSync Maharashtra | Bridging Industry Demand with Future-Ready Skills',
  description: 'AI-powered labour-market intelligence & skill-development decision-support platform for the Government of Maharashtra.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
