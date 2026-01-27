import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// MRT imports
import { MaterialReactTable } from "material-react-table";
import { useUser } from "@/contexts/userContext";

const InvestmentReport = () => {
  const { user } = useAuth0();
  
  const { userState } = useUser();
    console.log("userState in result",userState);
    // Subscription State ✌️✌️✌️
    const isUserSubscribed = userState?.profile?.isSubscribed;
  

  const [isLoading, setIsLoading] = useState(true);
  const CurrentUserId = userState?.profile?.user_id;
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
      `${process.env.REACT_APP_BASE_URL}/api/v1/investments/update/${selectedProject._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUser: {
    sub: user?.sub,
    email: user?.email,
  },
          project_name: editProjectName,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    // Update UI
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
  if (!CurrentUserId) return;

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/investments/getinvestments?user_id=${CurrentUserId}`
      );

      const result = await res.json();
      setData([...result].reverse());
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [CurrentUserId]);


  const handleView = (item) => {
    navigate("/", {
      state: { project: item },
    });
  };


const visibleData = isUserSubscribed ? data : data.slice(0, 2);
const isLocked = !isUserSubscribed;
const BlurredCell = ({ value }) => (
  <div className="relative">
    <span className="select-none blur-sm">
      {value?.toLocaleString?.("en-IN") ?? value}
    </span>
    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-500">
      
    </span>
  </div>
);
 // 🔥 Define MRT columns
  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "project_name",
  //       header: "Project Name",
  //       Cell: ({ row }) => (
  //   <div className="flex items-center justify-between">
  //     <span className="font-bold">{row.original.project_name}</span>

  //     {/* Edit Button beside Project Name */}
  //     <button
  //       onClick={() => handleEdit(row.original)}
  //       className="ml-3 text-blue-600 hover:text-blue-800 underline text-sm"
  //     >
  //       Edit
  //     </button>
  //   </div>
  // ),
  //     },
  //     {
  //       accessorKey: "createdAt",
  //       header: "Created At",
  //     Cell: ({ cell }) => {
  //   const d = new Date(cell.getValue());
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${day}-${month}-${year}`;
  // },
  //     },
  //     {
  //       accessorKey: "roi",
  //       header: "ROI (%)",
  //       // Cell: ({ cell }) => `${Number(cell.getValue()).toFixed(2)}%`,
  //     },
  //     {
  //       accessorKey: "payback_period_years",
  //       header: "Payback (Years)",
  //       Cell: ({ cell }) => Number(cell.getValue()).toFixed(2),
  //     },
  //     {
  //       accessorKey: "total_investment",
  //       header: "Total Investment",
  //       Cell: ({ cell }) =>
  //         Number(cell.getValue()).toLocaleString("en-IN"),
  //     },
  //     {
  //       accessorKey: "five_year_profit",
  //       header: "5-Year Profit",
  //       Cell: ({ cell }) =>
  //         Number(cell.getValue()).toLocaleString("en-IN"),
  //     },
  //     {
  //       accessorFn: (row) => row.annual_financial_summary.revenue,
  //       id: "revenue",
  //       header: "Revenue",
  //       Cell: ({ cell }) =>
  //         Number(cell.getValue()).toLocaleString("en-IN"),
  //     },
  //     {
  //       accessorFn: (row) => row.annual_financial_summary.costs,
  //       id: "costs",
  //       header: "Costs",
  //       Cell: ({ cell }) =>
  //         Number(cell.getValue()).toLocaleString("en-IN"),
  //     },
  //     {
  //       accessorFn: (row) => row.annual_financial_summary.profit,
  //       id: "profit",
  //       header: "Profit",
  //       Cell: ({ cell }) =>
  //         Number(cell.getValue()).toLocaleString("en-IN"),
  //     },
  //     {
  //       header: "Action",
  //       id: "action",
  //       Cell: ({ row }) => (
  //         <button
  //           className="rounded-md font-outfit text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
  //           onClick={() => handleView(row.original)}
  //         >
  //          <span className="flex justify-between items-center ">
  //           <Eye /> 
  //           <span className="ml-2">
  //              View
  //             </span>
            
  //           </span>  
  //         </button>
  //       ),
  //     },
  //   ],
  //   []
  // );

  const columns = useMemo(
  () => [
    // ✅ Project Name (VISIBLE + Edit only if subscribed)
    {
      accessorKey: "project_name",
      header: "Project Name",
      Cell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span className="font-bold">
            {row.original.project_name}
          </span>

          {isUserSubscribed && (
            <button
              onClick={() => handleEdit(row.original)}
              className="ml-3 text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Edit
            </button>
          )}
        </div>
      ),
    },

    // ✅ Created At (VISIBLE)
    {
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ cell }) => {
        const d = new Date(cell.getValue());
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },

    // 🔒 ROI
    {
      accessorKey: "roi",
      header: "ROI (%)",
      Cell: ({ cell }) =>
        isLocked ? (  
          <BlurredCell value="XX.XX%" />
        ) : (
          `${Number(cell.getValue()).toFixed(2)}%`
        ),
    },

    // 🔒 Payback
    {
      accessorKey: "payback_period_years",
      header: "Payback (Years)",
      Cell: ({ cell }) =>
        isLocked ? (
          <BlurredCell value="X.XX" />
        ) : (
          Number(cell.getValue()).toFixed(2)
        ),
    },

    // 🔒 Total Investment
    {
      accessorKey: "total_investment",
      header: "Total Investment",
      Cell: ({ cell }) =>
        isLocked ? (
        <BlurredCell value="₹XX,XX,XXX" />
        ) : (
          Number(cell.getValue()).toLocaleString("en-IN")
        ),
    },

    // 🔒 5-Year Profit
    {
      accessorKey: "five_year_profit",
      header: "5-Year Profit",
      Cell: ({ cell }) =>
        isLocked ? (
          <BlurredCell value="₹XX,XX,XXX" />
        ) : (
          Number(cell.getValue()).toLocaleString("en-IN")
        ),
    },

    // 🔒 Revenue
    {
      accessorFn: (row) => row.annual_financial_summary.revenue,
      id: "revenue",
      header: "Revenue",
      Cell: ({ cell }) =>
        isLocked ? (
        
          <BlurredCell value="₹XX,XX,XXX" />
        ) : (
          Number(cell.getValue()).toLocaleString("en-IN")
        ),
    },

    // 🔒 Costs
    {
      accessorFn: (row) => row.annual_financial_summary.costs,
      id: "costs",
      header: "Costs",
      Cell: ({ cell }) =>
        isLocked ? (
          <BlurredCell value="₹XX,XX,XXX" />
        ) : (
          Number(cell.getValue()).toLocaleString("en-IN")
        ),
    },

    // 🔒 Profit
    {
      accessorFn: (row) => row.annual_financial_summary.profit,
      id: "profit",
      header: "Profit",
      Cell: ({ cell }) =>
        isLocked ? (
          <BlurredCell value="₹XX,XX,XXX" />
        ) : (
          Number(cell.getValue()).toLocaleString("en-IN")
        ),
    },

    // 🔒 Action column
    {
      header: "Action",
      id: "action",
      Cell: ({ row }) =>
        isUserSubscribed ? (
          <button
            className="rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm flex items-center"
            onClick={() => handleView(row.original)}
          >
            <Eye className="mr-2" /> View
          </button>
        ) : (
          <button className="text-white bg-blue-400 text-sm font-medium px-4 py-1 rounded-md select-none">
            Upgrade To View Saved Report
          </button>

        ),
    },
  ],
  [isUserSubscribed]
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
    <div className="flex items-center mb-6">
  {/* Left: Heading */}
  <h2 className="text-2xl font-bold">
    Your Saved Projects
  </h2>

  {/* Right: Upgrade CTA (only for locked users) */}
  {isLocked && (
    <div className="relative ml-5 w-[55%]">
  {/* Glow */}
  <div className="absolute -inset-1 rounded-xl 
    bg-gradient-to-r from-green-400 to-blue-500 
    opacity-60 blur-md"></div>

  {/* Card */}
  <div className="relative flex justify-between items-center gap-4 px-5 py-3 rounded-xl
    bg-white border shadow-lg">
    
    <div>
      <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
        <span></span> Unlock All Features
      </p>
      <p className="text-xs text-gray-500 pl-5">
       View Detailed Table 
      </p>
    </div>

    <button
      onClick={() => navigate("/pricing")}
      className="px-4 py-2 text-sm font-semibold
        bg-gradient-to-r from-green-500 to-green-600
        text-white rounded-lg hover:opacity-90
        animate-pulse"
    >
      Upgrade
    </button>
  </div>
</div>

  )}
</div>
     <div className="relative">
 <MaterialReactTable
  columns={columns}
  data={visibleData}
  state={{
    isLoading,
    showSkeletons: isLoading,
  }}
  isLoading={isLoading}
  enableColumnFilters={isUserSubscribed}
  enableSorting={isUserSubscribed}
  enablePagination={isUserSubscribed}
  muiTablePaperProps={{
    elevation: 3,
    sx: { borderRadius: "12px", overflowX: "auto" },
  }}
/>


  
</div>


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
