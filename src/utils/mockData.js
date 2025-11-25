// Mock data and calculations for the EV Charging Station ROI Calculator

// export const getMockCalculation = (costData, revenueData) => {
//   // Calculate total equipment costs
//   const level2Total = (costData.equipment.level2Chargers.quantity || 0) * (costData.equipment.level2Chargers.unitCost || 0);
//   const level3Total = (costData.equipment.level3Chargers.quantity || 0) * (costData.equipment.level3Chargers.unitCost || 0);
  
//   const totalEquipmentCost = level2Total + level3Total + 
//     (costData.equipment.transformer || 0) + 
//     (costData.equipment.electricalInfrastructure || 0) + 
//     (costData.equipment.networkingSoftware || 0);

//   // Calculate total installation costs
//   const totalInstallationCost = (costData.installation.sitePreperation || 0) +
//     (costData.installation.electricalInstallation || 0) +
//     (costData.installation.permits || 0) +
//     (costData.installation.laborCosts || 0);

//   // Calculate total investment
//   const totalInvestment = totalEquipmentCost + totalInstallationCost;

//   // Calculate annual operating costs
//   const annualOperatingCosts = (costData.operating.maintenance || 0) +
//     (costData.operating.networkFees || 0) +
//     (costData.operating.insurance || 0) +
//     (costData.operating.landLease || 0);

//   // Calculate annual revenue
//   const dailyLevel2Revenue = (revenueData.usage.dailySessionsLevel2 || 0) * 
//     (revenueData.usage.avgEnergyPerSession || 0) * (revenueData.pricing.level2Rate || 0);
  
//   const dailyLevel3Revenue = (revenueData.usage.dailySessionsLevel3 || 0) * 
//     (revenueData.usage.avgEnergyPerSession || 0) * (revenueData.pricing.level3Rate || 0);

//   const annualChargingRevenue = (dailyLevel2Revenue + dailyLevel3Revenue) * 365;
//   const annualMembershipRevenue = (revenueData.pricing.membershipFee || 0) * 12 * 
//     ((revenueData.usage.dailySessionsLevel2 || 0) + (revenueData.usage.dailySessionsLevel3 || 0)) * 30; // Rough estimate

//   const baseAnnualRevenue = annualChargingRevenue + annualMembershipRevenue;

//   // Calculate electricity costs
//   const dailyElectricity = ((revenueData.usage.dailySessionsLevel2 || 0) + (revenueData.usage.dailySessionsLevel3 || 0)) * 
//     (revenueData.usage.avgEnergyPerSession || 0) * (costData.operating.electricityCostPerKwh || 0);
//   const annualElectricityCost = dailyElectricity * 365;

//   // Calculate net annual profit for year 1
//   const baseAnnualProfit = baseAnnualRevenue - annualOperatingCosts - annualElectricityCost;

//   // Calculate 5-year projections with growth
//   let totalProfit = 0;
//   let yearlyProfits = [];
//   const growthRate = (revenueData.usage.growthRate || 0) / 100;

//   for (let year = 1; year <= (revenueData.timeline.analysisYears || 5); year++) {
//     const yearRevenue = baseAnnualRevenue * Math.pow(1 + growthRate, year - 1);
//     const yearElectricityCost = annualElectricityCost * Math.pow(1 + growthRate, year - 1);
//     const yearProfit = yearRevenue - annualOperatingCosts - yearElectricityCost;
//     totalProfit += yearProfit;
//     yearlyProfits.push({
//       year,
//       revenue: Math.round(yearRevenue),
//       costs: Math.round(annualOperatingCosts + yearElectricityCost),
//       profit: Math.round(yearProfit)
//     });
//   }

//   // Calculate ROI and payback period
//   const roi = totalInvestment > 0 ? Math.round((totalProfit / totalInvestment) * 100) : 0;
//   const paybackPeriod = baseAnnualProfit > 0 ? Math.round((totalInvestment / baseAnnualProfit) * 10) / 10 : 0;

//   // Monthly breakdown for first year
//   const monthlyRevenue = Math.round(baseAnnualRevenue / 12);
//   const monthlyCosts = Math.round((annualOperatingCosts + annualElectricityCost) / 12);
//   const monthlyProfit = Math.round(baseAnnualProfit / 12);

//   const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
//     month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
//     revenue: monthlyRevenue,
//     costs: monthlyCosts,
//     profit: monthlyProfit
//   }));

//   return {
//     totalInvestment: Math.round(totalInvestment),
//     roi,
//     paybackPeriod,
//     fiveYearProfit: Math.round(totalProfit),
//     annualRevenue: Math.round(baseAnnualRevenue),
//     annualCosts: Math.round(annualOperatingCosts + annualElectricityCost),
//     annualProfit: Math.round(baseAnnualProfit),
//     yearlyProfits,
//     monthlyBreakdown,
//     costBreakdown: {
//       equipment: Math.round(totalEquipmentCost),
//       installation: Math.round(totalInstallationCost),
//       operatingAnnual: Math.round(annualOperatingCosts),
//       electricityAnnual: Math.round(annualElectricityCost)
//     }
//   };
// };


