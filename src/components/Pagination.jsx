// src/components/Pagination.jsx
import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []
  
  // Create page number list with ellipsis for many pages
  if (totalPages <= 5) {
    // If fewer than 6 pages, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always include first page
    pages.push(1)
    
    // Show ellipsis or page numbers
    if (currentPage <= 3) {
      pages.push(2, 3, 4, '...')
    } else if (currentPage >= totalPages - 2) {
      pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1)
    } else {
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...')
    }
    
    // Always include last page
    pages.push(totalPages)
  }

  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="flex items-center bg-white rounded-lg shadow-md">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border-r ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-teal-600 hover:bg-teal-50'
          }`}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Page numbers */}
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-4 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 ${
                  currentPage === page
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-teal-600 hover:bg-teal-50'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border-l ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-teal-600 hover:bg-teal-50'
          }`}
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination