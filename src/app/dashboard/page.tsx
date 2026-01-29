'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace('/sign-in');
      return;
    }

    // Check metadata first
    const metadataRole = user.publicMetadata.role as string;
    
    // Fetch from API to be sure (optional, but safer)
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        const userRole = data.role || metadataRole;
        
        if (userRole === 'ADMIN' || userRole === 'GOD_MODE') {
            router.replace('/command-center-z');
        } else if (userRole === 'VENDOR') {
            router.replace('/dashboard/vendor');
        } else {
            // Default student dashboard is effectively their orders/profile
            router.replace('/orders'); 
        }
      })
      .catch(() => {
         // Fallback
         router.replace('/orders');
      });

  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Accessing Terminal...</p>
      </div>
    </div>
  );
}
