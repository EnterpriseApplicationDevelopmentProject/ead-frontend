'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to login page
    router.push('/login');
  }, [router]);

  // Show nothing while redirecting
  return null;
}
