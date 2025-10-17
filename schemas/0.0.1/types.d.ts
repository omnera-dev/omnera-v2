/**
 * TypeScript type definitions for AppSchema
 * Generated automatically - do not edit manually
 */

/**
 * Complete application configuration including name, version, and description. This is the root schema for Omnera applications.
 */
export interface ApplicationConfiguration {
  /**
   * Application Name
   *
   * The name of the application (follows npm package naming conventions)
   */
  name: string
  /**
   * Application Version
   *
   * The version of the application following Semantic Versioning (SemVer) 2.0.0 specification
   *
   * @optional
   */
  version?: string
  /**
   * Application Description
   *
   * A single-line description of the application (line breaks not allowed)
   *
   * @optional
   */
  description?: string
}
