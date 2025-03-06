import Link from 'next/link';

interface NavItemProps {
    label: string;
    href: string;
}

export default function NavItem({ label, href }: NavItemProps) {
    return (
        <li>
            <Link href={href} className="px-4 py-2 hover:text-blue-500 bg-red-500">
                {label}
            </Link>
        </li>
    );
}