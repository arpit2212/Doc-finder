// src/components/BookAppointment.jsx
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    visitMode: doctor?.video_consult && doctor?.in_clinic ? '' : 
              doctor?.video_consult ? 'video' : 'clinic',
    problem: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      const hourStr = hour > 12 ? `${hour - 12}` : `${hour}`;
      const period = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${hourStr}:00 ${period}`);
      if (hour !== 19) {
        slots.push(`${hourStr}:30 ${period}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.visitMode) newErrors.visitMode = 'Visit mode is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate random booking ID
      const randomBookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Navigate to success page with booking details
      navigate('/booking-success', { 
        state: { 
          bookingId: randomBookingId,
          doctor: doctor,
          appointmentDetails: formData
        }
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  // For date input - set min date to today
  const today = new Date().toISOString().split('T')[0];

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#dce1e3]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 text-xl mb-4">Doctor information not found</div>
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

  return (
    <div className="min-h-screen bg-[#dce1e3] py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-600 text-white p-6">
            <h1 className="text-2xl font-bold">Book Appointment</h1>
            <p className="mt-2">Please fill in your details to book an appointment with Dr. {doctor.name}</p>
          </div>
          
          <div className="p-6">
            {/* Doctor Info Summary */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img 
                  src={doctor.photo || "/api/placeholder/80/80"} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/80/80";
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialities.map(s => s.name).join(', ')}</p>
                <p className="text-teal-600 font-medium">{doctor.fees}</p>
              </div>
            </div>
            
            {/* Appointment Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                {/* Appointment Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                
                {/* Appointment Time */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="time">
                    Preferred Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.time}
                    onChange={handleChange}
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>
                
                {/* Visit Mode */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mode of Consultation
                  </label>
                  <div className="flex space-x-4">
                    {doctor.in_clinic && (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visitMode"
                          value="clinic"
                          checked={formData.visitMode === 'clinic'}
                          onChange={handleChange}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-gray-700">In-Clinic Visit</span>
                      </label>
                    )}
                    
                    {doctor.video_consult && (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visitMode"
                          value="video"
                          checked={formData.visitMode === 'video'}
                          onChange={handleChange}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-gray-700">Video Consultation</span>
                      </label>
                    )}
                  </div>
                  {errors.visitMode && <p className="text-red-500 text-sm mt-1">{errors.visitMode}</p>}
                </div>
              </div>
              
              {/* Health Problem Description */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="problem">
                  Health Problem (Optional)
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="Briefly describe your health problem or reason for visit"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 mr-4 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
