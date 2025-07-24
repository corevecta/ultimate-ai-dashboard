'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Layers,
  GitBranch,
  Cpu,
  Package,
  Settings,
  Terminal,
  Sparkles,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Brain,
  Boxes,
  Code2,
  Workflow,
  Database,
  CloudLightning,
  Palette,
  MessageSquare,
  FileCode2,
  Rocket,
  Server,
  Bot,
  Puzzle,
  AlertTriangle,
  BookOpen,
  Component
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { CommandMenu } from '../command-menu'
import { ThemeToggle } from '../theme-toggle'
import { NotificationCenter } from '../notification-center'
import { UserMenu } from '../user-menu'
import { navigationItems } from '../../src/lib/navigation'

const features = [
  { icon: Zap, label: 'Real-time', color: 'text-yellow-500' },
  { icon: Shield, label: 'Secure', color: 'text-green-500' },
  { icon: CloudLightning, label: 'Edge', color: 'text-blue-500' },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className={cn(
          "relative z-40 flex flex-col border-r border-white/10 bg-gray-950/50 backdrop-blur-xl",
          "transition-all duration-300 ease-in-out"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                <Cpu className="h-full w-full text-white" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30 blur-md" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-lg font-bold text-gradient"
                >
                  AI Orchestrator
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-white/10 hover:text-white",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white"
                    : "text-gray-400"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && sidebarOpen && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Features */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-around">
            {features.map((feature, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-1",
                  sidebarOpen ? "flex-1" : ""
                )}
              >
                <feature.icon className={cn("h-5 w-5", feature.color)} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-gray-400"
                    >
                      {feature.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-gray-950/50 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-8 rounded bg-white/10 px-2 py-0.5 text-xs">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationCenter />
            <UserMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
      </div>

      {/* Command Menu */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}