import React, { useRef, useState } from "react";
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

const ROIResults = ({ results }) => {
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const { getCurrencySymbol, formatCurrency } = useCurrency();
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleUpgrade = () => {
    setUnlocked(true);
  };

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
    <RoiPdfDocument results={pdfResults} projectName={projectName || "ROI Report"} />
  ).toBlob();

  // 3️⃣ DOWNLOAD PDF
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "ROI_Report"}.pdf`;
  a.click();
};


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
            animate-none shadow-[0_0_12px_rgba(255, 255, 0, 0.276)]
            cursor-not-allowed">
          {/* 🔒 Upgrade Message */}
          {!unlocked && (
            <div className="mt-4 mb-4 flex items-center justify-center gap-2 font-bold text-xl bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <Lock className="h-5 w-5 text-yellow-600" />
              <span>
                You need to upgrade your plan to access export features.
              </span>
            </div>
          )}
          {/* Yearly Projections */}
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                {results?.revenueData?.timeline?.analysisYears}-Year Profit
                Projections
              </CardTitle>
              <CardDescription>
                Expected yearly profits with growth assumptions
              </CardDescription>
            </CardHeader>
            {/* <CardContent>
            <div>
              {results.yearlyProfits.map((year, index) => (
                <div
                  key={year.year}
                  className="grid grid-cols-4 gap-2 py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div className="font-medium">Year {year.year}</div>
                  <div className="text-emerald-600 blur-sm">
                    {getCurrencySymbol()}
                    {year.revenue.toLocaleString()}
                  </div>
                  <div className="text-red-600 blur-sm">
                    {getCurrencySymbol()}
                    {year.costs.toLocaleString()}
                  </div>
                  <div className="font-semibold text-slate-900 blur-sm">
                    {getCurrencySymbol()}
                    {year.profit.toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-4 gap-4 py-4 bg-slate-50 rounded font-semibold">
                <div>Total</div>
                <div className="text-emerald-600 blur-sm">
                  {getCurrencySymbol()}
                  {results.yearlyProfits
                    .reduce((sum, year) => sum + year.revenue, 0)
                    .toLocaleString()}
                </div>
                <div className="text-red-600 blur-sm">
                  {getCurrencySymbol()}
                  {results.yearlyProfits
                    .reduce((sum, year) => sum + year.costs, 0)
                    .toLocaleString()}
                </div>
                <div className="text-slate-900 blur-sm">
                  {getCurrencySymbol()}
                  {results.fiveYearProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent> */}
            <CardContent>
              <div className="relative">
                {/* TABLE CONTENT */}
                <div
                  className={`${
                    !unlocked ? "blur-sm pointer-events-none select-none" : ""
                  }`}
                >
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-2 py-3 bg-slate-200 font-semibold border-b border-slate-300">
                      <div className="text-center">Year</div>
                      <div className="text-center">Revenue</div>
                      <div className="text-center">Cost</div>
                      <div className="text-center">Profit</div>
                    </div>

                    {/* Rows */}
                    {results.yearlyProfits.map((year, index) => (
                      <div
                        key={year.year}
                        className="grid grid-cols-4 gap-2 py-3 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-center">
                          Year {year.year}
                        </div>

                        <div className="text-emerald-600  text-center">
                          {getCurrencySymbol()}
                          {formatCurrency(year.revenue)}
                        </div>

                        <div className="text-red-600  text-center">
                          {getCurrencySymbol()}
                          {formatCurrency(year.costs)}
                        </div>

                        <div className="font-semibold text-slate-900 text-center">
                          {getCurrencySymbol()}
                          {formatCurrency(year.profit)}
                        </div>
                      </div>
                    ))}

                    {/* Total Row */}
                    <div className="grid grid-cols-4 gap-4 py-4 bg-slate-50 rounded font-semibold">
                      <div className=" text-center">Total</div>

                      <div className="text-emerald-600 text-center">
                        {getCurrencySymbol()}
                        {results.yearlyProfits
                          .reduce((sum, year) => sum + year.revenue, 0)
                          .toLocaleString()}
                      </div>

                      <div className="text-red-600 text-center">
                        {getCurrencySymbol()}
                        {results.yearlyProfits
                          .reduce((sum, year) => sum + year.costs, 0)
                          .toLocaleString()}
                      </div>

                      <div className="text-slate-900 text-center">
                        {getCurrencySymbol()}
                        {results.fiveYearProfit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OVERLAY BUTTON */}
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <button
                      onClick={() => setUnlocked(true)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
                    >
                      <span className="flex justify-center items-center">
                        <LockKeyholeOpen />
                      </span>
                      Unlock Now
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights & Recommendations */}
          <Card className="border-2 border-blue-200 my-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Key Insights & Recommendations
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4 blur-sm">
            <div className="space-y-3">
              {results.roi >= 15 ? (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-emerald-800">
                      Strong ROI Potential
                    </p>
                    <p className="text-emerald-700 text-sm">
                      Your projected ROI of {results.roi}% indicates excellent
                      investment potential.
                    </p>
                  </div>
                </div>
              ) : results.roi >= 10 ? (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-yellow-800">Moderate ROI</p>
                    <p className="text-yellow-700 text-sm">
                      Consider optimizing costs or increasing pricing to improve
                      ROI.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Low ROI Warning</p>
                    <p className="text-red-700 text-sm">
                      Current projections show low returns. Review costs and
                      usage assumptions.
                    </p>
                  </div>
                </div>
              )}

              {results.paybackPeriod <= 3 ? (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-blue-800">Quick Payback</p>
                    <p className="text-blue-700 text-sm">
                      Your {results.paybackPeriod}-year payback period is
                      excellent for this industry.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent> */}
            <CardContent className="relative">
              {/* CONTENT (blurred when locked) */}
              <div
                className={`${
                  !unlocked ? "blur-sm pointer-events-none select-none" : ""
                } space-y-4`}
              >
                <div className="space-y-3">
                  {results.roi >= 15 ? (
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-emerald-800">
                          Strong ROI Potential
                        </p>
                        <p className="text-emerald-700 text-sm">
                          Your projected ROI of {results.roi?.toFixed(2)}%
                          indicates excellent investment potential.
                        </p>
                      </div>
                    </div>
                  ) : results.roi >= 10 ? (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-yellow-800">
                          Moderate ROI
                        </p>
                        <p className="text-yellow-700 text-sm">
                          Consider optimizing costs or increasing pricing to
                          improve ROI.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-red-800">
                          Low ROI Warning
                        </p>
                        <p className="text-red-700 text-sm">
                          Current projections show low returns. Review costs and
                          usage assumptions.
                        </p>
                      </div>
                    </div>
                  )}

                  {results.paybackPeriod <= 3 && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-blue-800">
                          Quick Payback
                        </p>
                        <p className="text-blue-700 text-sm">
                          Your {results.paybackPeriod}-year payback period is
                          excellent for this industry.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* OVERLAY BUTTON */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <button
                    onClick={() => setUnlocked(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
                  >
                    <span className="flex justify-center items-center">
                      <LockKeyholeOpen />
                    </span>
                    Unlock Now
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="mb-4">
            <CardContent className="pt-4">
              {/* <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel Data
            </Button>
          </div> */}
              <div className="flex justify-around flex-col sm:flex-row gap-4">
                {/* PDF Button */}
                <div className="relative flex items-center">
                  {!unlocked && (
                    <div className="absolute -left-6 flex items-center">
                      <Lock className="h-4 w-4 text-yellow-500" />
                    </div>
                  )}

                  {/* <Button
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border 
        transition-all duration-300
        ${
          unlocked
            ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600"
            : "border-gray-300 text-gray-500 bg-gray-100 opacity-60 cursor-not-allowed"
        }`}
                    disabled={!unlocked}
                    onClick={unlocked ? handleDownloadPdf : undefined}
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF Report
                  </Button> */}
                  <Button
  className={`flex items-center gap-2 px-5 py-3 rounded-xl border
  ${unlocked
    ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
    : "border-gray-300 text-gray-500 bg-gray-100 opacity-60 cursor-not-allowed"
  }`}
  disabled={!unlocked}
  onClick={unlocked ? handleJsonPdfDownload : undefined}
  variant="outline"
