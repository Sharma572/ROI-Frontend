
// export const getMockCalculation = (costData, revenueData) => {
//   console.log("Cost Data In Function",costData);
  
//   // -----------------------------------
//   // CHARGER COUNTS
//   // -----------------------------------
//   const countL2 = costData?.equipment?.level2Chargers?.quantity || 0;
//   const countL3 = costData?.equipment?.level3Chargers?.quantity || 0;

//   // -----------------------------------
//   // EQUIPMENT COSTS
//   // -----------------------------------
//   const level2Total =
//     countL2 * (costData?.equipment?.level2Chargers?.unitCost || 0);

//   const level3Total =
//     countL3 * (costData?.equipment?.level3Chargers?.unitCost || 0);

//   const totalEquipmentCost =
//     level2Total +
//     level3Total +
//     (costData?.equipment?.transformer || 0) +
//     (costData?.equipment?.electricalInfrastructure || 0) +
//     (costData?.equipment?.networkingSoftware || 0);

//   // -----------------------------------
//   // INSTALLATION COSTS
//   // -----------------------------------
//   const totalInstallationCost =
//     (costData?.installation?.sitePreperation || 0) +
//     (costData?.installation?.electricalInstallation || 0) +
//     (costData?.installation?.permits || 0) +
//     (costData?.installation?.laborCosts || 0);

//   const totalInvestment = totalEquipmentCost + totalInstallationCost;

//   // -----------------------------------
//   // FIXED OPERATING COSTS
//   // -----------------------------------
//   const annualOperatingCosts =
//     (costData?.operating?.maintenance || 0) +
//     (costData?.operating?.networkFees || 0) +
//     (costData?.operating?.insurance || 0) +
//     (costData?.operating?.landLease || 0);

//   // -----------------------------------
//   // USAGE (Per Charger)
//   // -----------------------------------
//   let dailyL2 = revenueData?.usage?.dailySessionsLevel2 || 0;
//   let dailyL3 = revenueData?.usage?.dailySessionsLevel3 || 0;

//   const monthlyInputL2 = revenueData?.usage?.monthlySessionsLevel2 || 0;
//   const monthlyInputL3 = revenueData?.usage?.monthlySessionsLevel3 || 0;

//   // auto: monthly → daily
//   if (dailyL2 === 0 && monthlyInputL2 > 0) dailyL2 = monthlyInputL2 / 30;
//   if (dailyL3 === 0 && monthlyInputL3 > 0) dailyL3 = monthlyInputL3 / 30;

//   const totalDailySessionsL2 = dailyL2 * countL2;
//   const totalDailySessionsL3 = dailyL3 * countL3;

//   const totalMonthlySessionsL2 =
//     monthlyInputL2 > 0
//       ? monthlyInputL2 * countL2
//       : totalDailySessionsL2 * 30;

//   const totalMonthlySessionsL3 =
//     monthlyInputL3 > 0
//       ? monthlyInputL3 * countL3
//       : totalDailySessionsL3 * 30;

//   // -----------------------------------
//   // ENERGY (Per Charger → Total)
//   // -----------------------------------
//   const avgEnergyL2 = revenueData?.usage?.avgEnergyLevel2 || 0;
//   const avgEnergyL3 = revenueData?.usage?.avgEnergyLevel3 || 0;

//   const perChargerMonthlyEnergyL2 =
//     revenueData?.usage?.monthlyEnergyLevel2 || 0;
//   const perChargerMonthlyEnergyL3 =
//     revenueData?.usage?.monthlyEnergyLevel3 || 0;

//   const level2MonthlyEnergy =
//     perChargerMonthlyEnergyL2 > 0
//       ? perChargerMonthlyEnergyL2 * countL2
//       : totalMonthlySessionsL2 * avgEnergyL2;

