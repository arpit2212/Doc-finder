// src/components/DoctorList.jsx
import DoctorCard from './DoctorCard'

const DoctorList = ({ doctors, totalDoctors, currentPage, doctorsPerPage }) => {
  // Calculate the range of doctors being displayed
  const startIndex = (currentPage - 1) * doctorsPerPage + 1
  const endIndex = Math.min(startIndex + doctors.length - 1, totalDoctors)
  
  return (
    <main className="md:w-3/4 w-full">
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          <span className="text-teal-600">{totalDoctors}</span> {totalDoctors === 1 ? 'Doctor' : 'Doctors'} Found
        </h2>
        
        {totalDoctors > doctorsPerPage && (
          <p className="text-sm text-gray-500 mt-1">
            Showing {startIndex}-{endIndex} of {totalDoctors}
          </p>
        )}
      </div>
      
      {doctors.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No doctors found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </main>
  )
}

export default DoctorList