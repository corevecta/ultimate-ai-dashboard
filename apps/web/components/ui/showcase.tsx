'use client'

import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Checkbox } from './checkbox'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Slider } from './slider'

export function UIShowcase() {
  const [checked, setChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [sliderValue, setSliderValue] = useState([50])

  return (
    <div className="space-y-8 p-8">
      <div className="glass rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gradient">UI Components Showcase</h2>
        
        {/* Buttons */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Enter your password" />
            </div>
          </div>
        </section>

        {/* Checkbox */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Checkbox</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={checked} 
              onCheckedChange={(checked) => setChecked(checked as boolean)}
            />
            <Label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </Label>
          </div>
        </section>

        {/* Radio Group */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Radio Group</h3>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" />
              <Label htmlFor="option3">Option 3</Label>
            </div>
          </RadioGroup>
        </section>

        {/* Slider */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Slider</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Volume</Label>
              <span className="text-sm text-gray-400">{sliderValue[0]}%</span>
            </div>
            <Slider 
              value={sliderValue} 
              onValueChange={setSliderValue}
              max={100} 
              step={1} 
            />
          </div>
        </section>
      </div>
    </div>
  )
}