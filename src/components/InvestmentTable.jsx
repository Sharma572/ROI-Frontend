import React, { useEffect, useState } from "react";

const InvestmentReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 👇 Replace with your actual API endpoint
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/investments/getallinvestments`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  console.log("Investment Data",data);
  

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-2xl font-sans font-bold flex items-center justify-center">Investment Summary</h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>User ID</th>
            <th style={thStyle}>ROI</th>
            <th style={thStyle}>Payback (Years)</th>
            <th style={thStyle}>Total Investment</th>
            <th style={thStyle}>5-Year Profit</th>
            <th style={thStyle}>Revenue</th>
            <th style={thStyle}>Costs</th>
            <th style={thStyle}>Profit</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>
                Loading or No Data Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id}>
                <td style={tdStyle}>{item.user_id}</td>
                <td style={tdStyle}>{item.roi}</td>
                <td style={tdStyle}>{item.payback_period_years}</td>
                <td style={tdStyle}>{item.total_investment.toLocaleString()}</td>
                <td style={tdStyle}>{item.five_year_profit.toLocaleString()}</td>
                <td style={tdStyle}>
                  {item.annual_financial_summary.revenue.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {item.annual_financial_summary.costs.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {item.annual_financial_summary.profit.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Simple table styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default InvestmentReport;
