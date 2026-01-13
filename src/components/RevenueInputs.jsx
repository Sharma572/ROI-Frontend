import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Users, TrendingUp, Clock, TrendingUpIcon } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useChargerType } from '@/contexts/ChargerTypeContext';

const RevenueInputs = ({ revenueData, setRevenueData,errors,setErrors }) => {
  const { getCurrencySymbol, formatCurrencyInput, convertInputToUSD } = useCurrency();
 const { chargerType } = useChargerType();
console.log("Charger Type Selected on Cost",chargerType);

  const updatePricing = (field, value) => {
    const usdValue = field === 'membershipFee' ? convertInputToUSD(parseFloat(value) || 0) : parseFloat(value) || 0;
    setRevenueData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: usdValue
      }
    }));

     // ✅ CLEAR ERROR ON TYPE
  setErrors((prev) => {
    const updated = { ...prev };
    delete updated[field]; // level2Rate / level3Rate
    return updated;
  });
  };

  // Older Logic
// const updateUsage = (field, value) => {
//   const num = parseFloat(value);

//   setRevenueData(prev => {
//     const usage = { ...prev.usage, [field]: num }; // <-- MUST COME FIRST

//     // -------------------------------
//     // AUTO SYNC: SESSIONS ↔ MONTHLY
//     // -------------------------------

//     // ---- LEVEL 2 ----
//     if (field === "dailySessionsLevel2") {
//       usage.monthlySessionsLevel2 = Math.round(num * 30);
//     }
//     if (field === "monthlySessionsLevel2") {
//       usage.dailySessionsLevel2 = Number((num / 30).toFixed(2));
//     }

//     // ---- LEVEL 3 ----
//     if (field === "dailySessionsLevel3") {
//       usage.monthlySessionsLevel3 = Math.round(num * 30);
//     }
//     if (field === "monthlySessionsLevel3") {
//       usage.dailySessionsLevel3 = Number((num / 30).toFixed(2));
//     }

//     // ------------------------------------------
//     // MONTHLY ENERGY → SESSIONS (if AVG exists)
//     // ------------------------------------------

//     // LEVEL 2
//     if (field === "monthlyEnergyLevel2") {
//       const avg = usage.avgEnergyLevel2 || 0;

//       if (avg > 0) {
//         const dailyEnergy = num / 30;
//         const dailySessions = dailyEnergy / avg;

//         usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
//         usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
//       }
//     }

//     // LEVEL 3
//     if (field === "monthlyEnergyLevel3") {
//       const avg = usage.avgEnergyLevel3 || 0;

//       if (avg > 0) {
//         const dailyEnergy = num / 30;
//         const dailySessions = dailyEnergy / avg;

//         usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
//         usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
//       }
//     }

//     // ------------------------------------------
//     // DAILY SESSIONS + AVG ENERGY → MONTHLY ENERGY
//     // ------------------------------------------

//     // LEVEL 2
//     if (field === "dailySessionsLevel2" || field === "avgEnergyLevel2") {
//       const daily = usage.dailySessionsLevel2 || 0;
//       const avg = usage.avgEnergyLevel2 || 0;

//       if (daily > 0 && avg > 0) {
//         const dailyEnergy = daily * avg;
//         usage.monthlyEnergyLevel2 = Math.round(dailyEnergy * 30);
//       }
//     }

//     // LEVEL 3
//     if (field === "dailySessionsLevel3" || field === "avgEnergyLevel3") {
//       const daily = usage.dailySessionsLevel3 || 0;
//       const avg = usage.avgEnergyLevel3 || 0;

//       if (daily > 0 && avg > 0) {
//         const dailyEnergy = daily * avg;
//         usage.monthlyEnergyLevel3 = Math.round(dailyEnergy * 30);
//       }
//     }

//     // ------------------------------------------
//     // AVG ENERGY CHANGE → RECALC SESSIONS
//     // ------------------------------------------

//     // LEVEL 2
//     if (field === "avgEnergyLevel2" && usage.monthlyEnergyLevel2 > 0) {
//       const dailyEnergy = usage.monthlyEnergyLevel2 / 30;
//       const dailySessions = dailyEnergy / num;

//       usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
//       usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
//     }

