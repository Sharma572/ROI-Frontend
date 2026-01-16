import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";

import { Badge } from "./ui/badge";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useCurrency } from "../contexts/CurrencyContext";
import { useAuth0 } from "@auth0/auth0-react";
import { pdf } from "@react-pdf/renderer";
import { RoiPdfDocument } from "../pdf/RoiPdfDocument";
import { useUser } from "@/contexts/userContext";

const ROIResults = ({ results }) => {
  const { user } = useAuth0();
  const { userState } = useUser();
  console.log("userState in result",userState);
  // Subscription State ✌️✌️✌️
  const isUserSubscribed = userState?.profile?.isSubscribed;
  const { getCurrencySymbol, formatCurrency } = useCurrency();
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
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

  const saveInvestmentReport = async (results, projectName) => {
    const payload = {
      project_name: projectName,
      user_id: user?.sub,

      roi: `${results.roi.toFixed(2)}%`,
      payback_period_years: results.paybackPeriod.toFixed(1),
      total_investment: results.totalInvestment,
      five_year_profit: results.fiveYearProfit,

      annual_financial_summary: {
        revenue: results.annualRevenue,
        costs: results.annualCosts,
        profit: results.annualProfit,
      },

      investment_breakdown: {
        equipment_costs: results.costBreakdown.equipment,
        installation_costs: results.costBreakdown.installation,
      },

      profit_projections: results.yearlyProfits,

      // RAW USER INPUTS
      userInputCost: results?.costData,
      userInputRevenue: results?.revenueData,
    };

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

    const res = await response.json();
    console.log("Saved:", res);

    if (res.success) alert("Saved Successfully!");
    else alert("Save failed!");
  };

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

  const handleExportExcel = () => {
    let worksheetData = [];

    // 1️⃣ Summary Section (No repeated headers in Excel)
    worksheetData.push(["Summary"]);
    worksheetData.push(["Key", "Value"]);
    worksheetData.push(["Total Investment", results.totalInvestment]);
    worksheetData.push(["ROI", results.roi]);
    worksheetData.push(["Payback Period", results.paybackPeriod]);
    worksheetData.push(["Five Year Profit", results.fiveYearProfit]);
    worksheetData.push(["Annual Revenue", results.annualRevenue]);
    worksheetData.push(["Annual Costs", results.annualCosts]);
    worksheetData.push(["Annual Profit", results.annualProfit]);
    worksheetData.push([]); // Blank Row

    // 2️⃣ Yearly Profits
    worksheetData.push(["Yearly Profits"]);
    worksheetData.push(["Year", "Revenue", "Costs", "Profit"]);
    results.yearlyProfits.forEach((y) => {
      worksheetData.push([y.year, y.revenue, y.costs, y.profit]);
    });
    worksheetData.push([]);

    // 3️⃣ Monthly Breakdown
    // worksheetData.push(["Monthly Breakdown"]);
    // worksheetData.push(["Month", "Revenue", "Costs", "Profit"]);
    // results.monthlyBreakdown.forEach((m) => {
    //   worksheetData.push([m.month, m.revenue, m.costs, m.profit]);
    // });
    // worksheetData.push([]);

    // 4️⃣ Cost Breakdown
    worksheetData.push(["Cost Breakdown"]);
    worksheetData.push(["Key", "Value"]);
    worksheetData.push(["Equipment", results.costBreakdown.equipment]);
    worksheetData.push(["Installation", results.costBreakdown.installation]);
    worksheetData.push([
      "Operating Annual",
      results.costBreakdown.operatingAnnual,
    ]);
    worksheetData.push([
      "Electricity Annual",
      results.costBreakdown.electricityAnnual,
    ]);

    // ✅ Convert to Excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ROI Analysis");

    // ✅ Export File
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ROI_Analysis_SingleSheet.xlsx");
  };

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    if (!element) return;
    element.classList.add("pdf-mode");
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    // 🔴 Remove the pdf-mode class after rendering
    element.classList.remove("pdf-mode");
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const pdf = new jsPDF("p", "mm", "a4");

    // Convert HTML to canvas
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const marginTop = 7; // ✅ Top padding in mm
    let position = marginTop;
    let heightLeft = imgHeight;

    // 🟢 Add the first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 🟢 Add extra pages if content is taller than one page
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // 🟢 Save the PDF
    pdf.save("ROI_Report.pdf");
  };

  const handleJsonPdfDownload = async () => {
  const blob = await pdf(
    <RoiPdfDocument results={results} projectName={projectName || "ROI Report"} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "ROI_Report"}.pdf`;
  a.click();
};

// const handleJsonPdfDownload = async () => {
//   if (!results) return;

//   // 1️⃣ CLEAN & FORMAT DATA BEFORE SENDING TO PDF
//   const pdfResults = {
//     ...results,
//     annualRevenueFormatted: `${getCurrencySymbol()} ${results.annualRevenue.toLocaleString()}`,
//     annualCostsFormatted: `${getCurrencySymbol()} ${results.annualCosts.toLocaleString()}`,
//     annualProfitFormatted: `${getCurrencySymbol()} ${results.annualProfit.toLocaleString()}`,
//     totalInvestmentFormatted: `${getCurrencySymbol()} ${results.totalInvestment.toLocaleString()}`,
//     fiveYearProfitFormatted: `${getCurrencySymbol()} ${results.fiveYearProfit.toLocaleString()}`,

//     yearlyProfitsFormatted: results.yearlyProfits.map((y) => ({
//       year: y.year,
//       revenueFormatted: `${getCurrencySymbol()} ${y.revenue.toLocaleString()}`,
//       costsFormatted: `${getCurrencySymbol()} ${y.costs.toLocaleString()}`,
//       profitFormatted: `${getCurrencySymbol()} ${y.profit.toLocaleString()}`
//     }))
//   };

//   // 2️⃣ GENERATE PDF
//   const blob = await pdf(
//     <RoiPdfDocument results={pdfResults} projectName={projectName || "ROI Report"} />
//   ).toBlob();

//   // 3️⃣ DOWNLOAD PDF
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${projectName || "ROI_Report"}.pdf`;
//   a.click();
// };
console.log("result",results);



  return (
    <div className="space-y-6">
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

          {!isUserSubscribed && (
            <div className="mt-4 mb-4 flex items-center justify-center gap-2 font-bold text-xl bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <Lock className="h-5 w-5 text-yellow-600" />
              <span>You need to upgrade your plan to access premium features.</span>
            </div>
          )}

          {/* -------------------- SECURE SECTION #1: YEARLY PROJECTIONS -------------------- */}
         {/* -------------------- PROJECTION TABLE -------------------- */}
<Card>
  <CardHeader>
    <CardTitle>
      {results?.revenueData?.timeline?.analysisYears}-Year Profit Projections
    </CardTitle>
    <CardDescription>Expected yearly profits</CardDescription>
  </CardHeader>

  <CardContent>
    {/* REAL DATA — SUBSCRIBED USERS */}
    {isUserSubscribed && (
      <>
        <div className="grid grid-cols-4 gap-2 py-3 bg-slate-200 font-semibold border-b">
          <div className="text-center">Year</div>
          <div className="text-center">Revenue</div>
          <div className="text-center">Cost</div>
          <div className="text-center">Profit</div>
        </div>

        {results.yearlyProfits.map((year) => (
          <div key={year.year} className="grid grid-cols-4 gap-2 py-3 border-b">
            <div className="text-center">Year {year.year}</div>
            <div className="text-center text-emerald-600">
              {formatCurrency(year.revenue)}
            </div>
            <div className="text-center text-red-600">
              {formatCurrency(year.costs)}
            </div>
            <div className="text-center font-semibold">
              {formatCurrency(year.profit)}
            </div>
          </div>
        ))}
      </>
    )}

    {/* LOCKED VIEW — NON SUBSCRIBED */}
    {!isUserSubscribed && (
      <div className="relative">
        <div className="grid grid-cols-4 gap-2 py-3 bg-slate-200 font-semibold border-b">
          <div className="text-center">Year</div>
          <div className="text-center">Revenue</div>
          <div className="text-center">Cost</div>
          <div className="text-center">Profit</div>
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 py-3 border-b opacity-50">
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded"></div>
          </div>
        ))}

        {/* SINGLE UNLOCK OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <button
            onClick={() => {
              sessionStorage.setItem(
                "roi_session",
                JSON.stringify({ results, unlocked: false })
              );
              navigate("/pricing");
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
          >
            <LockKeyholeOpen className="inline-block mr-1" />
            Unlock Now
          </button>
        </div>
      </div>
    )}
  </CardContent>
</Card>


          {/* -------------------- SECURE SECTION #2: INSIGHTS -------------------- */}
         <Card className="border-2 border-blue-200 my-4">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-blue-600" />
      Key Insights & Recommendations
    </CardTitle>
  </CardHeader>

  <CardContent className="relative">
    {isUserSubscribed ? (
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
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
          >
            <LockKeyholeOpen className="inline-block mr-1" />
            Unlock Now
          </button>
        </div>
      </>
    )}
  </CardContent>
</Card>


          {/* ---------------------- EXPORT BUTTONS ---------------------- */}
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-around">

                {/* PDF */}
                <div className="relative flex items-center">
                  {!isUserSubscribed && (
                    <Lock className="h-4 w-4 text-yellow-500 absolute -left-6" />
                  )}

                  <Button
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${
                      isUserSubscribed
                        ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                        : "border-gray-300 text-gray-500 bg-gray-100 opacity-60"
                    }`}
                    disabled={!isUserSubscribed}
                    // onClick={isUserSubscribed ? handleJsonPdfDownload : undefined}
                     onClick={isUserSubscribed ? handleDownloadPdf : undefined}
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF Report
                  </Button>
                </div>

                {/* Excel */}
                <div className="relative flex items-center">
                  {!isUserSubscribed && (
                    <Lock className="h-4 w-4 text-yellow-500 absolute -left-6" />
                  )}

                  <Button
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${
                      isUserSubscribed
                        ? "border-blue-500 text-blue-700 hover:bg-blue-50"
                        : "border-gray-300 text-gray-500 bg-gray-100 opacity-60 "
                    }`}
                    disabled={!isUserSubscribed}
                    onClick={isUserSubscribed ? handleExportExcel : undefined}
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Export Excel Data
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
 
      </div>

    </div>
  );
};

export default ROIResults;
