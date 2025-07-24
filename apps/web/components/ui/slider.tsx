import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../lib/utils'

const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full glass">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        'block h-5 w-5 rounded-full border-2 border-purple-500 bg-gray-950',
        'ring-offset-gray-950 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'hover:scale-110 hover:border-purple-400',
        'shadow-lg shadow-purple-500/25'
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }