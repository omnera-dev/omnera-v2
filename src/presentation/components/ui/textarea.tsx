/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import * as React from 'react'
import { cn } from '@/presentation/styling/cn'
import { COMMON_INTERACTIVE_CLASSES } from '@/presentation/styling/variant-classes'

function Textarea({ className, ...props }: Readonly<React.ComponentProps<'textarea'>>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        COMMON_INTERACTIVE_CLASSES,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
