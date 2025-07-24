#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}   Ultimate AI Dashboard 2025${NC}"
echo -e "${PURPLE}   Next.js 15 + React 19 + Tailwind v4${NC}"
echo -e "${PURPLE}========================================${NC}\n"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}📦 Installing pnpm...${NC}"
    npm install -g pnpm
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

# Create necessary directories
mkdir -p apps/web/components/{dashboard,ui,layout}
mkdir -p apps/web/lib/{trpc,realtime,utils}
mkdir -p packages/ui/src/{components,hooks,lib}
mkdir -p packages/database/prisma
mkdir -p packages/api/src/{routers,services}

# Create a minimal working setup
echo -e "${YELLOW}🔧 Creating minimal setup...${NC}"

# Create utils file
cat > packages/ui/src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create components index
cat > packages/ui/src/index.ts << 'EOF'
export * from './components/card-spotlight'
export * from './lib/utils'
EOF

# Create minimal lib files for the web app
mkdir -p apps/web/lib
cat > apps/web/lib/utils.ts << 'EOF'
export { cn } from '@ultimate-ai/ui'
EOF

# Create placeholder components
cat > apps/web/components/theme-provider.tsx << 'EOF'
'use client'
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
EOF

cat > apps/web/components/command-menu.tsx << 'EOF'
'use client'
export function CommandMenu({ open, onOpenChange }: any) {
  return null
}
EOF

cat > apps/web/components/theme-toggle.tsx << 'EOF'
'use client'
export function ThemeToggle() {
  return <button className="p-2">🌙</button>
}
EOF

cat > apps/web/components/notification-center.tsx << 'EOF'
'use client'
export function NotificationCenter() {
  return <button className="p-2">🔔</button>
}
EOF

cat > apps/web/components/user-menu.tsx << 'EOF'
'use client'
export function UserMenu() {
  return <button className="p-2">👤</button>
}
EOF

# Create placeholder providers
cat > apps/web/lib/trpc/provider.tsx << 'EOF'
'use client'
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
EOF

cat > apps/web/lib/realtime/provider.tsx << 'EOF'
'use client'
export function PartySocketProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
EOF

# Create dashboard components
cat > apps/web/components/ui/loading-state.tsx << 'EOF'
export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
EOF

# Create placeholder dashboard components
for component in metrics-overview pipeline-visualization activity-feed projects-grid system-status ai-insights; do
  cat > apps/web/components/dashboard/${component}.tsx << EOF
export function $(echo $component | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^\([a-z]\)/\U\1/') {
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gradient mb-4">
        $(echo $component | sed 's/-/ /g' | sed 's/\b\(.\)/\U\1/g')
      </h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  )
}
EOF
done

# Create tailwind config
cat > apps/web/tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'blob': 'blob 7s infinite',
      },
    },
  },
  plugins: [],
}

export default config
EOF

# Create PostCSS config
cat > apps/web/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create tsconfig
cat > apps/web/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@ultimate-ai/ui": ["../../packages/ui/src"],
      "@ultimate-ai/api": ["../../packages/api/src"],
      "@ultimate-ai/database": ["../../packages/database/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create .env.local
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_APP_URL=http://localhost:3002
DATABASE_URL=postgresql://user:password@localhost:5432/ultimate_ai
OPENAI_API_KEY=your-api-key-here
EOF

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${BLUE}Starting the modern dashboard on port 3002...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📍 Classic Dashboard:${NC} http://localhost:3000"
echo -e "${GREEN}📍 React UI:${NC} http://localhost:3000/orchestrator"
echo -e "${GREEN}📍 Modern Dashboard:${NC} http://localhost:3002"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Start the development server
cd apps/web
PORT=3002 pnpm dev