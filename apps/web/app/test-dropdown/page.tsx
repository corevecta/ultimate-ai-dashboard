'use client'

import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TestDropdownPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dropdown Menu</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic Dropdown</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => console.log('View Details')}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Edit')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Delete')}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Without asChild</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="p-2 border rounded">Click me</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Inline Button</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 border rounded">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Test 1</DropdownMenuItem>
              <DropdownMenuItem>Test 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}