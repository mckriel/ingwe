// app/ui/components/listing/PropertyHeader.tsx
import React from "react";

interface PropertyHeaderProps {
  title: string;
  location: string;
}

export default function PropertyHeader({ title, location }: PropertyHeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg text-gray-600">{location}</p>
    </header>
  );
}
