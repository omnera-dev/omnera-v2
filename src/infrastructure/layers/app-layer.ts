import { Layer } from 'effect'
import { ServerFactoryLive } from '@/infrastructure/server/server-factory-live'
import { PageRendererLive } from '@/presentation/layers/page-renderer-live'

/**
 * Application layer composition
 *
 * Combines all live service implementations into a single Layer
 * that can be provided to Application use cases.
 *
 * This is the production dependency wiring point - swap out
 * individual layers here for testing or different environments.
 *
 * @example
 * ```typescript
 * // In src/index.ts (production)
 * const program = startServer(appConfig).pipe(
 *   Effect.provide(AppLayer)
 * )
 *
 * // In tests (with mocks)
 * const TestLayer = Layer.mergeAll(MockServerFactory, MockPageRenderer)
 * const program = startServer(appConfig).pipe(
 *   Effect.provide(TestLayer)
 * )
 * ```
 */
export const AppLayer = Layer.mergeAll(ServerFactoryLive, PageRendererLive)
