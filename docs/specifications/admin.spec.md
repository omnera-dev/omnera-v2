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

**GIVEN** I am on the admin tables page **WHEN** the page loads **THEN** I should see a list of all configured tables

**GIVEN** I am on the admin tables page **WHEN** there are no tables configured **THEN** I should see an empty state with a "Create Table" button

### Table CRUD Operations

#### Create Table

**GIVEN** I am on the admin tables page **WHEN** I click "Create Table" **THEN** I should see a table creation form

**GIVEN** I am on the table creation form **WHEN** I fill in valid table details (name, fields) and submit **THEN** the table should be created and I should be redirected to the table detail page

**GIVEN** I am on the table creation form **WHEN** I submit with invalid data **THEN** I should see validation errors

#### Read Table

**GIVEN** I have created a table **WHEN** I navigate to the admin tables page **THEN** I should see the table in the list

**GIVEN** I am on the admin tables page **WHEN** I click on a table name **THEN** I should see the table detail page with schema information

#### Update Table

**GIVEN** I am on a table detail page **WHEN** I click "Edit Table" **THEN** I should see the table edit form

**GIVEN** I am on the table edit form **WHEN** I modify table properties and submit **THEN** the table should be updated with the new values

**GIVEN** I am on the table edit form **WHEN** I add a new field to the table **THEN** the field should be added to the table schema

**GIVEN** I am on the table edit form **WHEN** I remove a field from the table **THEN** the field should be removed from the table schema

#### Delete Table

**GIVEN** I am on the admin tables page **WHEN** I click "Delete" on a table **THEN** I should see a confirmation dialog

**GIVEN** I see a delete confirmation dialog **WHEN** I confirm deletion **THEN** the table should be removed from the list

**GIVEN** I see a delete confirmation dialog **WHEN** I cancel deletion **THEN** the table should remain in the list

### Field Management

**GIVEN** I am editing a table **WHEN** I add a new field **THEN** I should be able to configure field type, validation, and constraints

**GIVEN** I am editing a table **WHEN** I modify an existing field **THEN** the field configuration should be updated

**GIVEN** I am editing a table **WHEN** I delete a field **THEN** the field should be removed from the table schema

**GIVEN** I am editing a table **WHEN** I reorder fields **THEN** the field order should be updated

### Validation

**GIVEN** I am creating a table **WHEN** I use an invalid table name **THEN** I should see a validation error

**GIVEN** I am creating a table **WHEN** I create a table with a duplicate name **THEN** I should see a validation error

**GIVEN** I am creating a table **WHEN** I try to save without required fields **THEN** I should see validation errors for missing fields

## Future Admin Features

The following sections are placeholders for future admin panel features:

### Pages Management

- CRUD operations for pages
- Page routing configuration
- Component composition

### Automations Management

- CRUD operations for automations
- Trigger and action configuration
- Workflow testing

### Connections Management

- CRUD operations for external connections
- API integration configuration
- Authentication setup

---

**Note**: This is a living document. User stories should follow the GIVEN-WHEN-THEN format and be specific, testable, and focused on user interactions with the admin panel.
