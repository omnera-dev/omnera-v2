/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

'use client'

import { PanelLeftIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Sheet, SheetContent } from '@/presentation/components/ui/sheet'
import { useSidebar } from '@/presentation/components/ui/sidebar-hook'
import { cn } from '@/presentation/styling/cn'
import { SIDEBAR_WIDTH_MOBILE } from './sidebar-constants'

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet
        open={openMobile}
        onOpenChange={setOpenMobile}
        {...props}
      >
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={props.ref}
      className={cn(
        'text-sidebar-foreground group peer hidden md:block',
        state === 'collapsed' && 'is-collapsed',
        variant === 'floating' || variant === 'inset'
          ? 'bg-transparent p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
          : 'bg-sidebar w-[--sidebar-width] group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
        className
      )}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative h-svh w-full duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'bg-sidebar rounded-lg border shadow-sm group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
        )}
      >
        <div
          data-sidebar="sidebar"
          className="bg-sidebar flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: Readonly<React.ComponentProps<typeof Button>>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-slot="sidebar-trigger"
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        // eslint-disable-next-line functional/no-expression-statements -- Event handlers need side effects
        onClick?.(event)

        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SidebarRail({ className, ...props }: Readonly<React.ComponentProps<'button'>>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-slot="sidebar-rail"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] md:flex',
        'group-data-[side=left]:right-0 group-data-[side=left]:left-auto group-data-[side=right]:right-0',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:hover:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  )
}

export function SidebarInset({ className, ...props }: Readonly<React.ComponentProps<'main'>>) {
  return (
    <main
      className={cn(
        'bg-background relative flex min-h-svh flex-1 flex-col',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]',
        className
      )}
      {...props}
    />
  )
}

export function SidebarInput({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof Input>>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
        className
      )}
      {...props}
    />
  )
}
