import { useCurrency } from "@/contexts/CurrencyContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function PricingPlans() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 font-['Lexend_Deca'] py-4 px-4">
      {/* Back Button */}
      <span className="flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-10 h-10 rounded-full 
          bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white 
          shadow-sm hover:shadow-emerald-200 transition-all duration-300"
        >
          <ArrowLeft
            size={20}
            className="transition-transform duration-200 hover:-translate-x-1"
          />
        </button>
        <span className="ml-2 font-semibold text-gray-700">Back</span>
      </span>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-outfit text-4xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
          Unlock the Full Power of EV ROI Calculations
        </h2>
      
      </div>
<div className="flex justify-center items-center">
 <p className="text-gray-600 font-outfit text-sm font-semibold mr-4">
          Select a membership to subscribe to, or{" "}
          <span className="relative group text-emerald-600 cursor-pointer font-medium underline">
            Buy Credits
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs font-medium rounded-lg px-3 py-1 whitespace-nowrap shadow-lg transition-all duration-200">
              Free members cannot purchase credits directly. Please upgrade first.
            </span>
          </span>
        </p>
      {/* Payment Method */}
      <div className="flex justify-center font-mono items-center mt-2 gap-4 text-sm text-gray-600">
        <span>Payment method:</span>
        <label className="flex items-center gap-2">
          <ShieldCheck />
          {/* <input type="radio" defaultChecked className="accent-emerald-600" /> */}
          Credit / Debit Card
        </label>
        <label className="flex items-center gap-2">
          <ShieldCheck />
          {/* <input type="radio" className="accent-emerald-600" /> */}
          Net Banking
        </label>
      </div>
</div>
 

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto mt-16 mb-8 grid md:grid-cols-3 gap-8">
       {/* <PriceCard
  title="Starter Pack"
  price={499}
  credits={15}
 Effective_Cost_per_Credit={"₹33 / $0.46 per credit"}
 Best_For={["New users","Students & small consultants","Occasional ROI calculations"]}
/>

<PriceCard
  title="Pro Pack"
 price={1499}
  credits={60}
  recommended={true}
  Effective_Cost_per_Credit={"₹25 / $0.30 per credit"}
  Best_For={["EV consultants","Small infra companies","EV charger installers"]}
/>

<PriceCard
  title="Business Pack"
  price={3499}
  credits={150}
  Effective_Cost_per_Credit={"₹23 / $0.26 per credit"}
  Best_For={["CPOs","Developers & EPC firms"]}
/> */}
<PriceCard
  title="Starter Pack"
  basePriceINR={499}
  credits={15}
  Best_For={["New users", "Students & small consultants", "Occasional ROI calculations"]}
/>

<PriceCard
  title="Pro Pack"
  basePriceINR={1499}
  credits={60}
  recommended={true}
  Best_For={["EV consultants", "Small infra companies", "EV charger installers"]}
/>

<PriceCard
  title="Business Pack"
  basePriceINR={3499}
  credits={150}
  Best_For={["CPOs", "Developers & EPC firms"]}
/>

      </div>
    </div>
  );
}

function PriceCard({ title, basePriceINR, credits, Best_For, recommended }) {
  const { currency, getCurrencySymbol, formatCurrency,convertAmount } = useCurrency();
  const { user } = useAuth0();
  const { setWalletBalance } = useWallet();
  // Effective Price Per Credit (recomputed when currency or rates change)
const effectivePerCredit = useMemo(() => {
  if (!basePriceINR || !credits) return 0;

  // First convert the full price to selected currency
  const convertedPrice = convertAmount(basePriceINR, "INR", currency);

  // Then divide by credits
  const result = convertedPrice / credits;

  return Number(result).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}, [basePriceINR, credits, currency]);

  // UI currency symbol
  const symbol = getCurrencySymbol(currency);

  // Convert INR → selected currency (USD/EUR/GBP/INR)
  const displayPrice = formatCurrency(basePriceINR, currency);

  // Razorpay always uses INR
  const razorpayAmountINR = basePriceINR;

  const handlePayment = async ({ title, credits, priceINR }) => {
    console.log("Clicked Data of card", { title, credits, priceINR });

    try {
      console.log("Charging INR amount:", razorpayAmountINR);

      const orderResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/payment/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
        amount: priceINR,
        plan: title,
        credits,
        currency: "INR",
        receipt: `ROI_${title}_${Date.now()}`,
        user_id: user.sub, // ✅ THIS FIXES EVERYTHING
      }),
        }
      );

      const order = await orderResponse.json();

      const options = {
        key: "rzp_test_RelPTZxFaBCsfD",
        amount: razorpayAmountINR * 100,
        currency: "INR",
        order_id: order.order.id,
        name: "EV Charging ROI Calculator",
        description: `${title} – ${credits} Credits`,
//         handler: async function (response) {
//   await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/verify`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(response),
//   });

//   alert("Payment Successful!");
//   // Update wallet balance in context
//   setWalletBalance((prev) => prev + credits);
// }

handler: async function (response) {
  const verifyRes = await fetch(
    `${process.env.REACT_APP_BASE_URL}/api/v1/payment/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    }
  );

  const data = await verifyRes.json();

  if (data.success) {
    setWalletBalance(data.updatedCredit); // ✅ CORRECT
    alert("Payment Successful!");
  } else {
    alert("Payment verification failed");
  }
}

      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-xl p-6 shadow bg-white hover:shadow-lg transition">
      {/* Title */}
      <h3 className="text-xl font-bold">{title}</h3>

      {/* Converted Price */}
      <div className="mt-4 text-4xl font-extrabold text-green-600">
        {symbol} {displayPrice}
      </div>

      {/* Credits */}
      <p className="mt-2 text-sm font-semibold bg-green-100 px-3 py-1 rounded text-green-700">
        {credits} Credits Included
      </p>

      {/* Effective Cost Per Credit */}
      <p className="text-xs mt-1 text-gray-600">
  Effective: {symbol}{effectivePerCredit} per credit
</p>


      {/* Best For */}
      <ul className="mt-4 space-y-1">
        {Best_For.map((item, i) => (
          <li key={i} className="text-sm flex gap-2 items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            {item}
          </li>
        ))}
      </ul>

      {/* Buy Button */}
      <button
        // onClick={(e)=>handlePayment(e)}
        onClick={() =>
  handlePayment({
    title,
    credits,
    priceINR: basePriceINR,
  })
}

        className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700"
      >
        Buy Credits
      </button>
    </div>
  );
}
