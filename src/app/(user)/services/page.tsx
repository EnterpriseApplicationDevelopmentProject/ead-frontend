'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { serviceApi, ServiceResponse } from '@/lib/api/services';

// Use the interface from API but extend it for frontend display
interface VehicleService extends Omit<ServiceResponse, 'price' | 'category'> {
  price: string | number;
  category: string; // Always string after transformation
}

const vehicleServices: VehicleService[] = [
  {
    id: '1',
    name: 'Oil Change & Filter Replacement',
    description: 'Complete oil change service with premium synthetic or conventional oil. Includes oil filter replacement and fluid level check.',
    price: '$49.99',
    duration: '30 mins',
    imageUrl: 'https://images.unsplash.com/photo-1632823469412-20e3dd1c7a84?w=500&h=300&fit=crop',
    category: 'Maintenance',
    popular: true,
    features: ['Premium oil options', 'Oil filter replacement', 'Multi-point inspection', 'Fluid top-off'],
  },
  {
    id: '2',
    name: 'Brake Inspection & Service',
    description: 'Comprehensive brake system inspection including pads, rotors, calipers, and brake fluid. Replacement services available.',
    price: '$89.99',
    duration: '1 hour',
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=300&fit=crop',
    category: 'Safety',
    popular: true,
    features: ['Brake pad inspection', 'Rotor measurement', 'Brake fluid check', 'Test drive included'],
  },
  {
    id: '3',
    name: 'Tire Rotation & Balance',
    description: 'Professional tire rotation and balancing to ensure even wear and optimal performance. Extends tire life significantly.',
    price: '$59.99',
    duration: '45 mins',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=300&fit=crop',
    category: 'Maintenance',
    features: ['4-wheel rotation', 'Wheel balancing', 'Tire pressure check', 'Visual inspection'],
  },
  {
    id: '4',
    name: 'Engine Diagnostics',
    description: 'Advanced computer diagnostics to identify engine issues. Comprehensive scan of all vehicle systems with detailed report.',
    price: '$79.99',
    duration: '1 hour',
    imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&h=300&fit=crop',
    category: 'Diagnostics',
    popular: true,
    features: ['Full system scan', 'Error code reading', 'Detailed report', 'Expert consultation'],
  },
  {
    id: '5',
    name: 'Air Conditioning Service',
    description: 'Complete AC system inspection, refrigerant recharge, and performance check. Stay cool all summer long.',
    price: '$129.99',
    duration: '1.5 hours',
    imageUrl: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&h=300&fit=crop',
    category: 'Climate Control',
    features: ['AC system inspection', 'Refrigerant recharge', 'Leak detection', 'Performance test'],
  },
  {
    id: '6',
    name: 'Battery Test & Replacement',
    description: 'Complete battery testing and replacement service. We test charging system and install premium batteries with warranty.',
    price: '$149.99',
    duration: '30 mins',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=300&fit=crop',
    category: 'Electrical',
    features: ['Battery load test', 'Charging system check', 'Terminal cleaning', 'Premium battery options'],
  },
  {
    id: '7',
    name: 'Transmission Service',
    description: 'Transmission fluid change and filter replacement. Helps prevent costly transmission repairs and ensures smooth shifting.',
    price: '$179.99',
    duration: '2 hours',
    imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500&h=300&fit=crop',
    category: 'Maintenance',
    features: ['Fluid exchange', 'Filter replacement', 'Gasket inspection', 'Test drive included'],
  },
  {
    id: '8',
    name: 'Full Detail & Wash',
    description: 'Premium interior and exterior detailing. Hand wash, wax, interior vacuum, and conditioning. Make your car look brand new.',
    price: '$199.99',
    duration: '3 hours',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=300&fit=crop',
    category: 'Detailing',
    popular: true,
    features: ['Exterior hand wash & wax', 'Interior deep clean', 'Leather conditioning', 'Tire shine'],
  },
  {
    id: '9',
    name: 'Wheel Alignment',
    description: 'Precision wheel alignment using advanced computerized equipment. Improves handling and extends tire life.',
    price: '$99.99',
    duration: '1 hour',
    imageUrl: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&h=300&fit=crop',
    category: 'Maintenance',
    features: ['4-wheel alignment', 'Computerized precision', 'Steering check', 'Before/after report'],
  },
  {
    id: '10',
    name: 'Exhaust System Repair',
    description: 'Complete exhaust system inspection and repair. Muffler, catalytic converter, and pipe replacement available.',
    price: '$299.99',
    duration: '2 hours',
    imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500&h=300&fit=crop',
    category: 'Repair',
    features: ['Full system inspection', 'Leak detection', 'Component replacement', 'Emissions test'],
  },
  {
    id: '11',
    name: 'Suspension Service',
    description: 'Inspection and repair of shocks, struts, and suspension components. Ensures smooth ride and proper handling.',
    price: '$249.99',
    duration: '2.5 hours',
    imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&h=300&fit=crop',
    category: 'Repair',
    features: ['Shock/strut inspection', 'Component replacement', 'Ride quality test', 'Alignment check'],
  },
  {
    id: '12',
    name: 'Pre-Purchase Inspection',
    description: 'Comprehensive 150-point inspection for used car buyers. Get complete peace of mind before your purchase.',
    price: '$149.99',
    duration: '2 hours',
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=300&fit=crop',
    category: 'Diagnostics',
    features: ['150-point inspection', 'Detailed written report', 'Photos included', 'Expert recommendations'],
  },
];

