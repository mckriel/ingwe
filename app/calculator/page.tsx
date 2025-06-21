'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bond repayment calculator by default
    router.replace('/calculator/bond-repayment');
  }, [router]);

  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Redirecting to Bond Repayment Calculator...</p>
      </div>
    </main>
  );
}
