/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'
import { cn } from '@/presentation/utils/cn'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: Readonly<React.ComponentProps<typeof SeparatorPrimitive.Root>>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
