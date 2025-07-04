"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "@/app/ui/component/header/top-navigation-bar/nav-item";
import Image from "next/image";
import Link from "next/link";

interface NavigationBarProps {
    property?: {
        price?: string | number;
    };
}

export default function NavigationBar({ property }: NavigationBarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Determine if property is for sale or rent based on price
    const is_rental = property?.price && 
        (typeof property.price === 'string' && 
         (property.price.toLowerCase().includes('rental') || 
          property.price.toLowerCase().includes('rent') ||
          property.price.toLowerCase().includes('p/m') ||
          property.price.toLowerCase().includes('per month')));
    
    const is_sale = property && !is_rental || false;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="flex items-center justify-between w-full p-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="ingwe logo"
          width={200}
          height={50}
          priority
          onError={(e) => {
            // Fallback for logo
            const imgElement = e.target as HTMLImageElement;
            // Keep current dimensions but show alternative text
            console.error("Logo image failed to load");
          }}
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
        <NavItem label="Buy" href="/buy" isActive={pathname === "/buy" || !!is_sale} />
        <NavItem label="Rent" href="/rent" isActive={pathname === "/rent" || !!is_rental} />
        <NavItem label="Selling" href="/sell" isActive={pathname === "/sell"} />
        <NavItem label="Calculators" href="/calculator" isActive={pathname.startsWith("/calculator")} />
        <NavItem label="Company" href="/about" isActive={pathname.startsWith("/about")} />
        <NavItem label="Agents" href="/agents" isActive={pathname.startsWith("/agents")} />
        <NavItem label="Articles" href="/articles" isActive={pathname.startsWith("/articles")} />
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="relative w-8 h-6 flex flex-col justify-between items-center md:hidden focus:outline-none"
        onClick={toggleMenu}
      >
        {/* Top bar */}
        <span
          className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${
            isMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        {/* Middle bar */}
        <span
          className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        />
        {/* Bottom bar */}
        <span
          className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${
            isMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Overlay (with fade-in/out) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          className="text-2xl m-4 focus:outline-none"
          onClick={closeMenu}
        >
          ✕
        </button>

        <div className="flex flex-col space-y-4 mt-8 px-6">
          <NavItem
            label="Buy"
            href="/buy"
            isActive={pathname === "/buy" || !!is_sale}
            onClick={closeMenu}
          />
          <NavItem
            label="Rent"
            href="/rent"
            isActive={pathname === "/rent" || !!is_rental}
            onClick={closeMenu}
          />
          <NavItem
            label="Selling"
            href="/sell"
            isActive={pathname === "/sell"}
            onClick={closeMenu}
          />
          <NavItem
            label="Calculators"
            href="/calculator"
            isActive={pathname.startsWith("/calculator")}
            onClick={closeMenu}
          />
          <NavItem
            label="Company"
            href="/about"
            isActive={pathname.startsWith("/about")}
            onClick={closeMenu}
          />
          <NavItem
            label="Agents"
            href="/agents"
            isActive={pathname.startsWith("/agents")}
            onClick={closeMenu}
          />
          <NavItem
            label="Articles"
            href="/articles"
            isActive={pathname.startsWith("/articles")}
            onClick={closeMenu}
          />
        </div>
      </div>
    </nav>
    );
}