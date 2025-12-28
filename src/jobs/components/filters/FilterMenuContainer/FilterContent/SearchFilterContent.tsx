/**
 * SearchFilterContent Component
 *
 * Searchable checkbox list for filters with many options (e.g., companies).
 */

import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import type { CompanyOption } from '../../../../hooks/useCompanyOptions'

// =============================================================================
// Types
// =============================================================================

interface SearchFilterContentProps {
  /** Available options (with optional job counts) */
  options: CompanyOption[]
  /** Currently selected values */
  selectedValues: string[]
  /** Toggle handler - called with the value to toggle */
  onChange: (value: string) => void
  /** Placeholder text for search input */
  searchPlaceholder?: string | undefined
  /** Whether options are currently loading */
  isLoading?: boolean | undefined
}

// =============================================================================
// Component
// =============================================================================

/**
 * Searchable checkbox filter content
 *
 * @example
 * ```tsx
 * <SearchFilterContent
 *   options={companies}
 *   selectedValues={filters.company ?? []}
 *   onChange={(value) => toggleFilter('company', value)}
 *   searchPlaceholder="Search companies..."
 *   isLoading={isLoadingCompanies}
 * />
 * ```
 */
export default function SearchFilterContent({
  options,
  selectedValues,
  onChange,
  searchPlaceholder = 'Search...',
  isLoading = false,
}: SearchFilterContentProps) {
  const [searchValue, setSearchValue] = useState('')

  // Filter options based on search input
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      return options
    }

    const searchLower = searchValue.toLowerCase()
    return options.filter(option =>
      option.name.toLowerCase().includes(searchLower)
    )
  }, [options, searchValue])

  return (
    <Box>
      {/* Search Input */}
      <Box sx={{ pr: 4 }}>
        <TextField
          fullWidth
          size='small'
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          sx={{
            mb: 1,
            px: 1.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: '#ffffff',
              '&:hover fieldset': { borderColor: '#0a66c2' },
              '&.Mui-focused fieldset': { borderColor: '#0a66c2' },
            },
          }}
        />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ px: 2, py: 1 }}
        >
          Loading...
        </Typography>
      )}

      {/* No Results */}
      {!isLoading && filteredOptions.length === 0 && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ px: 2, py: 1 }}
        >
          {searchValue ? 'No matching companies' : 'No companies available'}
        </Typography>
      )}

      {/* Options List */}
      {!isLoading &&
        filteredOptions.map(option => (
          <FormControlLabel
            key={option.name}
            control={
              <Checkbox
                checked={selectedValues.includes(option.name)}
                onChange={() => onChange(option.name)}
                sx={{
                  color: '#0a66c2',
                  '&.Mui-checked': {
                    color: '#0a66c2',
                  },
                }}
              />
            }
            label={
              option.jobCount !== undefined
                ? `${option.name} (${option.jobCount})`
                : option.name
            }
            sx={{
              display: 'flex',
              px: 1.5,
            }}
          />
        ))}
    </Box>
  )
}
