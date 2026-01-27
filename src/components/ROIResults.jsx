import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Download,
  AlertCircle,
  LockKeyholeOpen,
  Lock,
  EyeIcon,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useCurrency } from "../contexts/CurrencyContext";
import { useAuth0 } from "@auth0/auth0-react";
import { pdf } from "@react-pdf/renderer";
import { RoiPdfDocument } from "../pdf/RoiPdfDocument";
import { useUser } from "@/contexts/userContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ROIResults = ({ results }) => {
  const { userState,setUserState } = useUser();
  const { user } = useAuth0();
 
  console.log("userState in result",userState);
  // Subscription State ✌️✌️✌️
  // const isUserSubscribed = userState?.profile?.isSubscribed;
  const userCredit = userState?.profile?.credit ?? 0;
  const plan = userState?.profile?.subscriptionPlan;
const permissions = userState?.permissions ?? {
  canViewFullReport: false,
  downloadCost: 2,
};
const DOWNLOAD_COST = 3;
const canViewReport =
  permissions?.canViewFullReport === true;
const hasDownloadCredit =
  userState?.profile?.credit >= permissions.downloadCost;

  const { getCurrencySymbol, formatCurrency } = useCurrency();
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();
const [openCalculationModal, setOpenCalculationModal] = useState(false);