>
  <Download className="h-4 w-4" />
  Export PDF Report
</Button>

                </div>

                {/* Excel Button */}
                <div className="relative flex items-center">
                  {!unlocked && (
                    <div className="absolute -left-6 flex items-center">
                      <Lock className="h-4 w-4 text-yellow-500" />
                    </div>
                  )}

                  <Button
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border
        transition-all duration-300
        ${
          unlocked
            ? "border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-600"
            : "border-gray-300 text-gray-500 bg-gray-100 opacity-60 cursor-not-allowed"
        }`}
                    disabled={!unlocked}
                    onClick={unlocked ? handleExportExcel : undefined}
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

      {results && (
        <>
          {isAuthenticated ? (
            // <Button
            //   onClick={() => saveInvestmentReport(results)}
            //   className="bg-emerald-600 text-white"
            // >
            //   Save Report
            // </Button>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 text-white"
            >
              Save Report
            </Button>
          ) : (
            <Button
              onClick={() => loginWithRedirect()}
              style={{ background: "#1ac47d" }}
              className=" text-white"
            >
              Login to Save Report
            </Button>
          )}
        </>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Project</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter report name..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <DialogFooter>
            <Button
              disabled={!projectName.trim()}
              className="bg-emerald-600 text-white"
              onClick={() => {
                saveInvestmentReport(results, projectName);
                setShowModal(false);
              }}
            >
              Save My Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ROIResults;