//   const level3MonthlyEnergy =
//     perChargerMonthlyEnergyL3 > 0
//       ? perChargerMonthlyEnergyL3 * countL3
//       : totalMonthlySessionsL3 * avgEnergyL3;

//   const totalMonthlyEnergy = level2MonthlyEnergy + level3MonthlyEnergy;

//   // -----------------------------------
//   // REVENUE (UPDATED - Reads from costData.operating)
//   // -----------------------------------

//   // Customer charging revenue calculation
//   const baseMonthlyChargingRevenue =
//     level2MonthlyEnergy * (revenueData?.pricing?.level2Rate || 0) +
//     level3MonthlyEnergy * (revenueData?.pricing?.level3Rate || 0);

//   const revenueType = costData?.operating?.revenueType || "percentage";
//   let monthlyChargingRevenue = 0;

//   // CASE 1 → Revenue Share Percentage
//   if (revenueType === "percentage") {
//     const percent = costData?.operating?.revenuePercentage || 0;
//     monthlyChargingRevenue = (baseMonthlyChargingRevenue * percent) / 100;
//   }

//   // CASE 2 → Revenue Per kWh
//   if (revenueType === "perKwh") {
//     const perKwh = costData?.operating?.revenuePerKwh || 0;
//     monthlyChargingRevenue = totalMonthlyEnergy * perKwh;
//   }

//   const annualChargingRevenue = monthlyChargingRevenue * 12;

//   // Membership revenue
//   const monthlyMembershipRevenue =
//     (revenueData?.pricing?.membershipFee || 0) *
//     (totalDailySessionsL2 + totalDailySessionsL3) *
//     30;

//   const annualMembershipRevenue = monthlyMembershipRevenue * 12;

//   const baseAnnualRevenue =
//     annualChargingRevenue + annualMembershipRevenue;

//   // -----------------------------------
//   // ELECTRICITY COST
//   // -----------------------------------
//   const monthlyElectricityCost =
//     totalMonthlyEnergy *
//     (costData?.operating?.electricityCostPerKwh || 0);

//   const annualElectricityCost = monthlyElectricityCost * 12;

//   // -----------------------------------
//   // PROFIT
//   // -----------------------------------
//   const baseAnnualProfit =
//     baseAnnualRevenue -
//     annualOperatingCosts -
//     annualElectricityCost;

//   // -----------------------------------
//   // 5-YEAR PROJECTIONS
//   // -----------------------------------
//   let totalProfit = 0;
//   let yearlyProfits = [];

//   const growthRate = (revenueData?.usage?.growthRate || 0) / 100;
//   const analysisYears = revenueData?.timeline?.analysisYears || 5;

//   for (let year = 1; year <= analysisYears; year++) {
//     const yearRevenue =
//       baseAnnualRevenue * Math.pow(1 + growthRate, year - 1);

//     const yearElectricity =
//       annualElectricityCost * Math.pow(1 + growthRate, year - 1);

//     const yearProfit =
//       yearRevenue - annualOperatingCosts - yearElectricity;

//     yearlyProfits.push({
//       year,
//       revenue: yearRevenue,
//       costs: annualOperatingCosts + yearElectricity,
//       profit: yearProfit,
//     });

//     totalProfit += yearProfit;
//   }

//   // -----------------------------------
//   // ROI + PAYBACK
//   // -----------------------------------
//   const roi =
//     totalInvestment > 0
//       ? (totalProfit / totalInvestment) * 100
//       : 0;

//   const paybackPeriod =
//     baseAnnualProfit > 0
//       ? totalInvestment / baseAnnualProfit
//       : 0;

//   // -----------------------------------
//   // MONTHLY BREAKDOWN
//   // -----------------------------------
//   const monthlyRevenue = baseAnnualRevenue / 12;
//   const monthlyCosts =
//     (annualOperatingCosts + annualElectricityCost) / 12;
//   const monthlyProfit = baseAnnualProfit / 12;

