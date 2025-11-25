import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import CostInputs from "./CostInputs";
import RevenueInputs from "./RevenueInputs";
import ROIResults from "./ROIResults";
import CurrencySelector from "./CurrencySelector";
import { Calculator, Zap, DollarSign, TrendingUp, ArrowRight, CalculatorIcon } from "lucide-react";
import { getMockCalculation } from "../utils/mockData";
import { useCurrency } from "../contexts/CurrencyContext";
import { useWallet } from "@/contexts/WalletContext";

const EVCalculator = () => {
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const { setWalletBalance } = useWallet();
  const [hasRegistered, setHasRegistered] = useState(false);
  console.log("Current Usr Details 🫡", user);
  console.log("User is logged In ", isAuthenticated);
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState("costs");
  const [hasUserLogged, setHasUserLogged] = useState(false);
  const [costData, setCostData] = useState({
    equipment: {
      level2Chargers: { quantity: 0, unitCost: 0 },
      level3Chargers: { quantity: 0, unitCost: 0 },
      transformer: 0,
      electricalInfrastructure: 0,
      networkingSoftware: 0,
    },
    installation: {
      sitePreperation: 0,
      electricalInstallation: 0,
      permits: 0,
      laborCosts: 0,
    },
    operating: {
      electricityCostPerKwh: 0.12,
      maintenance: 0,
      networkFees: 0,
      insurance: 0,
      landLease: 0,
    },
  });

  const [revenueData, setRevenueData] = useState({
    pricing: {
      level2Rate: 0.25,
      level3Rate: 0.45,
      membershipFee: 0,
    },
    usage: {
  dailySessionsLevel2: null,
  dailySessionsLevel3: null,
  avgEnergyLevel2: 25,
  avgEnergyLevel3: 25,
  avgSessionDuration: 2,
  growthRate: 0,
},
    timeline: {
      analysisYears: 5,
    },
  });

  const [results, setResults] = useState(null);

  // useEffect(() => {
  //   // Calculate results whenever data changes
  //   const calculation = getMockCalculation(costData, revenueData);
  //   setResults(calculation);
  // }, [costData, revenueData]);

const isValidForCalculation = () => {
  const c = costData.equipment;
  const r = revenueData.usage;

  // ✅ at least ONE charger type must be valid
  const level2Valid =
    c.level2Chargers.quantity > 0 &&
    c.level2Chargers.unitCost > 0;

  const level3Valid =
    c.level3Chargers.quantity > 0 &&
    c.level3Chargers.unitCost > 0;

  const costValid = level2Valid || level3Valid;

  // ✅ optional revenue fields (enable only if needed)
  const revenueValid =
    r.dailySessionsLevel2 > 0 ||
    r.dailySessionsLevel3 > 0;

  return costValid && revenueValid;
};

  console.log("Result of calculation", results);



  // ✅ Register user in your backend after Auth0 login
  useEffect(() => {
    const registerUser = async () => {
      if (isAuthenticated && user && !hasRegistered) {
        try {
          const payload = {
            user_id: user.sub, // unique Auth0 ID
            email: user.email,
            email_verified: user.email_verified,
            name: user.name || `${user.given_name} ${user.family_name}`,
          };

          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/v1/user/register-user`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const result = await response.json();
          console.log("✅ User registered:", result);
          setHasRegistered(true); // avoid multiple requests
        } catch (error) {
          console.error("❌ Error registering user:", error);
        }
      }
    };

    registerUser();
  }, [isAuthenticated, user, hasRegistered]);

  const saveInvestmentReport = async (data) => {
    const userId = user?.sub;
    const payload = {
      user_id: userId, // Replace with actual logged-in user if available
      roi: `${data.roi}%`,
      payback_period_years: data.paybackPeriod,
      total_investment: data.totalInvestment,
      five_year_profit: data.fiveYearProfit,

      annual_financial_summary: {
        revenue: data.annualRevenue,
        costs: data.annualCosts,
        profit: data.annualProfit,
      },

      investment_breakdown: {
        equipment_costs: data.costBreakdown.equipment,
        installation_costs: data.costBreakdown.installation,
      },

      profit_projections: data.yearlyProfits,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/investments/createinvestment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Saved successfully:", result);
      alert("✅ Investment report saved!");
    } catch (error) {
      console.error("Error saving report:", error);
      alert("❌ Failed to save report");
    }
  };

  const handleShowResultClick = async () => {
  try {
    const userID = user?.sub
    const payload = {
      user_id: userID,
      amount: 1,
    };

    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/user/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Deduction Failed");
const data = await res.json();
      console.log("data after deduction",data);
      
    // ✅ update global balance
    setWalletBalance(data.remainingCredit);

    alert(`₹${payload.amount} deducted!`);
    // ✅ Continue only when API success
    const calculation = getMockCalculation(costData, revenueData);
    setResults(calculation);
    setActiveTab("results");
  } catch (error) {
    console.error(error);
    alert("Payment/Deduction failed. Try again!");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Calculate Your Investment Return
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Analyze the costs, revenues, and ROI for your EV charging station
            project. Get detailed insights to make informed investment
            decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex justify-between grid-cols-3 mb-6">
                <TabsTrigger value="costs" className="flex w-[50%] items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Costs
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="flex w-[50%] items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="flex w-[50%] items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="costs" className="space-y-6">
                <CostInputs costData={costData} setCostData={setCostData} />
                {/* NEXT BUTTON */}
                <div className="flex justify-end">
                <Button
  onClick={() => setActiveTab("revenue")}
  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg 
             shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2"
>
  Next 
  <ArrowRight className="w-4 h-4" />
</Button>

                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <RevenueInputs
                  revenueData={revenueData}
                  setRevenueData={setRevenueData}
                />

                <div className="flex justify-end">
                  {/* <Button
                    onClick={() => {
                      const calculation = getMockCalculation(
                        costData,
                        revenueData
                      );
                      setResults(calculation);
                      setActiveTab("results");
                    }}
                    className="bg-green-700 text-white"
                  >
                   <CalculatorIcon /> Calculate & Show Result
                  </Button> */}
                  <Button
  // disabled={!isValidForCalculation()}
  onClick={handleShowResultClick}
  // className={`text-white ${
  //   !isValidForCalculation()
  //     ? "bg-gray-400 cursor-not-allowed"
  //     : "bg-green-700"
  // }`}
  className="bg-green-600 text-white"
>
  <CalculatorIcon /> Calculate & Show Result
</Button>

                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <ROIResults results={results} />
                {results && (
                  <>
                    {isAuthenticated ? (
                      <Button
                        onClick={() => saveInvestmentReport(results)}
                        className="bg-emerald-600 text-white"
                      >
                        Save Report
                      </Button>
                    ) : (
                      <Button
                        onClick={() => loginWithRedirect()}
                        style={{background:"#1ac47d"}}
                        className=" text-white"
                      >
                        Login to Save Report
                      </Button>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Quick Overview</CardTitle>
                <CardDescription>
                  Key metrics from your calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results ? (
                  <>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-sm text-emerald-600 font-medium">
                        ROI
                      </div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {results.roi}%
                      </div>
                    </div>
                    <div className="bg-fuchsia-50 p-4 rounded-lg">
                      <div className="text-sm text-fuchsia-500 font-medium">
                        Annual ROI
                      </div>
                      <div className="text-2xl font-bold text-fuchsia-600">
                     {(results.roi / 12).toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">
                        Payback Period
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {results.paybackPeriod} years
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-sm text-amber-600 font-medium">
                        Total Investment
                      </div>
                      <div className="text-2xl font-bold text-amber-700">
                        {formatCurrency(results.totalInvestment)}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">
                        5-Year Profit
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {formatCurrency(results.fiveYearProfit)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your data to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EVCalculator;
