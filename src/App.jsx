// src/App.jsx
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from './components/Header'
import FilterPanel from './components/FilterPanel'
import DoctorList from './components/DoctorList'
import Pagination from './components/Pagination'

function App() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [specialties, setSpecialties] = useState([])
  
  // Get all query params
  const searchQuery = searchParams.get('search') || ''
  const consultType = searchParams.get('consultType') || ''
  const selectedSpecialties = searchParams.getAll('specialty') || []
  const sortBy = searchParams.get('sortBy') || ''
  const page = parseInt(searchParams.get('page')) || 1
  
  // Pagination state - derived from URL
  const doctorsPerPage = 7 // 7 doctors per page

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
        if (!response.ok) {
          throw new Error('Failed to fetch doctors')
        }
        const data = await response.json()
        setDoctors(data)
        
        // Extract unique specialties
        const allSpecialties = new Set()
        data.forEach(doctor => {
          doctor.specialities.forEach(specialty => {
            allSpecialties.add(specialty.name)
          })
        })
        setSpecialties(Array.from(allSpecialties).sort())
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDoctors()
  }, []) // Empty dependency array to run only once

  // Apply filters and search
  useEffect(() => {
    if (!doctors.length) return

    let filtered = [...doctors]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply consultation type filter
    if (consultType === 'video') {
      filtered = filtered.filter(doctor => doctor.video_consult)
    } else if (consultType === 'clinic') {
      filtered = filtered.filter(doctor => doctor.in_clinic)
    }

    // Apply specialty filters
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor => 
        doctor.specialities.some(specialty => 
          selectedSpecialties.includes(specialty.name)
        )
      )
    }

    // Apply sorting
    if (sortBy === 'fees') {
      filtered.sort((a, b) => {
        const feeA = parseInt(a.fees.replace(/[^\d]/g, ''))
        const feeB = parseInt(b.fees.replace(/[^\d]/g, ''))
        return feeA - feeB
      })
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience.match(/\d+/)[0])
        const expB = parseInt(b.experience.match(/\d+/)[0])
        return expB - expA
      })
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchQuery, consultType, selectedSpecialties.toString(), sortBy])
  // Changed dependency to ensure array equality check works properly

  // Memoize handlers to prevent recreating them on each render
  const handleSearch = useCallback((query) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      if (query) {
        newParams.set('search', query)
      } else {
        newParams.delete('search')
      }
      newParams.set('page', '1')
      return newParams
    })
  }, [setSearchParams])

  const handleConsultTypeChange = useCallback((type) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      if (type) {
        newParams.set('consultType', type)
      } else {
        newParams.delete('consultType')
      }
      newParams.set('page', '1')
      return newParams
    })
  }, [setSearchParams])

  const handleSpecialtyChange = useCallback((specialty, isChecked) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      const current = newParams.getAll('specialty')
      
      newParams.delete('specialty')
      if (isChecked) {
        // Add the new specialty
        [...current, specialty].forEach(s => newParams.append('specialty', s))
      } else {
        // Remove the specialty
        current.filter(s => s !== specialty).forEach(s => newParams.append('specialty', s))
      }
      
      newParams.set('page', '1')
      return newParams
    })
  }, [setSearchParams])

  const handleSortChange = useCallback((sortOption) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      if (sortOption) {
        newParams.set('sortBy', sortOption)
      } else {
        newParams.delete('sortBy')
      }
      newParams.set('page', '1')
      return newParams
    })
  }, [setSearchParams])

  const handlePageChange = useCallback((pageNumber) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      newParams.set('page', pageNumber.toString())
      return newParams
    })
    // Scroll to top when changing pages
    window.scrollTo(0, 0)
  }, [setSearchParams])

  // Get current doctors for pagination
  const indexOfLastDoctor = page * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#dce1e3]">Loading doctors...</div>
  if (error) return <div className="flex justify-center items-center h-screen bg-[#dce1e3]">Error: {error}</div>

  return (
    <div className="min-h-screen bg-[#dce1e3]">
      <Header 
        doctors={doctors} 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
      />
      <div className="container mx-auto p-4 md:flex gap-6">
        <FilterPanel 
          specialties={specialties}
          selectedSpecialties={selectedSpecialties}
          consultType={consultType}
          sortBy={sortBy}
          onConsultTypeChange={handleConsultTypeChange}
          onSpecialtyChange={handleSpecialtyChange}
          onSortChange={handleSortChange}
        />
        <div className="flex-1">
          <DoctorList 
            doctors={currentDoctors} 
            totalDoctors={filteredDoctors.length}
            currentPage={page}
            doctorsPerPage={doctorsPerPage}
          />
          
          {filteredDoctors.length > doctorsPerPage && (
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;