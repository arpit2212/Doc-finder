// src/components/FilterPanel.jsx
const FilterPanel = ({ 
    specialties, 
    selectedSpecialties, 
    consultType, 
    sortBy, 
    onConsultTypeChange, 
    onSpecialtyChange, 
    onSortChange 
  }) => {
    // Helper function to convert specialty name to test ID format
    const getSpecialtyTestId = (name) => {
      return `filter-specialty-${name.replace(/\//g, '-')}`;
    };
  
    return (
      <aside className="md:w-1/4 w-full mb-6 md:mb-0">
        {/* Consultation Type Filter */}
        <div className="filter-section">
          <h3 className="filter-header" data-testid="filter-header-moc">Consultation Mode</h3>
          <div className="filter-option">
            <input
              type="radio"
              id="video-consult"
              name="consultType"
              checked={consultType === 'video'}
              onChange={() => onConsultTypeChange('video')}
              data-testid="filter-video-consult"
            />
            <label htmlFor="video-consult" className="filter-label">Video Consult</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="in-clinic"
              name="consultType"
              checked={consultType === 'clinic'}
              onChange={() => onConsultTypeChange('clinic')}
              data-testid="filter-in-clinic"
            />
            <label htmlFor="in-clinic" className="filter-label">In Clinic</label>
          </div>
          {consultType && (
            <button 
              onClick={() => onConsultTypeChange('')}
              className="text-sm text-blue-500 hover:underline mt-2"
            >
              Clear
            </button>
          )}
        </div>
  
        {/* Specialties Filter */}
        <div className="filter-section">
          <h3 className="filter-header" data-testid="filter-header-speciality">Speciality</h3>
          <div className="max-h-60 overflow-y-auto">
            {specialties.map((specialty) => (
              <div key={specialty} className="filter-option">
                <input
                  type="checkbox"
                  id={`specialty-${specialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
                  data-testid={getSpecialtyTestId(specialty)}
                />
                <label htmlFor={`specialty-${specialty}`} className="filter-label">{specialty}</label>
              </div>
            ))}
          </div>
          {selectedSpecialties.length > 0 && (
            <button 
              onClick={() => {
                selectedSpecialties.forEach(specialty => onSpecialtyChange(specialty, false))
              }}
              className="text-sm text-blue-500 hover:underline mt-2"
            >
              Clear All
            </button>
          )}
        </div>
  
        {/* Sort Filter */}
        <div className="filter-section">
          <h3 className="filter-header" data-testid="filter-header-sort">Sort By</h3>
          <div className="filter-option">
            <input
              type="radio"
              id="sort-fees"
              name="sortBy"
              checked={sortBy === 'fees'}
              onChange={() => onSortChange('fees')}
              data-testid="sort-fees"
            />
            <label htmlFor="sort-fees" className="filter-label">Fees (Low to High)</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="sort-experience"
              name="sortBy"
              checked={sortBy === 'experience'}
              onChange={() => onSortChange('experience')}
              data-testid="sort-experience"
            />
            <label htmlFor="sort-experience" className="filter-label">Experience (High to Low)</label>
          </div>
          {sortBy && (
            <button 
              onClick={() => onSortChange('')}
              className="text-sm text-blue-500 hover:underline mt-2"
            >
              Clear
            </button>
          )}
        </div>
      </aside>
    )
  }
  
  export default FilterPanel