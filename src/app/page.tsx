import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image - Display the complete design */}
      <Image
        src="/automobile-landing-page.png"
        alt="Expert Auto Care Service"
        fill
        className="object-cover object-center"
        priority
        quality={100}
      />
      
      {/* Clickable Areas for Navigation (Invisible overlays on buttons) */}
      <div className="absolute bottom-[8%] left-[3%] md:left-[4%] z-20">
        <Link 
          href="/auth/login"
          className="block w-[120px] h-[50px] md:w-[140px] md:h-[60px]"
          aria-label="Login"
        >
          <span className="sr-only">Login</span>
        </Link>
      </div>
      
      <div className="absolute bottom-[8%] left-[13%] md:left-[14%] z-20">
        <Link 
          href="/auth/signup"
          className="block w-[120px] h-[50px] md:w-[140px] md:h-[60px]"
          aria-label="Sign Up"
        >
          <span className="sr-only">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
