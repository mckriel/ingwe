'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CalculatorTab() {
    const pathname = usePathname();

    const tabs = [
        { label: 'Bond Repayment', href: '/calculator/bond-repayment' },
        { label: 'Affordability', href: '/calculator/affordability' },
        { label: 'Bond And Transfer', href: '/calculator/bond-and-transfer' },
    ]

    return (
        <div className="flex justify-center space-x-8 my-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                href={tab.href}
                key={tab.href}
                className={`
                  pb-2 border-b-2
                  ${
                    isActive
                      ? "border-[#D1DA68] text-gray-800"
                      : "border-transparent text-gray-800 hover:text-[#D1DA68]"
                  }
                  transition-colors
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
    );
}