//     // LEVEL 3
//     if (field === "avgEnergyLevel3" && usage.monthlyEnergyLevel3 > 0) {
//       const dailyEnergy = usage.monthlyEnergyLevel3 / 30;
//       const dailySessions = dailyEnergy / num;

//       usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
//       usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
//     }

//     // ------------------------------------------
//     // ⭐ AUTO-CALCULATE AVG ENERGY (NEW CODE)
//     // ------------------------------------------

//     // LEVEL 2
//     if (
//       usage.monthlyEnergyLevel2 > 0 &&
//       usage.monthlySessionsLevel2 > 0
//     ) {
//       usage.avgEnergyLevel2 = Number(
//         (usage.monthlyEnergyLevel2 / usage.monthlySessionsLevel2).toFixed(2)
//       );
//     }

//     // LEVEL 3
//     if (
//       usage.monthlyEnergyLevel3 > 0 &&
//       usage.monthlySessionsLevel3 > 0
//     ) {
//       usage.avgEnergyLevel3 = Number(
//         (usage.monthlyEnergyLevel3 / usage.monthlySessionsLevel3).toFixed(2)
//       );
//     }

//     return { ...prev, usage };
//   });
// };

const updateUsage = (field, value) => {
  const num = value === "" ? 0 : parseFloat(value) || 0;

  setRevenueData((prev) => {
    const usage = { ...prev.usage, [field]: num };

    // -----------------------------------------------------
    // ⭐ RESET LOGIC WHEN FIELD IS CLEARED (NO NaN Issues)
    // -----------------------------------------------------
    if (value === "") {
      // ✅ If Avg Energy is cleared → reset sessions ONLY
if (field === "avgEnergyLevel2") {
  usage.dailySessionsLevel2 = 0;
  usage.monthlySessionsLevel2 = 0;
  return { ...prev, usage };
}

if (field === "avgEnergyLevel3") {
  usage.dailySessionsLevel3 = 0;
  usage.monthlySessionsLevel3 = 0;
  return { ...prev, usage };
}

      // If monthly energy L2 is cleared → reset only L2 sessions
      if (field === "monthlyEnergyLevel2") {
        usage.dailySessionsLevel2 = 0;
        usage.monthlySessionsLevel2 = 0;
        usage.monthlyEnergyLevel2 = 0;
        // ❌ DO NOT RESET usage.avgEnergyLevel2
        return { ...prev, usage };
      }

      // If monthly energy L3 is cleared → reset only L3 sessions
      if (field === "monthlyEnergyLevel3") {
        usage.dailySessionsLevel3 = 0;
        usage.monthlySessionsLevel3 = 0;
        usage.monthlyEnergyLevel3 = 0;
        // ❌ DO NOT RESET usage.avgEnergyLevel3
        return { ...prev, usage };
      }

      // Generic reset for other session/energy fields
      if (field.includes("Level2")) {
        usage.dailySessionsLevel2 ||= 0;
        usage.monthlySessionsLevel2 ||= 0;
        usage.monthlyEnergyLevel2 ||= 0;
      }

      if (field.includes("Level3")) {
        usage.dailySessionsLevel3 ||= 0;
        usage.monthlySessionsLevel3 ||= 0;
        usage.monthlyEnergyLevel3 ||= 0;
      }

      return { ...prev, usage };
    }

    // -----------------------------------------------------
    // ⭐ AUTO SYNC: DAILY ↔ MONTHLY SESSIONS
    // -----------------------------------------------------

    // ---- LEVEL 2 ----
    if (field === "dailySessionsLevel2") {
      usage.monthlySessionsLevel2 = Math.round(num * 30);
    }
    if (field === "monthlySessionsLevel2") {
      usage.dailySessionsLevel2 = Number((num / 30).toFixed(2));
    }

    // ---- LEVEL 3 ----
    if (field === "dailySessionsLevel3") {
      usage.monthlySessionsLevel3 = Math.round(num * 30);
    }
    if (field === "monthlySessionsLevel3") {
      usage.dailySessionsLevel3 = Number((num / 30).toFixed(2));
    }

    // -----------------------------------------------------
    // ⭐ MONTHLY ENERGY → CALCULATE SESSIONS (if AVG exists)
    // -----------------------------------------------------

    // LEVEL 2
    if (field === "monthlyEnergyLevel2") {
      const avg = usage.avgEnergyLevel2 || 0;

      if (avg > 0) {
        const dailyEnergy = num / 30;
        const dailySessions = dailyEnergy / avg;

        usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
        usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
      }
    }

    // LEVEL 3
    if (field === "monthlyEnergyLevel3") {
      const avg = usage.avgEnergyLevel3 || 0;

      if (avg > 0) {
        const dailyEnergy = num / 30;
        const dailySessions = dailyEnergy / avg;

        usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
        usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
      }
    }

    // -----------------------------------------------------
    // ⭐ DAILY SESSIONS + AVG → MONTHLY ENERGY
    // -----------------------------------------------------

    // LEVEL 2
    // if (field === "dailySessionsLevel2" || field === "avgEnergyLevel2") {
    //   const daily = usage.dailySessionsLevel2 || 0;
    //   const avg = usage.avgEnergyLevel2 || 0;

    //   if (daily > 0 && avg > 0) {
    //     usage.monthlyEnergyLevel2 = Math.round(daily * avg * 30);
    //   }
    // }

    // LEVEL 3
    // if (field === "dailySessionsLevel3" || field === "avgEnergyLevel3") {
    //   const daily = usage.dailySessionsLevel3 || 0;
    //   const avg = usage.avgEnergyLevel3 || 0;

    //   if (daily > 0 && avg > 0) {
    //     usage.monthlyEnergyLevel3 = Math.round(daily * avg * 30);
    //   }
    // }

    // -----------------------------------------------------
    // ⭐ AVG ENERGY CHANGE → RECALCULATE SESSIONS
    // -----------------------------------------------------

    // LEVEL 2
    if (field === "avgEnergyLevel2" && usage.monthlyEnergyLevel2 > 0) {
      const dailyEnergy = usage.monthlyEnergyLevel2 / 30;
      const dailySessions = dailyEnergy / num;

      usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
      usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
    }

    // LEVEL 3
    if (field === "avgEnergyLevel3" && usage.monthlyEnergyLevel3 > 0) {
      const dailyEnergy = usage.monthlyEnergyLevel3 / 30;
      const dailySessions = dailyEnergy / num;

      usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
      usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
    }

    // -----------------------------------------------------
    // ⭐ AUTO-CALCULATE AVG ENERGY (EXCEPT WHEN FIELD CLEARED)
    // -----------------------------------------------------

    // LEVEL 2
    // if (
    //   usage.monthlyEnergyLevel2 > 0 &&
    //   usage.monthlySessionsLevel2 > 0 &&
    //   field !== "monthlyEnergyLevel2" // <— DO NOT RECALC if clearing
    // ) {
    //   usage.avgEnergyLevel2 = Number(
    //     (usage.monthlyEnergyLevel2 / usage.monthlySessionsLevel2).toFixed(2)
    //   );
    // }

    // // LEVEL 3
    // if (
    //   usage.monthlyEnergyLevel3 > 0 &&
    //   usage.monthlySessionsLevel3 > 0 &&
    //   field !== "monthlyEnergyLevel3"
    // ) {
    //   usage.avgEnergyLevel3 = Number(
    //     (usage.monthlyEnergyLevel3 / usage.monthlySessionsLevel3).toFixed(2)
    //   );
    // }

    if (field === "monthlyEnergyLevel2" && usage.avgEnergyLevel2 > 0) {
  const dailyEnergy = num / 30;
  const dailySessions = dailyEnergy / usage.avgEnergyLevel2;

  usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
  usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
}
if (field === "avgEnergyLevel2" && usage.monthlyEnergyLevel2 > 0) {
  const dailyEnergy = usage.monthlyEnergyLevel2 / 30;
  const dailySessions = dailyEnergy / num;

  usage.dailySessionsLevel2 = Number(dailySessions.toFixed(2));
  usage.monthlySessionsLevel2 = Math.round(dailySessions * 30);
}


    return { ...prev, usage };
  });
};





  const updateTimeline = (field, value) => {
    setRevenueData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: parseInt(value) || 5
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Pricing Strategy */}
      <Card className="border-2 hover:border-emerald-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Pricing Strategy
          </CardTitle>
          <CardDescription>
            Set your charging rates and membership fees
          </CardDescription>
        </CardHeader>
        <CardContent>
        {/* Conditional Render of teh from */}
          <div className="grid md:grid-cols-2 gap-6">

  {/* LEVEL 2 RATE */}
  {(chargerType === "level2" || chargerType === "both") && (
    <div>
       <Label htmlFor="level2-rate">Level 2 (AC) Rate ({getCurrencySymbol()}/kWh)  <span className="text-red-600 font-bold">*</span></Label>
     
      {/* <Input
        id="level2-rate"
        type="text"
       
        placeholder="0"
        value={revenueData.pricing.level2Rate || ''}
        onChange={(e) => updatePricing('level2Rate', e.target.value)}
        className="mt-1"
      /> */}
      <Input
  id="level2-rate"
  type="number"
  min="0"
  step="0.01"
  inputMode="decimal"
  placeholder="0"
  value={revenueData.pricing.level2Rate > 0 ? revenueData.pricing.level2Rate : ""}
  onChange={(e) => updatePricing("level2Rate", e.target.value)}
  className={`mt-1 ${
    errors?.level2Rate ? "border-red-500 focus:ring-red-500" : ""
  }`}
/>
{errors?.level2Rate && (
  <p className="text-sm text-red-600 mt-1">{errors.level2Rate}</p>
)}
      <p className="text-sm text-slate-500 mt-1">
        Typical range: {getCurrencySymbol()}11 - {getCurrencySymbol()}16
      </p>
    </div>
  )}

  {/* LEVEL 3 RATE */}
  {(chargerType === "level3" || chargerType === "both") && (
    <div>
      {/* <Label htmlFor="level3-rate">Level 3 (DC) Rate ({getCurrencySymbol()}/kWh)</Label> */}
      <Label htmlFor="level3-rate">Level 3 (DC) Rate ({getCurrencySymbol()}/kWh)  <span className="text-red-600 font-bold">*</span></Label>
     
      {/* <Input
        id="level3-rate"
        type="text"

        placeholder="0"
        value={revenueData.pricing.level3Rate || ''}
        onChange={(e) => updatePricing('level3Rate', e.target.value)}
        className="mt-1"
      /> */}
      <Input
  id="level3-rate"
  type="number"
  min="0"
  step="0.01"
  inputMode="decimal"
  placeholder="0"
  value={revenueData.pricing.level3Rate > 0 ? revenueData.pricing.level3Rate : ""}
  onChange={(e) => updatePricing("level3Rate", e.target.value)}
     className={`mt-1 ${
    errors?.level3Rate ? "border-red-500 focus:ring-red-500" : ""
  }`}
/>
{errors?.level3Rate && (
  <p className="text-sm text-red-600 mt-1">{errors.level3Rate}</p>
)}

      <p className="text-sm text-slate-500 mt-1">
        Typical range: {getCurrencySymbol()}14 - {getCurrencySymbol()}20
      </p>
    </div>
  )}

  {/* MEMBERSHIP – always visible */}
  <div>
    <Label htmlFor="membership-fee">
      Monthly Membership Fee ({getCurrencySymbol()})
    </Label>
    <Input
      id="membership-fee"
      type="text"
      placeholder="0"
      // value={formatCurrencyInput(revenueData.pricing.membershipFee || 0).toFixed(0)}
      value={
    revenueData.pricing.membershipFee > 0
      ? formatCurrencyInput(
          revenueData.pricing.membershipFee
        ).toFixed(0)
      : ""
  }
      onChange={(e) => updatePricing('membershipFee', e.target.value)}
      className="mt-1"
    />
    <p className="text-sm text-slate-500 mt-1">
      Optional subscription model
    </p>
  </div>

