// src/App.jsx
import { useEffect, useState } from 'react'
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const doctorsPerPage = 7 // 7 doctors per page

  // Get all query params
  const searchQuery = searchParams.get('search') || ''
  const consultType = searchParams.get('consultType') || ''
  const selectedSpecialties = searchParams.getAll('specialty') || []
  const sortBy = searchParams.get('sortBy') || ''
  const page = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    // Set current page from URL when component mounts
    setCurrentPage(page)
  }, [page])

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
  }, [])

  // Apply filters and search
  useEffect(() => {
    if (doctors.length === 0) return

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
    
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      handlePageChange(1)
    }
  }, [doctors, searchQuery, consultType, selectedSpecialties, sortBy])

  const handleSearch = (query) => {
    if (query) {
      searchParams.set('search', query)
    } else {
      searchParams.delete('search')
    }
    // Reset to page 1 when searching
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handleConsultTypeChange = (type) => {
    if (type) {
      searchParams.set('consultType', type)
    } else {
      searchParams.delete('consultType')
    }
    // Reset to page 1 when filters change
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handleSpecialtyChange = (specialty, isChecked) => {
    const current = searchParams.getAll('specialty')
    
    if (isChecked) {
      if (!current.includes(specialty)) {
        searchParams.append('specialty', specialty)
      }
    } else {
      const updated = current.filter(s => s !== specialty)
      searchParams.delete('specialty')
      updated.forEach(s => searchParams.append('specialty', s))
    }
    
    // Reset to page 1 when filters change
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handleSortChange = (sortOption) => {
    if (sortOption) {
      searchParams.set('sortBy', sortOption)
    } else {
      searchParams.delete('sortBy')
    }
    // Reset to page 1 when sorting changes
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    searchParams.set('page', pageNumber.toString())
    setSearchParams(searchParams)
    // Scroll to top when changing pages
    window.scrollTo(0, 0)
  }

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage
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
            currentPage={currentPage}
            doctorsPerPage={doctorsPerPage}
          />
          
          {filteredDoctors.length > doctorsPerPage && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App