import Link from 'next/link';

interface NavItemProps {
    label: string;
    href: string;
    isActive: boolean;
    onClick?: () => void;
}

export default function NavItem({ label, href, isActive }: NavItemProps) {
    return (
        <li className='px-2 list-none'>
            <Link
                href={href}
                className={`relative pb-1 text-gray-600 hover:text-black transition-all ${
                    isActive ? "font-bold text-black" : ""
                }`}
            >
                {label}
                {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#D1DA68]"></span>
                )}
            </Link>
        </li>
    );
}