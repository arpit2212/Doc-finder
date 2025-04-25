import { useState, useEffect, useRef } from 'react'

const Header = ({ doctors, onSearch, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setInputValue(searchQuery || '')
  }, [searchQuery])

  useEffect(() => {
    // Add click outside listener to close suggestions
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/dr\.|doctor|dr|prof\.|professor|prof/gi, '') // Remove titles
      .trim()
  }

  const getSimilarityScore = (doctorName, searchValue) => {
    const normalizedDoctorName = normalizeText(doctorName)
    const normalizedSearchValue = normalizeText(searchValue)
    
    // Exact match gets highest score
    if (normalizedDoctorName.includes(normalizedSearchValue)) {
      return 100 - (normalizedDoctorName.indexOf(normalizedSearchValue) * 0.1)
    }

    // Check for partial matches
    const searchTokens = normalizedSearchValue.split(/\s+/)
    let matchCount = 0
    
    searchTokens.forEach(token => {
      if (token.length > 1 && normalizedDoctorName.includes(token)) {
        matchCount++
      }
    })
    
    return matchCount > 0 ? 50 + matchCount * 10 : 0
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    if (value.trim().length > 0) {
      // Get all potential matches with similarity scores
      const matches = doctors.map(doctor => ({
        ...doctor,
        similarityScore: getSimilarityScore(doctor.name, value)
      }))
      .filter(doctor => doctor.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3)
      
      setSuggestions(matches)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(inputValue)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (name) => {
    setInputValue(name)
    onSearch(name)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
    // Show suggestions again if there's text in the input
    if (inputValue.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const highlightMatch = (text, query) => {
    if (!query) return text
    
    const normalizedText = text
    const normalizedQuery = normalizeText(query)
    
    if (!normalizedQuery || !normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase())) {
      return text
    }
    
    const index = normalizedText.toLowerCase().indexOf(normalizedQuery.toLowerCase())
    const before = text.substring(0, index)
    const match = text.substring(index, index + normalizedQuery.length)
    const after = text.substring(index + normalizedQuery.length)
    
    return (
      <>
        {before}<span className="font-bold text-teal-700">{match}</span>{after}
      </>
    )
  }

  const handleClear = () => {
    setInputValue('')
    onSearch('')
    setShowSuggestions(false)
    inputRef.current.focus()
  }

  const handleLogin = () => {
    // Implement login functionality here
    console.log('Login button clicked')
  }

  return (
    <header className="bg-teal-50 p-4 shadow-md mb-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="mr-3">
              <svg className="h-10 w-10 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-teal-700">Doc Finder</h1>
          </div>
          
          <button 
            onClick={handleLogin}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Login
          </button>
        </div>
        
        <div className="w-full max-w-2xl mx-auto relative" ref={suggestionsRef}>
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for doctors (e.g., Arpit, Cardiologist, etc.)"
                className={`w-full p-3 pl-10 rounded-l-lg border-2 ${isInputFocused ? 'border-teal-400' : 'border-teal-200'} border-r-0 focus:outline-none focus:border-teal-400 transition-colors`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={handleKeyDown}
                data-testid="autocomplete-input"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              {inputValue && (
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={handleClear}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-teal-600 text-white px-6 rounded-r-lg hover:bg-teal-700 transition duration-200 flex items-center"
            >
              Search
            </button>
          </form>
          
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute w-full bg-white mt-1 rounded-lg border border-teal-200 shadow-lg z-10">
              {suggestions.map((doctor) => (
                <li 
                  key={doctor.id}
                  className="p-3 hover:bg-teal-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(doctor.name)}
                  data-testid="suggestion-item"
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="font-medium">
                        {highlightMatch(doctor.name, inputValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.specialities && doctor.specialities.length > 0 
                          ? doctor.specialities.map(spec => spec.name).join(', ')
                          : 'General Practitioner'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {doctor.video_consult && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Video
                        </span>
                      )}
                      {doctor.in_clinic && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          In-clinic
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header