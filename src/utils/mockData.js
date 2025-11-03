// Mock data and calculations for the EV Charging Station ROI Calculator

export const getMockCalculation = (costData, revenueData) => {
  // Calculate total equipment costs
  const level2Total = (costData.equipment.level2Chargers.quantity || 0) * (costData.equipment.level2Chargers.unitCost || 0);
  const level3Total = (costData.equipment.level3Chargers.quantity || 0) * (costData.equipment.level3Chargers.unitCost || 0);
  
  const totalEquipmentCost = level2Total + level3Total + 
    (costData.equipment.transformer || 0) + 
    (costData.equipment.electricalInfrastructure || 0) + 
    (costData.equipment.networkingSoftware || 0);

  // Calculate total installation costs
  const totalInstallationCost = (costData.installation.sitePreperation || 0) +
    (costData.installation.electricalInstallation || 0) +
    (costData.installation.permits || 0) +
    (costData.installation.laborCosts || 0);

  // Calculate total investment
  const totalInvestment = totalEquipmentCost + totalInstallationCost;

  // Calculate annual operating costs
  const annualOperatingCosts = (costData.operating.maintenance || 0) +
    (costData.operating.networkFees || 0) +
    (costData.operating.insurance || 0) +
    (costData.operating.landLease || 0);

  // Calculate annual revenue
  const dailyLevel2Revenue = (revenueData.usage.dailySessionsLevel2 || 0) * 
    (revenueData.usage.avgEnergyPerSession || 0) * (revenueData.pricing.level2Rate || 0);
  
  const dailyLevel3Revenue = (revenueData.usage.dailySessionsLevel3 || 0) * 
    (revenueData.usage.avgEnergyPerSession || 0) * (revenueData.pricing.level3Rate || 0);

  const annualChargingRevenue = (dailyLevel2Revenue + dailyLevel3Revenue) * 365;
  const annualMembershipRevenue = (revenueData.pricing.membershipFee || 0) * 12 * 
    ((revenueData.usage.dailySessionsLevel2 || 0) + (revenueData.usage.dailySessionsLevel3 || 0)) * 30; // Rough estimate

  const baseAnnualRevenue = annualChargingRevenue + annualMembershipRevenue;

  // Calculate electricity costs
  const dailyElectricity = ((revenueData.usage.dailySessionsLevel2 || 0) + (revenueData.usage.dailySessionsLevel3 || 0)) * 
    (revenueData.usage.avgEnergyPerSession || 0) * (costData.operating.electricityCostPerKwh || 0);
  const annualElectricityCost = dailyElectricity * 365;

  // Calculate net annual profit for year 1
  const baseAnnualProfit = baseAnnualRevenue - annualOperatingCosts - annualElectricityCost;

  // Calculate 5-year projections with growth
  let totalProfit = 0;
  let yearlyProfits = [];
  const growthRate = (revenueData.usage.growthRate || 0) / 100;

  for (let year = 1; year <= (revenueData.timeline.analysisYears || 5); year++) {
    const yearRevenue = baseAnnualRevenue * Math.pow(1 + growthRate, year - 1);
    const yearElectricityCost = annualElectricityCost * Math.pow(1 + growthRate, year - 1);
    const yearProfit = yearRevenue - annualOperatingCosts - yearElectricityCost;
    totalProfit += yearProfit;
    yearlyProfits.push({
      year,
      revenue: Math.round(yearRevenue),
      costs: Math.round(annualOperatingCosts + yearElectricityCost),
      profit: Math.round(yearProfit)
    });
  }

  // Calculate ROI and payback period
  const roi = totalInvestment > 0 ? Math.round((totalProfit / totalInvestment) * 100) : 0;
  const paybackPeriod = baseAnnualProfit > 0 ? Math.round((totalInvestment / baseAnnualProfit) * 10) / 10 : 0;

  // Monthly breakdown for first year
  const monthlyRevenue = Math.round(baseAnnualRevenue / 12);
  const monthlyCosts = Math.round((annualOperatingCosts + annualElectricityCost) / 12);
  const monthlyProfit = Math.round(baseAnnualProfit / 12);

  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
    revenue: monthlyRevenue,
    costs: monthlyCosts,
    profit: monthlyProfit
  }));

  return {
    totalInvestment: Math.round(totalInvestment),
    roi,
    paybackPeriod,
    fiveYearProfit: Math.round(totalProfit),
    annualRevenue: Math.round(baseAnnualRevenue),
    annualCosts: Math.round(annualOperatingCosts + annualElectricityCost),
    annualProfit: Math.round(baseAnnualProfit),
    yearlyProfits,
    monthlyBreakdown,
    costBreakdown: {
      equipment: Math.round(totalEquipmentCost),
      installation: Math.round(totalInstallationCost),
      operatingAnnual: Math.round(annualOperatingCosts),
      electricityAnnual: Math.round(annualElectricityCost)
    }
  };
};

//   console.log('=== CALCULATION DEBUG START ===');
  
//   // 1. Calculate Total Investment
//   const level2Total = (costData.equipment.level2Chargers.quantity || 0) * (costData.equipment.level2Chargers.unitCost || 0);
//   const level3Total = (costData.equipment.level3Chargers.quantity || 0) * (costData.equipment.level3Chargers.unitCost || 0);
  
