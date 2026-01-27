// import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import { Font } from "@react-pdf/renderer";
// import { Svg, Path } from "@react-pdf/renderer";

// export const RupeeIcon = ({ size = 20, color = "#354052" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Path
//       d="M18 5H7H10C11.0609 5 12.0783 5.42143 12.8284 6.17157C13.5786 6.92172 14 7.93913 14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13H7L13 19M7 9H18"
//       stroke={color}
//       strokeWidth={2}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Svg>
// );

// Font.register({
//   family: "Outfit",
//   fonts: [
//     { src: "/fonts/Outfit-Regular.ttf", fontWeight: "normal" },
//     { src: "/fonts/Outfit-Medium.ttf", fontWeight: "500" },
//     { src: "/fonts/Outfit-SemiBold.ttf", fontWeight: "600" },
//     { src: "/fonts/Outfit-Bold.ttf", fontWeight: "bold" },
//   ],
// });
// // ----------------------
// // STYLING
// // ----------------------
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontFamily: "Outfit",
//   },

//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

//   // Metric Card Styles
//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   card: {
//     width: "24%",
//     padding: 10,
//     borderRadius: 6,
//   },

//   label: { fontSize: 10, color: "#555" },
//   valueLarge: { fontSize: 20, fontWeight: "bold", marginTop: 3 },

//   // Sections
//   sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
//   sectionDesc: { fontSize: 10, marginBottom: 10, color: "#777" },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//   },

//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#E5E7EB",
//     padding: 6,
//     fontWeight: "bold",
//     borderTopLeftRadius: 4,
//     borderTopRightRadius: 4,
//   },

//   cell: { width: "25%", fontSize: 10, padding: "7px" },

//   insightBox: {
//     padding: 10,
//     backgroundColor: "#E8FBEA",
//     borderRadius: 6,
//     marginTop: 10,
//   },
//   insightHeading: { fontWeight: "bold", color: "#0A7A33", marginBottom: 4 },
// });

// // ----------------------
// // DOCUMENT COMPONENT
// // ----------------------
// export const RoiPdfDocument = ({ results, projectName }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Title */}
//         <Text style={styles.title}>{"ROI Report"}</Text>

//         {/* ---------- METRIC CARDS (Same UI as your PDF) ---------- */}
//         <View style={styles.cardRow}>
//           <View style={[styles.card, { backgroundColor: "#E9FFF2" }]}>
//             <Text style={styles.label}>ROI</Text>
//             <Text style={[styles.valueLarge, { color: "#00A65A" }]}>
//               {results.roi.toFixed(2)}%
//             </Text>
//           </View>

//           <View style={[styles.card, { backgroundColor: "#EEF6FF" }]}>
//             <Text style={styles.label}>Payback Period</Text>
//             <Text style={[styles.valueLarge, { color: "#2563EB" }]}>
//               {results.paybackPeriod?.toFixed(2)} years
//             </Text>
//           </View>

//           <View style={[styles.card, { backgroundColor: "#F5EDFF" }]}>
//             <Text style={styles.label}>Total Investment</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text style={[styles.valueLarge, { color: "#7C3AED" }]}>
//                 {results.totalInvestment.toLocaleString()}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.card, { backgroundColor: "#FFF8E5" }]}>
//             <Text style={styles.label}>5-Year Profit</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text style={[styles.valueLarge, { color: "#D97706" }]}>
//                 {results.fiveYearProfit.toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* -------- Annual Financial Summary -------- */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Annual Financial Summary</Text>
//           <Text style={styles.sectionDesc}>
//             First year revenue, costs, and profit breakdown
//           </Text>

//           <View style={styles.row}>
//             <Text>Annual Revenue</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14}  color="#3b3a3c" />
//               <Text>{results.annualRevenue?.toFixed(2)}</Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <Text>Annual Costs</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text> {results.annualCosts.toLocaleString()}</Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <Text>Annual Profit</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text>{results.annualProfit.toLocaleString()}</Text>
//             </View>
//           </View>
//         </View>

