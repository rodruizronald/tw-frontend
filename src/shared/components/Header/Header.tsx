/**
 * Header Component
 *
 * Application header with search bar and filter chips.
 */

import SearchIcon from '@mui/icons-material/Search'
import {
  AppBar,
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import type { MouseEvent } from 'react'

import { FILTER_CONFIG, FilterChip } from '@/jobs/components/filters'
import type { AnchorElements } from '@/jobs/hooks'
import type { FilterKey } from '@/jobs/types/filters'

// =============================================================================
// Types
// =============================================================================

interface HeaderProps {
  /** Current search query */
  searchQuery: string
  /** Handler for search query changes */
  onSearchChange: (query: string) => void
  /** Handler for search button click */
  onSearch: () => void
  /** Anchor elements for filter dropdowns */
  anchorEls: AnchorElements
  /** Handler for filter chip click */
  onFilterClick: (filterKey: FilterKey, event: MouseEvent<HTMLElement>) => void
  /** Get the count of active selections for a filter */
  getActiveFilterCount: (filterKey: FilterKey) => number
}

// =============================================================================
// Component
// =============================================================================

/**
 * Application header with search and filter chips
 */
export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  anchorEls,
  onFilterClick,
  getActiveFilterCount,
}: HeaderProps) {
  return (
    <AppBar
      position='sticky'
      sx={{
        bgcolor: '#ffffff',
        color: '#000000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 4, md: 8, lg: 18, xl: 36 },
        }}
      >
        <Box sx={{ py: 2 }}>
          {/* Search Row */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ mb: 2.5 }}
          >
            {/* Logo Button */}
            <Button
              variant='contained'
              disabled
              sx={{
                bgcolor: '#0a66c2',
                minWidth: 80,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 'body1.fontSize',
                '&:hover': { bgcolor: '#004182' },
                '&.Mui-disabled': {
                  bgcolor: '#0a66c2',
                  color: 'white',
                },
              }}
            >
              JobHub
            </Button>

            {/* Search Input */}
            <TextField
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSearch()}
              placeholder='Job title or skill'
              autoComplete='off'
              size='small'
              sx={{
                maxWidth: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: '#ffffff',
                  '&:hover fieldset': { borderColor: '#0a66c2' },
                  '&.Mui-focused fieldset': { borderColor: '#0a66c2' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Search Button */}
            <Button
              variant='contained'
              onClick={onSearch}
              sx={{
                bgcolor: '#0a66c2',
                borderRadius: '24px',
                px: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: 'body1.fontSize',
                '&:hover': { bgcolor: '#004182' },
              }}
            >
              Search
            </Button>
          </Stack>

          {/* Filter Chips Row */}
          <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ gap: 1 }}>
            {FILTER_CONFIG.map(config => (
              <FilterChip
                key={config.key}
                filterKey={config.key}
                isOpen={Boolean(anchorEls[config.key])}
                activeCount={getActiveFilterCount(config.key)}
                onClick={onFilterClick}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </AppBar>
  )
}
