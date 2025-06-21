import Image from 'next/image';
import React, { useState } from 'react';
import PropertyImageModal from './property-image-modal';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [is_modal_open, set_is_modal_open] = useState(false);
    const [modal_image_index, set_modal_image_index] = useState(0);
    
    const validImages = images.filter(img => img && img.trim() !== "" && !img.includes('/house1.jpeg'));
    
    const open_modal = (imageIndex: number) => {
        set_modal_image_index(imageIndex);
        set_is_modal_open(true);
    };

    const close_modal = () => {
        set_is_modal_open(false);
    };
    
    if (validImages.length === 0) {
        return null;
    }
    
    return (
      <section className="mb-8">
        <div className="rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div 
              className="relative w-full aspect-square cursor-pointer"
              onClick={() => open_modal(0)}
            >
              <Image
                src={validImages[0]}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:opacity-90 transition-opacity"
                onError={(e) => {
                  const parent = e.currentTarget.closest('section');
                  if (parent) {
                    parent.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {validImages.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative w-full aspect-square cursor-pointer"
                  onClick={() => open_modal(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`Image ${idx + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      const imgDiv = e.currentTarget.closest('div');
                      if (imgDiv) {
                        imgDiv.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Image Modal */}
        <PropertyImageModal
          images={validImages}
          isOpen={is_modal_open}
          onClose={close_modal}
          initialImageIndex={modal_image_index}
        />
      </section>
    );
}