</div>

        </CardContent>
      </Card>

      {/* Usage Projections */}
      <Card className="border-2 hover:border-blue-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
           Per-Charger Usage Projections
          </CardTitle>
          <CardDescription>
            Estimate how much each charger is used on average.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
{/* LEVEL 2 SECTION */}
{(chargerType === "level2" || chargerType === "both") && (
  <div className="space-y-2 border-[1px] p-4 rounded-lg border-gray-300 hover:border-gray-400 transition-colors">

    {/* Section Title */}
    <h3 className="font-semibold text-blue-700 text-lg border-b pb-1">
      Level 2 (AC) Usage
    </h3>

    {/* Daily + Monthly Sessions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Daily L2 Sessions</Label>
        <Input
          type="text"
          placeholder="Enter daily L2 sessions"
          value={revenueData.usage.dailySessionsLevel2 ?? ""}
          onChange={(e) =>
            updateUsage("dailySessionsLevel2", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Monthly L2 Sessions</Label>
        <Input
          type="text"
          placeholder="Enter monthly L2 sessions"
          value={revenueData.usage.monthlySessionsLevel2 ?? ""}
          onChange={(e) =>
            updateUsage("monthlySessionsLevel2", e.target.value)
          }
        />
      </div>
    </div>

    {/* Monthly Energy (FULL WIDTH) */}
    <div>
      <Label>Monthly Energy Consumed (kWh) - Level 2</Label>
      <Input
        type="text"
        placeholder="Total monthly L2 energy"
        value={revenueData.usage.monthlyEnergyLevel2 ?? ""}
        onChange={(e) =>
          updateUsage("monthlyEnergyLevel2", e.target.value)
        }
      />
    </div>

    {/* Avg Energy (FULL WIDTH) */}
    <div>
      <Label>Avg Energy per L2 Session (kWh)</Label>
      <Input
        type="text"
        placeholder="Enter average energy"
        value={revenueData.usage.avgEnergyLevel2 ?? ""}
        onChange={(e) =>
          updateUsage("avgEnergyLevel2", e.target.value)
        }
      />
    </div>
  </div>
)}

