import { useCurrency } from "@/contexts/CurrencyContext";
import { useUser } from "@/contexts/userContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, BadgeCent, ShieldCheck } from "lucide-react";
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
      <div className="max-w-7xl mx-auto mt-16 mb-8 grid md:grid-cols-4 gap-2">



<PriceCard
  title="Basic Pack"
  basePriceINR={0}
  credits={10}
  Best_For={["Trail"]}
/>
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
    const { setUserState } = useUser();
  const { setWalletBalance } = useWallet();
   const navigate = useNavigate();
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

const TYPICAL_USAGE = {
  "Basic Pack": "10 quick ROI calculations only",
  "Starter Pack": "10 quick ROI calculations + 1–2 downloadable PDF reports",
  "Pro Pack": "~20 full ROI reports OR ~50 quick ROI calculations",
  "Business Pack": "100+ ROI calculations per month for teams & enterprises",
};


const handlePayment = async ({ title, credits, priceINR }) => {
  try {
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
          user_id: user.sub,
        }),
      }
    );

    const order = await orderResponse.json();
    console.log("Oder Response",order);
    
    const options = {
      key: "rzp_test_RelPTZxFaBCsfD",
      amount: priceINR * 100,
      currency: "INR",
      order_id: order.order.id,
      name: "EV Charging ROI Calculator",
      description: `${title}  ${credits} Credits`,

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
          // ✅ Update wallet
          // setWalletBalance(data.updatedCredit);

          // ✅ Unlock ROI session
          const savedSession = localStorage.getItem("roi_session");
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            localStorage.setItem(
              "roi_session",
              JSON.stringify({
                ...parsed,
                unlocked: true,
              })
            );
          }

          // ✅ Redirect AFTER payment success
          // Waller balance Updated and ROI Unlocked Plan Updated....
        console.log("Order API Response",order);
        console.log("Order API Response Send",data?.updatedCredit);
        
          setUserState({
        loading: false,
        profile: {
          subscriptionPlan: order?.order?.notes?.plan,
          isSubscribed: true,
          credit: data?.updatedCredit,
        },
      });
      navigate("/", { replace: true });
        } else {
          alert("Payment verification failed");
        }
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
    console.error(error);
  }
};

  return (
   <div className="rounded-2xl p-5 bg-white shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col">
      {/* Title */}
      <h3 className="text-xl font-bold">{title}</h3>

      {/* Converted Price */}
     <div className="mt-3 text-3xl font-extrabold text-green-600">
        {symbol} {displayPrice}
      </div>

<div className="flex items-center ">
    {/* Credits */}
      <p className="inline-block mt-3 text-xs font-semibold bg-green-100 px-3 py-1 rounded-full text-green-700">
        {credits} Credits
      </p>

      {/* Effective Cost Per Credit */}
      <p className="text-xs mt-3 ml-3 text-gray-600">
  Effective: {symbol}{effectivePerCredit} per credit
</p>

</div>

{/* Premium Divider */}<div className="mt-4 h-px w-full bg-green-200" />
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

       className="w-full flex justify-center items-center mt-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-md"
      >
       <span>
          <BadgeCent
                      size={26}
                      className="mr-2 text-white"
                    />
        </span> 
        <span className="text-lg font-mono">
          Buy Credits
          </span>
      </button>


      {/* Best For */}
      <ul className="mt-4 space-y-1">
        {Best_For.map((item, i) => (
          <li key={i} className="text-sm flex gap-2 items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            {item}
          </li>
        ))}
      </ul>
{/* Typical Usage */}

<div className="mt-3 flex items-start gap-2 text-sm text-gray-700 max-w-[90%]">
  <span className="text-green-600">📊</span>
  <p>
    <span className="font-semibold text-gray-900">Typical usage:</span>{" "}
    {TYPICAL_USAGE[title]}
  </p>
</div>

{
  title != "Basic Pack" ? (<div className="mt-4 rounded-lg bg-green-50 px-3 py-2 max-w-[95%]">
  <div className="flex items-start gap-3">
    <span className="text-green-600 text-lg">⚡</span>
   <p className="text-xs font-semibold text-green-900 leading-snug">
      Unlimited full access to{" "}
      <span className="font-bold">5-Year Profit Projections</span> and{" "}
      <span className="font-bold">Key Insights & Recommendations</span>
    </p>
  </div>
</div>) : ("")
}



     
    </div>
  );
}
