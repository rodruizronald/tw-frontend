import {
  LocationOn,
  Schedule,
  TrendingUp,
  WorkOutline,
} from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import CompanyAvatar from '@shared/components/CompanyAvatar'
import { useEffect, useRef, useState } from 'react'

import type { Job } from '../../types/models'

interface JobDetailsProps {
  job?: Job | null
  isFetching?: boolean
}

export default function JobDetails({
  job,
  isFetching = false,
}: JobDetailsProps) {
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const header = headerRef.current

    if (!scrollContainer || !header) return

    const handleScroll = () => {
      const headerRect = header.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()

      setShowStickyHeader(headerRect.bottom <= containerRect.top)
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [job])

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 2,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        // Fade effect during API calls
        opacity: isFetching ? 0.6 : 1,
        transition: 'opacity 250ms ease-in-out',
        // Disable interactions during API calls
        pointerEvents: isFetching ? 'none' : 'auto',
        cursor: isFetching ? 'not-allowed' : 'default',
      }}
    >
      {/* Sticky Header */}
      {job && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'white',
            borderBottom: '1px solid #e0e0e0',
            px: 3,
            py: 2,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: showStickyHeader ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: showStickyHeader
              ? '0 2px 4px rgba(0, 0, 0, 0.1)'
              : 'none',
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 700,
                color: '#0a66c2',
                fontSize: '1.25rem',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {job.title}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#333',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {job.company}
            </Typography>
          </Box>
          <Button
            variant='contained'
            onClick={() =>
              job.applicationUrl && window.open(job.applicationUrl, '_blank')
            }
            disabled={!job.applicationUrl}
            sx={{
              bgcolor: '#0a66c2',
              borderRadius: '20px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              '&:hover': { bgcolor: '#004182' },
            }}
          >
            Apply Now
          </Button>
        </Box>
      )}

      {/* Job Details Content - Scrollable */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflow: isFetching ? 'hidden' : 'auto', // Disable scrolling during API calls
          p: job ? 3 : 4,
        }}
      >
        {job ? (
          <Box>
            {/* Header Layout */}
            <Box ref={headerRef} sx={{ mb: 4 }}>
              {/* Company Logo and Name */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <CompanyAvatar company={job.company} size={56} />
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 600, color: '#333' }}
                >
                  {job.company}
                </Typography>
              </Box>

              {/* Job Title */}
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 700,
                  color: '#0a66c2',
                  mb: 2,
                  fontSize: '2rem',
                }}
              >
                {job.title}
              </Typography>

              {/* Posted Date */}
              <Typography
                variant='body2'
                sx={{
                  color: '#666',
                  mb: 2,
                  fontSize: '0.875rem',
                }}
              >
                Posted {job.postedDate}
              </Typography>

              {/* Job Meta Info with Icons */}
              <Stack direction='row' spacing={2} flexWrap='wrap' sx={{ mb: 3 }}>
                {job.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 18, color: '#666' }} />
                    <Typography
                      variant='body1'
                      sx={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {job.location}
                    </Typography>
                  </Box>
                )}

                {job.workMode && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WorkOutline sx={{ fontSize: 18, color: '#666' }} />
                    <Typography
                      variant='body1'
                      sx={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {job.workMode}
                    </Typography>
                  </Box>
                )}

                {job.jobType && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 18, color: '#666' }} />
                    <Typography
                      variant='body1'
                      sx={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {job.jobType}
                    </Typography>
                  </Box>
                )}

                {job.experience && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 18, color: '#666' }} />
                    <Typography
                      variant='body1'
                      sx={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {job.experience}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {/* Apply Button */}
              <Button
                variant='contained'
                onClick={() =>
                  job.applicationUrl &&
                  window.open(job.applicationUrl, '_blank')
                }
                size='large'
                disabled={!job.applicationUrl}
                sx={{
                  bgcolor: '#0a66c2',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#004182' },
                }}
              >
                Apply Now
              </Button>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                Description
              </Typography>
              <Typography
                variant='body1'
                sx={{ lineHeight: 1.6, color: '#333' }}
              >
                {job.description}
              </Typography>
            </Box>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                  Responsibilities
                </Typography>
                <ul
                  style={{
                    paddingLeft: '20px',
                    lineHeight: 1.6,
                    color: '#333',
                  }}
                >
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                  Requirements
                </Typography>

                {/* Must Have */}
                {job.requirements.mustHave &&
                  job.requirements.mustHave.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
                      >
                        Must Have
                      </Typography>
                      <ul
                        style={{
                          paddingLeft: '20px',
                          lineHeight: 1.6,
                          color: '#333',
                        }}
                      >
                        {job.requirements.mustHave.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </Box>
                  )}

                {/* Nice To Have */}
                {job.requirements.niceToHave &&
                  job.requirements.niceToHave.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
                      >
                        Nice To Have
                      </Typography>
                      <ul
                        style={{
                          paddingLeft: '20px',
                          lineHeight: 1.6,
                          color: '#333',
                        }}
                      >
                        {job.requirements.niceToHave.map(
                          (requirement, index) => (
                            <li key={index}>{requirement}</li>
                          )
                        )}
                      </ul>
                    </Box>
                  )}

                {/* Technologies */}
                {job.technologies && job.technologies.length > 0 && (
                  <Box sx={{ mb: 0 }}>
                    <Typography
                      variant='subtitle1'
                      sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
                    >
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {job.technologies.map((tech, index) => (
                        <Box
                          key={index}
                          sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: '#e3f2fd',
                            color: '#0a66c2',
                            borderRadius: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                  Benefits
                </Typography>
                <ul
                  style={{
                    paddingLeft: '20px',
                    lineHeight: 1.6,
                    color: '#333',
                  }}
                >
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography variant='h5' sx={{ color: '#666', mb: 1 }}>
                Select a Job
              </Typography>
              <Typography variant='body1' sx={{ color: '#999' }}>
                Choose a job from the list to view details
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
