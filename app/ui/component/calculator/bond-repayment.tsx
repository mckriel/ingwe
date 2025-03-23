"use client";

import { useState } from "react";

export default function BondRepayment() {
  // State for form inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1000000); // e.g. default 1,000,000
  const [deposit, setDeposit] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(11.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);

  // We’ll do a mock calculation for demonstration
  // In real life, you’d apply an amortization formula or use an API
  const monthlyRepayment = Math.round(10664);
  const totalCosts = 69913;

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column (inputs) */}
        <div className="bg-[#D1DA68] p-6 rounded-lg flex flex-col space-y-4">
          <h2 className="text-xl font-semibold mb-2">Purchase Price</h2>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="p-2 rounded bg-white text-black focus:outline-none"
          />

          <h2 className="text-xl font-semibold mb-2">Deposit (optional)</h2>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="p-2 rounded bg-white text-black focus:outline-none"
          />

          <h2 className="text-xl font-semibold mb-2">Interest Rate</h2>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="p-2 rounded bg-white text-black focus:outline-none"
          />

          <h2 className="text-xl font-semibold mb-2">Loan Term (years)</h2>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="p-2 rounded bg-white text-black focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
        </div>

        {/* Right Column (results) */}
        <div className="bg-gray-900 text-white p-6 rounded-lg flex flex-col space-y-6">
          {/* Monthly Bond Repayment */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Monthly Bond Repayment</h2>
            <span className="text-xl font-bold">R {monthlyRepayment.toLocaleString()}</span>
          </div>

          {/* Once-off Costs */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Once-off Costs</h2>
              <span className="text-xl font-bold">R {totalCosts.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Deposit: R {deposit.toLocaleString()} <br />
              Bond Registration: R 37,555 <br />
              Property Transfer: R 45,454 <br />
              <a href="#" className="text-green-300 underline">
                View bond and transfer cost breakdown
              </a>
            </p>
          </div>

          {/* Gross Monthly Income Required */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gross Monthly Income Required</h2>
              <span className="text-xl font-bold">R {totalCosts.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              <a href="#" className="text-green-300 underline">
                What do I qualify for based on my income?
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
