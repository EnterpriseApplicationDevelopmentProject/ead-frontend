import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
      {/* Main Content Container */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Top Section - Logo */}
        <div className="px-6 md:px-12 pt-6 md:pt-8">
          <div className="text-white text-sm md:text-base font-semibold">
            <p>LOGO</p>
            <p>HERE</p>
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
            <p className="text-white text-base md:text-lg mb-10 md:mb-12 leading-relaxed max-w-lg">
              From routine oil changes to complex repairs, our certified mechanics keep your car running smoothly and safely on the road in their safety Town
            </p>

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
          <div className="hidden lg:block relative flex-1 max-w-3xl">
            {/* Placeholder for car - you can replace this with actual car SVG or image */}
            <div className="relative w-full h-[500px]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-[600px] h-[300px] bg-gray-600 rounded-[100px] opacity-40"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl opacity-30">
                🚗
              </div>
            </div>

            {/* Service Image Cards at bottom */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
              <div className="w-32 h-24 bg-white/20 backdrop-blur-sm rounded-lg border-4 border-white/40 flex items-center justify-center">
                <span className="text-4xl">🔧</span>
              </div>
              <div className="w-32 h-24 bg-white/20 backdrop-blur-sm rounded-lg border-4 border-white/40 flex items-center justify-center">
                <span className="text-4xl">🛠️</span>
              </div>
              <div className="w-32 h-24 bg-white/20 backdrop-blur-sm rounded-lg border-4 border-white/40 flex items-center justify-center">
                <span className="text-4xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Diamond - Bottom Right */}
      <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 w-16 h-16 md:w-20 md:h-20 bg-white transform rotate-45 z-30 opacity-90"></div>
    </div>
  );
}
