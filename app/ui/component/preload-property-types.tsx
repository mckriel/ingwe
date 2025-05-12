'use client';

import { useEffect } from 'react';

export default function PreloadPropertyTypes() {
  useEffect(() => {
    // Preload property types on client-side
    const preloadTypes = async () => {
      try {
        // Using dynamic import to avoid server/client mismatch
        const { get_property_types } = await import('@/app/actions/property-types');
        await get_property_types();
        console.log('Client-side property types preloaded successfully');
      } catch (error) {
        console.error('Error preloading property types on client-side:', error);
      }
    };
    
    preloadTypes();
  }, []);

  // This is an invisible component
  return null;
}