useEffect(() => {
  const session = sessionStorage.getItem("roi_session");
  console.log("Session Data",session);
  
  if (!session) return;

  const parsed = JSON.parse(session);
  console.log("parsed Data unlocked",parsed);
  
  if (parsed.unlocked === true) {
    setUnlocked(true);
  }
}, []);
 
  const pdfRef = useRef();
  if (!results) {
    return (
      <Card className="border-2 border-dashed border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            No Results Yet
          </h3>
          <p className="text-slate-500 text-center max-w-md">
            Fill in the cost and revenue information in the previous tabs to see
            your ROI analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

useEffect(() => {
  const session = sessionStorage.getItem("roi_session");
  if (!session) return;

  const { unlocked } = JSON.parse(session);
  setUnlocked(Boolean(unlocked));
}, []);

  // const saveInvestmentReport = async (results, projectName) => {
  //   const payload = {
  //     project_name: projectName,
  //     user_id: user?.sub,

  //     roi: `${results.roi.toFixed(2)}%`,
  //     payback_period_years: results.paybackPeriod.toFixed(1),
  //     total_investment: results.totalInvestment,
  //     five_year_profit: results.fiveYearProfit,

  //     annual_financial_summary: {
  //       revenue: results.annualRevenue,
  //       costs: results.annualCosts,
  //       profit: results.annualProfit,
  //     },

  //     investment_breakdown: {
  //       equipment_costs: results.costBreakdown.equipment,
  //       installation_costs: results.costBreakdown.installation,
  //     },

  //     profit_projections: results.yearlyProfits,

  //     // RAW USER INPUTS
  //     userInputCost: results?.costData,
  //     userInputRevenue: results?.revenueData,
  //   };

  //   const response = await fetch(
  //     `${process.env.REACT_APP_BASE_URL}/api/v1/investments/createinvestment`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   const res = await response.json();
  //   console.log("Saved:", res);

  //   if (res.success) alert("Saved Successfully!");
  //   else alert("Save failed!");
  // };

  const getROIStatus = (roi) => {
    if (roi >= 20)
      return {
        status: "excellent",
        color: "text-emerald-500",
        text: "Excellent",
      };
    if (roi >= 15)
      return { status: "good", color: "text-green-500", text: "Good" };
    if (roi >= 10)
      return { status: "fair", color: "text-yellow-500", text: "Fair" };
    return { status: "poor", color: "text-red-500", text: "Poor" };
  };

  const roiStatus = getROIStatus(results.roi);

//   const handleExportExcel = async () => {
//   try {
//     // 1️⃣ Call DOWNLOAD API (deduct 3 credits)
//     const res = await fetch(
//       `${process.env.REACT_APP_BASE_URL}/api/v1/user/download-report`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: user?.sub,
//           type: "EXCEL",
//         }),
//       }
//     );

//     const resData = await res.json();

//     if (!res.ok) {
//       alert(resData.message);
//       return;
//     }

//     // 2️⃣ Build Excel data AFTER successful deduction
//     let worksheetData = [];

//     // Summary
//     worksheetData.push(["Summary"]);
//     worksheetData.push(["Key", "Value"]);
//     worksheetData.push(["Total Investment", results.totalInvestment]);
//     worksheetData.push(["ROI", results.roi]);
//     worksheetData.push(["Payback Period", results.paybackPeriod]);
//     worksheetData.push(["Five Year Profit", results.fiveYearProfit]);
//     worksheetData.push(["Annual Revenue", results.annualRevenue]);
//     worksheetData.push(["Annual Costs", results.annualCosts]);
//     worksheetData.push(["Annual Profit", results.annualProfit]);
//     worksheetData.push([]);

//     // Yearly Profits
//     worksheetData.push(["Yearly Profits"]);
//     worksheetData.push(["Year", "Revenue", "Costs", "Profit"]);
//     results.yearlyProfits.forEach((y) => {
//       worksheetData.push([y.year, y.revenue, y.costs, y.profit]);
//     });
//     worksheetData.push([]);

//     // Cost Breakdown
//     worksheetData.push(["Cost Breakdown"]);
//     worksheetData.push(["Key", "Value"]);
//     worksheetData.push(["Equipment", results.costBreakdown.equipment]);
//     worksheetData.push(["Installation", results.costBreakdown.installation]);
//     worksheetData.push([
//       "Operating Annual",
//       results.costBreakdown.operatingAnnual,
//     ]);
//     worksheetData.push([
//       "Electricity Annual",
//       results.costBreakdown.electricityAnnual,
//     ]);

//     // 3️⃣ Generate Excel
//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "ROI Analysis");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(blob, "ROI_Analysis.xlsx");

//     // 4️⃣ Update credit in global state
//     setUserState((prev) => ({
//       ...prev,
//       profile: {
//         ...prev.profile,
//         credit: resData.remainingCredit,
//       },
//     }));

//   } catch (error) {
//     console.error("❌ Excel download failed:", error);
//     alert("Something went wrong while downloading Excel");
//   }
// };


  // const handleExportExcel = async() => {
  //        const res = await fetch(
  //   `${process.env.REACT_APP_BASE_URL}/api/v1/user/unlock-report`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ user_id: user?.sub }),
  //   }
  // );

  // const resData = await res.json();

  // if (!res.ok) {
  //   alert(resData.message);
  //   return;
  // }
  //   let worksheetData = [];

  //   // 1️⃣ Summary Section (No repeated headers in Excel)
  //   worksheetData.push(["Summary"]);
  //   worksheetData.push(["Key", "Value"]);
  //   worksheetData.push(["Total Investment", results.totalInvestment]);
  //   worksheetData.push(["ROI", results.roi]);
  //   worksheetData.push(["Payback Period", results.paybackPeriod]);
  //   worksheetData.push(["Five Year Profit", results.fiveYearProfit]);
  //   worksheetData.push(["Annual Revenue", results.annualRevenue]);
  //   worksheetData.push(["Annual Costs", results.annualCosts]);
  //   worksheetData.push(["Annual Profit", results.annualProfit]);
  //   worksheetData.push([]); // Blank Row

  //   // 2️⃣ Yearly Profits
  //   worksheetData.push(["Yearly Profits"]);
  //   worksheetData.push(["Year", "Revenue", "Costs", "Profit"]);
  //   results.yearlyProfits.forEach((y) => {
  //     worksheetData.push([y.year, y.revenue, y.costs, y.profit]);
  //   });
  //   worksheetData.push([]);

  //   // 3️⃣ Monthly Breakdown
  //   // worksheetData.push(["Monthly Breakdown"]);
  //   // worksheetData.push(["Month", "Revenue", "Costs", "Profit"]);
  //   // results.monthlyBreakdown.forEach((m) => {
  //   //   worksheetData.push([m.month, m.revenue, m.costs, m.profit]);
  //   // });
  //   // worksheetData.push([]);

  //   // 4️⃣ Cost Breakdown
  //   worksheetData.push(["Cost Breakdown"]);
  //   worksheetData.push(["Key", "Value"]);
  //   worksheetData.push(["Equipment", results.costBreakdown.equipment]);
  //   worksheetData.push(["Installation", results.costBreakdown.installation]);
  //   worksheetData.push([
  //     "Operating Annual",
  //     results.costBreakdown.operatingAnnual,
  //   ]);
  //   worksheetData.push([
  //     "Electricity Annual",
  //     results.costBreakdown.electricityAnnual,
  //   ]);

  //   // ✅ Convert to Excel
  //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "ROI Analysis");

  //   // ✅ Export File
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, "ROI_Analysis_SingleSheet.xlsx");
  //    setUserState((prev) => ({
  //   ...prev,
  //   profile: {
  //     ...prev.profile,
  //     credit: data.remainingCredit,
  //   },
  // }));
  // };

const handleExportExcel = async() => {
    // 1️⃣ Call DOWNLOAD API (deduct 3 credits)
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/user/download-report`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.sub,
          type: "EXCEL",
        }),
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      alert(resData.message);
      return;
    }
  const rows = [];

  /* ================= TITLE ================= */
  rows.push(["ROI ANALYSIS REPORT"]);
  rows.push(["Generated from ROI Calculator"]);
  rows.push([]);

  /* ================= SUMMARY ================= */
  rows.push(["SUMMARY"]);
  rows.push(["Metric", "Value"]);
  rows.push(["Total Investment", results.totalInvestment]);
  rows.push(["Annual Revenue", results.annualRevenue]);
  rows.push(["Annual Cost", results.annualCosts]);
  rows.push(["Annual Profit", results.annualProfit]);
  rows.push(["5-Year Profit", results.fiveYearProfit]);
  rows.push(["Payback Period (Years)", results.paybackPeriod.toFixed(2)]);
  rows.push(["ROI (%)", results.roi.toFixed(2)]);
  rows.push([]);

  /* ================= USER INPUTS ================= */
  rows.push(["USER INPUTS"]);
  rows.push(["Category", "Field", "Value"]);

  rows.push(["Chargers", "Level 2 Quantity", results.costData.equipment.level2Chargers.quantity]);
  rows.push(["Usage", "Monthly Energy (kWh)", results.revenueData.usage.monthlyEnergyLevel2]);
  rows.push(["Pricing", "Level 2 Rate / kWh", results.revenueData.pricing.level2Rate]);
  rows.push(["Electricity", "Electricity Cost / kWh", results.costData.operating.electricityCostPerKwh]);
  rows.push(["Operating", "Maintenance", results.costData.operating.maintenance]);
  rows.push(["Operating", "Network Fees", results.costData.operating.networkFees]);
  rows.push(["Operating", "Insurance", results.costData.operating.insurance]);
  rows.push(["Operating", "Land Lease", results.costData.operating.landLease]);
  rows.push([]);

  /* ================= CALCULATIONS ================= */
  rows.push(["CALCULATION BREAKDOWN"]);
  rows.push(["Calculation", "Formula", "Result"]);

  rows.push(["Annual Revenue", "Monthly Energy × Chargers × Rate × 12", results.annualRevenue]);
  rows.push(["Energy Cost", "Monthly Energy × Chargers × Electricity Rate × 12", results.costBreakdown.electricityAnnual]);
  rows.push(["Other Cost", "Maintenance + Network + Insurance + Land Lease", results.costBreakdown.operatingAnnual]);
  rows.push(["Total Cost", "Energy Cost + Other Cost", results.annualCosts]);
  rows.push(["Annual Profit", "Revenue − Total Cost", results.annualProfit]);
  rows.push(["Payback Period", "Total Investment ÷ Annual Profit", results.paybackPeriod.toFixed(2)]);
  rows.push(["ROI (%)", "(5-Year Profit ÷ Total Investment) × 100", results.roi.toFixed(2)]);
  rows.push([]);

  /* ================= YEARLY PROJECTIONS ================= */
  rows.push(["YEARLY PROJECTIONS"]);
  rows.push(["Year", "Revenue", "Energy Cost", "Other Cost", "Total Cost", "Profit"]);

  results.yearlyProfits.forEach((y) => {
    rows.push([
      `Year ${y.year}`,
      y.revenue,
      results.costBreakdown.electricityAnnual,
      results.costBreakdown.operatingAnnual,
      y.costs,
      y.profit,
    ]);
  });

  /* ================= CREATE SHEET ================= */
  const sheet = XLSX.utils.aoa_to_sheet(rows);

  /* ================= COLUMN WIDTH (IMPORTANT) ================= */
  sheet["!cols"] = [
    { wch: 30 }, // Column A
    { wch: 45 }, // Column B (formulas / labels)
    { wch: 22 }, // Column C
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
  ];

  /* ================= HEADER STYLING ================= */
  const boldRows = [
    0,  // Title
    3,  // SUMMARY
    13, // USER INPUTS
    25, // CALCULATIONS
    36, // YEARLY PROJECTIONS
  ];

  boldRows.forEach((row) => {
    const cell = XLSX.utils.encode_cell({ r: row, c: 0 });
    if (sheet[cell]) {
      sheet[cell].s = {
        font: {
          bold: true,
          
          sz: row === 0 ? 18 : 14, // Bigger title
        },
      };
    }
  });

  /* ================= EXPORT ================= */
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "ROI Analysis");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], { type: "application/octet-stream" }),
    "ROI_Analysis_Modern.xlsx"
  );

   setUserState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        credit: resData.remainingCredit,
      },
    }));
};



  // const handleDownloadPdf = async () => {
  //   const element = pdfRef.current;
  //   if (!element) return;
  //   element.classList.add("pdf-mode");
  //   const canvas = await html2canvas(element, {
  //     scale: 1.5,
  //     useCORS: true,
  //     scrollY: -window.scrollY,
  //   });

  //   // 🔴 Remove the pdf-mode class after rendering
  //   element.classList.remove("pdf-mode");
  //   const imgData = canvas.toDataURL("image/jpeg", 0.9);
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   // Convert HTML to canvas
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   const imgWidth = pdfWidth;
  //   const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  //   const marginTop = 7; // ✅ Top padding in mm
  //   let position = marginTop;
  //   let heightLeft = imgHeight;

  //   // 🟢 Add the first page
  //   pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //   heightLeft -= pdfHeight;

  //   // 🟢 Add extra pages if content is taller than one page
  //   while (heightLeft > 0) {
  //     position -= pdfHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pdfHeight;
  //   }

  //   // 🟢 Save the PDF
  //   pdf.save("ROI_Report.pdf");
  // };

//   const handleDownloadPdf = async () => {
//       const res = await fetch(
//     `${process.env.REACT_APP_BASE_URL}/api/v1/user/unlock-report`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ user_id: user?.sub }),
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     alert(data.message);
//     return;
//   }
//   const element = pdfRef.current;
//   if (!element) return;

//   element.classList.add("pdf-mode");

//   const canvas = await html2canvas(element, {
//     scale: 2,
//     useCORS: true,
//     scrollY: -window.scrollY,
//   });

//   element.classList.remove("pdf-mode");

//   const pdf = new jsPDF("p", "mm", "a4");

//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();

//   const marginTop = 5;
//   const marginBottom = 5;
//   const usableHeight = pageHeight - marginTop - marginBottom;

//   const imgWidth = pageWidth;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   let yOffset = 0;

//   while (yOffset < canvas.height) {
//     const pageCanvas = document.createElement("canvas");
//     const ctx = pageCanvas.getContext("2d");

//     const pageHeightPx = (usableHeight * canvas.width) / imgWidth;

//     pageCanvas.width = canvas.width;
//     pageCanvas.height = Math.min(
//       pageHeightPx,
//       canvas.height - yOffset
//     );

//     ctx.drawImage(
//       canvas,
//       0,
//       yOffset,
//       canvas.width,
//       pageCanvas.height,
//       0,
//       0,
//       canvas.width,
//       pageCanvas.height
//     );

//     const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);

//     if (yOffset > 0) pdf.addPage();

//     pdf.addImage(
//       pageImgData,
//       "JPEG",
//       0,
//       marginTop,
//       imgWidth,
//       (pageCanvas.height * imgWidth) / canvas.width
//     );

//     yOffset += pageHeightPx;
//   }

//   pdf.save("ROI_Report.pdf");
//   setUserState((prev) => ({
//     ...prev,
//     profile: {
//       ...prev.profile,
//       credit: data.remainingCredit,
//     },
//   }));
// };
const handleDownloadPdf = async () => {
  try {
    // 1️⃣ Call DOWNLOAD API (deduct credits FIRST)
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/user/download-report`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.sub,
          type: "PDF",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // 2️⃣ Generate PDF only AFTER successful deduction
    const element = pdfRef.current;
    if (!element) return;

    element.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    element.classList.remove("pdf-mode");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginTop = 5;
    const marginBottom = 5;
    const usableHeight = pageHeight - marginTop - marginBottom;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yOffset = 0;

    while (yOffset < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      const ctx = pageCanvas.getContext("2d");

      const pageHeightPx = (usableHeight * canvas.width) / imgWidth;

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(
        pageHeightPx,
        canvas.height - yOffset
      );

      ctx.drawImage(
        canvas,
        0,
        yOffset,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);

      if (yOffset > 0) pdf.addPage();

      pdf.addImage(
        pageImgData,
        "JPEG",
        0,
        marginTop,
        imgWidth,
        (pageCanvas.height * imgWidth) / canvas.width
      );

      yOffset += pageHeightPx;
    }

    pdf.save("ROI_Report.pdf");

    // 3️⃣ Update credit in global state
    setUserState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        credit: data.remainingCredit,
      },
    }));

  } catch (error) {
    console.error("❌ PDF download failed:", error);
    alert("Something went wrong while downloading PDF");
  }
};


