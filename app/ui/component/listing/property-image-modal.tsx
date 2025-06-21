'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface PropertyImageModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export default function PropertyImageModal({ 
  images, 
  isOpen, 
  onClose, 
  initialImageIndex = 0 
}: PropertyImageModalProps) {
  const [current_image_index, set_current_image_index] = useState(initialImageIndex);
  const [failed_modal_images, set_failed_modal_images] = useState<Set<string>>(new Set());

  // Filter images by removing the failed ones
  const valid_images = images?.filter(img => 
    img && 
    img.trim() !== "" && 
    !img.includes('/house1.jpeg') && 
    !img.includes('house1.jpeg') &&
    !failed_modal_images.has(img)
  ) || [];

  const handle_modal_image_error = useCallback((image_url: string) => {
    set_failed_modal_images(prev => {
      const new_failed = new Set(prev);
      new_failed.add(image_url);
      return new_failed;
    });
    
    // If the current image failed, move to the next available image
    const current_image_url = images[current_image_index];
    if (current_image_url === image_url && valid_images.length > 1) {
      const next_index = current_image_index < valid_images.length - 1 ? current_image_index : 0;
      set_current_image_index(next_index);
    }
  }, [current_image_index, images, valid_images.length]);

  useEffect(() => {
    set_current_image_index(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    const handle_keydown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        go_to_previous_image();
      } else if (event.key === 'ArrowRight') {
        go_to_next_image();
      }
    };

    document.addEventListener('keydown', handle_keydown);
    return () => document.removeEventListener('keydown', handle_keydown);
  }, [isOpen, current_image_index]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const go_to_previous_image = () => {
    set_current_image_index((prev) => 
      prev === 0 ? valid_images.length - 1 : prev - 1
    );
  };

  const go_to_next_image = () => {
    set_current_image_index((prev) => 
      prev === valid_images.length - 1 ? 0 : prev + 1
    );
  };

  const go_to_image = (index: number) => {
    set_current_image_index(index);
  };

  if (!isOpen || valid_images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay background */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full h-full max-w-6xl max-h-screen p-4 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#D1DA68] rounded-full flex items-center justify-center hover:bg-[#C5CE5F] transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main image container */}
        <div className="flex-1 relative">
          {/* Navigation arrows */}
          <button
            onClick={go_to_previous_image}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-16 h-16 bg-[#D1DA68] rounded-full flex items-center justify-center hover:bg-[#C5CE5F] transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={go_to_next_image}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-16 h-16 bg-[#D1DA68] rounded-full flex items-center justify-center hover:bg-[#C5CE5F] transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main image */}
          <div className="w-full h-full relative">
            <Image
              src={valid_images[current_image_index]}
              alt={`Property image ${current_image_index + 1}`}
              fill
              className="object-contain"
              onError={() => handle_modal_image_error(valid_images[current_image_index])}
            />
          </div>
        </div>

        {/* Thumbnail row */}
        <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
          {valid_images.map((src, idx) => (
            <div
              key={`modal-thumb-${src}-${idx}`}
              className={`relative w-20 h-12 flex-shrink-0 cursor-pointer border-2 rounded ${
                idx === current_image_index ? 'border-[#D1DA68]' : 'border-transparent'
              }`}
              onClick={() => go_to_image(idx)}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover rounded"
                onError={() => handle_modal_image_error(src)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}