import { useState, useEffect, useRef } from 'react'

const Header = ({ doctors, onSearch, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)

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

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    if (value.trim().length > 0) {
      // Filter doctors by name and take top 3
      const filtered = doctors
        .filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3)
      
      setSuggestions(filtered)
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
            <input
              type="text"
              placeholder="Search for doctors..."
              className="w-full p-3 rounded-l-lg border-2 border-r-0 border-teal-200 focus:outline-none focus:border-teal-400"
              value={inputValue}
              onChange={handleInputChange}
              data-testid="autocomplete-input"
            />
            <button 
              type="submit" 
              className="bg-teal-600 text-white px-6 rounded-r-lg hover:bg-teal-700 transition duration-200"
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
                  {doctor.name}
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