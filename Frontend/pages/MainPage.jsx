import { FaArrowRight, FaCheck, FaFileDownload } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import Header from "./Header";
import Select from "react-select";
import { useState, useEffect, useRef, useMemo } from "react";
import Cookies from "js-cookie";

function startNewSurvey() {
    localStorage.removeItem("surveyId");
    window.location.href = "/survey";
}

function CircularLoader() {
    return (
        <div className="flex justify-center items-center py-4">
            <div className="loader"></div>
        </div>
    );
}

export default function MainPage() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleRows, setVisibleRows] = useState(20);
    const [activeTab, setActiveTab] = useState("inprogress");
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const tableContainerRef = useRef(null);
    const [quotaData, setQuotaData] = useState([]);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            alert("Invalid Session");
            window.location.href = "/";
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    "https://api-lgbti.nnet-dataviz.com/api/visualize"
                );
                const data = await response.json();
                const LoggedInUsername = localStorage.getItem("username");
                const mappedData = data.map((item, index) => ({
                    sno: index + 1,
                    id: item.data.uniqueId,
                    phase1_status: item.data.phase1_status || "N/A",
                    last_accessed_time: item.data.last_accessed_time || "N/A",
                    username: item.data.username || "N/A",
                }));


                const filteredData = mappedData.filter(
                    (item) => item.username === LoggedInUsername
                );


                setTableData(filteredData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        }
        async function fetchQuota() {
            try {
                const response = await fetch("https://api-lgbti.nnet-dataviz.com/api/count-by-gender");
                const data = await response.json();
                if (data.success) {
                    setQuotaData(data.data); // [{State, count}, ...]
                }
            } catch (err) {
                console.error("Error fetching quota data:", err);
            }
        }

        fetchQuota();
        fetchData();
    }, []);

    // ✅ In Progress Tag with custom confirm
    function InProgressTag({ id }) {
        const [hovered, setHovered] = useState(false);

        const handleClick = () => {
            setSelectedSurveyId(id);
            setShowConfirm(true);
        };

        const confirmResume = () => {
            if (selectedSurveyId) {
                localStorage.setItem("surveyId", selectedSurveyId);
                window.location.href = "/survey";
            }
        };

        return (
            <>
                <button
                    onClick={handleClick}
                    className={`
    relative py-1.5 px-3 w-full flex justify-center items-center rounded-md font-bold text-xs cursor-pointer 
    transition-all duration-200 ease-in-out transform active:translate-y-[2px] 
    ${hovered
                            ? "bg-[#c87dfa] text-[#500a7f] shadow-[0_4px_0_#7a2899]" // top bright state
                            : "bg-amber-400/70 text-[#B5971D] shadow-[0_4px_0_#94780e]" // normal
                        }
  `}
                    style={{
                        height: "26px",
                    }}
                >
                    <span
                        className="flex items-center justify-center gap-1 drop-shadow-sm"
                    >
                        Resume
                    </span>
                </button>


                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                            <h2 className="text-[#364979] text-lg font-semibold mb-3">
                                Resume Survey?
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Do you want to continue this survey where you left off?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    className="bg-[#364979] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#2a3a6a] transition"
                                    onClick={confirmResume}
                                >
                                    Yes, Resume
                                </button>
                                <button
                                    className="bg-gray-200 text-[#364979] px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    const Terminated = (
        <span className="bg-red-600/50 py-1 px-2 w-full flex justify-center items-center rounded-md text-[#8B0000] font-bold text-xs cursor-not-allowed">
            Terminated
        </span>
    );

    const completed = (
        <span className="bg-lime-600/50 py-1 px-2 w-full flex justify-center items-center rounded-md text-[#5D8E17] font-bold text-xs cursor-not-allowed">
            <FaCheck className="text-green-700 text-sm" />
        </span>
    );

    const na = (
        <span className="bg-orange-500/50 py-1 w-full flex justify-center items-center rounded-md text-[#EE6C27] font-bold text-xs cursor-pointer">
            Not Started Yet
        </span>
    );

    const start = (
        <button className="bg-sky-800/50 py-1 w-full flex justify-center items-center rounded-md text-[#02548E] font-bold text-xs cursor-pointer">
            Start
        </button>
    );

    const phase1CompletedCount = useMemo(
        () => tableData.filter((row) => row.phase1_status === "Completed").length,
        [tableData]
    );

    const phase1TerminatedCount = useMemo(
        () => tableData.filter((row) => row.phase1_status === "Terminated").length,
        [tableData]
    );

    const phase1InProgressCount = useMemo(
        () => tableData.filter((row) => row.phase1_status === "In Progress").length,
        [tableData]
    );

    return (
        <section className=" h-screen w-screen flex flex-col">
            <div className="bg-gradient-to-r from-[#2c3e50] to-[#364979] pt-[calc(env(safe-area-inset-top)+12px)] pb-2 w-full shadow-md">
                <Header />
            </div>
            <main className="bg-[#E8E8F1] flex-1 min-h-0 flex flex-col">
                {/* Top Section */}
                <section className="flex w-full">
                    <div className="w-[100%] flex justify-center">
                        <button
                            className="flex items-center gap-2 py-2 px-6 bg-[#93a6d7] text-[#364979] font-semibold rounded-md my-4 cursor-pointer shadow-md hover:shadow-[#646464] transform transition-all duration-150 hover:-translate-y-1 active:translate-y-0 active:scale-95 active:shadow-sm"
                            onClick={() => startNewSurvey()}
                        >
                            <span className="p-2 rounded-full flex items-center gap-2 font-mono">
                                New Survey <FaArrowRight className="text-[#364979]" />
                            </span>
                        </button>
                    </div>
                    <div className="w-full flex justify-center">
                        <table className="w-full max-w-[200px] text-[12px] font-semibold text-[#364979] font-mono mr-5">
                            <tbody>
                                <tr className="h-2">
                                    <td className="text-right">Conducted : </td>
                                    <td className="text-center">{tableData.length}</td>
                                </tr>
                                <tr className="h-2">
                                    <td className="text-right">Completed : </td>
                                    <td className="text-center">{phase1CompletedCount}</td>
                                </tr>
                                <tr className="h-2">
                                    <td className="text-right">In Progress : </td>
                                    <td className="text-center">{phase1InProgressCount}</td>
                                </tr>
                                <tr className="h-2">
                                    <td className="text-right">Terminated : </td>
                                    <td className="text-center">{phase1TerminatedCount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>




                </section>

                {/* Card Section with Tabs */}
                <section className="flex-1 min-h-0 p-3">
                    <hr className="border-t-4 border-[#364979] rounded-full mx-1" />
                    <div className="w-full h-full border-2 border-t-0 border-gray-300 rounded-md bg-white">

                        {/* Tab Buttons */}
                        <div className="flex w-full my-4">
                            {["inprogress", "completed", "quota"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`w-1/3 px-4 py-2 font-bold font-mono text-xs transition ${activeTab === tab
                                        ? "bg-[#364979] text-white"
                                        : "bg-gray-200 text-[#364979]"
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === "inprogress"
                                        ? "In Progress"
                                        : tab === "completed"
                                            ? "Completed"
                                            : "Quota"}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div
                            className="w-full text-sm overflow-auto"
                            style={{ maxHeight: "calc(100vh - 405px)" }}
                        >
                            {loading ? (
                                <div className="py-4 text-center">
                                    <CircularLoader />
                                </div>
                            ) : (
                                (() => {
                                    // QUOTA TAB
                                    if (activeTab === "quota") {
                                        if (quotaData.length === 0) {
                                            return (
                                                <div className="flex justify-center items-center h-[300px]">
                                                    <p className="text-[#364979] font-bold text-lg">Loading quota...</p>
                                                </div>
                                            );
                                        }

                                        const statesFromSurvey = [
                                            { value: "1", label: "Odisha" },
                                            { value: "2", label: "West Bengal" },
                                            { value: "3", label: "Bihar" },
                                            { value: "4", label: "Chhattisgarh" },
                                            { value: "5", label: "Madhya Pradesh" },
                                            { value: "6", label: "Chandigarh" },
                                            { value: "7", label: "Uttar Pradesh" },
                                            { value: "8", label: "Delhi" },
                                            { value: "9", label: "Manipur" },
                                            { value: "10", label: "Assam" },
                                            { value: "11", label: "Karnataka" },
                                            { value: "12", label: "Tamil Nadu" },
                                            { value: "13", label: "Telengana" },
                                            { value: "14", label: "Gujarat" },
                                            { value: "15", label: "Maharashtra" },
                                            { value: "16", label: "Goa" },
                                        ];

                                        return (
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead className="sticky top-0 bg-white shadow z-10">
                                                    <tr className="text-[#364979] font-bold border-b font-mono">
                                                        <th className="px-4 py-2 text-center">State</th>
                                                        <th className="px-4 py-2 text-center">Female</th>
                                                        <th className="px-4 py-2 text-center">Male</th>
                                                        <th className="px-4 py-2 text-center">Intersex</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {statesFromSurvey.map((state) => {
                                                        // Find API data for this state
                                                        const stateData = quotaData.find((q) => q.State === state.label);

                                                        // Default to 0 if missing
                                                        const femaleCount = stateData?.counts?.Female ?? 0;
                                                        const maleCount = stateData?.counts?.Male ?? 0;
                                                        const intersexCount = stateData?.counts?.Intersex ?? 0;

                                                        return (
                                                            <tr key={state.value} className="border-b hover:bg-gray-50 font-mono">
                                                                <td className="px-4 py-2 text-[#364979]">{state.label}</td>
                                                                <td className="px-4 py-2 text-[#364979] text-center">{femaleCount}/100</td>
                                                                <td className="px-4 py-2 text-[#364979] text-center">{maleCount}/100</td>
                                                                <td className="px-4 py-2 text-[#364979] text-center">{intersexCount}/100</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        );
                                    }


                                    // IN PROGRESS / COMPLETED TABS
                                    const filtered =
                                        activeTab === "inprogress"
                                            ? tableData.filter((row) => row.phase1_status === "In Progress")
                                            : tableData.filter((row) => row.phase1_status === "Completed");

                                    if (filtered.length === 0) {
                                        return (
                                            <div className="py-8 text-center text-[#364979] font-semibold">
                                                No data found
                                            </div>
                                        );
                                    }

                                    return (
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead className="sticky top-0 bg-white shadow z-10">
                                                <tr className="text-[#364979] font-bold border-b font-mono">
                                                    <th className="px-4 py-2">ID</th>
                                                    <th className="px-4 py-2">
                                                        {activeTab === "inprogress" ? "Last Accessed" : "Completed On"}
                                                    </th>
                                                    {activeTab === "inprogress" && <th className="px-4 py-2">Status</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map((row) => (
                                                    <tr key={row.id} className="border-b hover:bg-gray-50 font-mono">
                                                        <td className="px-4 py-2 text-[#364979]">{row.id}</td>
                                                        <td className="px-4 py-2 text-[#364979]">
                                                            {new Date(row.last_accessed_time).toLocaleString()}
                                                        </td>
                                                        {activeTab === "inprogress" && (
                                                            <td className="px-4 py-2">
                                                                {row.phase1_status === "In Progress" ? (
                                                                    <InProgressTag id={row.id} />
                                                                ) : row.phase1_status === "Completed" ? (
                                                                    completed
                                                                ) : null}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    );
                                })()
                            )}
                        </div>

                    </div>
                </section>
            </main>
        </section>
    );
}
