'use client';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-8">
          <p className="text-2xl mb-8">INGWE HOME PAGE</p>
          
          <div className="flex space-x-4">
            <Link href="/buy" className="px-4 py-2 bg-green-600 text-white rounded">
              Buy
            </Link>
            <Link href="/rent" className="px-4 py-2 bg-blue-600 text-white rounded">
              Rent
            </Link>
          </div>
        </div>
    );
}
