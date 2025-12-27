import { JobDetails, JobFilters, JobList } from '@jobs/components'
import { FILTER_OPTIONS, PAGINATION } from '@jobs/constants'
import {
  convertLegacyFilters,
  useJobFilters,
  useJobPagination,
  useJobSearch,
} from '@jobs/hooks'
import { Job } from '@jobs/types/models'
import { Box } from '@mui/material'
import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'

import Header from '../Header'

// Extract the URL reset logic to a separate function
const resetToPageOne = (
  setSearchParams: (params: URLSearchParams) => void
): void => {
  const newSearchParams = new URLSearchParams(window.location.search)
  newSearchParams.delete('p')

  window.history.replaceState(
    {},
    '',
    newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams}`
      : window.location.pathname
  )

  setSearchParams(newSearchParams)
}

export default function JobLayout(): ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('')

  // Use API job search hook
  const {
    jobs: apiJobs,
    pagination: apiPagination,
    isFetching,
    search,
  } = useJobSearch()

  // Use job filters hook
  const {
    anchorEls,
    activeFilters,
    handleFilterClick,
    handleMenuClose,
    handleFilterChange,
    getActiveFilterCount,
  } = useJobFilters()

  // Wrapper to adapt the new search API to the old pagination hook interface
  const searchJobsAdapter = useCallback(
    async (
      query: string,
      _filters: unknown,
      pagination: { page?: number; pageSize?: number }
    ) => {
      const filters = convertLegacyFilters(query, {})
      const result = await search(filters, pagination)
      return result
    },
    [search]
  )

  // Use server-side pagination hook
  const {
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
    setSearchParams,
  } = useJobPagination(
    apiJobs,
    apiPagination,
    searchJobsAdapter,
    searchQuery,
    activeFilters
  )

  const handleSearch = async (): Promise<void> => {
    // Reset to page 1 and clear selected job
    resetToPageOne(setSearchParams)

    try {
      // Convert legacy filters to new format
      const filters = convertLegacyFilters(searchQuery, {})

      await search(filters, {
        page: PAGINATION.DEFAULT_PAGE, // Always start from page 1 for new searches
        pageSize: PAGINATION.PAGE_SIZE,
      })

      // Only clear selection after successful API call
      setSelectedJobId(null)
      setAppliedSearchQuery(searchQuery)

      console.log('Search completed successfully')
    } catch (error) {
      console.log('Search failed:', error)
    }
  }

  const handleJobSelect = (job: Job): void => {
    setSelectedJobId(job.id)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        filterOptions={FILTER_OPTIONS}
        anchorEls={anchorEls}
        onFilterClick={handleFilterClick}
        getActiveFilterCount={getActiveFilterCount}
      />
      <JobFilters
        filterOptions={FILTER_OPTIONS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        anchorEls={anchorEls}
        onMenuClose={handleMenuClose}
      />

      {/* Main Content Container - Fixed Height */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0, // Important for flex children to be scrollable
          bgcolor: '#f5f5f5',
          px: { xs: 2, sm: 4, md: 8, lg: 18, xl: 36 }, // Responsive horizontal padding
          py: 2, // Small vertical padding for breathing room
        }}
      >
        {/* Job List Container - Independent Scrolling */}
        <Box
          sx={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Important for scrolling
          }}
        >
          <JobList
            jobs={currentPageJobs}
            selectedJobId={selectedJobId ?? ''}
            onJobSelect={handleJobSelect}
            resultsCount={totalJobs}
            searchQuery={appliedSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </Box>

        {/* Job Details Container - Independent Scrolling */}
        <Box
          sx={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Important for scrolling
          }}
        >
          <JobDetails job={selectedJob} isFetching={isFetching} />
        </Box>
      </Box>
    </Box>
  )
}
