import Link from "next/link";

export default function FooterNavigation() {
    return (
      <div>
        <ul className="space-y-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/buy" className="hover:underline">Buy</Link></li>
          <li><Link href="/rent" className="hover:underline">Rent</Link></li>
          <li><Link href="/sell" className="hover:underline">Sell</Link></li>
        </ul>
      </div>
    );
  }