//   const handleJsonPdfDownload = async () => {
//   const blob = await pdf(
//     <RoiPdfDocument results={results} projectName={projectName || "ROI Report"} />
//   ).toBlob();

//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${projectName || "ROI_Report"}.pdf`;
//   a.click();
// };

const handleJsonPdfDownload = async () => {
  if (!results) return;

  // 1️⃣ CLEAN & FORMAT DATA BEFORE SENDING TO PDF
  const pdfResults = {
    ...results,
    annualRevenueFormatted: `${getCurrencySymbol()} ${results.annualRevenue.toLocaleString()}`,
    annualCostsFormatted: `${getCurrencySymbol()} ${results.annualCosts.toLocaleString()}`,
    annualProfitFormatted: `${getCurrencySymbol()} ${results.annualProfit.toLocaleString()}`,
    totalInvestmentFormatted: `${getCurrencySymbol()} ${results.totalInvestment.toLocaleString()}`,
    fiveYearProfitFormatted: `${getCurrencySymbol()} ${results.fiveYearProfit.toLocaleString()}`,

    yearlyProfitsFormatted: results.yearlyProfits.map((y) => ({
      year: y.year,
      revenueFormatted: `${getCurrencySymbol()} ${y.revenue.toLocaleString()}`,
      costsFormatted: `${getCurrencySymbol()} ${y.costs.toLocaleString()}`,
      profitFormatted: `${getCurrencySymbol()} ${y.profit.toLocaleString()}`
    }))
  };

  // 2️⃣ GENERATE PDF
  const blob = await pdf(
    <RoiPdfDocument results={pdfResults} projectName={ "ROI Report"} />
  ).toBlob();

  // 3️⃣ DOWNLOAD PDF
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${"ROI_Report"}.pdf`;
  a.click();
};
console.log("result",results);

// const handleBlurItem =async()=>{
//   const deductResponse = await fetch(
//   `${process.env.REACT_APP_BASE_URL}/api/v1/user/deduct`,
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: user?.sub, // auth0 user id
//       amount: 2,          // deduct 2 credit
//     }),
//   }
// );

// const deductData = await deductResponse.json();

// if (!deductResponse.ok) {
//   throw new Error(deductData.message || "Credit deduction failed");
// }
// console.log("User state Data before set",userState);

// setUserState((prev) => ({
//   ...prev,
//   loading: false,
//   profile: {
//     ...prev.profile, // ✅ keep ALL existing fields
//     credit: deductData.remainingCredit ?? prev.profile.credit,
//     isSubscribed :true
//   },
// }));

// console.log("✅ Credit Deducted Successfully:", deductData);


// }

const handleBlurItem = async () => {
  const res = await fetch(
    `${process.env.REACT_APP_BASE_URL}/api/v1/user/unlock-report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user?.sub }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  setUserState((prev) => ({
    ...prev,
    profile: {
      ...prev.profile,
      credit: data.remainingCredit,
    },
    permissions: {
      ...prev.permissions,
      canViewFullReport: true,
    },
  }));
};

  return (
    <div className="space-y-2">
      <div ref={pdfRef} className=" space-y-6 bg-white p-4 rounded-lg">
        {/* Key Metrics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          <Card className="border-2 border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">ROI</p>
                  <p className="text-3xl font-bold text-emerald-700 ">
                    {results.roi?.toFixed(2)}%
                  </p>
                  <div
                    style={{ paddingTop: "0px" }}
                    className={` font-bold ${roiStatus.color} text-white `}
                  >
                    {roiStatus?.text}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Payback Period
                  </p>
                  <p className="text-3xl font-bold text-blue-700 ">
                    {results.paybackPeriod.toFixed(1)}
                  </p>
                  <p className="text-blue-600 text-sm ">years</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Total Investment
                  </p>
                  <p className="text-2xl font-bold text-purple-700 ">
                    {formatCurrency(results.totalInvestment)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">
                    5-Year Profit
                  </p>
                  <p className="text-2xl font-bold text-amber-700 ">
                    {formatCurrency(results.fiveYearProfit)}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profitability Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Annual Financial Summary
            </CardTitle>
            <CardDescription>
              First year revenue, costs, and profit breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Annual Revenue
                  </span>

                  <span className={"font-semibold text-emerald-600"}>
                    {formatCurrency(results.annualRevenue)}
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Annual Costs
                  </span>
                  <span className={"font-semibold text-red-600"}>
                    {formatCurrency(results.annualCosts)}
                  </span>
                </div>
                <Progress
                  value={(results.annualCosts / results.annualRevenue) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Annual Profit
                  </span>
                  <span className={"font-semibold text-green-600"}>
                    {formatCurrency(results.annualProfit)}
                  </span>
                </div>
                <Progress
                  value={(results.annualProfit / results.annualRevenue) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Breakdown</CardTitle>
            <CardDescription>
              Where your initial investment will be allocated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">Equipment Costs</span>
                <span className={"font-semibold text-orange-600"}>
                  {getCurrencySymbol()}
                  {results.costBreakdown.equipment.toLocaleString()}
                </span>
              </div>
              <Separator />

              <div className="flex justify-between items-center py-1">
                <span className="font-medium">Installation Costs</span>
                <span className={"font-semibold text-green-600"}>
                  {getCurrencySymbol()}
                  {results.costBreakdown.installation.toLocaleString()}
                </span>
              </div>
              <Separator />

              <div className="flex justify-between items-center py-1 bg-slate-50 px-4 rounded">
                <span className="font-semibold">Total Initial Investment</span>
                <span className={"font-semibold text-gray-800"}>
                  {getCurrencySymbol()}
                  {results.totalInvestment.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

       <div className="border-[1px] border-yellow-200 rounded-2xl px-4 py-3 
            shadow-[0_0_12px_rgba(255, 255, 0, 0.276)]">

          {!canViewReport  && (
            <div className="mt-4 mb-4 flex items-center justify-center gap-2 font-bold text-xl bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <Lock className="h-5 w-5 text-yellow-600" />
              <span>You need to upgrade your plan to access premium features.</span>
            </div>
          )}

          {/* -------------------- SECURE SECTION #1: YEARLY PROJECTIONS -------------------- */}
         {/* -------------------- PROJECTION TABLE -------------------- */}
{/* -------------------- PROJECTION TABLE -------------------- */}
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <div>
<CardTitle>
      {results?.revenueData?.timeline?.analysisYears}-Year Profit Projections
    </CardTitle>
    <CardDescription>Expected yearly profits</CardDescription>
      </div>
      <div>
        <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
        <button
  onClick={() => setOpenCalculationModal(true)}
  className="
    inline-flex items-center gap-2
    rounded-lg border border-emerald-300
    bg-white px-3 py-2
    text-sm font-medium text-emerald-700
    hover:bg-emerald-50
    hover:border-emerald-400
    transition-all duration-200
    shadow-sm
  "
>
  <AlertCircle className="h-4 w-4" />
</button>

    </TooltipTrigger>

    <TooltipContent side="top" align="center">
      <p className="text-xs">
        See detailed formulas used to calculate revenue, cost, ROI & payback
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>


      </div>
    </div>

  </CardHeader>



  <CardContent>
    {canViewReport ? (
      /* ✅ FULL TABLE */
      <>
        <div className="grid grid-cols-6 gap-2 py-3 bg-slate-200 font-semibold border-b">
          <div className="text-center">Year</div>
          <div className="text-center">Revenue</div>
          <div className="text-center">Energy Cost</div>
          <div className="text-center">Other Cost</div>
          <div className="text-center">Total Cost</div>
          <div className="text-center">Profit</div>
        </div>

        {results.yearlyProfits.map((year) => {
          const energyCost = results.costBreakdown.electricityAnnual;
          const otherCost = results.costBreakdown.operatingAnnual;

          return (
            <div
              key={year.year}
              className="grid grid-cols-6 gap-2 py-3 border-b"
            >
              <div className="text-center">Year {year.year}</div>
              <div className="text-center text-emerald-600">
                {formatCurrency(year.revenue)}
              </div>
              <div className="text-center text-orange-600">
                {formatCurrency(energyCost)}
              </div>
              <div className="text-center text-red-500">
                {formatCurrency(otherCost)}
              </div>
              <div className="text-center text-red-600">
                {formatCurrency(year.costs)}
              </div>
              <div className="text-center font-semibold text-green-700">
                {formatCurrency(year.profit)}
              </div>
            </div>
          );
        })}
      </>
    ) : (
      /* 🔒 BLURRED VIEW */
      <div className="relative">
        <div className="grid grid-cols-4 gap-2 py-3 bg-slate-200 font-semibold border-b">
          <div className="text-center">Year</div>
          <div className="text-center">Revenue</div>
          <div className="text-center">Cost</div>
          <div className="text-center">Profit</div>
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 py-3 border-b opacity-50"
          >
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
          </div>
        ))}

        {/* 🔓 UNLOCK CTA */}
        {permissions?.canUnlockWithCredits && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <button
              onClick={handleBlurItem}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
            >
              <EyeIcon className="inline-block mr-1" />
              Unlock for {permissions.unlockCost} credits
            </button>
          </div>
        )}
      </div>
    )}
  </CardContent>
