import BondRepaymentPage from "@/app/ui/component/calculator/bond-repayment";
import CalculatorTabs from "@/app/ui/component/calculator/calculator-tab";

export default function CalculatorLayout() {
  return (
    <main>
      <CalculatorTabs />
      <BondRepaymentPage />
    </main>
  );
}
