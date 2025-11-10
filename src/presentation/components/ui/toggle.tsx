/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import * as TogglePrimitive from '@radix-ui/react-toggle'
import * as React from 'react'
import { toggleVariants } from '@/presentation/components/ui/toggle-variants'
import { cn } from '@/presentation/styling/cn'
import type { VariantProps } from 'class-variance-authority'

function Toggle({
  className,
  variant,
  size,
  ...props
}: Readonly<
  React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle }
