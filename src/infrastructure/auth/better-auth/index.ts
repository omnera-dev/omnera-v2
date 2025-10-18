/**
 * Better Auth Module
 *
 * Provides authentication functionality using Better Auth library.
 * Re-exports all auth-related services and types.
 */
export { auth } from './auth'
export { Auth, AuthLive } from './layer'
export { AuthError } from '../../errors/auth-error'
