'use client';

import { useState } from 'react';

interface AgentContactModalProps {
  is_open: boolean;
  on_close: () => void;
  agent_name?: string;
}

export default function AgentContactModal({ is_open, on_close, agent_name = "Agent Name" }: AgentContactModalProps) {
  const [form_data, set_form_data] = useState({
    location: 'Cristiansen',
    email: '',
    phone: '',
    message: 'Hi Noeleen I would like to enquire about a Property.'
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
    console.log('Agent contact form submitted:', form_data);
    // Handle form submission here
    on_close();
  };

  if (!is_open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-auto relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={on_close}
          className="absolute top-4 right-4 w-12 h-12 bg-[#B8C332] rounded-full flex items-center justify-center text-white hover:bg-[#a6b02e] transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Form Content */}
        <div className="p-8 pt-12">
          <form onSubmit={handle_submit} className="space-y-6">
            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              {agent_name}
            </h2>

            {/* Location Dropdown */}
            <div className="relative">
              <select
                name="location"
                value={form_data.location}
                onChange={handle_input_change}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 text-gray-700 appearance-none pr-12 focus:outline-none focus:ring-2 focus:ring-[#B8C332] text-lg"
              >
                <option value="Cristiansen">Cristiansen</option>
                <option value="Cape Town">Cape Town</option>
                <option value="Johannesburg">Johannesburg</option>
                <option value="Durban">Durban</option>
                <option value="Pretoria">Pretoria</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Email Address */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form_data.email}
              onChange={handle_input_change}
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent text-gray-700 text-lg"
              required
            />

            {/* Phone Number */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form_data.phone}
              onChange={handle_input_change}
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent text-gray-700 text-lg"
              required
            />

            {/* Message */}
            <textarea
              name="message"
              placeholder="Hi Noeleen I would like to enquire about a Property."
              rows={6}
              value={form_data.message}
              onChange={handle_input_change}
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent text-gray-700 text-lg"
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg mt-8"
            >
              Sign Up Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}