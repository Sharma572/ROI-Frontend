import { useWallet } from "@/contexts/WalletContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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
       <PriceCard
  title="Starter Pack"
  price="₹499 / $7"
  credits={15}
 Effective_Cost_per_Credit={"₹33 / $0.46 per credit"}
 Best_For={["New users","Students & small consultants","Occasional ROI calculations"]}
/>

<PriceCard
  title="Pro Pack"
  price="₹1,499 / $18"
  credits={60}
  recommended={true}
  Effective_Cost_per_Credit={"₹25 / $0.30 per credit"}
  Best_For={["EV consultants","Small infra companies","EV charger installers"]}
/>

<PriceCard
  title="Business Pack"
  price="₹3,499 / $40"
  credits={150}
  Effective_Cost_per_Credit={"₹23 / $0.26 per credit"}
  Best_For={["CPOs","Developers & EPC firms"]}
/>

      </div>
    </div>
  );
}


function PriceCard({ title, price, credits,Effective_Cost_per_Credit, Best_For,recommended }) {
    const { user } = useAuth0();
     const { setWalletBalance } = useWallet();
  const handlePayment = async () => {
    try {
      const amount = parseInt(price.replace(/[^0-9]/g, "")) || 500;
      const credit = credits
      const orderResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/payment/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "INR",
            receipt: `ROI_${title}_${Date.now()}`,
          }),
        }
      );

      const orderData = await orderResponse.json();
      console.log("orderData 🔸",orderData);
      
      if (!orderData.success) {
        alert("❌ Failed to create Razorpay order!");
        return;
      }

      const { id: order_id, currency } = orderData.order;

      const options = {
        key: "rzp_test_RelPTZxFaBCsfD",
        amount: orderData.order.amount,
        currency,
        name: "EV Charging ROI Calculator",
        description: `${title} – ${credits} Credits`,
        order_id,
        handler: async function (response) {
          const verifyResponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/v1/payment/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                purchasedCredits: credits,
                plan: title,
                amount,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
         
             try {
                const userID = user?.sub
                const payload = {
                  user_id: userID,
                  amount: credit,
                };
            
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/user/add-credit`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                });
            
                if (!res.ok) throw new Error("Add Credit Failed");
            const data = await res.json();
                  console.log("data after adding credits ",data);
                  
                // ✅ update global balance
                 setWalletBalance(data.updatedCredit);

              } catch (error) {
                console.error(error);
                alert("Payment/Deduction failed. Try again!");
              }
            alert(`✅ Payment successful! ${credits} credits added to your account.`);
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        theme: { color: "#1AC47D" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
 <div
  className={`
    relative rounded-3xl p-8 transition-all duration-500 
    bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]
    hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1
    border border-gray-100
    ${recommended ? "ring-2 ring-[#1AC47D]" : ""}
  `}
>
  {/* Recommended Badge */}
  {recommended && (
    <div className="absolute -top-4 right-6 bg-[#1AC47D] text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
      Most Popular
    </div>
  )}

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-900">{title}</h3>

  {/* Price */}
  <div className="mt-4 mb-1">
    <span className="text-4xl font-extrabold text-[#10B26C]">
      {price}
    </span>
  </div>

  {/* Credits Badge */}
  <p className="inline-block mt-2 text-xs font-bold bg-[#DFF7EB] 
    text-[#0E9E5A] px-3 py-1 rounded-full shadow-sm">
    {credits} Credits Included
  </p>

  {/* Effective Cost */}
<p className="inline-block text-[10px] mt-2 bg-[#E6F9EF] 
   text-[#777777] font-semibold px-2 py-1 rounded-full">
  {Effective_Cost_per_Credit}
</p>



  {/* Divider */}
  <div className="my-5 border-t border-gray-200"></div>

  {/* Best For */}
  <div>
    <p className="text-sm font-semibold text-gray-900 mb-2">Best For:</p>
    <ul className="space-y-2 text-gray-700 text-sm">
      {Best_For.map((item, idx) => (
        <li key={idx} className="flex items-center font-outfit font-semibold text-sm gap-2">
          <span className="w-2 h-2 bg-[#1AC47D] rounded-full"></span>
          {item}
        </li>
      ))}
    </ul>
  </div>

  {/* Buy Button */}
  <button
    onClick={handlePayment}
    className="
      w-full mt-6 py-3 rounded-2xl font-semibold text-white 
      bg-gradient-to-r from-[#1AC47D] to-[#13A86B]
      hover:shadow-lg hover:scale-[1.02] transition-all duration-300
    "
  >
    Buy Credits
  </button>
</div>


  );
}
