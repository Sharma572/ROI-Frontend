// import { useAuth0 } from "@auth0/auth0-react";
// import { ArrowLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const InvestmentReport = () => {
//   const { user } = useAuth0();
//   const CurrentUserId = user?.sub;
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     // 👇 Replace with your actual API endpoint
//     fetch(
//       `${process.env.REACT_APP_BASE_URL}/api/v1/investments/getinvestments?user_id=${CurrentUserId}`
//     )
//       .then((res) => res.json())
//       .then((result) => {
//         setData(result);
//       })
//       .catch((err) => console.error("Error fetching data:", err));
//   }, []);

//   console.log("Investment Data", data);

//   const handleView =(data)=>{
//    console.log("Data Of Selected Item",data);
//     navigate("/", {
//       state: { project: data }   // ⬅ Pass full project data
//     });
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <div className="flex justify-between w-[58%]">
//         {/* Back button */}
//         <span className="flex items-center ">
//           <button
//             onClick={() => navigate("/")}
//             className="flex items-center justify-center w-10 h-10 rounded-full 
//              bg-emerald-100 text-emerald-700 
//              hover:bg-emerald-600 hover:text-white 
//              shadow-sm hover:shadow-md transition-all duration-300"
//           >
//             <ArrowLeft
//               size={20}
//               className="transition-transform duration-200 hover:-translate-x-1"
//             />
//           </button>
//           <span className="ml-2 font-semibold">Back</span>
//         </span>

//         <h2 className="text-2xl font-sans font-bold flex items-center justify-center">
//           Your Saved Project
//         </h2>
//       </div>
//       <table
//         style={{
//           borderCollapse: "collapse",
//           width: "100%",
//           marginTop: "20px",
//         }}
//       >
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={thStyle}>User ID</th>
//             <th style={thStyle}>ROI</th>
//             <th style={thStyle}>Payback (Years)</th>
//             <th style={thStyle}>Total Investment</th>
//             <th style={thStyle}>5-Year Profit</th>
//             <th style={thStyle}>Revenue</th>
//             <th style={thStyle}>Costs</th>
//             <th style={thStyle}>Profit</th>
//             <th style={thStyle}>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>
//                 Loading or No Data Found
//               </td>
//             </tr>
//           ) : (
//             data.map((item) => (
//               <tr key={item._id}>
//                 <td style={tdStyle}>{item.user_id}</td>
//                 <td style={tdStyle}>{item.roi}</td>
//                 <td style={tdStyle}>{item.payback_period_years}</td>
//                 <td style={tdStyle}>
//                   {item.total_investment.toLocaleString()}
//                 </td>
//                 <td style={tdStyle}>
//                   {item.five_year_profit.toLocaleString()}
//                 </td>
//                 <td style={tdStyle}>
//                   {item.annual_financial_summary.revenue.toLocaleString()}
//                 </td>
//                 <td style={tdStyle}>
//                   {item.annual_financial_summary.costs.toLocaleString()}
//                 </td>
//                 <td style={tdStyle}>
//                   {item.annual_financial_summary.profit.toLocaleString()}
//                 </td>
//                 <td style={tdStyle}>
//                   <button onClick={()=>handleView(item)}>View</button>
//                   </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Simple table styles
// const thStyle = {
//   border: "1px solid #ddd",
//   padding: "10px",
//   textAlign: "left",
//   fontWeight: "bold",
// };

// const tdStyle = {
//   border: "1px solid #ddd",
//   padding: "10px",
// };

// export default InvestmentReport;

import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// MRT imports
import { MaterialReactTable } from "material-react-table";

// import { Box, Button } from "@mui/material";

const InvestmentReport = () => {
  const { user } = useAuth0();
  const CurrentUserId = user?.sub;
  const [data, setData] = useState([]);
  const navigate = useNavigate();
const [editModalOpen, setEditModalOpen] = useState(false);
const [editProjectName, setEditProjectName] = useState("");
const [selectedProject, setSelectedProject] = useState(null);
const handleEdit = (project) => {
  setSelectedProject(project);
  setEditProjectName(project.project_name);
  setEditModalOpen(true);
};
const handleUpdateProjectName = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/investments/updateinvestment`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProject._id,
          project_name: editProjectName,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    setData((prev) =>
      prev.map((item) =>
        item._id === selectedProject._id
          ? { ...item, project_name: editProjectName }
          : item
      )
    );

    setEditModalOpen(false);
  } catch (err) {
    console.error(err);
    alert("Failed to update project name!");
  }
};

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/investments/getinvestments?user_id=${CurrentUserId}`
    )
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleView = (item) => {
    navigate("/", {
      state: { project: item },
    });
  };

  // 🔥 Define MRT columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "project_name",
        header: "Project Name",
        Cell: ({ row }) => (
    <div className="flex items-center justify-between">
      <span className="font-bold">{row.original.project_name}</span>

      {/* Edit Button beside Project Name */}
      <button
        onClick={() => handleEdit(row.original)}
        className="ml-3 text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Edit
      </button>
    </div>
  ),
      },
      {
        accessorKey: "roi",
        header: "ROI (%)",
        // Cell: ({ cell }) => `${Number(cell.getValue()).toFixed(2)}%`,
      },
      {
        accessorKey: "payback_period_years",
        header: "Payback (Years)",
        Cell: ({ cell }) => Number(cell.getValue()).toFixed(2),
      },
      {
        accessorKey: "total_investment",
        header: "Total Investment",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-IN"),
      },
      {
        accessorKey: "five_year_profit",
        header: "5-Year Profit",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-IN"),
      },
      {
        accessorFn: (row) => row.annual_financial_summary.revenue,
        id: "revenue",
        header: "Revenue",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-IN"),
      },
      {
        accessorFn: (row) => row.annual_financial_summary.costs,
        id: "costs",
        header: "Costs",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-IN"),
      },
      {
        accessorFn: (row) => row.annual_financial_summary.profit,
        id: "profit",
        header: "Profit",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-IN"),
      },
      {
        header: "Action",
        id: "action",
        Cell: ({ row }) => (
          <button
            className="rounded-md font-outfit text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
            onClick={() => handleView(row.original)}
          >
           <span className="flex justify-between items-center ">
            <Eye /> 
            <span className="ml-2">
               View
              </span>
            
            </span>  
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-10 h-10 rounded-full 
             bg-emerald-100 text-emerald-700 
             hover:bg-emerald-600 hover:text-white 
             shadow-sm hover:shadow-md transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="ml-2 font-semibold">Back</span>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Saved Projects</h2>

      {/* 🔥 Material React Table Instead of HTML Table */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters
        enableSorting
        enablePagination
        enableRowActions={false}
        muiTablePaperProps={{
          elevation: 3,
          sx: { borderRadius: "12px" },
        }}
        muiTableBodyProps={{
          sx: { cursor: "pointer" },
        }}
      />
      {editModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
      <h3 className="text-lg font-bold mb-4">Edit Project Name</h3>

      <input
        type="text"
        className="border rounded-md w-full px-3 py-2"
        value={editProjectName}
        onChange={(e) => setEditProjectName(e.target.value)}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setEditModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateProjectName}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default InvestmentReport;
