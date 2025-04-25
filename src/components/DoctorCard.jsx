// src/components/DoctorCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract years from experience string
  const experienceYears = doctor?.experience?.match(/\d+/)?.[0] || '0';
  
  // Extract amount from fees
  const fees = doctor?.fees?.trim() || 'Fee not available';
  
  const handleBookAppointment = (e) => {
    e.preventDefault();
    
    if (!doctor || !doctor.id) {
      console.error("Doctor ID is missing!");
      return;
    }
    
    setIsLoading(true);
    
    // Navigate to booking page with doctor info in state
    navigate(`/book/${doctor.id}`, { 
      state: { doctor }
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden" data-testid="doctor-card">
      <div className="p-4 md:flex">
        {/* Doctor Image and Basic Info */}
        <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-center md:items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
            <img 
              src={doctor.photo || "/api/placeholder/100/100"} 
              alt={doctor.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/100/100";
              }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800" data-testid="doctor-name">{doctor.name}</h3>
          <div data-testid="doctor-specialty" className="text-sm text-gray-600 mb-2">
            {doctor.specialities && doctor.specialities.map((specialty, index) => (
              <span key={index}>
                {specialty.name}
                {index < doctor.specialities.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
          <div data-testid="doctor-experience" className="text-sm text-gray-600">
            {experienceYears} {parseInt(experienceYears) === 1 ? 'Year' : 'Years'} Experience
          </div>
        </div>
        
        {/* Doctor Details */}
        <div className="md:w-2/4 md:px-4">
          {doctor.doctor_introduction && (
            <p className="text-sm text-gray-700 mb-3">{doctor.doctor_introduction}</p>
          )}
          
          {doctor.clinic && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Clinic</h4>
              <p className="text-sm text-gray-600">{doctor.clinic.name}</p>
              {doctor.clinic.address && (
                <p className="text-sm text-gray-500">
                  {doctor.clinic.address.address_line1}, {doctor.clinic.address.locality}, {doctor.clinic.address.city}
                </p>
              )}
            </div>
          )}
          
          {doctor.languages && doctor.languages.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Languages</h4>
              <p className="text-sm text-gray-600">{doctor.languages.join(', ')}</p>
            </div>
          )}
        </div>
        
        {/* Appointment Info */}
        <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col items-center md:items-end">
          <div className="text-lg font-semibold text-teal-600 mb-3" data-testid="doctor-fee">
            {fees}
          </div>
          
          <div className="space-y-2 w-full md:text-right">
            {doctor.in_clinic && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs inline-block">
                In-Clinic Available
              </div>
            )}
            {doctor.video_consult && (
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs inline-block">
                Video Consult Available
              </div>
            )}
          </div>
          
          <button 
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full md:w-auto flex items-center justify-center"
            onClick={handleBookAppointment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;