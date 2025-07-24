'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function SimpleTestGrid() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, withSpecification: 0, withMarketEnhanced: 0 })

  useEffect(() => {
    fetch('/api/projects?limit=10')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2>Simple Test Grid</h2>
      
      {/* Test 1: Basic stats */}
      <div className="p-4 bg-gray-800 rounded">
        <div>Total: {stats.total}</div>
        <div>With Spec: {stats.withSpecification}</div>
        <div>Market Enhanced: {stats.withMarketEnhanced}</div>
      </div>

      {/* Test 2: Button with text */}
      <Button>
        Simple Button
      </Button>

      {/* Test 3: Just paragraph tags */}
      <div className="p-4 bg-gray-800 rounded">
        <p className="text-purple-400 text-sm">Test Label</p>
        <p className="text-3xl font-bold text-white mt-1">123</p>
      </div>
    </div>
  )
}