</Card>



{/* Calculations Berakdown  */}
<Dialog open={openCalculationModal} onOpenChange={setOpenCalculationModal}>
  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-emerald-700">
        <AlertCircle className="h-5 w-5" />
        How these calculations are done
      </DialogTitle>
      <p className="text-sm text-slate-500">
        Transparent breakdown of revenue, cost, and ROI calculations
      </p>
    </DialogHeader>

    {/* -------- Modal Body -------- */}
    <div className="space-y-4 text-sm text-slate-700">
      
      {/* Energy Cost */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="font-semibold text-slate-800">🔌 Energy Cost</p>
        <p>
          Monthly Energy ({results.revenueData.usage.monthlyEnergyLevel2} kWh)
          × Chargers ({results.costData.equipment.level2Chargers.quantity})
          × Electricity Rate ({getCurrencySymbol()}
          {results.costData.operating.electricityCostPerKwh}/kWh) × 12
        </p>
        <p className="font-medium mt-1">
          = {formatCurrency(results.costBreakdown.electricityAnnual)}
        </p>
      </div>

      {/* Other Cost */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="font-semibold text-slate-800">🧾 Other Operating Costs</p>
        <p>
          Maintenance + Network Fees + Insurance + Land Lease
        </p>
        <p className="font-medium mt-1">
          = {formatCurrency(results.costBreakdown.operatingAnnual)}
        </p>
      </div>

      {/* Total Cost */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="font-semibold text-slate-800">📊 Total Annual Cost</p>
        <p className="font-medium mt-1">
          = {formatCurrency(results.annualCosts)}
        </p>
      </div>

      {/* Profit */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="font-semibold text-slate-800">💰 Annual Profit</p>
        <p className="font-medium mt-1">
          = {formatCurrency(results.annualProfit)}
        </p>
      </div>

      {/* ROI */}
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <p className="font-semibold text-emerald-800">📈 ROI</p>
        <p className="font-medium mt-1">
          = {results.roi.toFixed(2)}%
        </p>
      </div>
    </div>

    {/* -------- Footer -------- */}
    <div className="flex justify-end pt-4">
      <Button onClick={() => setOpenCalculationModal(false)}>
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>




          {/* -------------------- SECURE SECTION #2: INSIGHTS -------------------- */}
         <Card className="border-2 border-blue-200 my-4">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-blue-600" />
      Key Insights & Recommendations
    </CardTitle>
  </CardHeader>

  <CardContent className="relative">
    {canViewReport  ? (
      <div className="space-y-4">
        {results.roi >= 15 ? (
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="font-medium text-emerald-800">Strong ROI Potential</p>
            <p className="text-emerald-700">
              ROI of {results.roi.toFixed(2)}% indicates excellent performance.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-800">Moderate ROI</p>
            <p className="text-yellow-700">
              You may improve ROI by optimizing operating costs.
            </p>
          </div>
        )}
      </div>
    ) : (
      <>
        <div className="space-y-3 opacity-50">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 rounded w-2/3"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <button
            // onClick={() => navigate("/pricing")}
            onClick={handleBlurItem}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
          >
            <EyeIcon className="inline-block mr-1" />
          Unlock for {permissions.unlockCost} credits
          </button>
        </div>
      </>
    )}
  </CardContent>
</Card>


          {/* ---------------------- EXPORT BUTTONS ---------------------- */}
         
        </div>

      </div>
<Card className="mb-4 border border-slate-200 rounded-2xl shadow-sm">
  <CardContent className="p-6">

    {/* 🔹 Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Download Report
        </h3>
        <p className="text-sm text-slate-500">
          PDF or Excel export available
        </p>
      </div>

      {/* Credits pill */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold
          ${
            hasDownloadCredit
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }
        `}
      >
        <Coins className="h-4 w-4" />
        {userCredit} Credits
      </div>
    </div>

    {/* 🔹 Cost Info */}
    <div className="mb-6 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-slate-200">
      <Download className="h-5 w-5 text-indigo-600" />
      <span className="text-sm text-slate-700">
        Each download costs{" "}
        <span className="font-semibold text-slate-900">
          {DOWNLOAD_COST} credits
        </span>
      </span>
    </div>

    {/* 🔹 Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        disabled={!hasDownloadCredit}
        onClick={handleDownloadPdf}
        // onClick={handleJsonPdfDownload}
        className={`flex-1 h-12 rounded-xl text-sm font-semibold transition
          ${
            hasDownloadCredit
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }
        `}
      >
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>

      <Button
        disabled={!hasDownloadCredit}
        onClick={handleExportExcel}
        className={`flex-1 h-12 rounded-xl text-sm font-semibold transition
          ${
            hasDownloadCredit
              ? "bg-white border border-slate-300 hover:bg-slate-50 text-slate-900"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }
        `}
        variant="outline"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>

    {/* 🔹 Footer Hint */}
    {!hasDownloadCredit && (
      <p className="mt-5 text-center text-sm text-slate-500">
        Not enough credits?
        <span
          onClick={() => navigate("/pricing")}
          className="ml-1 font-semibold text-indigo-600 cursor-pointer hover:underline"
        >
          Buy credits or upgrade →
        </span>
      </p>
    )}

  </CardContent>
</Card>

    </div>
  );
};

export default ROIResults;
