"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Car, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { appointmentService } from '@/lib/api/appointmentService';
import { vehicleApi } from '@/lib/vehicleApi';
import * as serviceApi from '@/lib/api/serviceApi';
import { Service } from '@/types/service.types';
import { Vehicle } from '@/types/vehicle.types';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Real data from API
  const [services, setServices] = useState<Service[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Fetch services and vehicles on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch availability when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
      // Clear selected time slot when date changes
      setSelectedTimeSlot('');
    }
  }, [selectedDate]);

  // Refresh availability when moving to step 3 (time selection)
  useEffect(() => {
    if (step === 3 && selectedDate) {
      console.log('Step 3: Refreshing availability for', selectedDate);
      fetchAvailability(selectedDate);
    }
  }, [step]);

  const fetchAvailability = async (date: string) => {
    try {
      setLoadingAvailability(true);
      console.log('Fetching availability for date:', date);
      const bookedTimes = await appointmentService.getAvailability(date);
      console.log('Backend returned booked times (24h):', bookedTimes);
      
      // Convert backend 24h format (HH:mm) to 12h format to match timeSlots
      const booked12h = bookedTimes.map(time24 => convertTo12Hour(time24));
      console.log('Converted to 12h format:', booked12h);
      
      setBookedSlots(booked12h);
      
      // If currently selected slot is now booked, clear it
      if (selectedTimeSlot && booked12h.includes(selectedTimeSlot)) {
        console.warn('Currently selected slot is now booked, clearing selection');
        setSelectedTimeSlot('');
      }
    } catch (err: any) {
      console.error('Failed to fetch availability:', err);
      // Don't show error to user, just assume no slots booked
      setBookedSlots([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const convertTo12Hour = (time24: string): string => {
    // Convert "09:00" to "09:00 AM", "14:30" to "02:30 PM"
    try {
      const [h, m] = time24.split(':').map(Number);
      if (isNaN(h) || isNaN(m)) {
        console.error('Invalid time format:', time24);
        return time24;
      }
      const hour = h % 12 || 12;
      const period = h >= 12 ? 'PM' : 'AM';
      return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    } catch (err) {
      console.error('Error converting time:', time24, err);
      return time24;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch active services and customer vehicles in parallel
      const [servicesData, vehiclesData] = await Promise.all([
        serviceApi.getActiveServices(),
        vehicleApi.getAllVehicles(),
      ]);

      setServices(servicesData);
      setVehicles(vehiclesData);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err?.response?.data?.message || 'Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const parseTimeTo24 = (time12: string) => {
    // expects format like '09:30 AM'
    const [time, modifier] = time12.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hours = h;
  const mins = m;
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const addMinutes = (time24: string, mins: number) => {
    const [h, m] = time24.split(':').map(Number);
    const dt = new Date();
    dt.setHours(h);
    dt.setMinutes(m + mins);
    return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
  };



  const handleBookAppointment = async () => {
    // Build payload matching backend AppointmentDTO
    if (!selectedService || !selectedVehicle || !selectedDate || !selectedTimeSlot) {
      window.alert('Please complete the booking form');
      return;
    }

    // Check if selected time slot is booked
    if (bookedSlots.includes(selectedTimeSlot)) {
      window.alert('This time slot is no longer available. Please select another time.');
      setSelectedTimeSlot(''); // Clear the selection
      return;
    }

    const serviceObj = services.find(s => s.id === selectedService);
    const vehicleObj = vehicles.find(v => v.id === selectedVehicle);

    if (!serviceObj || !vehicleObj) {
      window.alert('Invalid service or vehicle selection');
      return;
    }

    const start24 = parseTimeTo24(selectedTimeSlot);
    // Calculate end time based on service duration
    const end24 = addMinutes(start24, serviceObj.estimatedDurationMinutes);

    // Backend expects AppointmentDTO with exact field names and types
    const payload = {
      service: serviceObj.name,
      vehicleNo: vehicleObj.licensePlate,
      vehicleId: vehicleObj.id.toString(),
      date: selectedDate, // Already in YYYY-MM-DD format from date picker
      startTime: start24,
      endTime: end24
      // status will be set to REQUESTING by backend automatically
      // customerId will be set by backend from authenticated user
    };

    try {
      setSubmitting(true);
      console.log('Booking appointment with payload:', payload);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Sending backend AppointmentDTO shape
      await appointmentService.createAppointment(payload as any);
      window.alert('Appointment booked successfully!');
      router.push('/customer/my-appointments');
    } catch (err: any) {
      console.error('Booking failed', err);
      const errorMessage = err?.response?.data?.message || err?.response?.data || 'Failed to book appointment';
      
      // If the slot was taken, refresh availability
      if (errorMessage.includes('already booked') || errorMessage.includes('Time slot')) {
        window.alert('This time slot was just booked by another customer. Please select a different time.');
        // Refresh availability
        fetchAvailability(selectedDate);
        setSelectedTimeSlot('');
      } else {
        window.alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedService && selectedVehicle;
    if (step === 2) return selectedDate;
    if (step === 3) {
      // Can only proceed if time slot is selected AND it's not booked
      return selectedTimeSlot && !bookedSlots.includes(selectedTimeSlot);
    }
    return false;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // No vehicles state
  if (vehicles.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p className="font-medium">No Vehicles Found</p>
          <p className="text-sm">You need to add a vehicle before booking an appointment.</p>
        </div>
        <button
          onClick={() => router.push('/customer/vehicles')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Vehicle
        </button>
      </div>
    );
  }

  // No services state
  if (services.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p className="font-medium">No Services Available</p>
          <p className="text-sm">There are currently no active services available for booking.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => step === 1 ? router.back() : setStep(step - 1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Schedule a service for your vehicle</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {num === 1 && 'Service & Vehicle'}
                  {num === 2 && 'Select Date'}
                  {num === 3 && 'Select Time'}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`h-1 flex-1 ${
                    step > num ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Service & Vehicle Selection */}
      {step === 1 && (
        <div className="space-y-8">
          {/* Service Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {service.imageUrl && (
                          <img 
                            src={service.imageUrl} 
                            alt={service.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.description && (
                            <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {serviceApi.formatDuration(service.estimatedDurationMinutes)}
                            </span>
                            <span className="font-semibold text-green-600">${service.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedService === service.id && (
                      <Check className="w-5 h-5 text-blue-600 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {vehicle.imageUrl ? (
                        <img 
                          src={vehicle.imageUrl} 
                          alt={vehicle.licensePlate}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicle.color} • VIN: {vehicle.vin.slice(-6)}
                        </p>
                      </div>
                    </div>
                    {selectedVehicle === vehicle.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {dates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                    selectedDate === dateStr
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Calendar className={`w-6 h-6 mb-2 ${selectedDate === dateStr ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className={`text-sm font-semibold ${selectedDate === dateStr ? 'text-blue-600' : 'text-gray-900'}`}>
                      {formatDate(date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selected: <span className="font-semibold">{formatFullDate(new Date(selectedDate))}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Time Slot Selection */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
          
          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono">
              <strong>Debug Info:</strong>
              <div>Date: {selectedDate}</div>
              <div>Booked Slots ({bookedSlots.length}): {JSON.stringify(bookedSlots)}</div>
              <div>Selected: {selectedTimeSlot || 'none'}</div>
              <div>Is Selected Booked: {selectedTimeSlot && bookedSlots.includes(selectedTimeSlot) ? 'YES' : 'NO'}</div>
            </div>
          )}
          
          {loadingAvailability ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Checking availability...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                      className={`relative p-4 border-2 rounded-lg text-center transition-all ${
                        isBooked
                          ? 'border-red-200 bg-red-50 cursor-not-allowed'
                          : selectedTimeSlot === slot
                          ? 'border-blue-600 bg-blue-50 cursor-pointer shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {isBooked ? (
                          <>
                            <div className="relative">
                              <Clock className="w-5 h-5 mb-2 text-red-400" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-0.5 bg-red-500 transform rotate-45"></div>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-red-600 line-through">
                              {slot}
                            </div>
                            <span className="text-xs text-red-600 mt-1 font-medium">Unavailable</span>
                          </>
                        ) : (
                          <>
                            <Clock className={`w-5 h-5 mb-2 ${
                              selectedTimeSlot === slot ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <div className={`text-sm font-semibold ${
                              selectedTimeSlot === slot ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {slot}
                            </div>
                            {selectedTimeSlot === slot && (
                              <span className="text-xs text-blue-600 mt-1">Selected</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 border-2 border-blue-600 bg-blue-50 rounded flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 border-2 border-red-200 bg-red-50 rounded flex items-center justify-center">
                    <div className="relative">
                      <Clock className="w-5 h-5 text-red-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-red-500 transform rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">Unavailable</span>
                </div>
              </div>
              {bookedSlots.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        {bookedSlots.length} time slot{bookedSlots.length > 1 ? 's' : ''} unavailable
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        These slots are already booked by you or other customers. Please choose an available time.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {bookedSlots.length === 0 && !loadingAvailability && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        All time slots are available!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Select any time slot that works best for you.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {selectedTimeSlot && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selected Time: <span className="font-semibold">{selectedTimeSlot}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => step === 1 ? router.back() : setStep(step - 1)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={submitting}
        >
          {step === 1 ? 'Cancel' : 'Previous'}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleBookAppointment}
            disabled={!canProceed() || submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>

      {/* Summary (shown on all steps) */}
      {(selectedService || selectedVehicle || selectedDate || selectedTimeSlot) && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            {selectedService && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
              </div>
            )}
            {selectedService && (
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">
                  ${services.find(s => s.id === selectedService)?.price.toFixed(2)}
                </span>
              </div>
            )}
            {selectedService && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {services.find(s => s.id === selectedService) && 
                    serviceApi.formatDuration(services.find(s => s.id === selectedService)!.estimatedDurationMinutes)
                  }
                </span>
              </div>
            )}
            {selectedVehicle && (
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{vehicles.find(v => v.id === selectedVehicle)?.licensePlate}</span>
              </div>
            )}
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatFullDate(new Date(selectedDate))}</span>
              </div>
            )}
            {selectedTimeSlot && (
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTimeSlot}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
