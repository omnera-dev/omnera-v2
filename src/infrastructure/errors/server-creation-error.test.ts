import { describe, test, expect } from 'bun:test'
import { ServerCreationError } from './server-creation-error'

describe('ServerCreationError', () => {
  describe('error construction', () => {
    test('creates error with string cause', () => {
      const error = new ServerCreationError('Failed to start server')

      expect(error).toBeInstanceOf(ServerCreationError)
      expect(error.cause).toBe('Failed to start server')
      expect(error._tag).toBe('ServerCreationError')
    })

    test('creates error with Error cause', () => {
      const originalError = new Error('Port already in use')
      const error = new ServerCreationError(originalError)

      expect(error).toBeInstanceOf(ServerCreationError)
      expect(error.cause).toBe(originalError)
      expect(error._tag).toBe('ServerCreationError')
    })

    test('creates error with object cause', () => {
      const cause = { code: 'EADDRINUSE', port: 3000 }
      const error = new ServerCreationError(cause)

      expect(error).toBeInstanceOf(ServerCreationError)
      expect(error.cause).toEqual(cause)
      expect(error._tag).toBe('ServerCreationError')
    })

    test('creates error with null cause', () => {
      const error = new ServerCreationError(null)

      expect(error).toBeInstanceOf(ServerCreationError)
      expect(error.cause).toBeNull()
      expect(error._tag).toBe('ServerCreationError')
    })
  })

  describe('error properties', () => {
    test('_tag is readonly and always ServerCreationError', () => {
      const error = new ServerCreationError('test')

      expect(error._tag).toBe('ServerCreationError')

      // Verify it's the correct discriminator for type narrowing
      const checkTag = (err: unknown): err is ServerCreationError => {
        return (
          typeof err === 'object' &&
          err !== null &&
          '_tag' in err &&
          err._tag === 'ServerCreationError'
        )
      }

      expect(checkTag(error)).toBe(true)
    })

    test('cause property preserves original error information', () => {
      const originalError = new Error('Bun.serve failed')
      originalError.stack = 'Server creation stack trace'

      const error = new ServerCreationError(originalError)

      expect(error.cause).toBe(originalError)
      expect((error.cause as Error).message).toBe('Bun.serve failed')
      expect((error.cause as Error).stack).toBe('Server creation stack trace')
    })
  })

  describe('error usage with Effect', () => {
    test('can be used in Effect error channel', () => {
      type ServerError = ServerCreationError | { _tag: 'OtherError' }

      const handleError = (error: ServerError): string => {
        switch (error._tag) {
          case 'ServerCreationError':
            return `Server creation failed: ${error.cause}`
          case 'OtherError':
            return 'Other error occurred'
        }
      }

      const serverError = new ServerCreationError('Port 3000 unavailable')
      expect(handleError(serverError)).toBe('Server creation failed: Port 3000 unavailable')
    })
  })

  describe('real-world error scenarios', () => {
    test('handles port already in use error', () => {
      const portError = new Error('listen EADDRINUSE: address already in use :::3000')
      const error = new ServerCreationError(portError)

      expect(error.cause).toBe(portError)
      expect((error.cause as Error).message).toContain('EADDRINUSE')
    })

    test('handles permission denied error', () => {
      const permissionError = new Error('listen EACCES: permission denied 0.0.0.0:80')
      const error = new ServerCreationError(permissionError)

      expect(error.cause).toBe(permissionError)
      expect((error.cause as Error).message).toContain('EACCES')
    })

    test('handles invalid hostname error', () => {
      const hostnameError = new Error('getaddrinfo ENOTFOUND invalid.hostname')
      const error = new ServerCreationError(hostnameError)

      expect(error.cause).toBe(hostnameError)
      expect((error.cause as Error).message).toContain('ENOTFOUND')
    })
  })
})
