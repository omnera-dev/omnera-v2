# Admin Panel Specification

This document contains user stories for admin panel features. These stories are used by the `e2e-test-translator` agent to generate E2E tests in `tests/admin/`.

## Overview

The admin panel provides administrative interfaces for managing application resources:

- **Tables Management** - CRUD operations for database tables
- **Schema Management** - Table structure and field configuration
- **Data Management** - Viewing and editing data

## Tables Management

### Navigation and Access

**GIVEN** the application is running **WHEN** I navigate to `/_admin/tables` **THEN** the admin tables page should load correctly

---

**Note**: This is a living document. User stories should follow the GIVEN-WHEN-THEN format and be specific, testable, and focused on user interactions with the admin panel.
