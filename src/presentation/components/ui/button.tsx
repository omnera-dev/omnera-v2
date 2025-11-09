/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import type { CtaButtonColor } from '@/domain/models/app/page/layout/navigation/cta-button'
import { cn } from '@/presentation/styling/cn'
import { resolveThemeColor } from '@/presentation/styling/theme-colors'
import { buttonVariants } from './button-variants'

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
      color?: CtaButtonColor
    }
>) {
  const Comp = asChild ? Slot : 'button'
  const variantClass = variant ? `btn-${variant}` : undefined
  const sizeClass = size ? `btn-${size}` : undefined

  // Resolve theme color to hex value
  const colorValue = resolveThemeColor(color)
  const style = colorValue ? { backgroundColor: colorValue } : undefined

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), variantClass, sizeClass)}
      style={style}
      {...props}
    />
  )
}

export { Button }
