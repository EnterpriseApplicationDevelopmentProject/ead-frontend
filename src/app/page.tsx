import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
      {/* Main Content Container */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Top Section - Logo */}
        <div className="px-6 md:px-12 pt-6 md:pt-8">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
                <div className="text-white font-black text-xl md:text-2xl">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
                    <path d="M8 24C8 24 10 22 13 22C16 22 18 24 21 24C24 24 26 22 29 22C32 22 34 24 34 24V28C34 28 32 26 29 26C26 26 24 28 21 28C18 28 16 26 13 26C10 26 8 28 8 28V24Z" fill="white"/>
                    <path d="M10 12H30L32 18H8L10 12Z" fill="white"/>
                    <ellipse cx="13" cy="18" rx="2" ry="2" fill="white"/>
                    <ellipse cx="27" cy="18" rx="2" ry="2" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* Logo Text */}
            <div className="text-white">
              <p className="font-black text-lg md:text-xl leading-tight">EXPERT</p>
              <p className="font-black text-lg md:text-xl leading-tight text-red-500">AUTO CARE</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Left Side - Text Content */}
          <div className="max-w-xl lg:max-w-2xl z-30">
            {/* Title Section */}
            <div className="mb-8 md:mb-10">
              <div className="relative inline-block mb-2">
                <div className="absolute -left-4 -top-2 right-0 bottom-0 bg-red-600 transform -skew-x-12 z-0"></div>
                <h1 className="relative z-10 text-white text-4xl md:text-6xl lg:text-7xl font-black px-6 py-3">
                  Expert Auto Care
                </h1>
              </div>
              <h2 className="text-white text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
                SERVICE
              </h2>
              <p className="text-white text-sm md:text-base mt-2 font-light">
                Best Car Wash Service in your Town
              </p>
            </div>

            {/* Description */}
            <p className="text-white text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-lg">
              From routine oil changes to complex repairs, our certified mechanics keep your car running smoothly and safely on the road in their safety Town
            </p>

            {/* Contact Info & Hours */}
            <div className="mb-8 md:mb-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-semibold text-base md:text-lg"> 0112 250 250 / 0112 350 350</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold text-base md:text-lg"> Open: Mon-Sat  8:00 AM - 8:00 PM</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 md:gap-6">
              <Link 
                href="/auth/login"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 md:py-5 md:px-16 rounded-full text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-white hover:bg-gray-100 text-red-600 font-bold py-4 px-12 md:py-5 md:px-16 rounded-full text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Right Side - Car Image and Service Cards */}
          <div className="hidden lg:block relative flex-1 max-w-4xl mr-12">
            {/* Main Car Image */}
            <div className="relative w-[900px] h-[500px] border: border-radius-lg shadow-2xl mx-auto">
              <Image
                src="/main-car-image.png"
                alt="Luxury Car"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Service Image Cards at bottom */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
              <div className="w-32 h-24 rounded-lg border-4 border-white/60 overflow-hidden shadow-xl hover:scale-105 ">
                <Image
                  src="/service-1.jpg"
                  alt="Service 1"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-24 rounded-lg border-4 border-white/60 overflow-hidden shadow-xl hover:scale-105 transition-transform">
                <Image
                  src="/service-2.jpg"
                  alt="Service 2"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-24 rounded-lg border-4 border-white/60 overflow-hidden shadow-xl hover:scale-105 transition-transform">
                <Image
                  src="/service-3.jpg"
                  alt="Service 3"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
