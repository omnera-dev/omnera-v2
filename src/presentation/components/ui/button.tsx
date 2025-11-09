/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/presentation/utils/cn'
import { buttonVariants } from './button-variants'

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>) {
  const Comp = asChild ? Slot : 'button'
  const variantClass = variant ? `btn-${variant}` : undefined

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), variantClass)}
      {...props}
    />
  )
}

export { Button }
