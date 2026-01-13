import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCurrency } from "../contexts/CurrencyContext";
import {
  BadgeCent,
  BadgeIndianRupee,
  Coins,
  Gem,
  GemIcon,
  Globe,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import { useWallet } from "../contexts/WalletContext";
import { useUser } from "@/contexts/userContext";

const CurrencySelector = () => {
  const { currency, setCurrency, getAvailableCurrencies, getCurrencySymbol } =
    useCurrency();
  const navigate = useNavigate();
  const { walletBalance, setWalletBalance } = useWallet();
  const currencies = getAvailableCurrencies();
  const [hasRegistered, setHasRegistered] = useState(false);
  const { user, logout,loginWithRedirect, loginWithPopup, isAuthenticated } = useAuth0();
  console.log("Auth0 User Data in Currency Selector:", user);
  const [profilePic, setProfilePic] = useState("");
  const [userData,setUserData]=useState({});
  const [currentUser, setCurrentUser] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [extraFields, setExtraFields] = useState({
    mobile: "",
    companyName: "",
  });
  const menuRef = useRef(null);
console.log("User Register Details",user);

  const handleSubscribe = () => {
    navigate("/Pricing");
    setMenuOpen(false);
  };


const { setUserState } = useUser();
const { userState } = useUser();
console.log("userState",userState);

const credit = userState.profile?.credit;
const plan = userState.profile?.subscriptionPlan;
const isSubscribed = userState.profile?.isSubscribed;

useEffect(() => {
  const registerUser = async () => {
    if (isAuthenticated && user && !hasRegistered) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/getuser/${encodeURIComponent(
            user.sub
          )}`
        );

        if (res.ok) {
          const data = await res.json();

          // ✅ SAVE EVERYTHING IN ONE OBJECT
          setUserState({
            loading: false,
            profile: data.user,
          });

          setHasRegistered(true);

          if (!data.user.mobile || !data.user.companyName) {
            setShowProfileModal(true);
          }

          return;
        }

        // 🔹 Register new user (first-time)
        await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/register-user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.sub,
              email: user.email,
              email_verified: user.email_verified,
              name: user.name,
              profile_pic: user.picture,
            }),
          }
        );

         // 3️⃣ Fetch wallet credit for new user
         console.log("User Auth0 id",user?.sub);
         
      const creditRes = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/credit/${encodeURIComponent(
          user.sub
        )}`
      );

      const creditData = await creditRes.json();

      // 4️⃣ Save everything in ONE object
      setUserState({
        loading: false,
        profile: {
          user_id: user.sub,
          email: user.email,
          name: user.name,
          profile_pic: user.picture,
          credit: creditData.credit || 0,
          isSubscribed: false,
        },
      });

        setHasRegistered(true);
        setShowProfileModal(true);
      } catch (err) {
        console.error("Error registering user:", err);
      }
    }
  };

  registerUser();

}, [isAuthenticated, user, hasRegistered]);


  // useEffect(() => {
  //   console.log("Initial APi call check");
    
  //   const registerUser = async () => {
  //     if (isAuthenticated && user && !hasRegistered) {
  //       try {
           
  //         const checkResponse = await fetch(
  //           `${process.env.REACT_APP_BASE_URL}/api/v1/user/getuser/${encodeURIComponent(
  //             user.sub
  //           )}`
  //         );

  //         if (checkResponse.ok) {
  // //          const data = await checkResponse.json();

  // // console.log("check current user API JSON:", data);
  //           const existingUser = await checkResponse.json();
  //           setUserData(existingUser)
  //           setProfilePic(existingUser?.user?.profile_pic);
  //           setCurrentUser(existingUser?.user || {});
  //           setWalletBalance(existingUser?.user?.credit || 0);
  //           setHasRegistered(true);

  //           // 🔍 Show profile modal if mobile/companyName missing
  //           if (
  //             !existingUser?.user?.mobile ||
  //             !existingUser?.user?.companyName
  //           ) {
  //             setShowProfileModal(true);
  //           }
  //           return;
  //         }

  //         // 🔹 Register new user
  //         const payload = {
  //           user_id: user.sub,
  //           email: user.email,
  //           company_name:user?.company_name,
  //           mobile_number:user?.mobile_number,
  //           email_verified: user.email_verified,
  //           name: user.name || `${user.given_name} ${user.family_name}`,
  //           profile_pic: user.picture,
  //         };

  //         const response = await fetch(
  //           `${process.env.REACT_APP_BASE_URL}/api/v1/user/register-user`,
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify(payload),
  //           }
  //         );

  //         const result = await response.json();
  //         setHasRegistered(true);
  //         setShowProfileModal(true); // ask for extra details for new users
  //       } catch (error) {
  //         console.error("Error registering user:", error);
  //       }
  //     }
  //   };

  //   registerUser();
  // }, [isAuthenticated, user, hasRegistered, setWalletBalance]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Handle input change for profile modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExtraFields((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save profile data to backend
  const handleSaveProfile = async () => {
    if (!extraFields.mobile || !extraFields.companyName) {
      alert("Please fill in all fields");
      return;
    }

    try {
      
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/user/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.sub,
          mobile: extraFields.mobile,
          companyName: extraFields.companyName,
        }),
      });
      const data = await res.json();
      console.log("✅ Profile updated:", data);
      setShowProfileModal(false);
      setCurrentUser(data?.user || {});
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };
console.log("CURRENT USER DATA FETCH",userData);

  return (
    <div className="flex items-center gap-3 relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-slate-500" />
      </div>

      {/* Currency Selector */}
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Select currency">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getCurrencySymbol()}</span>
              <span>{currency}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-6">{curr.symbol}</span>
                  <span className="font-medium">{curr.code}</span>
                  <span className="text-slate-500 text-sm">{curr.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Authenticated User Section */}
      {isAuthenticated && user ? (
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="bg-yellow-100 font-bold text-yellow-800 text-sm inline-flex items-center px-1.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
              <BadgeCent
                      size={16}
                      className="mr-2 text-yellow-800"
                    />
              {credit}
            </span>
           
         {user?.picture ? (
  <img
    src={user.picture}
    alt={user.name || "User"}
    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
    referrerPolicy="no-referrer"
  />
) : (
  <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
    {user.name?.charAt(0)?.toUpperCase() || "U"}
  </span>
)}


          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <div className="py-2">
                <div className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <span className="flex items-center">Credit</span>
                  <span className="flex items-center justify-center font-semibold text-green-700">
                    <BadgeCent
                      size={16}
                      className="mr-2 text-green-600"
                    />
                    {credit}
                  </span>
                </div>

                {/* 🔥 Upgrade Button */}
                <div className="flex text-gray-700 items-center justify-around">
                  <span className="flex items-center uppercase">{plan}</span>
                  <button
                    onClick={handleSubscribe}
                    className="flex items-center justify-around gap-2 p-2 font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
                  >
                    <Gem size={18} />
                    Upgrade
                  </button>
                </div>

                {/* 📊 My Saved Investment */}
                <button
                  onClick={() => navigate("/admin/table")}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150"
                >
                  <Coins size={16} className="mr-2 text-indigo-600" />
                  My Saved Project
                </button>

                <button
                  onClick={() => logout()}
                  className="flex items-center w-full px-3 py-2 mt-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => loginWithRedirect()}
          style={{ background: "#1ac47d" }}
          className="text-white flex items-center"
        >
          <LogIn size={18} className="mr-1" /> Login
        </Button>
//        
      )}
 
 <div>
<button
  onClick={handleSubscribe}
  className="
    group relative overflow-hidden
    px-6 py-2.5
    text-sm font-semibold text-indigo-700
    bg-white/70 backdrop-blur-md
    border border-indigo-300
    rounded-xl shadow
    transition-all duration-300 ease-out
    hover:-translate-y-0.5
    hover:shadow-xl
  "
>
  {/* Animated gradient sweep */}
  <span
    className="
      absolute inset-0
      bg-gradient-to-r from-indigo-400/20 via-purple-400/30 to-pink-400/20
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-300
    "
  />

  {/* Glow ring */}
  <span
    className="
      pointer-events-none
      absolute inset-0 rounded-xl
      ring-2 ring-indigo-400/30
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-300
    "
  />

  {/* Text */}
  <span className="relative z-10 tracking-wide">
    Upgrade
  </span>
</button>
 </div>

    
    </div>
  );
};

export default CurrencySelector;
