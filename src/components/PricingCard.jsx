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
          Unlock the Full Power of AI
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
          PayPal
        </label>
      </div>
</div>
 

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto mt-6 grid md:grid-cols-3 gap-8">
       <PriceCard
  title="Starter Pack"
  price="₹299"
  credits={20}
 
/>

<PriceCard
  title="Pro Pack"
  price="₹799"
  credits={70}
  recommended={true}

/>

<PriceCard
  title="Business Pack"
  price="₹1999"
  credits={200}
 
/>

      </div>
    </div>
  );
}

// function PriceCard({ title, price, subText, perDetails, recommended }) {
//   return (
//     <div
//       className={`relative rounded-2xl p-8 border transition-all duration-500 ${
//         recommended
//           ? "border-emerald-500 shadow-xl shadow-emerald-100 hover:shadow-emerald-200 scale-[1.02]"
//           : "border-gray-200 hover:border-emerald-400 hover:shadow-md"
//       }`}
//       style={{
//         backgroundColor: "#1AC47D1A", // ✅ Light emerald translucent background
//       }}
//     >
//       {recommended && (
//         <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
//           Most Recommended
//         </div>
//       )}

//       <div className="text-left">
//         <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>

//         <div style={{color:'#1ac47d'}} className="text-5xl font-bold  mt-4">{price}</div>
//         <p className="text-sm mt-2 text-gray-500">{subText}</p>

//         <p className="text-xs mt-6 text-emerald-700/70">{perDetails}</p>

//         <button
//          style={{background:"#1ac47d"}} className="w-full mt-8 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
//         >
//           Subscribe
//         </button>
//       </div>
//     </div>
//   );
// }

// function PriceCard({ title, price, subText, perDetails, recommended }) {
//   const handlePayment = async () => {
//     try {
//       // Convert price to numeric amount (e.g. "$14.99" → 14.99)
//       const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
//       const amountInRupees = Math.round(numericPrice * 83); // Rough USD→INR (optional)
//       const amount = amountInRupees || 500; // fallback for demo

//       // 1️⃣ Create order on your backend
//       const orderResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: amount, // ₹
//           currency: "INR",
//           receipt: `${title}_plan_${Date.now()}`,
//         }),
//       });

//       const orderData = await orderResponse.json();
//       if (!orderData.success) {
//         alert("❌ Failed to create Razorpay order!");
//         return;
//       }
//      console.log("Order Response 💳",orderResponse);
     
//       const { id: order_id, currency } = orderData.order;

//       // 2️⃣ Configure Razorpay Checkout
//       const options = {
//         key: "rzp_test_RelPTZxFaBCsfD", // your Razorpay test key
//         amount: orderData.order.amount,
//         currency: currency,
//         name: "EV Charging ROI Calculator",
//         description: `${title} Subscription`,
//         order_id: order_id,
//         handler: async function (response) {
//           // 3️⃣ Verify payment signature
//           const verifyResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/verify`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           });

//           const verifyData = await verifyResponse.json();
//           if (verifyData.success) {
//             alert(`✅ Payment verified for ${title} plan!`);
//           } else {
//             alert("❌ Payment verification failed!");
//           }
//         },
//         prefill: {
//           name: "Raunak Sharma",
//           email: "test@example.com",
//           contact: "9999999999",
//         },
//         notes: {
//           plan: title,
//         },
//         theme: {
//           color: "#1ac47d",
//         },
//       };

//       // 4️⃣ Open Razorpay popup
//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div
//       className={`relative rounded-2xl p-8 border transition-all duration-500 ${
//         recommended
//           ? "border-emerald-500 shadow-xl shadow-emerald-100 hover:shadow-emerald-200 scale-[1.02]"
//           : "border-gray-200 hover:border-emerald-400 hover:shadow-md"
//       }`}
//       style={{
//         backgroundColor: "#1AC47D1A",
//       }}
//     >
//       {recommended && (
//         <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
//           Most Recommended
//         </div>
//       )}

//       <div className="text-left">
//         <h3 className="text-3xl font-outfit font-extrabold text-gray-800">{title}</h3>

//         <div style={{ color: "#1ac47d" }} className="text-2xl font-outfit font-bold mt-4">
//           {price}
//         </div>
//         <p className="text-sm mt-2 text-gray-500">{subText}</p>
//         <p className="text-xs mt-6 text-emerald-700/70">{perDetails}</p>

//         <button
//           onClick={handlePayment}
//           style={{ background: "#1ac47d" }}
//           className="w-full mt-8 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
//         >
//           Subscribe
//         </button>
//       </div>
//     </div>
//   );
// }


function PriceCard({ title, price, credits, recommended }) {
  const handlePayment = async () => {
    try {
      const amount = parseInt(price.replace(/[^0-9]/g, "")) || 500;

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
        bg-white/70 backdrop-blur-xl border border-gray-200
        hover:shadow-xl hover:shadow-emerald-300/40 hover:-translate-y-1 
        ${recommended ? "ring-2 ring-[#1AC47D]" : ""}
      `}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute -top-4 right-6 bg-[#1AC47D] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h3>

      {/* Price */}
      <div className="mt-5">
        <span className="text-4xl font-extrabold bg-gradient-to-r from-[#1AC47D] to-green-600 bg-clip-text text-transparent">
          {price}
        </span>
      </div>

      {/* Credits */}
      <p className="text-sm mt-3 text-gray-700 font-medium">
        {credits} Credits Included
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

    

      {/* Purchase Button */}
      <button
        onClick={handlePayment}
        style={{ background: "#1ac47d" }}
        className="w-full mt-2 text-white font-semibold py-3 rounded-xl 
                   transition-all duration-300 hover:shadow-lg hover:bg-[#18b06f]"
      >
        Buy Credits
      </button>
    </div>
  );
}