//   const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
//     month: new Date(2024, i).toLocaleString("default", {
//       month: "short",
//     }),
//     revenue: monthlyRevenue,
//     costs: monthlyCosts,
//     profit: monthlyProfit,
//   }));

//   // -----------------------------------
//   // FINAL OUTPUT
//   // -----------------------------------
//   return {
//     totalInvestment,
//     roi,
//     paybackPeriod,
//     fiveYearProfit: totalProfit,

//     level2MonthlyEnergy,
//     level3MonthlyEnergy,

//     annualRevenue: baseAnnualRevenue,
//     annualCosts: annualOperatingCosts + annualElectricityCost,
//     annualProfit: baseAnnualProfit,

//     yearlyProfits,
//     monthlyBreakdown,

//     costBreakdown: {
//       equipment: totalEquipmentCost,
//       installation: totalInstallationCost,
//       operatingAnnual: annualOperatingCosts,
//       electricityAnnual: annualElectricityCost,
//     },

//     costData,
//     revenueData,
//   };
// };

export const getMockCalculation = (costData, revenueData) => {
  console.log("Cost Data In Function", costData);

  // -----------------------------------
  // CHARGER COUNTS
  // -----------------------------------
  const countL2 = costData?.equipment?.level2Chargers?.quantity || 0;
  const countL3 = costData?.equipment?.level3Chargers?.quantity || 0;

  // -----------------------------------
  // EQUIPMENT COSTS
  // -----------------------------------
  const level2Total = countL2 * (costData?.equipment?.level2Chargers?.unitCost || 0);
  const level3Total = countL3 * (costData?.equipment?.level3Chargers?.unitCost || 0);

  const totalEquipmentCost =
    level2Total +
    level3Total +
    (costData?.equipment?.transformer || 0) +
    (costData?.equipment?.electricalInfrastructure || 0) +
    (costData?.equipment?.networkingSoftware || 0);

  // -----------------------------------
  // INSTALLATION COSTS
  // -----------------------------------
  const totalInstallationCost =
    (costData?.installation?.sitePreperation || 0) +
    (costData?.installation?.electricalInstallation || 0) +
    (costData?.installation?.permits || 0) +
    (costData?.installation?.laborCosts || 0);

  const totalInvestment = totalEquipmentCost + totalInstallationCost;

  // -----------------------------------
  // FIXED OPERATING COSTS
  // -----------------------------------
  const annualFixedOperatingCosts =
    (costData?.operating?.maintenance || 0) +
    (costData?.operating?.networkFees || 0) +
    (costData?.operating?.insurance || 0) +
    (costData?.operating?.landLease || 0);

  // -----------------------------------
  // USAGE
  // -----------------------------------
  let dailyL2 = revenueData?.usage?.dailySessionsLevel2 || 0;
  let dailyL3 = revenueData?.usage?.dailySessionsLevel3 || 0;

  const monthlyInputL2 = revenueData?.usage?.monthlySessionsLevel2 || 0;
  const monthlyInputL3 = revenueData?.usage?.monthlySessionsLevel3 || 0;

  if (dailyL2 === 0 && monthlyInputL2 > 0) dailyL2 = monthlyInputL2 / 30;
  if (dailyL3 === 0 && monthlyInputL3 > 0) dailyL3 = monthlyInputL3 / 30;

  const totalMonthlySessionsL2 =
    monthlyInputL2 > 0 ? monthlyInputL2 * countL2 : dailyL2 * countL2 * 30;

  const totalMonthlySessionsL3 =
    monthlyInputL3 > 0 ? monthlyInputL3 * countL3 : dailyL3 * countL3 * 30;

  // -----------------------------------
  // ENERGY
  // -----------------------------------
  const avgEnergyL2 = revenueData?.usage?.avgEnergyLevel2 || 0;
  const avgEnergyL3 = revenueData?.usage?.avgEnergyLevel3 || 0;

  const monthlyEnergyL2 =
    (revenueData?.usage?.monthlyEnergyLevel2 || 0) > 0
      ? revenueData?.usage?.monthlyEnergyLevel2 * countL2
      : totalMonthlySessionsL2 * avgEnergyL2;

  const monthlyEnergyL3 =
    (revenueData?.usage?.monthlyEnergyLevel3 || 0) > 0
      ? revenueData?.usage?.monthlyEnergyLevel3 * countL3
      : totalMonthlySessionsL3 * avgEnergyL3;

  const totalMonthlyEnergy = monthlyEnergyL2 + monthlyEnergyL3;

  // -----------------------------------
  // REVENUE (SIR LOGIC)
  // -----------------------------------

  // Full customer revenue → goes to operator
  const customerMonthlyRevenue =
    monthlyEnergyL2 * (revenueData?.pricing?.level2Rate || 0) +
    monthlyEnergyL3 * (revenueData?.pricing?.level3Rate || 0);

  const customerAnnualRevenue = customerMonthlyRevenue * 12;

  // Revenue share paid to site owner
  let siteOwnerShareMonthly = 0;
  const revenueType = costData?.operating?.revenueType || "percentage";

  if (revenueType === "percentage") {
    const percent = costData?.operating?.revenuePercentage || 0;
    siteOwnerShareMonthly = (customerMonthlyRevenue * percent) / 100;
  } else if (revenueType === "perKwh") {
    const perKwh = costData?.operating?.revenuePerKwh || 0;
    siteOwnerShareMonthly = totalMonthlyEnergy * perKwh;
  }

  const siteOwnerShareAnnual = siteOwnerShareMonthly * 12;

  // Electricity cost to operator
  const electricityMonthlyCost =
    totalMonthlyEnergy * (costData?.operating?.electricityCostPerKwh || 0);

  const electricityAnnualCost = electricityMonthlyCost * 12;

  // Total operator costs
  const operatorAnnualCosts =
    annualFixedOperatingCosts + electricityAnnualCost + siteOwnerShareAnnual;

  // Operator annual profit
  const operatorAnnualProfit = customerAnnualRevenue - operatorAnnualCosts;

  // -----------------------------------
  // 5-YEAR PROJECTIONS
  // -----------------------------------
  let yearlyProfits = [];
  let totalProfit = 0;

  const growthRate = (revenueData?.usage?.growthRate || 0) / 100;
  const years = revenueData?.timeline?.analysisYears || 5;

  for (let year = 1; year <= years; year++) {
    const yearRevenue = customerAnnualRevenue * Math.pow(1 + growthRate, year - 1);
    const yearElectricity = electricityAnnualCost * Math.pow(1 + growthRate, year - 1);

    const yearCost = annualFixedOperatingCosts + siteOwnerShareAnnual + yearElectricity;
    const yearProfit = yearRevenue - yearCost;

    yearlyProfits.push({
      year,
      revenue: yearRevenue,
      costs: yearCost,
      profit: yearProfit,
    });

    totalProfit += yearProfit;
  }

  // -----------------------------------
  // ROI + PAYBACK
  // -----------------------------------
  const roi = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  const paybackPeriod =
    operatorAnnualProfit > 0 ? totalInvestment / operatorAnnualProfit : 0;

  // -----------------------------------
  // FINAL OUTPUT
  // -----------------------------------
  return {
    totalInvestment,
    roi,
    paybackPeriod,
    fiveYearProfit: totalProfit,

    annualRevenue: customerAnnualRevenue,
    annualCosts: operatorAnnualCosts,
    annualProfit: operatorAnnualProfit,

    yearlyProfits,

    costBreakdown: {
      equipment: totalEquipmentCost,
      installation: totalInstallationCost,
      operatingAnnual: annualFixedOperatingCosts,
      electricityAnnual: electricityAnnualCost,
      siteOwnerShareAnnual,
    },

    costData,
    revenueData,
  };
};


