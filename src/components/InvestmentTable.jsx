import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InvestmentReport = () => {
  const { user } = useAuth0();
  const CurrentUserId = user?.sub;
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // 👇 Replace with your actual API endpoint
    fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/investments/getinvestments?user_id=${CurrentUserId}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  console.log("Investment Data", data);

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-between w-[58%]">
        {/* Back button */}
        <span className="flex items-center ">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-full 
             bg-emerald-100 text-emerald-700 
             hover:bg-emerald-600 hover:text-white 
             shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft
              size={20}
              className="transition-transform duration-200 hover:-translate-x-1"
            />
          </button>
          <span className="ml-2 font-semibold">Back</span>
        </span>

        <h2 className="text-2xl font-sans font-bold flex items-center justify-center">
          Your Saved Project
        </h2>
      </div>
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
                <td style={tdStyle}>
                  {item.total_investment.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {item.five_year_profit.toLocaleString()}
                </td>
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
