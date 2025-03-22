import React from 'react';

interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
    return (
      <section className="mb-4">
        <h3 className="font-semibold mb-2">Features</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </section>
    );
}
