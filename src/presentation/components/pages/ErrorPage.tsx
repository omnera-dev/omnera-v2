/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'

/**
 * ErrorPage component - 500 internal server error page
 *
 * This page is displayed when the server encounters an unexpected error.
 * It provides a clear message and a link back to the homepage.
 *
 * @returns React element for 500 error page
 */
export function ErrorPage(): Readonly<ReactElement> {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>500 - Internal Server Error</title>
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-red-600">500</h1>
          <p className="mb-8 text-xl text-gray-600">Internal Server Error</p>
          <a
            href="/"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Go back home
          </a>
        </div>
      </body>
    </html>
  )
}