//         {/* -------- Investment Breakdown -------- */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Investment Breakdown</Text>
//           <Text style={styles.sectionDesc}>
//             Where your initial investment will be allocated
//           </Text>

//           <View style={styles.row}>
//             <Text>Equipment Costs</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text>{results.costBreakdown.equipment.toLocaleString()}</Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <Text>Installation Costs</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text>{results.costBreakdown.installation.toLocaleString()}</Text>
//             </View>
//           </View>

//           <View style={[styles.row, { fontWeight: "bold", marginTop: 5 }]}>
//             <Text>Total Initial Investment</Text>
//             <View style={styles.row}>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text>{results.totalInvestment.toLocaleString()}</Text>
//             </View>
//           </View>
//         </View>

//         {/* -------- 5-Year Profit Table -------- */}
//         <View style={{ marginTop: 25 }}>
//           <Text style={styles.sectionTitle}>5-Year Profit Projections</Text>

//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.cell, { fontWeight: "bold" }]}>Year</Text>
//             <Text style={[styles.cell, { fontWeight: "bold" }]}>Revenue</Text>
//             <Text style={[styles.cell, { fontWeight: "bold" }]}>Cost</Text>
//             <Text style={[styles.cell, { fontWeight: "bold" }]}>Profit</Text>
//           </View>

//           {/* Rows */}
//           {results.yearlyProfits.map((y, index) => (
//             <View key={index} style={styles.row}>
//               <Text style={styles.cell}>Year {y.year}</Text>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text style={[styles.cell, { color: "#059669" }]}>
//                 {y.revenue.toLocaleString()}
//               </Text>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text style={[styles.cell, { color: "#DC2626" }]}>
//                 {y.costs.toLocaleString()}
//               </Text>
//               <RupeeIcon size={14} color="#3b3a3c" />
//               <Text style={[styles.cell, { fontWeight: "bold" }]}>
//                 {y.profit.toLocaleString()}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* -------- Insights -------- */}
//         <View style={{ marginTop: 25 }}>
//           <Text style={styles.sectionTitle}>
//             Key Insights & Recommendations
//           </Text>

//           <View style={styles.insightBox}>
//             <Text style={styles.insightHeading}>Strong ROI Potential</Text>
//             <Text>
//               Your projected ROI of {results.roi.toFixed(2)}% indicates
//               excellent investment potential.
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };


import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { Svg, Path } from "@react-pdf/renderer";

export const RupeeIcon = ({ size = 20, color = "#354052" }) => (
  <Svg width={size} className="mt-2" height={size} viewBox="0 0 24 24">
    
    <Path
      d="M18 5H7H10C11.0609 5 12.0783 5.42143 12.8284 6.17157C13.5786 6.92172 14 7.93913 14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13H7L13 19M7 9H18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

Font.register({
  family: "Outfit",
  fonts: [
    { src: "/fonts/Outfit-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Outfit-Medium.ttf", fontWeight: "500" },
    { src: "/fonts/Outfit-SemiBold.ttf", fontWeight: "600" },
    { src: "/fonts/Outfit-Bold.ttf", fontWeight: "bold" },
  ],
});
// ----------------------
// STYLING
// ----------------------
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Outfit",
  },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  // Metric Card Styles
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    width: "24%",
    padding: 10,
    borderRadius: 6,
  },

  amountCell: {
  width: "25%",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
},

rupee: {
  fontSize: 10,
  marginRight: 2,
},

number: {
  fontSize: 10,
  fontVariant: "tabular-nums",
},

profit: {
  color: "#059669",
  fontWeight: "bold",
},

cost: {
  color: "#DC2626",
},


  label: { fontSize: 10, color: "#555" },
  valueLarge: { fontSize: 20, fontWeight: "bold", marginTop: 3 },

  // Sections
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  sectionDesc: { fontSize: 10, marginBottom: 10, color: "#777" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'Center',
    paddingVertical: 4,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 6,
    fontWeight: "bold",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  cell: { width: "25%", fontSize: 10, padding: "7px" },

  insightBox: {
    padding: 10,
    backgroundColor: "#E8FBEA",
    borderRadius: 6,
    marginTop: 10,
  },
  insightHeading: { fontWeight: "bold", color: "#0A7A33", marginBottom: 4 },
});

