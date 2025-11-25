import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const RevenueInputs = ({ revenueData, setRevenueData }) => {
  const { getCurrencySymbol, formatCurrencyInput, convertInputToUSD } = useCurrency();
  const updatePricing = (field, value) => {
    const usdValue = field === 'membershipFee' ? convertInputToUSD(parseFloat(value) || 0) : parseFloat(value) || 0;
    setRevenueData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: usdValue
      }
    }));
  };
const updateUsage = (field, value) => {
  const num = value === "" ? null : parseFloat(value);

  setRevenueData(prev => {
    const usage = { ...prev.usage };

    // Save cleaned value
    usage[field] = num;

    // If input is empty → reset related fields
    if (num === null) {
      if (field === "dailySessionsLevel3") {
        usage.monthlySessionsLevel3 = null;
        usage.monthlyEnergyLevel3 = null;
      }

      if (field === "avgEnergyLevel3") {
        usage.monthlyEnergyLevel3 = null;
      }

      if (field === "monthlyEnergyLevel3") {
        usage.dailySessionsLevel3 = null;
        usage.monthlySessionsLevel3 = null;
      }

      return { ...prev, usage };
    }

    // ---------- AUTO SYNC START ---------- //

    // LEVEL 3 SESSIONS ↔ MONTHLY
    if (field === "dailySessionsLevel3") {
      usage.monthlySessionsLevel3 = Math.round(num * 30);
    }
    if (field === "monthlySessionsLevel3") {
      usage.dailySessionsLevel3 = Number((num / 30).toFixed(2));
    }

    // MONTHLY ENERGY → SESSIONS
    if (field === "monthlyEnergyLevel3") {
      const avg = usage.avgEnergyLevel3 || 0;

      if (avg > 0) {
        const dailyEnergy = num / 30;
        const dailySessions = dailyEnergy / avg;

        usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
        usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
      }
    }

    // DAILY SESSIONS + AVG ENERGY → MONTHLY ENERGY
    if (field === "dailySessionsLevel3" || field === "avgEnergyLevel3") {
      const daily = usage.dailySessionsLevel3 || 0;
      const avg = usage.avgEnergyLevel3 || 0;

      if (daily > 0 && avg > 0) {
        usage.monthlyEnergyLevel3 = Math.round(daily * avg * 30);
      }
    }

    // AVG ENERGY CHANGE → RECALC sessions
    if (field === "avgEnergyLevel3" && usage.monthlyEnergyLevel3 > 0) {
      const dailyEnergy = usage.monthlyEnergyLevel3 / 30;
      const dailySessions = dailyEnergy / num;

      usage.dailySessionsLevel3 = Number(dailySessions.toFixed(2));
      usage.monthlySessionsLevel3 = Math.round(dailySessions * 30);
    }

    // ---------- AUTO SYNC END ---------- //

    return { ...prev, usage };
  });
};

// const updateUsage = (field, value) => {
//   const num = parseFloat(value) ;

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
//     // AUTO: MONTHLY ENERGY → SESSIONS (if AVG exists)
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
//     // AUTO: DAILY SESSIONS + AVG ENERGY → MONTHLY ENERGY
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
//     // AUTO: IF AVG ENERGY CHANGED & MONTHLY ENERGY EXISTS
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

