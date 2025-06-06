'use client';

import { useState } from 'react';

interface SellerModalProps {
  is_open: boolean;
  on_close: () => void;
}

export default function SellerModal({ is_open, on_close }: SellerModalProps) {
  const [form_data, set_form_data] = useState({
    user_type: '',
    branch: '',
    name: '',
    number: '',
    email: '',
    search_location: '',
    asking_price: '',
    listing_type: '',
    description: ''
  });

  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    set_form_data(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form_data);
    // Handle form submission here
    on_close();
  };

  if (!is_open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={on_close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Form */}
        <form onSubmit={handle_submit} className="space-y-6">
          {/* Title */}
          <h2 className="text-3xl font-normal text-[#B8C332] mb-8">
            Seller / Landlord Registration
          </h2>

          {/* Top row dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* I am a dropdown */}
            <div className="relative">
              <select
                name="user_type"
                value={form_data.user_type}
                onChange={handle_input_change}
                className="w-full px-4 py-4 bg-gray-100 rounded-2xl border-0 text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#B8C332]"
              >
                <option value="">I am a ...</option>
                <option value="seller">Seller</option>
                <option value="landlord">Landlord</option>
                <option value="agent">Agent</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Branch dropdown */}
            <div className="relative">
              <select
                name="branch"
                value={form_data.branch}
                onChange={handle_input_change}
                className="w-full px-4 py-4 bg-gray-100 rounded-2xl border-0 text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#B8C332]"
              >
                <option value="">Branch</option>
                <option value="cape-town">Cape Town</option>
                <option value="johannesburg">Johannesburg</option>
                <option value="durban">Durban</option>
                <option value="pretoria">Pretoria</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form_data.name}
                onChange={handle_input_change}
                className="px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              />
              <input
                type="tel"
                name="number"
                placeholder="Number"
                value={form_data.number}
                onChange={handle_input_change}
                className="px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form_data.email}
                onChange={handle_input_change}
                className="px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              />
            </div>
          </div>

          {/* Property Details Section */}
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Property Details</h3>
            <div className="space-y-4">
              {/* Search and Asking Price row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="search_location"
                    placeholder="Search"
                    value={form_data.search_location}
                    onChange={handle_input_change}
                    className="w-full px-4 py-4 pl-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  name="asking_price"
                  placeholder="Asking Price"
                  value={form_data.asking_price}
                  onChange={handle_input_change}
                  className="px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
                />
              </div>

              {/* Listing Type dropdown */}
              <div className="relative w-full md:w-1/2">
                <select
                  name="listing_type"
                  value={form_data.listing_type}
                  onChange={handle_input_change}
                  className="w-full px-4 py-4 bg-gray-100 rounded-2xl border-0 text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#B8C332]"
                >
                  <option value="">Listing Type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="auction">Auction</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Description textarea */}
              <textarea
                name="description"
                placeholder="Description"
                rows={4}
                value={form_data.description}
                onChange={handle_input_change}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-4 bg-[#B8C332] text-white rounded-2xl font-medium hover:bg-[#a6b02e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:ring-offset-2"
            >
              Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}