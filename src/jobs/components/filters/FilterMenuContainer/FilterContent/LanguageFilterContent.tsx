/**
 * LanguageFilterContent Component
 *
 * Radio button list for selecting language.
 */

import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import type { ChangeEvent } from 'react'

import type { Language } from '../../../../types/enums'
import type { FilterOption } from '../../filterConfig'

// =============================================================================
// Types
// =============================================================================

interface LanguageFilterContentProps {
  /** Available language options */
  options: FilterOption[]
  /** Currently selected value (or undefined for no selection) */
  value: Language | undefined
  /** Change handler */
  onChange: (value: Language) => void
}

// =============================================================================
// Component
// =============================================================================

/**
 * Language filter content with radio buttons
 *
 * @example
 * ```tsx
 * <LanguageFilterContent
 *   options={LANGUAGE_OPTIONS}
 *   value={filters.language}
 *   onChange={(value) => setFilter('language', value)}
 * />
 * ```
 */
export default function LanguageFilterContent({
  options,
  value,
  onChange,
}: LanguageFilterContentProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as Language)
  }

  return (
    <RadioGroup value={value ?? ''} onChange={handleChange}>
      {options.map(option => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              sx={{
                color: '#057642',
                '&.Mui-checked': {
                  color: '#057642',
                },
              }}
            />
          }
          label={option.label}
          sx={{
            px: 1.5,
          }}
        />
      ))}
    </RadioGroup>
  )
}
