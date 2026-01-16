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
import {
  Calculator,
  Zap,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CalculatorIcon,
  BookMarked,
} from "lucide-react";
import { getMockCalculation } from "../utils/mockData";
import { useCurrency } from "../contexts/CurrencyContext";
import { useWallet } from "@/contexts/WalletContext";
import { useChargerType } from "@/contexts/ChargerTypeContext";
import { useLocation } from "react-router-dom";
import { useUser } from "@/contexts/userContext";

const EVCalculator = () => {
  const location = useLocation();
  const project = location.state?.project;
  const { setUserState } = useUser();
  const [costErrors, setCostErrors] = useState({});
  const [revenueErrors, setRevenueErrors] = useState({});
  const { chargerType } = useChargerType();
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const { setWalletBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const [hasRegistered, setHasRegistered] = useState(false);
  const [isAutofill, setIsAutofill] = useState(false);
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
      electricityCostPerKwh: 0,
      maintenance: 0,
      networkFees: 0,
      insurance: 0,
      landLease: 0,
      // Revenue Modal 
       revenueType: "percentage",   // NEW
    revenuePercentage: 0,        // NEW
    revenuePerKwh: 0,    
    },
  });


  const [projectName, setProjectName] = useState(true);

  const [revenueData, setRevenueData] = useState({
    pricing: {
      level2Rate: 0,
      level3Rate: 0,
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
  const [totalInvestments, setTotalInvestment] = useState(null);
  useEffect(() => {
  const saved = sessionStorage.getItem("roi_session");
  if (!saved) return;

  try {
    const { results, unlocked } = JSON.parse(saved);

    // 🔁 Restore form inputs
    setCostData(results.costData);
    setRevenueData(results.revenueData);

    // 🔁 Restore calculation
    setResults(results);

    // 🔁 Jump to Results tab
    setActiveTab("results");

    // 🔁 Restore unlock state
    sessionStorage.setItem("roi_unlocked", unlocked ? "true" : "false");
  } catch (e) {
    console.error("Failed to restore ROI session", e);
  }
}, []);

  useEffect(() => {
    // Calculate results whenever data changes
    const calculation = getMockCalculation(costData, revenueData);
    setTotalInvestment(calculation);
  }, [costData]);

  const isValidForCalculation = () => {
    const c = costData.equipment;
    const r = revenueData.usage;

    // ✅ at least ONE charger type must be valid
    const level2Valid =
      c.level2Chargers.quantity > 0 && c.level2Chargers.unitCost > 0;

    const level3Valid =
      c.level3Chargers.quantity > 0 && c.level3Chargers.unitCost > 0;

    const costValid = level2Valid || level3Valid;

    // ✅ optional revenue fields (enable only if needed)
    const revenueValid = r.dailySessionsLevel2 > 0 || r.dailySessionsLevel3 > 0;

    return costValid && revenueValid;
  };

  console.log(
    "Result of calculation",
    results?.revenueData?.timeline?.analysisYears
  );

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

  console.log("Result data in Ev calculator", results);

  // Working Code 
  // const handleNext = () => {
  //   const { equipment, operating } = costData;

  //   const l2Qty = equipment.level2Chargers.quantity;
  //   const l2Cost = equipment.level2Chargers.unitCost;

  //   const l3Qty = equipment.level3Chargers.quantity;
  //   const l3Cost = equipment.level3Chargers.unitCost;

  //   const electricity = operating.electricityCostPerKwh;

  //   // Electricity cost validation (common)
  //   if (!electricity || electricity <= 0) {
  //     setFormError("❌ Electricity Cost per kWh must be greater than 0.");
  //     return false;
  //   }
  //   console.log("chargerType", chargerType);

  //   // ========== LEVEL 2 ==========
  //   if (chargerType === "level2") {
  //     if (l2Qty <= 0) {
  //       setFormError("❌ Please enter Level 2 charger quantity greater than 0.");
  //       return false;
  //     }
  //     if (l2Cost <= 0) {
  //       setFormError("❌ Level 2 charger unit cost must be greater than 0.");
  //       return false;
  //     }
  //   }

  //   // ========== LEVEL 3 ==========
  //   if (chargerType === "level3") {
  //     if (l3Qty <= 0) {
  //       setFormError("❌ Please enter Level 3 charger quantity greater than 0.");
  //       return false;
  //     }
  //     if (l3Cost <= 0) {
  //       setFormError("❌ Level 3 charger unit cost must be greater than 0.");
  //       return false;
  //     }
  //   }

  //   // ========== BOTH ==========
  //   if (chargerType === "both") {
  //     if (l2Qty <= 0 || l3Qty <= 0) {
  //       setFormError("❌ Both Level 2 and Level 3 charger quantities must be > 0.");
  //       return false;
  //     }
  //     if (l2Cost <= 0 || l3Cost <= 0) {
  //       setFormError("❌ Both Level 2 and Level 3 charger unit costs must be > 0.");
  //       return false;
  //     }
  //   }

  //   // If all good
  //   console.log("✔ Validation passed", costData);
  //   // go to next step...
  //   // setActiveTab("revenue");
  //     return true; // ✅ VALID
  // };

  // const handleShowResultClick = async () => {
  //   try {
  //     // Save Investment Data to backend here...

  //     const calculation = getMockCalculation(costData, revenueData);
  //     setResults(calculation);
  //     setActiveTab("results");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Payment/Deduction failed. Try again!");
  //   }
  // };

  // useEffect(() => {
  //   if (!project) return;

  //   console.log("📌 Loading project into form", project);

  //   // Prefill Cost
  //   if (project.userInputCost) {
  //     setCostData(project.userInputCost);
  //   }

  //   // Prefill Revenue
  //   if (project.userInputRevenue) {
  //     setRevenueData(project.userInputRevenue);
  //   }

  //   // Auto-calc results
  //   const calc = getMockCalculation(project.userInputCost, project.userInputRevenue);
  //   setResults(calc);
  //   setActiveTab("results");  // Jump to result tab automatically
  // }, [project]);

  const handleNext = () => {
  const { equipment } = costData;
  const errors = {};

  const l2Qty = equipment.level2Chargers.quantity;
  const l2Cost = equipment.level2Chargers.unitCost;
  const l3Qty = equipment.level3Chargers.quantity;
  const l3Cost = equipment.level3Chargers.unitCost;

  // LEVEL 2
  if (chargerType === "level2") {
    if (l2Qty <= 0) errors.level2Qty = "Level 2 quantity required";
    if (l2Cost <= 0) errors.level2Cost = "Level 2 unit cost required";
  }

  // LEVEL 3
  if (chargerType === "level3") {
    if (l3Qty <= 0) errors.level3Qty = "Level 3 quantity required";
    if (l3Cost <= 0) errors.level3Cost = "Level 3 unit cost required";
  }

  // BOTH
  if (chargerType === "both") {
    if (l2Qty <= 0) errors.level2Qty = "Level 2 quantity required";
    if (l2Cost <= 0) errors.level2Cost = "Level 2 unit cost required";
    if (l3Qty <= 0) errors.level3Qty = "Level 3 quantity required";
    if (l3Cost <= 0) errors.level3Cost = "Level 3 unit cost required";
  }

  setCostErrors(errors);

  return Object.keys(errors).length === 0;
};

const validateRevenue = () => {
  const errors = {};
  const { pricing } = revenueData;

  // Level 2 validation
  if (
    (chargerType === "level2" || chargerType === "both") &&
    (!pricing.level2Rate || pricing.level2Rate <= 0)
  ) {
    errors.level2Rate = "Level 2 (AC) rate is required";
  }

  // Level 3 validation
  if (
    (chargerType === "level3" || chargerType === "both") &&
    (!pricing.level3Rate || pricing.level3Rate <= 0)
  ) {
    errors.level3Rate = "Level 3 (DC) rate is required";
  }

  setRevenueErrors(errors);

  return Object.keys(errors).length === 0;
};


  const handleShowResultClick = async () => {
  try {
      setIsLoading(true);

       if (!validateRevenue()) {
      setIsLoading(false);
      return;
    }

// ✅ Clear old errors
setRevenueErrors({});

    
    // Generate unique project name based on date-time
    const now = new Date();
    const autoProjectName =
      "Project-" +
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0")
    // 1️⃣ Run calculation
    const calculation = getMockCalculation(costData, revenueData);
    setResults(calculation);
    setActiveTab("results");

    // 2️⃣ Structure payload for backend
    const payload = {
      currentUser: {
        sub: user?.sub,      // from auth0 or session
        email: user?.email,
        email_verified: true,
        name: user?.name,
        picture: user?.picture,
      },

      // PROJECT INFO
      project_name: autoProjectName,

      // MAIN CALC METRICS
      roi: calculation.roi.toFixed(2) + "%",
      payback_period_years: calculation.paybackPeriod,
      total_investment: calculation.totalInvestment,
      five_year_profit: calculation.fiveYearProfit,

      // ANNUAL FINANCIAL SUMMARY
      annual_financial_summary: {
        revenue: calculation.annualRevenue,
        costs: calculation.annualCosts,
        profit: calculation.annualProfit,
      },

      // BREAKDOWN
      investment_breakdown: {
        equipment_costs: calculation.costBreakdown.equipment,
        installation_costs: calculation.costBreakdown.installation,
      },

      // PROFIT PROJECTIONS (YEAR-WISE)
      profit_projections: calculation.yearlyProfits.map((item) => ({
        year: item.year,
        revenue: item.revenue,
        costs: item.costs,
        profit: item.profit,
      })),

      // SAVE ALL USER RAW INPUTS
      userInputCost: costData,
      userInputRevenue: revenueData,
    };

    console.log("🚀 Final Payload Sent To Backend:", payload);

    // 3️⃣ SEND TO BACKEND
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save investment");
    }

    console.log("Investment Saved:", data);

    // 4️⃣ DEDUCT 1 CREDIT AFTER SUCCESSFUL SAVE
const deductResponse = await fetch(
  `${process.env.REACT_APP_BASE_URL}/api/v1/user/deduct`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user?.sub, // auth0 user id
      amount: 1,          // deduct 1 credit
    }),
  }
);

const deductData = await deductResponse.json();

if (!deductResponse.ok) {
  throw new Error(deductData.message || "Credit deduction failed");
}
setUserState({
        loading: false,
        profile: {
          credit: deductData.remainingCredit || 0,
        },
      });
console.log("✅ Credit Deducted Successfully:", deductData);


  } catch (error) {
    console.error("Error saving investment:", error);
    alert("Something went wrong while saving investment.");
  }finally{
      setIsLoading(false);
  }
};


  useEffect(() => {
    if (!project) return;
    
    setIsAutofill(true); // ⭐ Mark that autofill is happening

    if (project.userInputCost) {
      setCostData(project.userInputCost);
    }

    if (project.userInputRevenue) {
      setRevenueData(project.userInputRevenue);
    }

    const calc = getMockCalculation(
      project.userInputCost,
      project.userInputRevenue
    );
    setResults(calc);
    setActiveTab("results");
  }, [project]);
  
  const handleNewProject = () => {
    setResults(null)
    setProjectName(false);
    setCostData({
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
      electricityCostPerKwh: 0,
      maintenance: 0,
      networkFees: 0,
      insurance: 0,
      landLease: 0,
    },
  })
  setRevenueData({
    pricing: {
      level2Rate: 0,
      level3Rate: 0,
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
  })
  }
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
        {project?.project_name && projectName && (
<div className=" px-4 py-4 flex justify-between items-center bg-green-100 text-black">
          <div>

            <span className="text-xl font-bold flex items-center mb-1">
              <span>
                <BookMarked />
              </span>
              <span className="ml-2">Project: {project?.project_name}</span>
            </span>
         
          </div>
          <div>
{/* RIGHT SIDE — BUTTON */}
  <button
    onClick={handleNewProject}
    className="bg-green-600 hover:bg-green-700 flex text-white px-4 py-2 rounded-lg shadow"
  >
    <span>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus-corner-icon lucide-file-plus-corner"><path d="M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M14 19h6"/><path d="M17 16v6"/></svg>
    </span>
    <span className="ml-2 font-medium">
    New Project
    </span>
  </button>
          </div>
           
        </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8 border-[1px] border-slate-200 p-6 rounded-lg shadow-sm bg-white">
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              // onValueChange={setActiveTab}
              onValueChange={(nextTab) => {
    // when clicking Revenue tab from Costs
    if (nextTab === "revenue" && activeTab === "costs") {
      if (handleNext()) {
        setActiveTab("revenue");
      }
      return;
    }
     // 🔴 REVENUE → RESULTS (ADD THIS)
    if (nextTab === "results" && activeTab === "revenue") {
      if (validateRevenue()) {
        setActiveTab("results");
      }
      return;
    }

    // allow all other tab switches
    setActiveTab(nextTab);
  }}
              className="w-full"
            >
              <TabsList className="flex justify-between grid-cols-3 mb-6">
                <TabsTrigger
                  value="costs"
                  className="flex w-[50%] items-center gap-2"
                >
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
                <CostInputs
                  costData={costData}
                  setCostData={setCostData}
                  isAutofill={isAutofill}
                  setIsAutofill={setIsAutofill}
                    errors={costErrors}
                     setErrors={setCostErrors}   
                />
                {/* NEXT BUTTON */}
                <div className="flex justify-end">
                  <Button
                    // onClick={handleNext}
                     onClick={() => {
    if (handleNext()) {
      setActiveTab("revenue");
    }
  }}
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
                   errors={revenueErrors}
                    setErrors={setRevenueErrors}
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
  onClick={handleShowResultClick}
  disabled={isLoading}   // Disable when loading
  className={`bg-green-600 text-white flex items-center gap-2 ${
    isLoading ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {isLoading ? (
    <>
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
      Saving...
    </>
  ) : (
    <>
      <CalculatorIcon /> Calculate & Show Result
    </>
  )}
</Button>

                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <ROIResults results={results} />
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
                {/* Update the logic where we are changing the investment */}
                {totalInvestments && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-sm text-amber-600 font-medium">
                      Total Investment
                    </div>
                    <div className="text-2xl font-bold text-amber-700">
                      {formatCurrency(totalInvestments.totalInvestment)}
                    </div>
                  </div>
                )}

                {results && (
                  <>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-sm text-emerald-600 font-medium">
                        ROI
                      </div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {results.roi?.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-fuchsia-50 p-4 rounded-lg">
                      <div className="text-sm text-fuchsia-500 font-medium">
                        Annual ROI
                      </div>
                      <div className="text-2xl font-bold text-fuchsia-600">
                        {(
                          results.roi /
                          results?.revenueData?.timeline?.analysisYears
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">
                        Payback Period
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {results.paybackPeriod.toFixed(1)} years
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">
                        {results?.revenueData?.timeline?.analysisYears}-Year
                        Profit
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {formatCurrency(results.fiveYearProfit)}
                      </div>
                    </div>
                  </>
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
