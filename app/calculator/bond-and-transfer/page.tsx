'use client';

import CalculatorTabs from "@/app/ui/component/calculator/calculator-tab";
import { useState, useEffect } from 'react';

export default function Page() {
  const [purchase_price, set_purchase_price] = useState(1000000);
  const [loan_amount, set_loan_amount] = useState(1000000);

  // Set page title
  useEffect(() => {
    document.title = 'Bond & Transfer Calculator | Ingwe | The Property Company';
  }, []);

  const [bond_registration_costs, set_bond_registration_costs] = useState(0);
  const [bank_initiation_fee, set_bank_initiation_fee] = useState(0);
  const [bond_deeds_office_levy, set_bond_deeds_office_levy] = useState(0);
  const [bond_postage_fees, set_bond_postage_fees] = useState(0);
  const [total_bond_costs, set_total_bond_costs] = useState(0);

  const [property_transfer_costs, set_property_transfer_costs] = useState(0);
  const [transfer_duty, set_transfer_duty] = useState(0);
  const [transfer_deeds_office_levy, set_transfer_deeds_office_levy] = useState(0);
  const [transfer_postage_fees, set_transfer_postage_fees] = useState(0);
  const [total_transfer_costs, set_total_transfer_costs] = useState(0);

  const [total_bond_and_transfer, set_total_bond_and_transfer] = useState(0);

  // Calculate costs when inputs change
  useEffect(() => {
    const calculate_costs = () => {
      // Bond registration costs calculation (approximate South African rates)
      const bond_reg_cost = loan_amount * 0.01 + 2000; // 1% + base fee
      const bank_init_fee = Math.max(5000, loan_amount * 0.005); // 0.5% with minimum
      const bond_deeds_levy = loan_amount * 0.001; // 0.1%
      const bond_postage = 344;

      set_bond_registration_costs(bond_reg_cost);
      set_bank_initiation_fee(bank_init_fee);
      set_bond_deeds_office_levy(bond_deeds_levy);
      set_bond_postage_fees(bond_postage);

      const bond_total = bond_reg_cost + bank_init_fee + bond_deeds_levy + bond_postage;
      set_total_bond_costs(bond_total);

      // Property transfer costs calculation
      const prop_transfer_cost = purchase_price * 0.01 + 2000; // 1% + base fee
      const duty = purchase_price > 1000000 ? (purchase_price - 1000000) * 0.08 : 0; // Transfer duty for amounts over R1m
      const transfer_deeds_levy = purchase_price * 0.001; // 0.1%
      const transfer_postage = 344;

      set_property_transfer_costs(prop_transfer_cost);
      set_transfer_duty(duty);
      set_transfer_deeds_office_levy(transfer_deeds_levy);
      set_transfer_postage_fees(transfer_postage);

      const transfer_total = prop_transfer_cost + duty + transfer_deeds_levy + transfer_postage;
      set_total_transfer_costs(transfer_total);

      // Total costs
      set_total_bond_and_transfer(bond_total + transfer_total);
    };

    calculate_costs();
  }, [purchase_price, loan_amount]);

  const format_currency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('ZAR', 'R');
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <CalculatorTabs />
        
        {/* Calculator Interface */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl">
            {/* Input Section - Green */}
            <div className="bg-[#B8C332] p-8 lg:p-12">
              <div className="space-y-8">
                {/* Purchase Price */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Purchase Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={purchase_price}
                      onChange={(e) => set_purchase_price(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                      placeholder="1 000 000"
                    />
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={loan_amount}
                      onChange={(e) => set_loan_amount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                      placeholder="1 000 000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section - Dark */}
            <div className="bg-gray-800 p-8 lg:p-12 text-white">
              {/* Bond registration cost breakdown */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Bond registration cost breakdown:</h3>
                  <div className="text-2xl font-bold text-[#B8C332]">
                    {format_currency(total_bond_costs)}
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#B8C332] mb-6"></div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Bond registration costs</span>
                    <span>{format_currency(bond_registration_costs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank initiation fee</span>
                    <span>{format_currency(bank_initiation_fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deeds office levy (Non VATable)</span>
                    <span>{format_currency(bond_deeds_office_levy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Postage, petties and other application fees</span>
                    <span>{format_currency(bond_postage_fees)}</span>
                  </div>
                </div>
              </div>

              {/* Property transfer cost breakdown */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Property transfer cost breakdown</h3>
                  <div className="text-2xl font-bold text-[#B8C332]">
                    {format_currency(total_transfer_costs)}
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#B8C332] mb-6"></div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Property transfer costs</span>
                    <span>{format_currency(property_transfer_costs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer duty</span>
                    <span>{format_currency(transfer_duty)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deeds office levy (Non VATable)</span>
                    <span>{format_currency(transfer_deeds_office_levy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Postage, petties and other application fees</span>
                    <span>{format_currency(transfer_postage_fees)}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-600 pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Total bond and Transfer costs:</h3>
                  <div className="text-2xl font-bold text-[#B8C332] border-2 border-[#B8C332] rounded-xl px-4 py-2">
                    {format_currency(total_bond_and_transfer)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
