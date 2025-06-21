import React from 'react';

interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
    return (
      <section className="mb-4">
        <h2 className="text-xl font-semibold text-[#4B4B4B] mb-3">Features</h2>
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-2 rounded text-base border-2"
              style={{ 
                backgroundColor: '#FFFFFF', 
                color: '#D1DA68',
                borderColor: '#D1DA68'
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </section>
    );
}
