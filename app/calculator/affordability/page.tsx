'use client';

import CalculatorTabs from "@/app/ui/component/calculator/calculator-tab";
import { useState, useEffect } from 'react';

export default function Page() {
  const [gross_monthly_income, set_gross_monthly_income] = useState(1000000);
  const [net_monthly_income, set_net_monthly_income] = useState(0);
  const [monthly_expenses, set_monthly_expenses] = useState(0);
  const [interest_rate, set_interest_rate] = useState(11.65);
  const [loan_term, set_loan_term] = useState(20);

  const [qualification_amount, set_qualification_amount] = useState(0);
  const [monthly_bond_repayment, set_monthly_bond_repayment] = useState(0);

  // Calculate affordability when inputs change
  useEffect(() => {
    const calculate_affordability = () => {
      // Basic affordability calculation
      const disposable_income = net_monthly_income - monthly_expenses;
      const max_monthly_payment = Math.min(disposable_income, gross_monthly_income * 0.3);
      
      // Bond calculation using compound interest formula
      const monthly_rate = interest_rate / 100 / 12;
      const num_payments = loan_term * 12;
      
      if (monthly_rate > 0) {
        const max_loan_amount = max_monthly_payment * ((1 - Math.pow(1 + monthly_rate, -num_payments)) / monthly_rate);
        set_qualification_amount(Math.max(0, max_loan_amount));
        set_monthly_bond_repayment(max_monthly_payment);
      } else {
        set_qualification_amount(max_monthly_payment * num_payments);
        set_monthly_bond_repayment(max_monthly_payment);
      }
    };

    calculate_affordability();
  }, [gross_monthly_income, net_monthly_income, monthly_expenses, interest_rate, loan_term]);

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
                {/* Gross Monthly Income */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Gross Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={gross_monthly_income}
                      onChange={(e) => set_gross_monthly_income(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                      placeholder="1 000 000"
                    />
                  </div>
                </div>

                {/* Net Monthly Income */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Net Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={net_monthly_income}
                      onChange={(e) => set_net_monthly_income(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Monthly Expenses */}
                <div>
                  <label className="block text-gray-800 font-medium mb-3">
                    Monthly Expenses
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      R
                    </span>
                    <input
                      type="number"
                      value={monthly_expenses}
                      onChange={(e) => set_monthly_expenses(Number(e.target.value))}
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
              {/* Results */}
              <div className="space-y-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Amount you qualify for</h3>
                  <div className="text-3xl font-bold text-[#B8C332]">
                    {format_currency(qualification_amount)}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Monthly Bond Repayment</h3>
                  <div className="text-3xl font-bold text-[#B8C332]">
                    {format_currency(monthly_bond_repayment)}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="border-t border-gray-600 pt-8">
                <h4 className="text-[#B8C332] font-medium mb-4">
                  How are loan terms calculated?
                </h4>
                
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <p>
                    When it comes to applying for a home loan, South African banks will, typically, allow you 
                    to qualify for a home loan repayment of up to 30% of your joint, gross, monthly income 
                    i.e. your total joint income before tax and expenses have been deducted. This rule 
                    ensures that banks adhere to responsible credit lending as mandated by the National 
                    Credit Act of South Africa.
                  </p>
                  
                  <p>
                    The next item that banks will look at is your net monthly income minus your total 
                    monthly expenses. The banks want to be sure that your disposable income will cover the 
                    monthly repayments of the home loan.
                  </p>
                  
                  <p>
                    Make use of our affordability calculator above to find out what your estimated home 
                    loan amount will be. We have set the default interest rate to the current prime lending 
                    rate. Based on your credit profile, South African banks may choose to give you an 
                    interest rate either higher or lower than the prime lending rate. A small change in your 
                    interest rate can have a significant impact on your final home loan amount. It is very 
                    important to keep this in mind when estimating the amount for which you qualify.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
