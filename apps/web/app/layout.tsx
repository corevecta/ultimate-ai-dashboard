import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '../components/theme-provider'
import { TRPCProvider } from '../lib/trpc/provider'
import { PartySocketProvider } from '../lib/realtime/provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Orchestrator | Ultimate Dashboard',
  description: 'Next-generation AI orchestration platform with real-time monitoring',
  keywords: ['AI', 'orchestration', 'dashboard', 'monitoring', 'real-time'],
  authors: [{ name: 'Ultimate AI Team' }],
  openGraph: {
    title: 'AI Orchestrator Dashboard',
    description: 'Powerful AI orchestration with stunning visualizations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            <PartySocketProvider>
              {/* Animated background with gradients */}
              <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
                
                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                
                {/* Grid overlay */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '4rem 4rem',
                  }}
                />
              </div>
              
              {/* Main content */}
              <div className="relative min-h-screen">
                {children}
              </div>
              
              {/* Global notifications */}
              <Toaster 
                position="bottom-right"
                theme="dark"
                richColors
                closeButton
                expand
              />
            </PartySocketProvider>
          </TRPCProvider>
        </ThemeProvider>
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}