const categories = [
  'All Services',
  'Maintenance',
  'Safety',
  'Diagnostics',
  'Repair',
  'Electrical',
  'Climate Control',
  'Detailing',
];

export default function VehicleServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [activeFilter, setActiveFilter] = useState('All');
  const [services, setServices] = useState<VehicleService[]>([]); // Start with empty array - fetch from backend
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching services from backend...');
        const data = await serviceApi.getAllServices();
        
        // Transform backend data to frontend format
        const transformedData = data.map(service => ({
          ...service,
          // Convert price to display format (backend uses LKR, frontend displays with currency)
          price: typeof service.price === 'number' 
            ? `${service.currency || 'LKR'} ${service.price.toFixed(2)}` 
            : service.price,
          // Convert durationInHours to duration string if not present
          duration: service.duration || `${service.durationInHours || 1} hour${(service.durationInHours || 1) !== 1 ? 's' : ''}`,
          // Extract category name from category object (backend sends {id, name, description})
          category: typeof service.category === 'object' && service.category !== null 
            ? (service.category as any).name 
            : service.category || 'Service',
          categoryId: typeof service.category === 'object' && service.category !== null 
            ? (service.category as any).id 
            : service.categoryId,
          // Ensure features array exists (backend might not have it)
          features: service.features || [],
          // Set popular based on status or price (you can customize this logic)
          popular: service.popular !== undefined ? service.popular : service.price > 5000,
        }));
        
        setServices(transformedData as VehicleService[]);
        console.log(`✅ Successfully loaded ${transformedData.length} services from backend`);
        console.log('📦 Sample service:', transformedData[0]);
      } catch (err) {
        console.error('❌ Failed to fetch services from backend:', err);
        setError('Unable to load services. Please make sure the backend server is running on http://localhost:8080');
        
        // Option: Use fallback data in development
        if (process.env.NODE_ENV === 'development') {
          console.info('⚠️ Using fallback mock data for development');
          setServices(vehicleServices);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Run once on mount

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Popular' && service.popular) ||
                         (activeFilter === 'Maintenance' && service.category === 'Maintenance') ||
                         (activeFilter === 'Repair' && service.category === 'Repair');
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Services');
    setActiveFilter('All');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Backend Connection Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Backend Connection Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  <strong>Steps to fix:</strong>
                  <br />1. Make sure Spring Boot backend is running: <code className="bg-red-100 px-1 rounded">./mvnw spring-boot:run</code>
                  <br />2. Verify backend is accessible: <code className="bg-red-100 px-1 rounded">curl http://localhost:8080/api/customer/services</code>
                  <br />3. Check CORS configuration in your backend
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Vehicle Service Center
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional automotive care and maintenance services. Quality work, competitive prices, and exceptional customer service.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Certified Technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Warranty on All Services</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Same-Day Service Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[200px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button 
              onClick={resetFilters}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 border-b -mb-px">
            {['All', 'Popular', 'Maintenance', 'Repair'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeFilter === filter
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count and loading indicator */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
          </p>
          {loading && (
            <div className="flex items-center text-blue-600">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">Loading services...</span>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && services.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                    <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                )}
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Popular
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {service.category}
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {service.price}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a 
                    href={`/services/${service.id}`}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    Details
                  </a>
                  <button className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing a Service?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our expert technicians are here to help. Contact us for a free consultation and quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Call Us: (555) 123-4567
            </button>
            <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
