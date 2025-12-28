/**
 * FilterChip Component
 *
 * A clickable chip that displays a filter category with an active count badge.
 * Used to open filter dropdown menus.
 */

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Badge, Chip } from '@mui/material'
import type { MouseEvent } from 'react'

import type { FilterKey } from '../../../types/filters'
import { getFilterLabel } from '../filterConfig'

// =============================================================================
// Types
// =============================================================================

interface FilterChipProps {
  /** Filter key identifier */
  filterKey: FilterKey
  /** Whether the dropdown is currently open */
  isOpen: boolean
  /** Number of active selections for this filter */
  activeCount: number
  /** Click handler to open the dropdown */
  onClick: (filterKey: FilterKey, event: MouseEvent<HTMLElement>) => void
}

// =============================================================================
// Component
// =============================================================================

/**
 * Filter chip with badge showing active selection count
 *
 * @example
 * ```tsx
 * <FilterChip
 *   filterKey="experienceLevel"
 *   isOpen={isDropdownOpen('experienceLevel')}
 *   activeCount={getActiveCount('experienceLevel')}
 *   onClick={handleFilterClick}
 * />
 * ```
 */
export default function FilterChip({
  filterKey,
  isOpen,
  activeCount,
  onClick,
}: FilterChipProps) {
  const label = getFilterLabel(filterKey)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Find the chip element for proper anchor positioning
    const chipElement =
      (event.currentTarget.closest('.MuiChip-root') as HTMLElement) ||
      event.currentTarget
    onClick(filterKey, { ...event, currentTarget: chipElement })
  }

  return (
    <Badge
      badgeContent={activeCount}
      color='primary'
      invisible={activeCount === 0}
    >
      <Chip
        label={label}
        onClick={handleClick}
        onDelete={handleClick}
        deleteIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: isOpen ? '#0a66c2' : '#ffffff',
          color: isOpen ? '#ffffff' : '#313131',
          border: isOpen ? 'none' : '1px solid #A3A3A3',
          fontWeight: 'bold',
          fontSize: 'body1.fontSize',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: isOpen ? '#004182' : '#E8F2FF',
            borderColor: '#0a66c2',
            borderWidth: '2px',
          },
          '& .MuiChip-deleteIcon': {
            color: 'inherit',
          },
        }}
      />
    </Badge>
  )
}
