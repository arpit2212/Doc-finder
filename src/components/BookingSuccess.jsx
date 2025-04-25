import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, doctor, appointmentDetails } = location.state || {};

  if (!bookingId || !doctor || !appointmentDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#dce1e3]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 text-xl mb-4">Booking information not found</div>
          <button 
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            onClick={() => navigate('/')}
          >
            Return to Doctor List
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#dce1e3] py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 text-white p-6 text-center">
            <div className="flex justify-center">
              <CheckCircle size={60} className="mb-3" />
            </div>
            <h1 className="text-2xl font-bold">Appointment Booked Successfully!</h1>
            <p className="mt-2">Your booking has been confirmed.</p>
          </div>
          
          <div className="p-6">
            {/* Booking ID */}
            <div className="mb-6 pb-6 border-b border-gray-200 text-center">
              <p className="text-gray-600">Your Booking ID</p>
              <p className="text-2xl font-bold text-teal-600">{bookingId}</p>
              <p className="text-sm text-gray-500 mt-2">Please save this ID for your reference</p>
            </div>
            
            {/* Appointment Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Details</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={doctor.photo || "/api/placeholder/80/80"} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/60/60";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialities.map(s => s.name).join(', ')}</p>
                  </div>
                </div>
                
                {doctor.clinic && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700">Clinic</p>
                    <p>{doctor.clinic.name}</p>
                    {doctor.clinic.address && (
                      <p>{doctor.clinic.address.address_line1}, {doctor.clinic.address.city}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Date:</span> {formatDate(appointmentDetails.date)}</p>
                  <p><span className="font-medium text-gray-700">Time:</span> {appointmentDetails.time}</p>
                  <p>
                    <span className="font-medium text-gray-700">Mode:</span> 
                    {appointmentDetails.visitMode === 'video' ? ' Video Consultation' : ' In-Clinic Visit'}
                  </p>
                  <p><span className="font-medium text-gray-700">Fees:</span> {doctor.fees}</p>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium text-gray-700">Patient Details</p>
                  <p className="text-sm text-gray-600">{appointmentDetails.name}</p>
                  <p className="text-sm text-gray-600">{appointmentDetails.phone}</p>
                  <p className="text-sm text-gray-600">{appointmentDetails.email}</p>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Important Instructions</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Please arrive 15 minutes before your scheduled appointment time.</li>
                <li>Bring any relevant medical records or test reports with you.</li>
                <li>For video consultation, ensure you have a stable internet connection.</li>
                <li>You can reschedule or cancel your appointment up to 6 hours before the scheduled time.</li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center"
                onClick={() => window.print()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Details
              </button>
              <button
                className="px-6 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;