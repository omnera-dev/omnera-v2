/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import DOMPurify from 'dompurify'
import { type ReactElement } from 'react'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * ComponentRenderer - Renders a dynamic component based on its type
 *
 * This component handles the recursive rendering of sections, converting
 * the declarative component configuration into React elements.
 *
 * @param props - Component props
 * @param props.component - Component configuration from sections schema
 * @returns React element matching the component type
 */
export function ComponentRenderer({
  component,
}: {
  readonly component: Component
}): Readonly<ReactElement | null> {
  const { type, props, children, content } = component

  // Render children recursively
  const renderedChildren = children?.map((child: Component, index: number) => (
    <ComponentRenderer
      key={index}
      component={child}
    />
  ))

  // Merge className with other props
  const elementProps = {
    ...props,
    className: props?.className,
  }

  // Render based on component type
  switch (type) {
    case 'section':
      return <section {...elementProps}>{renderedChildren}</section>

    case 'text': {
      // Determine the HTML tag based on the level prop
      const level = props?.level
      if (level === 'h1') return <h1 {...elementProps}>{content}</h1>
      if (level === 'h2') return <h2 {...elementProps}>{content}</h2>
      if (level === 'h3') return <h3 {...elementProps}>{content}</h3>
      if (level === 'h4') return <h4 {...elementProps}>{content}</h4>
      if (level === 'h5') return <h5 {...elementProps}>{content}</h5>
      if (level === 'h6') return <h6 {...elementProps}>{content}</h6>
      // Default to paragraph
      return <p {...elementProps}>{content}</p>
    }

    case 'image':
      return (
        <img
          {...elementProps}
          alt={props?.alt || ''}
        />
      )

    case 'button':
      return <button {...elementProps}>{content || renderedChildren}</button>

    case 'link':
      return <a {...elementProps}>{content || renderedChildren}</a>

    case 'badge':
      return <span {...elementProps}>{content}</span>

    case 'icon':
      return <span {...elementProps}>{renderedChildren}</span>

    case 'customHTML': {
      // Sanitize HTML to prevent XSS attacks using DOMPurify
      const sanitizedHTML = DOMPurify.sanitize(props?.html || '')
      return (
        <div
          {...elementProps}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      )
    }

    case 'video':
      return <video {...elementProps}>{renderedChildren}</video>

    case 'audio':
      return <audio {...elementProps}>{renderedChildren}</audio>

    case 'iframe':
      return <iframe {...elementProps}>{renderedChildren}</iframe>

    case 'form':
      return <form {...elementProps}>{renderedChildren}</form>

    case 'input':
      return <input {...elementProps} />

    // Layout components - all render as <div> with children
    case 'container':
    case 'flex':
    case 'grid':
    case 'card':
    case 'timeline':
    case 'accordion':
      return <div {...elementProps}>{renderedChildren}</div>

    default:
      // Fallback for unknown types
      // eslint-disable-next-line unicorn/no-null -- React components conventionally return null for no render
      return null
  }
}
