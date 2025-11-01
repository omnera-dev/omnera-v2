/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Generic component properties Record
 *
 * @deprecated PropsSchema is now an alias for BlockPropsSchema to maintain DRY principle.
 * The BlockPropsSchema module has more comprehensive documentation and better abstraction.
 *
 * This file re-exports BlockPropsSchema to eliminate code duplication while maintaining
 * backward compatibility. All future development should use BlockPropsSchema directly.
 *
 * @see src/domain/models/app/block/common/block-props.ts for the primary schema definition
 * @see specs/app/pages/common/props.schema.json
 */
export {
  BlockPropsSchema as PropsSchema,
  BlockPropValueSchema as PropValueSchema,
  type BlockProps as Props,
  type BlockPropValue as PropValue,
} from '../../block/common/block-props'
