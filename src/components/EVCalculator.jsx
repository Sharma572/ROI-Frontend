import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import CostInputs from './CostInputs';
import RevenueInputs from './RevenueInputs';
import ROIResults from './ROIResults';
import CurrencySelector from './CurrencySelector';
import { Calculator, Zap, DollarSign, TrendingUp } from 'lucide-react';
import { getMockCalculation } from '../utils/mockData';
import { useCurrency } from '../contexts/CurrencyContext';

const EVCalculator = () => {
   const { user,loginWithRedirect,isAuthenticated } = useAuth0();
   const [hasRegistered, setHasRegistered] = useState(false);
   console.log("Current Usr Details 🫡",user);
   console.log("User is logged In ",isAuthenticated);
   const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState('costs');
  const [hasUserLogged,setHasUserLogged] = useState(false);
  const [costData, setCostData] = useState({
    equipment: {
      level2Chargers: { quantity: 0, unitCost: 0 },
      level3Chargers: { quantity: 0, unitCost: 0 },
      transformer: 0,
      electricalInfrastructure: 0,
      networkingSoftware: 0
    },
    installation: {
      sitePreperation: 0,
      electricalInstallation: 0,
      permits: 0,
      laborCosts: 0
    },
    operating: {
      electricityCostPerKwh: 0.12,
      maintenance: 0,
      networkFees: 0,
      insurance: 0,
      landLease: 0
    }
  });

  const [revenueData, setRevenueData] = useState({
    pricing: {
      level2Rate: 0.25,
      level3Rate: 0.45,
      membershipFee: 0
    },
    usage: {
      dailySessionsLevel2: 0,
      dailySessionsLevel3: 0,
      avgSessionDuration: 2,
      avgEnergyPerSession: 25,
      growthRate: 0
    },
    timeline: {
      analysisYears: 5
    }
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    // Calculate results whenever data changes
    const calculation = getMockCalculation(costData, revenueData);
    setResults(calculation);
  }, [costData, revenueData]);

  console.log("Result of calculation",results);
  
  // utils/generateUserId.js
 function generateUserId() {
  const timestamp = Date.now().toString(36); // compact time-based component
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // random part
  return `USER-${timestamp}-${randomPart}`;
}

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

          const response = await fetch("http://localhost:8080/api/v1/user/register-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

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
   const userId = generateUserId();
    const payload = {
    user_id: userId, // Replace with actual logged-in user if available
    roi: `${data.roi}%`,
    payback_period_years: data.paybackPeriod,
    total_investment: data.totalInvestment,
    five_year_profit: data.fiveYearProfit,

    annual_financial_summary: {
      revenue: data.annualRevenue,
      costs: data.annualCosts,
      profit: data.annualProfit
    },

    investment_breakdown: {
      equipment_costs: data.costBreakdown.equipment,
      installation_costs: data.costBreakdown.installation
    },

    profit_projections: data.yearlyProfits
  };

  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/investments/createinvestment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Saved successfully:", result);
    alert("✅ Investment report saved!");

  } catch (error) {
    console.error("Error saving report:", error);
    alert("❌ Failed to save report");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">EV Charging Station</h1>
                <p className="text-slate-600">ROI & Cost Calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
              {/* <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Beta Version
              </Badge> */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Calculate Your Investment Return
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Analyze the costs, revenues, and ROI for your EV charging station project. 
            Get detailed insights to make informed investment decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="costs" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Costs
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="costs" className="space-y-6">
                <CostInputs costData={costData} setCostData={setCostData} />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <RevenueInputs revenueData={revenueData} setRevenueData={setRevenueData} />
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <ROIResults results={results} />
                 {results && (
    // <Button onClick={() => saveInvestmentReport(results)} className="bg-emerald-600 text-white">
    // <Button onClick={() => loginWithRedirect()} className="bg-emerald-600 text-white">
    //  Login to Save Report
    // </Button>
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
    className="bg-emerald-600 text-white"
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
                      <div className="text-sm text-emerald-600 font-medium">ROI</div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {results.roi}%
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-sm text-emerald-400 font-medium">Annual ROI</div>
                      <div className="text-2xl font-bold text-emerald-500">
                        {results.roi / 12}%
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Payback Period</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {results.paybackPeriod} years
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-sm text-amber-600 font-medium">Total Investment</div>
                      <div className="text-2xl font-bold text-amber-700">
                        {formatCurrency(results.totalInvestment)}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">5-Year Profit</div>
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