//     return { ...prev, usage };
//   });
// };



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
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="level2-rate">Level 2 Rate ({getCurrencySymbol()}/kWh)</Label>
              <Input
                id="level2-rate"
                type="number"
                step="0.01"
                placeholder="0.25"
                value={revenueData.pricing.level2Rate || ''}
                onChange={(e) => updatePricing('level2Rate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Typical range: {getCurrencySymbol()}0.20 - {getCurrencySymbol()}0.35</p>
            </div>
            <div>
              <Label htmlFor="level3-rate">Level 3 Rate ({getCurrencySymbol()}/kWh)</Label>
              <Input
                id="level3-rate"
                type="number"
                step="0.01"
                placeholder="0"
                value={revenueData.pricing.level3Rate || ''}
                onChange={(e) => updatePricing('level3Rate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Typical range: {getCurrencySymbol()}0.35 - {getCurrencySymbol()}0.60</p>
            </div>
            <div>
              <Label htmlFor="membership-fee">Monthly Membership Fee ({getCurrencySymbol()})</Label>
              <Input
                id="membership-fee"
                type="number"
                placeholder="0"
                value={formatCurrencyInput(revenueData.pricing.membershipFee || 0).toFixed(0)}
                onChange={(e) => updatePricing('membershipFee', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Optional subscription model</p>
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
          <div className="grid md:grid-cols-2 gap-6">
           {/* DAILY SESSIONS */}
<div>
  <Label>Daily Level 2 Sessions</Label>
  <Input
    type="number"
    placeholder="Enter Your Daily Level 2 Session"
     value={revenueData.usage.dailySessionsLevel2 ?? ""}
    onChange={(e) => updateUsage("dailySessionsLevel2", e.target.value)}
  />
</div>

<div>
  <Label>Daily Level 3 Sessions</Label>
  <Input
    type="number"
    placeholder="Enter Your Daily Level 3 Session"
   value={revenueData.usage.dailySessionsLevel3 ?? ""}
    onChange={(e) => updateUsage("dailySessionsLevel3", e.target.value)}
  />
</div>


{/* AVG ENERGY (SEPARATE FOR LEVEL 2 & 3) */}
<div>
  <Label>Avg Energy per Level 2 Session (kWh)</Label>
  <Input
    type="number"
    placeholder="Enter Your Avg Energy per Level 2 Session (kWh)"
    value={revenueData.usage.avgEnergyLevel2}
    onChange={(e) => updateUsage("avgEnergyLevel2", e.target.value)}
  />
</div>

<div>
  <Label>Avg Energy per Level 3 Session (kWh)</Label>
  <Input
    type="number"
    value={revenueData.usage.avgEnergyLevel3}
     placeholder="Enter Your Avg Energy per Level 3 Session (kWh)"
    onChange={(e) => updateUsage("avgEnergyLevel3", e.target.value)}
  />
</div>

          </div> 

<div className="grid md:grid-cols-2 gap-6">

  {/* Monthly Energy L2 */}
  <div>
    <Label htmlFor="monthly-energy-l2">Monthly Energy Consumed (kWh) - Level 2</Label>
    <Input
      id="monthly-energy-l2"
      type="number"
      step="0.1"
      placeholder="Total monthly L2 kWh consumed"
      value={revenueData.usage.monthlyEnergyLevel2 || ''}
      onChange={(e) => updateUsage('monthlyEnergyLevel2', e.target.value)}
      className="mt-1"
    />
  </div>

  {/* Monthly Energy L3 */}
  <div>
    <Label htmlFor="monthly-energy-l3">Monthly Energy Consumed (kWh) - Level 3</Label>
    <Input
      id="monthly-energy-l3"
      type="number"
      step="0.1"
      placeholder="Total monthly L3 kWh consumed"
      value={revenueData.usage.monthlyEnergyLevel3 || ''}
      onChange={(e) => updateUsage('monthlyEnergyLevel3', e.target.value)}
      className="mt-1"
    />
   
  </div>

</div>


          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>

             <Label htmlFor="session-duration">Avg Session Duration (hours)</Label>
              <Input
                id="session-duration"
                type="number"
                step="0.1"
                placeholder="2.0"
                value={revenueData.usage.avgSessionDuration || ''}
                onChange={(e) => updateUsage('avgSessionDuration', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
              <Input
                id="growth-rate"
                type="number"
                placeholder="0"
                value={revenueData.usage.growthRate || ''}
                onChange={(e) => updateUsage('growthRate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Expected yearly usage increase</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Timeline */}
      <Card className="border-2 hover:border-purple-200 transition-colors">
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