/**
 * CheckboxFilterContent Component
 *
 * Checkbox list for multi-select filters.
 */

import { Checkbox, FormControlLabel } from '@mui/material'

import type { FilterOption } from '../../filterConfig'

// =============================================================================
// Types
// =============================================================================

interface CheckboxFilterContentProps {
  /** Available options to select from */
  options: FilterOption[]
  /** Currently selected values */
  selectedValues: string[]
  /** Toggle handler - called with the value to toggle */
  onChange: (value: string) => void
}

// =============================================================================
// Component
// =============================================================================

/**
 * Checkbox filter content for multi-select filters
 *
 * @example
 * ```tsx
 * <CheckboxFilterContent
 *   options={EXPERIENCE_LEVEL_OPTIONS}
 *   selectedValues={filters.experienceLevel ?? []}
 *   onChange={(value) => toggleFilter('experienceLevel', value)}
 * />
 * ```
 */
export default function CheckboxFilterContent({
  options,
  selectedValues,
  onChange,
}: CheckboxFilterContentProps) {
  return (
    <>
      {options.map(option => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onChange={() => onChange(option.value)}
              sx={{
                color: '#0a66c2',
                '&.Mui-checked': {
                  color: '#0a66c2',
                },
              }}
            />
          }
          label={option.label}
          sx={{
            display: 'flex',
            px: 1.5,
          }}
        />
      ))}
    </>
  )
}