// ----------------------
// DOCUMENT COMPONENT
// ----------------------
export const RoiPdfDocument = ({ results, projectName }) => {
  return (
    <Document>
  <Page size="A4" style={styles.page}>

    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.title}>ROI Investment Report</Text>
      <Text style={styles.subtitle}>
        Detailed financial analysis & projections
      </Text>
    </View>

    {/* KPI CARDS */}
    <View style={styles.cardRow}>
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>ROI</Text>
        <Text style={[styles.metricValue, { color: "#059669" }]}>
          {results.roi.toFixed(2)}%
        </Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Payback Period</Text>
        <Text style={[styles.metricValue, { color: "#2563EB" }]}>
          {results.paybackPeriod.toFixed(2)} yrs
        </Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Investment</Text>
        <Text style={[styles.metricValue, { color: "#7C3AED" }]}>
          ₹ {formatNumber(results.totalInvestment)}
        </Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>5-Year Profit</Text>
        <Text style={[styles.metricValue, { color: "#D97706" }]}>
          ₹ {formatNumber(results.fiveYearProfit)}
        </Text>
      </View>
    </View>

    {/* FINANCIAL SUMMARY */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Annual Financial Summary</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Revenue</Text>
          <Text style={styles.cell}>₹ {formatNumber(results.annualRevenue)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Costs</Text>
          <Text style={[styles.cell, { color: "#DC2626" }]}>
            ₹ {formatNumber(results.annualCosts)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Profit</Text>
          <Text style={[styles.cell, { color: "#059669", fontWeight: "bold" }]}>
            ₹ {formatNumber(results.annualProfit)}
          </Text>
        </View>
      </View>
    </View>

    {/* 5 YEAR TABLE */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>5-Year Profit Projection</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Year</Text>
          <Text style={styles.cell}>Revenue</Text>
          <Text style={styles.cell}>Cost</Text>
          <Text style={styles.cell}>Profit</Text>
        </View>

        {/* {results.yearlyProfits.map((y) => (
          <View key={y.year} style={styles.tableRow}>
            <Text style={styles.cell}>Year {y.year}</Text>
            <Text style={styles.cell}>₹ {formatNumber(y.revenue)}</Text>
            <Text style={[styles.cell, { color: "#DC2626" }]}>
              ₹ {formatNumber(y.costs)}
            </Text>
            <Text style={[styles.cell, { color: "#059669", fontWeight: "bold" }]}>
              ₹ {formatNumber(y.profit)}
            </Text>
          </View>
        ))} */}
        {results.yearlyProfits.map((y, index) => (
  <View
    key={y.year}
    style={[
      styles.tableRow,
      index % 2 === 0 && { backgroundColor: "#F9FAFB" },
    ]}
  >
    {/* Year */}
    <Text style={styles.cell}>Year {y.year}</Text>

    {/* Revenue */}
    <View style={styles.amountCell}>
      <Text style={styles.rupee}>₹</Text>
      <Text style={[styles.number, styles.profit]}>
        {formatNumber(y.revenue)}
      </Text>
    </View>

    {/* Cost */}
    <View style={styles.amountCell}>
      <Text style={styles.rupee}>₹</Text>
      <Text style={[styles.number, styles.cost]}>
        {formatNumber(y.costs)}
      </Text>
    </View>

    {/* Profit */}
    <View style={styles.amountCell}>
      <Text style={styles.rupee}>₹</Text>
      <Text style={[styles.number, styles.profit]}>
        {formatNumber(y.profit)}
      </Text>
    </View>
  </View>
))}

      </View>
    </View>

    {/* INSIGHTS */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Insights</Text>
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>Strong ROI Opportunity</Text>
        <Text>
          With an ROI of {results.roi.toFixed(2)}%, this investment shows
          excellent long-term potential.
        </Text>
      </View>
    </View>

    {/* FOOTER */}
    <Text style={styles.footer}>
      Generated by ROI Calculator • Confidential Report
    </Text>

  </Page>
</Document>

  );
};
