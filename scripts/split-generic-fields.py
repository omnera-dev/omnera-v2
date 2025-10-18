#!/usr/bin/env python3
"""
Script to split generic Text Field and Number Field into specific field types.
Each specific field type will have a const (not enum) for the type property.
"""

import json
import sys

def create_text_field(field_type: str, title: str, description: str, business_rules: list, user_stories: list):
    """Create a specific text field type schema."""
    return {
        "title": title,
        "description": description,
        "type": "object",
        "properties": {
            "id": {
                "$ref": "../common/definitions.schema.json#/definitions/id",
                "x-user-stories": [
                    "GIVEN a new entity is created WHEN the system assigns an ID THEN it should be unique within the parent collection",
                    "GIVEN an entity exists WHEN attempting to modify its ID THEN the system should prevent changes (read-only constraint)",
                    "GIVEN a client requests an entity by ID WHEN the ID is valid THEN the entity should be retrieved successfully"
                ]
            },
            "name": {
                "$ref": "../common/definitions.schema.json#/definitions/name",
                "x-user-stories": [
                    "GIVEN new field is created WHEN saving configuration THEN field name should follow database naming conventions",
                    "GIVEN field with duplicate name WHEN validating table schema THEN error should prevent conflicts",
                    "GIVEN field name is set WHEN querying data THEN field should be accessible by its name"
                ]
            },
            "required": {
                "type": "boolean",
                "default": False,
                "x-business-rules": [
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN required is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN required is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with required WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "unique": {
                "type": "boolean",
                "default": False,
                "description": "Whether this field must contain unique values across all rows",
                "x-business-rules": [
                    "Uniqueness constraint prevents conflicts and ensures each unique can be unambiguously referenced",
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN unique is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN unique is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with unique WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "indexed": {
                "type": "boolean",
                "default": False,
                "description": "Whether to create a database index on this field for faster queries",
                "x-business-rules": [
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN indexed is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN indexed is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with indexed WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "type": {
                "const": field_type,
                "x-business-rules": [
                    f"Constant value '{field_type}' ensures type safety and enables discriminated unions for field type validation"
                ],
                "x-user-stories": [
                    f"GIVEN a {title} is configured WHEN validating schema THEN type must be '{field_type}'",
                    f"GIVEN type is set to '{field_type}' WHEN processing field THEN it should be treated as a {title}"
                ]
            },
            "default": {
                "type": "string",
                "x-user-stories": [
                    "GIVEN user provides default WHEN validating input THEN string value should be accepted",
                    "GIVEN default is empty string WHEN validating input THEN behavior should follow optional/required rules"
                ]
            }
        },
        "required": ["id", "name", "type"],
        "additionalProperties": False,
        "x-user-stories": user_stories,
        "x-business-rules": business_rules
    }

def create_number_field(field_type: str, title: str, description: str, business_rules: list, user_stories: list, additional_props: dict = None):
    """Create a specific number field type schema."""
    field_schema = {
        "title": title,
        "description": description,
        "type": "object",
        "properties": {
            "id": {
                "$ref": "../common/definitions.schema.json#/definitions/id",
                "x-user-stories": [
                    "GIVEN a new entity is created WHEN the system assigns an ID THEN it should be unique within the parent collection",
                    "GIVEN an entity exists WHEN attempting to modify its ID THEN the system should prevent changes (read-only constraint)",
                    "GIVEN a client requests an entity by ID WHEN the ID is valid THEN the entity should be retrieved successfully"
                ]
            },
            "name": {
                "$ref": "../common/definitions.schema.json#/definitions/name",
                "x-user-stories": [
                    "GIVEN new field is created WHEN saving configuration THEN field name should follow database naming conventions",
                    "GIVEN field with duplicate name WHEN validating table schema THEN error should prevent conflicts",
                    "GIVEN field name is set WHEN querying data THEN field should be accessible by its name"
                ]
            },
            "required": {
                "type": "boolean",
                "default": False,
                "x-business-rules": [
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN required is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN required is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with required WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "unique": {
                "type": "boolean",
                "default": False,
                "description": "Whether this field must contain unique values across all rows",
                "x-business-rules": [
                    "Uniqueness constraint prevents conflicts and ensures each unique can be unambiguously referenced",
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN unique is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN unique is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with unique WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "indexed": {
                "type": "boolean",
                "default": False,
                "description": "Whether to create a database index on this field for faster queries",
                "x-business-rules": [
                    "Defaults to false when not specified, providing sensible fallback behavior without requiring explicit configuration"
                ],
                "x-user-stories": [
                    "GIVEN indexed is true WHEN processing entity THEN corresponding behavior should be enforced",
                    "GIVEN indexed is false (default: False) WHEN processing entity THEN corresponding behavior should not be enforced",
                    "GIVEN configuration with indexed WHEN validating settings THEN boolean value should be accepted"
                ]
            },
            "type": {
                "const": field_type,
                "x-business-rules": [
                    f"Constant value '{field_type}' ensures type safety and enables discriminated unions for field type validation"
                ],
                "x-user-stories": [
                    f"GIVEN a {title} is configured WHEN validating schema THEN type must be '{field_type}'",
                    f"GIVEN type is set to '{field_type}' WHEN processing field THEN it should be treated as a {title}"
                ]
            },
            "min": {
                "type": "number",
                "description": "Minimum value",
                "x-user-stories": [
                    "GIVEN user provides min WHEN validating input THEN numeric value should be accepted",
                    "GIVEN user provides non-numeric min WHEN validating input THEN error should require number"
                ]
            },
            "max": {
                "type": "number",
                "description": "Maximum value",
                "x-user-stories": [
                    "GIVEN user provides max WHEN validating input THEN numeric value should be accepted",
                    "GIVEN user provides non-numeric max WHEN validating input THEN error should require number"
                ]
            },
            "default": {
                "type": "number",
                "x-user-stories": [
                    "GIVEN user provides default WHEN validating input THEN numeric value should be accepted",
                    "GIVEN user provides non-numeric default WHEN validating input THEN error should require number"
                ]
            }
        },
        "required": ["id", "name", "type"],
        "additionalProperties": False,
        "x-business-rules": business_rules
    }

    # Add field-specific properties
    if additional_props:
        field_schema["properties"].update(additional_props)

    return field_schema

def main():
    # Read the original schema
    schema_path = "/Users/thomasjeanneau/Codes/omnera-v2/docs/specifications/schemas/tables/tables.schema.json"
    with open(schema_path, 'r') as f:
        schema = json.load(f)

    # Define specific text field types
    text_fields = [
        {
            "type": "single-line-text",
            "title": "Single Line Text Field",
            "description": "Short text input limited to a single line. Ideal for names, titles, labels, and brief identifiers. Text is stored as-is without formatting. Required flag makes the field mandatory. Unique constraint ensures no duplicate values across records. Indexing improves search and filter performance on this field.",
            "business_rules": [
                "Single-line constraint prevents multi-line input, ensuring consistent formatting and UI display",
                "Text is stored without formatting, preserving raw input for maximum flexibility"
            ],
            "user_stories": [
                "GIVEN I create a single-line text field WHEN I add a record THEN it should accept text without line breaks",
                "GIVEN I create a single-line text field with unique constraint WHEN I add duplicate text THEN it should reject the input",
                "GIVEN I create a required single-line text field WHEN I submit without value THEN it should show validation error"
            ]
        },
        {
            "type": "long-text",
            "title": "Long Text Field",
            "description": "Multi-line text input for paragraphs, descriptions, notes, and comments. Supports line breaks and longer content. Text is stored as-is without rich formatting (no bold, italics, etc.). Required flag makes the field mandatory. Indexing improves search performance but may be slower for very long content.",
            "business_rules": [
                "Multi-line support allows paragraphs and structured content with line breaks",
                "Text is stored without rich formatting (HTML, Markdown) to prevent injection attacks and maintain data portability"
            ],
            "user_stories": [
                "GIVEN I create a long text field WHEN I add a record THEN it should accept multi-line text with line breaks",
                "GIVEN I create a long text field WHEN I paste formatted text THEN it should strip formatting and preserve plain text",
                "GIVEN I create a required long text field WHEN I submit without value THEN it should show validation error"
            ]
        },
        {
            "type": "phone-number",
            "title": "Phone Number Field",
            "description": "Text field optimized for phone numbers with automatic formatting based on detected country code. Stores the raw phone number value without validation to support international formats. Display formatting helps readability but doesn't enforce strict patterns. Required flag makes the field mandatory. Unique constraint ensures no duplicate phone numbers.",
            "business_rules": [
                "Phone numbers are stored as raw text to support diverse international formats without strict validation",
                "Automatic formatting improves readability but doesn't restrict input, allowing flexibility for edge cases"
            ],
            "user_stories": [
                "GIVEN I create a phone number field WHEN I enter a phone number THEN it should format it automatically for display",
                "GIVEN I create a phone number field WHEN I enter an international number THEN it should accept it without validation errors",
                "GIVEN I create a phone number field with unique constraint WHEN I enter a duplicate number THEN it should reject the input"
            ]
        },
        {
            "type": "email",
            "title": "Email Field",
            "description": "Text field with email format validation (username@domain). Validates email structure (presence of @ symbol and domain) without sending test emails. Stores email as lowercase for consistent lookups. Required flag makes the field mandatory. Unique constraint ensures no duplicate emails. Indexing enables fast email-based queries.",
            "business_rules": [
                "Email validation checks structure (@ symbol, domain) without verifying deliverability to balance usability and data quality",
                "Emails are stored as lowercase to prevent duplicate entries differing only by case (Email@example.com vs email@example.com)"
            ],
            "user_stories": [
                "GIVEN I create an email field WHEN I enter a valid email THEN it should accept the input",
                "GIVEN I create an email field WHEN I enter text without @ symbol THEN it should show validation error",
                "GIVEN I create an email field with unique constraint WHEN I enter a duplicate email THEN it should reject the input regardless of case"
            ]
        },
        {
            "type": "url",
            "title": "URL Field",
            "description": "Text field for web links with URL format validation (http:// or https://). Validates URL structure and protocol without checking if the link is reachable. Stores full URL including protocol. Display shows clickable link in the UI. Required flag makes the field mandatory. Unique constraint ensures no duplicate URLs.",
            "business_rules": [
                "URL validation checks structure and protocol (http/https) without verifying link reachability to avoid external dependencies",
                "Full URL with protocol is stored to ensure links work correctly when clicked (http://example.com, not example.com)"
            ],
            "user_stories": [
                "GIVEN I create a URL field WHEN I enter a valid URL with http:// or https:// THEN it should accept the input",
                "GIVEN I create a URL field WHEN I enter text without protocol THEN it should show validation error",
                "GIVEN I create a URL field WHEN I view the record THEN the URL should display as a clickable link"
            ]
        }
    ]

    # Define specific number field types
    number_fields = [
        {
            "type": "integer",
            "title": "Integer Field",
            "description": "Whole number field without decimal places. Ideal for counts, IDs, quantities, ages, and rankings. Supports min/max constraints for range validation. Required flag makes the field mandatory. Unique constraint ensures no duplicate values. Indexing enables efficient numerical sorting and filtering.",
            "business_rules": [
                "Integer constraint ensures only whole numbers are accepted, preventing decimal input",
                "Min/max constraints provide range validation to keep values within business-defined bounds"
            ],
            "user_stories": [
                "GIVEN I create an integer field WHEN I enter a whole number THEN it should accept the input",
                "GIVEN I create an integer field WHEN I enter a decimal number THEN it should reject the input",
                "GIVEN I create an integer field with min=0 and max=100 WHEN I enter 150 THEN it should show validation error"
            ],
            "additional_props": {}
        },
        {
            "type": "decimal",
            "title": "Decimal Field",
            "description": "Floating-point number field with configurable decimal precision (0-10 places). Ideal for measurements, scores, ratings, and scientific data. Precision determines how many decimal places are stored and displayed (default: 2). Supports min/max constraints for range validation. Required flag makes the field mandatory.",
            "business_rules": [
                "Precision (0-10 decimal places) controls rounding and storage, preventing floating-point errors",
                "Default precision of 2 decimal places suits most use cases (prices, percentages) without requiring configuration"
            ],
            "user_stories": [
                "GIVEN I create a decimal field with precision=2 WHEN I enter 3.14159 THEN it should round to 3.14",
                "GIVEN I create a decimal field WHEN I enter a whole number THEN it should accept it and display with decimal places",
                "GIVEN I create a decimal field with min=0.0 and max=1.0 WHEN I enter 1.5 THEN it should show validation error"
            ],
            "additional_props": {
                "precision": {
                    "type": "integer",
                    "description": "Number of decimal places",
                    "minimum": 0,
                    "maximum": 10,
                    "default": 2,
                    "x-business-rules": [
                        "Numeric range (0-10) prevents overflow errors and ensures values stay within valid business bounds",
                        "Defaults to 2 when not specified, providing sensible fallback behavior without requiring explicit configuration"
                    ],
                    "x-user-stories": [
                        "GIVEN user provides precision between 0 and 10 WHEN validating input THEN value should be accepted",
                        "GIVEN user provides precision below 0 WHEN validating input THEN error should enforce minimum value",
                        "GIVEN user provides precision above 10 WHEN validating input THEN error should enforce maximum value"
                    ]
                }
            }
        },
        {
            "type": "currency",
            "title": "Currency Field",
            "description": "Monetary value field with currency code (USD, EUR, GBP, etc.). Stores numeric value with 2 decimal places for cents/pence. Currency code determines display format and symbol ($, €, £). Supports min/max constraints for range validation. Required flag makes the field mandatory. Indexing enables efficient sorting by monetary value.",
            "business_rules": [
                "Currency code is stored separately from value to support multi-currency applications and accurate conversions",
                "Fixed 2 decimal places match standard accounting practices for monetary values (cents/pence precision)",
                "Default currency of USD provides sensible fallback for applications without multi-currency needs"
            ],
            "user_stories": [
                "GIVEN I create a currency field with USD WHEN I enter 99.99 THEN it should display as $99.99",
                "GIVEN I create a currency field with EUR WHEN I enter 99.99 THEN it should display as €99.99",
                "GIVEN I create a currency field WHEN I enter 99.999 THEN it should round to 2 decimal places (99.99)"
            ],
            "additional_props": {
                "currency": {
                    "type": "string",
                    "description": "Currency code (ISO 4217)",
                    "default": "USD",
                    "examples": ["USD", "EUR", "GBP", "JPY", "CAD"],
                    "x-business-rules": [
                        "Defaults to \"USD\" when not specified, providing sensible fallback behavior without requiring explicit configuration",
                        "Currency code should follow ISO 4217 standard for international compatibility"
                    ],
                    "x-user-stories": [
                        "GIVEN user provides currency WHEN validating input THEN string value should be accepted",
                        "GIVEN currency is empty string WHEN validating input THEN default to USD"
                    ]
                }
            }
        },
        {
            "type": "percentage",
            "title": "Percentage Field",
            "description": "Ratio field displayed as percentage (0-100%). Stores value as decimal (0.0-1.0 or 0-100 depending on configuration). Display adds % symbol automatically. Supports min/max constraints for range validation (typically 0-100). Required flag makes the field mandatory. Useful for completion rates, discounts, and probability values.",
            "business_rules": [
                "Percentage values are displayed with % symbol but stored as numbers to enable mathematical operations",
                "Min/max constraints typically enforce 0-100 range but can be configured for specific use cases (e.g., growth rates >100%)"
            ],
            "user_stories": [
                "GIVEN I create a percentage field WHEN I enter 75 THEN it should display as 75%",
                "GIVEN I create a percentage field with max=100 WHEN I enter 150 THEN it should show validation error",
                "GIVEN I create a percentage field WHEN I enter a decimal like 33.33 THEN it should accept it and display as 33.33%"
            ],
            "additional_props": {}
        }
    ]

    # Create new field definitions
    new_any_of = []

    # Add specific text fields
    for field_def in text_fields:
        new_any_of.append(create_text_field(
            field_def["type"],
            field_def["title"],
            field_def["description"],
            field_def["business_rules"],
            field_def["user_stories"]
        ))

    # Add specific number fields
    for field_def in number_fields:
        new_any_of.append(create_number_field(
            field_def["type"],
            field_def["title"],
            field_def["description"],
            field_def.get("business_rules", []),
            field_def.get("user_stories", []),
            field_def.get("additional_props")
        ))

    # Keep all other field types from the original schema
    original_any_of = schema["items"]["properties"]["fields"]["items"]["anyOf"]

    # Skip Text Field (index 0) and Number Field (index 1), keep the rest
    for i, field in enumerate(original_any_of):
        if i >= 2:  # Skip first two (Text Field and Number Field)
            new_any_of.append(field)

    # Replace the anyOf array
    schema["items"]["properties"]["fields"]["items"]["anyOf"] = new_any_of

    # Write the modified schema
    with open(schema_path, 'w') as f:
        json.dump(schema, f, indent=2)

    print(f"✓ Successfully split generic fields into {len(text_fields)} text field types and {len(number_fields)} number field types")
    print(f"✓ Total field types in schema: {len(new_any_of)}")
    print("\nText field types created:")
    for field in text_fields:
        print(f"  - {field['title']} (type: {field['type']})")
    print("\nNumber field types created:")
    for field in number_fields:
        print(f"  - {field['title']} (type: {field['type']})")

if __name__ == "__main__":
    main()
