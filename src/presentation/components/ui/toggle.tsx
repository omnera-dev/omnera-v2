import * as TogglePrimitive from '@radix-ui/react-toggle'
import * as React from 'react'
import { toggleVariants } from '@/presentation/components/ui/toggle-variants'
import { cn } from '@/presentation/utils/cn'
import type { VariantProps } from 'class-variance-authority'

function Toggle({
  className,
  variant,
  size,
  ...props
}: Readonly<React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle }
