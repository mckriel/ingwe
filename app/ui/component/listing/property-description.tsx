import React from 'react';

interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
    // Ensure description is a string to avoid errors
    const safeDescription = description || "";
    
    // Format the description to display newlines properly
    const formattedDescription = safeDescription.trim() 
        ? safeDescription.split('\n').map((paragraph, index) => 
            paragraph.trim() ? <p key={index} className="text-gray-700 mb-2">{paragraph}</p> : <br key={index} />
          )
        : <p className="text-gray-700">No description available</p>;
    
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#4B4B4B] mb-3">Description</h2>
        <div className="text-gray-700">
          {formattedDescription}
        </div>
      </section>
    );
}