export const getMockCalculation = (costData, revenueData) => {
  // ---------------------------
  // EQUIPMENT COSTS
  // ---------------------------
  const level2Total =
    (costData.equipment.level2Chargers.quantity || 0) *
    (costData.equipment.level2Chargers.unitCost || 0);

  const level3Total =
    (costData.equipment.level3Chargers.quantity || 0) *
    (costData.equipment.level3Chargers.unitCost || 0);

  const totalEquipmentCost =
    level2Total +
    level3Total +
    (costData.equipment.transformer || 0) +
    (costData.equipment.electricalInfrastructure || 0) +
    (costData.equipment.networkingSoftware || 0);

  // ---------------------------
  // INSTALLATION COSTS
  // ---------------------------
  const totalInstallationCost =
    (costData.installation.sitePreperation || 0) +
    (costData.installation.electricalInstallation || 0) +
    (costData.installation.permits || 0) +
    (costData.installation.laborCosts || 0);

  const totalInvestment = totalEquipmentCost + totalInstallationCost;

  // ---------------------------
  // OPERATING COSTS
  // ---------------------------
  const annualOperatingCosts =
    (costData.operating.maintenance || 0) +
    (costData.operating.networkFees || 0) +
    (costData.operating.insurance || 0) +
    (costData.operating.landLease || 0);

  // ---------------------------
  // USAGE & ENERGY CALCULATIONS (FIXED)
  // ---------------------------
  let dailyL2 = revenueData.usage.dailySessionsLevel2 || 0;
  let dailyL3 = revenueData.usage.dailySessionsLevel3 || 0;

  const monthlyInputL2 = revenueData.usage.monthlySessionsLevel2 || 0;
  const monthlyInputL3 = revenueData.usage.monthlySessionsLevel3 || 0;

  // 👉 If only monthly sessions provided, auto-calc daily = monthly / 30
  if (dailyL2 === 0 && monthlyInputL2 > 0) {
    dailyL2 = monthlyInputL2 / 30;
  }
  if (dailyL3 === 0 && monthlyInputL3 > 0) {
    dailyL3 = monthlyInputL3 / 30;
  }

  // monthly fallback
  const monthlyL2 = monthlyInputL2 || dailyL2 * 30;
  const monthlyL3 = monthlyInputL3 || dailyL3 * 30;

  // Avg Energy Per Session
  const energyL2 = revenueData.usage.avgEnergyLevel2 || 0;
  const energyL3 = revenueData.usage.avgEnergyLevel3 || 0;

  // Daily kWh
  const level2DailyEnergy = dailyL2 * energyL2;
  const level3DailyEnergy = dailyL3 * energyL3;

  // Monthly kWh
  const level2MonthlyEnergy = level2DailyEnergy * 30;
  const level3MonthlyEnergy = level3DailyEnergy * 30;

  // ---------------------------
  // REVENUE CALCULATIONS
  // ---------------------------
  const dailyLevel2Revenue =
    level2DailyEnergy * (revenueData.pricing.level2Rate || 0);

  const dailyLevel3Revenue =
    level3DailyEnergy * (revenueData.pricing.level3Rate || 0);

  const annualChargingRevenue =
    (dailyLevel2Revenue + dailyLevel3Revenue) * 365;

  const annualMembershipRevenue =
    (revenueData.pricing.membershipFee || 0) *
    12 *
    (dailyL2 + dailyL3) *
    30;

  const baseAnnualRevenue =
    annualChargingRevenue + annualMembershipRevenue;

  // ---------------------------
  // ELECTRICITY COST
  // ---------------------------
  const dailyElectricityCost =
    (level2DailyEnergy + level3DailyEnergy) *
    (costData.operating.electricityCostPerKwh || 0);

  const annualElectricityCost = dailyElectricityCost * 365;

  // ---------------------------
  // PROFIT
  // ---------------------------
  const baseAnnualProfit =
    baseAnnualRevenue - annualOperatingCosts - annualElectricityCost;

  let totalProfit = 0;
  let yearlyProfits = [];
  const growthRate = (revenueData.usage.growthRate || 0) / 100;

  for (let year = 1; year <= (revenueData.timeline.analysisYears || 5); year++) {
    const yearRevenue =
      baseAnnualRevenue * Math.pow(1 + growthRate, year - 1);

    const yearElectricityCost =
      annualElectricityCost * Math.pow(1 + growthRate, year - 1);

    const yearProfit =
      yearRevenue - annualOperatingCosts - yearElectricityCost;

    totalProfit += yearProfit;

    yearlyProfits.push({
      year,
      revenue: Math.round(yearRevenue),
      costs: Math.round(annualOperatingCosts + yearElectricityCost),
      profit: Math.round(yearProfit),
    });
  }

  const roi =
    totalInvestment > 0
      ? Math.round((totalProfit / totalInvestment) * 100)
      : 0;

  const paybackPeriod =
    baseAnnualProfit > 0
      ? Math.round((totalInvestment / baseAnnualProfit) * 10) / 10
      : 0;

  // ---------------------------
  // MONTHLY BREAKDOWN
  // ---------------------------
  const monthlyRevenue = Math.round(baseAnnualRevenue / 12);
  const monthlyCosts = Math.round(
    (annualOperatingCosts + annualElectricityCost) / 12
  );
  const monthlyProfit = Math.round(baseAnnualProfit / 12);

  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString("default", { month: "short" }),
    revenue: monthlyRevenue,
    costs: monthlyCosts,
    profit: monthlyProfit,
  }));

  // ---------------------------
  // RETURN FINAL OUTPUT
  // ---------------------------
  return {
    totalInvestment: Math.round(totalInvestment),
    roi,
    paybackPeriod,
    fiveYearProfit: Math.round(totalProfit),

    // NEW VALUES
    level2DailyEnergy,
    level3DailyEnergy,
    level2MonthlyEnergy,
    level3MonthlyEnergy,

    annualRevenue: Math.round(baseAnnualRevenue),
    annualCosts: Math.round(annualOperatingCosts + annualElectricityCost),
    annualProfit: Math.round(baseAnnualProfit),

    yearlyProfits,
    monthlyBreakdown,

    costBreakdown: {
      equipment: Math.round(totalEquipmentCost),
      installation: Math.round(totalInstallationCost),
      operatingAnnual: Math.round(annualOperatingCosts),
      electricityAnnual: Math.round(annualElectricityCost),
    },
  };
};