{/* LEVEL 3 SECTION */}
{(chargerType === "level3" || chargerType === "both") && (
  <div className="space-y-2 mt-1 border-[1px] p-4 rounded-lg border-gray-300 hover:border-gray-400 transition-colors">

    {/* Section Title */}
    <h3 className="font-semibold text-orange-700 text-lg border-b pb-1">
      Level 3 (DC Fast) Usage
    </h3>

    {/* Daily + Monthly Sessions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Daily L3 Sessions</Label>
        <Input
          type="text"
          placeholder="Enter daily L3 sessions"
          value={revenueData.usage.dailySessionsLevel3 ?? ""}
          onChange={(e) =>
            updateUsage("dailySessionsLevel3", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Monthly L3 Sessions</Label>
        <Input
          type="text"
          placeholder="Enter monthly L3 sessions"
          value={revenueData.usage.monthlySessionsLevel3 ?? ""}
          onChange={(e) =>
            updateUsage("monthlySessionsLevel3", e.target.value)
          }
        />
      </div>
    </div>

    {/* Monthly Energy (FULL WIDTH) */}
    <div>
      <Label>Monthly Energy Consumed (kWh) - Level 3</Label>
      <Input
        type="text"
        placeholder="Total monthly L3 energy"
        value={revenueData.usage.monthlyEnergyLevel3 ?? ""}
        onChange={(e) =>
          updateUsage("monthlyEnergyLevel3", e.target.value)
        }
      />
    </div>

    {/* Avg Energy (FULL WIDTH) */}
    <div>
      <Label>Avg Energy per L3 Session (kWh)</Label>
      <Input
        type="text"
        placeholder="Enter average energy"
        value={revenueData.usage.avgEnergyLevel3 ?? ""}
        onChange={(e) =>
          updateUsage("avgEnergyLevel3", e.target.value)
        }
      />
    </div>
  </div>
)}

          </div> 

        </CardContent>
      </Card>

       <Card className="border-2 hover:border-orange-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
           
            <TrendingUpIcon className="h-5 w-5 text-orange-600" />
           Growth Rate
          </CardTitle>
          <CardDescription>
            <p className="text-sm text-slate-500 mt-1">Expected yearly usage increase</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
<div>

            <div>
              <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
              <Input
                id="growth-rate"
                type="text"
                placeholder="0"
                value={revenueData.usage.growthRate || ''}
                onChange={(e) => updateUsage('growthRate', e.target.value)}
                className="mt-1"
              />
             
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Analysis Timeline */}
      <Card className="border-2 hover:border-purple-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Analysis Timeline
          </CardTitle>
          <CardDescription>
            Set the time period for your ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="analysis-years">Analysis Period (years)</Label>
              <Select 
                value={revenueData.timeline.analysisYears.toString()} 
                onValueChange={(value) => updateTimeline('analysisYears', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="5">5 years</SelectItem>
                  <SelectItem value="7">7 years</SelectItem>
                  <SelectItem value="10">10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueInputs;