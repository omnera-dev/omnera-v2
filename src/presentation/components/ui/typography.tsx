/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/presentation/styling/cn'

// H1 Heading - Extra large, bold heading
export interface TypographyH1Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function TypographyH1({ children, className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

// H2 Heading - Large section heading with bottom border
export interface TypographyH2Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function TypographyH2({ children, className, ...props }: TypographyH2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

// H3 Heading - Medium section heading
export interface TypographyH3Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function TypographyH3({ children, className, ...props }: TypographyH3Props) {
  return (
    <h3
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

// H4 Heading - Small section heading
export interface TypographyH4Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function TypographyH4({ children, className, ...props }: TypographyH4Props) {
  return (
    <h4
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h4>
  )
}

// Paragraph - Standard body text
export interface TypographyPProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function TypographyP({ children, className, ...props }: TypographyPProps) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Blockquote - Styled quote block
export interface TypographyBlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
  children: ReactNode
}

export function TypographyBlockquote({ children, className, ...props }: TypographyBlockquoteProps) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// List - Unordered list with disc bullets
export interface TypographyListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
}

export function TypographyList({ children, className, ...props }: TypographyListProps) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    >
      {children}
    </ul>
  )
}

// Inline Code - Code snippet with background
export interface TypographyInlineCodeProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function TypographyInlineCode({ children, className, ...props }: TypographyInlineCodeProps) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

// Lead - Large introductory text
export interface TypographyLeadProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function TypographyLead({ children, className, ...props }: TypographyLeadProps) {
  return (
    <p
      className={cn('text-muted-foreground text-xl', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Large - Large emphasized text
export interface TypographyLargeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function TypographyLarge({ children, className, ...props }: TypographyLargeProps) {
  return (
    <div
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Small - Small text (labels, captions)
export interface TypographySmallProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function TypographySmall({ children, className, ...props }: TypographySmallProps) {
  return (
    <small
      className={cn('text-sm leading-none font-medium', className)}
      {...props}
    >
      {children}
    </small>
  )
}

// Muted - Muted/secondary text
export interface TypographyMutedProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function TypographyMuted({ children, className, ...props }: TypographyMutedProps) {
  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    >
      {children}
    </p>
  )
}
