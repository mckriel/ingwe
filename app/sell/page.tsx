'use client';

import { useState } from 'react';
import SellerModal from '@/app/ui/component/seller-modal';
import AgentContactModal from '@/app/ui/component/agent-contact-modal';

export default function Page() {
    const [is_seller_modal_open, set_is_seller_modal_open] = useState(false);
    const [is_agent_modal_open, set_is_agent_modal_open] = useState(false);

    const open_seller_modal = () => set_is_seller_modal_open(true);
    const close_seller_modal = () => set_is_seller_modal_open(false);
    
    const open_agent_modal = () => set_is_agent_modal_open(true);
    const close_agent_modal = () => set_is_agent_modal_open(false);

    return (
        <main className="min-h-screen flex flex-col items-center pt-8 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Property for Sale</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-screen-lg w-full">
                <p className="text-lg mb-4">
                    Ready to sell your property? Our expert agents can help you get the best price.
                </p>
                <p className="text-lg mb-4">
                    Contact us today to list your property with Ingwe.
                </p>
                <div className="mt-8 space-x-4">
                    <button 
                        onClick={open_seller_modal}
                        className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Register as Seller
                    </button>
                    <button 
                        onClick={open_agent_modal}
                        className="bg-[#D1DA68] hover:bg-[#D1DA68]/80 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Contact an Agent
                    </button>
                </div>
            </div>

            <SellerModal is_open={is_seller_modal_open} on_close={close_seller_modal} />
            <AgentContactModal is_open={is_agent_modal_open} on_close={close_agent_modal} agent_name="Noeleen Smith" />
        </main>
    );
}
