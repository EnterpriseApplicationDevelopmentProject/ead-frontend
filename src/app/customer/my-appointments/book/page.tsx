"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Car, ArrowLeft, Check } from 'lucide-react';
import { appointmentService } from '@/lib/api/appointmentService';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Mock data
  const services = [
    { id: 'SRV001', name: 'Oil Change', duration: '30 min', price: 50 },
    { id: 'SRV002', name: 'Brake Inspection', duration: '45 min', price: 75 },
    { id: 'SRV003', name: 'Tire Rotation', duration: '30 min', price: 40 },
    { id: 'SRV004', name: 'Engine Diagnostics', duration: '1 hour', price: 100 },
    { id: 'SRV005', name: 'Air Conditioning Service', duration: '1.5 hours', price: 120 },
    { id: 'SRV006', name: 'Battery Replacement', duration: '20 min', price: 150 },
  ];

  const vehicles = [
    { id: 'VEH001', number: 'ABC-2345', make: 'Toyota', model: 'Camry', year: 2020 },
    { id: 'VEH002', number: 'CBB-5475', make: 'Honda', model: 'Civic', year: 2019 },
    { id: 'VEH003', number: 'XYZ-7890', make: 'Ford', model: 'F-150', year: 2021 },
  ];

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

    const serviceObj = services.find(s => s.id === selectedService);
    const vehicleObj = vehicles.find(v => v.id === selectedVehicle);



    const start24 = parseTimeTo24(selectedTimeSlot);
    const end24 = addMinutes(start24, 30); // assume 30 min slot

    const payload = {
      service: serviceObj?.name || selectedService,
      vehicleNo: vehicleObj?.number || selectedVehicle,
      date: selectedDate,
      startTime: start24,
      endTime: end24,
      status: 'UPCOMING'
    };

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Sending backend AppointmentDTO shape
      await appointmentService.createAppointment(payload as any);
      window.alert('Appointment booked successfully!');
      router.push('/customer/my-appointments');
    } catch (err) {
      console.error('Booking failed', err);
      window.alert('Failed to book appointment');
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedService && selectedVehicle;
    if (step === 2) return selectedDate;
    if (step === 3) return selectedTimeSlot;
    return false;
  };

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
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration}
                        </span>
                        <span className="font-semibold text-green-600">${service.price}</span>
                      </div>
                    </div>
                    {selectedService === service.id && (
                      <Check className="w-5 h-5 text-blue-600" />
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
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{vehicle.number}</h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.make} {vehicle.model} {vehicle.year}
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  selectedTimeSlot === slot
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Clock className={`w-5 h-5 mb-2 ${selectedTimeSlot === slot ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-semibold ${selectedTimeSlot === slot ? 'text-blue-600' : 'text-gray-900'}`}>
                    {slot}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            disabled={!canProceed()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Booking
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
            {selectedVehicle && (
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{vehicles.find(v => v.id === selectedVehicle)?.number}</span>
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