//   const totalEquipmentCost = level2Total + level3Total + 
//     (costData.equipment.transformer || 0) + 
//     (costData.equipment.electricalInfrastructure || 0) + 
//     (costData.equipment.networkingSoftware || 0);

//   const totalInstallationCost = (costData.installation.sitePreperation || 0) +
//     (costData.installation.electricalInstallation || 0) +
//     (costData.installation.permits || 0) +
//     (costData.installation.laborCosts || 0);

//   const totalInvestment = totalEquipmentCost + totalInstallationCost;

//   console.log('Investment:', { totalEquipmentCost, totalInstallationCost, totalInvestment });

//   // 2. Calculate Revenue (FIXED)
//   const level2DailyKWh = (revenueData.usage.dailySessionsLevel2 || 0) * (revenueData.usage.avgEnergyPerSession || 0);
//   const level3DailyKWh = (revenueData.usage.dailySessionsLevel3 || 0) * (revenueData.usage.avgEnergyPerSession || 0);
  
//   const dailyLevel2Revenue = level2DailyKWh * (revenueData.pricing.level2Rate || 0);
//   const dailyLevel3Revenue = level3DailyKWh * (revenueData.pricing.level3Rate || 0);
  
//   const totalDailyRevenue = dailyLevel2Revenue + dailyLevel3Revenue;
//   const annualChargingRevenue = totalDailyRevenue * 365;
//   const annualMembershipRevenue = (revenueData.pricing.membershipFee || 0) * 12; // Fixed
  
//   const baseAnnualRevenue = annualChargingRevenue + annualMembershipRevenue;

//   console.log('Revenue:', { 
//     level2DailyKWh, level3DailyKWh, 
//     dailyLevel2Revenue, dailyLevel3Revenue,
//     annualChargingRevenue, baseAnnualRevenue 
//   });

//   // 3. Calculate Operating Costs (FIXED)
//   const totalDailyKWh = level2DailyKWh + level3DailyKWh;
//   const dailyElectricityCost = totalDailyKWh * (costData.operating.electricityCostPerKwh || 0);
//   const annualElectricityCost = dailyElectricityCost * 365;
  
//   const fixedOperatingCosts = (costData.operating.maintenance || 0) +
//     (costData.operating.networkFees || 0) +
//     (costData.operating.insurance || 0) +
//     (costData.operating.landLease || 0);

//   const totalAnnualOperatingCost = fixedOperatingCosts + annualElectricityCost;

//   console.log('Costs:', {
//     totalDailyKWh, dailyElectricityCost, annualElectricityCost,
//     fixedOperatingCosts, totalAnnualOperatingCost
//   });

//   // 4. Calculate Annual Profit
//   const baseAnnualProfit = baseAnnualRevenue - totalAnnualOperatingCost;
//   console.log('Annual Profit:', baseAnnualProfit);

//   // 5. Calculate Multi-Year Projections (FIXED)
//   let yearlyProfits = [];
//   const growthRate = (revenueData.usage.growthRate || 0) / 100;
//   const analysisYears = revenueData.timeline.analysisYears || 5;

//   for (let year = 1; year <= analysisYears; year++) {
//     const growthFactor = Math.pow(1 + growthRate, year - 1);
//     const yearRevenue = baseAnnualRevenue * growthFactor;
//     const yearElectricityCost = annualElectricityCost * growthFactor; // Electricity costs grow with usage
//     const yearOperatingCost = fixedOperatingCosts + yearElectricityCost;
//     const yearProfit = yearRevenue - yearOperatingCost;
    
//     yearlyProfits.push({
//       year,
//       revenue: Math.round(yearRevenue),
//       costs: Math.round(yearOperatingCost),
//       profit: Math.round(yearProfit)
//     });
//   }

//   // 6. Calculate Total Profit and ROI (FIXED)
//   const totalCumulativeProfit = yearlyProfits.reduce((sum, year) => sum + year.profit, 0);
//   const totalNetProfit = totalCumulativeProfit - totalInvestment; // SUBTRACT INVESTMENT!
  
//   const roi = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;
//   const paybackPeriod = baseAnnualProfit > 0 ? totalInvestment / baseAnnualProfit : 0;

//   console.log('Final Results:', {
//     totalCumulativeProfit,
//     totalNetProfit,
//     roi,
//     paybackPeriod,
//     yearlyProfits
//   });

//   console.log('=== CALCULATION DEBUG END ===');

//   return {
//     totalInvestment: Math.round(totalInvestment),
//     roi: Math.round(roi * 100) / 100, // 2 decimal places
//     paybackPeriod: Math.round(paybackPeriod * 10) / 10, // 1 decimal place
//     fiveYearProfit: Math.round(totalNetProfit),
//     annualRevenue: Math.round(baseAnnualRevenue),
//     annualCosts: Math.round(totalAnnualOperatingCost),
//     annualProfit: Math.round(baseAnnualProfit),
//     yearlyProfits,
//     monthlyBreakdown: [], // You can keep your existing monthly logic
//     costBreakdown: {
//       equipment: Math.round(totalEquipmentCost),
//       installation: Math.round(totalInstallationCost),
//       operatingAnnual: Math.round(fixedOperatingCosts),
//       electricityAnnual: Math.round(annualElectricityCost)
//     }
//   };
// };