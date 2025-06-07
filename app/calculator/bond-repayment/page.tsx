'use client';

import CalculatorTabs from "@/app/ui/component/calculator/calculator-tab";
import { useState, useEffect } from 'react';

export default function Page() {
  const [purchase_price, set_purchase_price] = useState(1000000);
  const [deposit, set_deposit] = useState(0);
  const [interest_rate, set_interest_rate] = useState(11.65);
  const [loan_term, set_loan_term] = useState(20);

  const [monthly_bond_repayment, set_monthly_bond_repayment] = useState(0);
  const [one_off_costs, set_one_off_costs] = useState(0);
  const [deposit_amount, set_deposit_amount] = useState(0);
  const [bond_registration, set_bond_registration] = useState(0);
  const [property_transfer, set_property_transfer] = useState(0);
  const [gross_monthly_income_required, set_gross_monthly_income_required] = useState(0);

  // Calculate repayment when inputs change
  useEffect(() => {
    const calculate_repayment = () => {
      const loan_amount = purchase_price - deposit;
      
      // Monthly bond repayment calculation
      const monthly_rate = interest_rate / 100 / 12;
      const num_payments = loan_term * 12;
      
      let monthly_payment = 0;
      if (monthly_rate > 0) {
        monthly_payment = loan_amount * (monthly_rate * Math.pow(1 + monthly_rate, num_payments)) / (Math.pow(1 + monthly_rate, num_payments) - 1);
      } else {
        monthly_payment = loan_amount / num_payments;
      }
      
      set_monthly_bond_repayment(monthly_payment);
      
      // One-off costs calculation
      const bond_reg_cost = loan_amount * 0.015 + 2000; // Approximate bond registration
      const prop_transfer_cost = purchase_price * 0.015 + 2000; // Approximate property transfer
      
      set_deposit_amount(deposit);
      set_bond_registration(bond_reg_cost);
      set_property_transfer(prop_transfer_cost);
      
      const total_one_off = deposit + bond_reg_cost + prop_transfer_cost;
      set_one_off_costs(total_one_off);
      
      // Gross monthly income required (using 30% rule)
      const required_income = monthly_payment / 0.3;
      set_gross_monthly_income_required(required_income);
    };

    calculate_repayment();
  }, [purchase_price, deposit, interest_rate, loan_term]);

  const format_currency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('ZAR', 'R');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <CalculatorTabs />
        
        {/* Calculator Interface */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl">
            {/* Input Section - Green */}
            <div className="bg-[#B8C332] p-8 lg:p-12">
              <div className="space-y-6">
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

                {/* Deposit */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Deposit (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => set_deposit(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Interest Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interest_rate}
                    onChange={(e) => set_interest_rate(Number(e.target.value))}
                    className="w-full px-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                    placeholder="11.65 %"
                  />
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Loan Term
                  </label>
                  <select
                    value={loan_term}
                    onChange={(e) => set_loan_term(Number(e.target.value))}
                    className="w-full px-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium appearance-none"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Section - Dark */}
            <div className="bg-gray-800 p-8 lg:p-12 text-white">
              {/* Monthly Bond Repayment */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-medium">Monthly Bond Repayment</h3>
                  <div className="text-3xl font-bold text-[#B8C332]">
                    {format_currency(monthly_bond_repayment)}
                  </div>
                </div>
                <div className="w-full h-px bg-[#B8C332] mb-6"></div>
              </div>

              {/* One-off Costs */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Once-off Costs</h3>
                  <div className="text-3xl font-bold text-[#B8C332]">
                    {format_currency(one_off_costs)}
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#B8C332] mb-6"></div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Deposit</span>
                    <span>{format_currency(deposit_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bond Registration</span>
                    <span>{format_currency(bond_registration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Transfer</span>
                    <span>{format_currency(property_transfer)}</span>
                  </div>
                  <div className="mt-4">
                    <button className="text-[#B8C332] hover:text-[#a6b02e] transition-colors text-sm">
                      View bond and transfer cost breakdown
                    </button>
                  </div>
                </div>
              </div>

              {/* Gross Monthly Income Required */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-medium">Gross Monthly Income Required</h3>
                  <div className="text-3xl font-bold text-[#B8C332]">
                    {format_currency(gross_monthly_income_required)}
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#B8C332] mb-6"></div>
                
                <div className="mt-4">
                  <button className="text-[#B8C332] hover:text-[#a6b02e] transition-colors text-sm">
                    What do I qualify for based on my income?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
