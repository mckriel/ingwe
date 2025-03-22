import React from 'react';

interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
    return (
      <section className="mb-4">
        <p className="text-gray-700">{description}</p>
      </section>
    );
}
