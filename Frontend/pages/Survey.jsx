import React, { useEffect, useRef, useState, useMemo } from "react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import * as SurveyThemes from "survey-core/themes";
import "survey-core/survey-core.min.css";
import { surveyJson } from "../components/json";
import { Geolocation } from "@capacitor/geolocation";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { App } from '@capacitor/app';
import SurveyHeader from "./SurveyHeader";

// ✅ Generate Unique ID
function generateUniqueId() {
    let str = Math.floor(10000000 + Math.random() * 9000000000).toString();
    if (str[0] === "0") str = "1" + str.slice(1);
    return str;
}

// ✅ Format date in Asia/Kolkata timezone
function formatDateToKolkata(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

// ✅ Helper for survey data flattening

// ✅ Expand survey data for database flattening
function expandSurveyData(data, definition) {
    const expanded = {};

    function flattenElement(el, prefix = "") {
        if (!el?.name) return;

        const name = prefix ? `${prefix}_${el.name}` : el.name;
        const value = data?.[el.name];

        // Always include base key
        if (value === undefined || value === null) {
            expanded[name] = "";
        }

        switch (el.type) {
            // ✅ Radio / Dropdown
            case "radiogroup":
            case "dropdown": {
                let selectedValue = "";
                let otherComment = "";

                if (value && typeof value === "object") {
                    selectedValue = value.value ?? value.text ?? "";
                    if (typeof selectedValue === "object") {
                        selectedValue = selectedValue.value ?? selectedValue.text ?? "";
                    }

                    // ✅ Extract inline comment if available
                    if (value.comment) otherComment = value.comment;
                } else {
                    selectedValue = value ?? "";
                }

                expanded[name] = selectedValue;

                // ✅ Check for showCommentArea / hasOther / isOtherChoice
                const hasOtherChoice =
                    el.showCommentArea === true ||
                    el.hasOther === true ||
                    (el.choices || []).some(
                        (c) => c.showCommentArea === true || c.isOtherChoice === true
                    );

                // ✅ If comment exists in data, always include `_other`
                if (hasOtherChoice || otherComment) {
                    expanded[`${name}_other`] =
                        otherComment ||
                        data?.[`${name}-Comment`] ||
                        data?.[`${name}_Comment`] ||
                        "";
                }

                break;
            }

            // ✅ Checkbox
            case "checkbox": {
                const selected = Array.isArray(value) ? value : value ? [value] : [];

                // Extract selected values (normalize strings/numbers/objects)
                const selectedValues = selected.map((v) =>
                    typeof v === "object" ? v.value?.toString() : v.toString()
                );

                // Mark 1/0 for all defined choices
                (el.choices || []).forEach((choice) => {
                    const val = choice.value?.toString();
                    const isSelected = selectedValues.includes(val);
                    expanded[`${name}_${val}`] = isSelected ? 1 : 0;

                    // ✅ Always create _otherText if choice has showCommentArea
                    if (choice.showCommentArea) {
                        // Check if user entered comment for this option
                        const commentObj = selected.find(
                            (v) => typeof v === "object" && v.value?.toString() === val
                        );
                        expanded[`${name}_${val}_otherText`] = commentObj?.comment ?? "";
                    }
                });

                // ✅ Handle built-in "Other" checkbox if el.showOtherItem / el.hasOther
                if (el.showOtherItem === true || el.hasOther === true) {
                    const otherKey = `${name}_other`;
                    const commentKey = `${name}_otherText`;
                    const isOther =
                        selectedValues.includes("other") ||
                        selectedValues.includes("9") || // fallback if "9" is used as 'Other'
                        false;

                    expanded[otherKey] = isOther ? 1 : 0;

                    // Put comment if provided, otherwise empty string
                    const inlineOtherComment = selected.find(
                        (v) => typeof v === "object" && v.comment
                    )?.comment;
                    expanded[commentKey] =
                        inlineOtherComment ??
                        data?.[`${name}-Comment`] ??
                        data?.[`${name}_Comment`] ??
                        "";
                }

                break;
            }




            // ✅ Text / Comment
            case "text":
            case "comment": {
                expanded[name] = value ?? "";
                break;
            }

            // ✅ Boolean
            case "boolean": {
                expanded[name] = value === true ? 1 : 0;
                break;
            }

            // ✅ Multiple text fields
            case "multipletext": {
                (el.items || []).forEach((item) => {
                    const key = `${name}_${item.name}`;
                    expanded[key] = value?.[item.name] ?? "";
                });
                break;
            }

            // ✅ Matrix / MatrixDropdown
            case "matrix":
            case "matrixdropdown": {
                (el.rows || []).forEach((row) => {
                    const rowKey = typeof row === "object" ? row.value : row;
                    (el.columns || []).forEach((col) => {
                        const colKey = typeof col === "object" ? col.name || col.value : col;
                        const cellValue =
                            value?.[rowKey]?.[colKey] ??
                            value?.[rowKey] ??
                            "";
                        expanded[`${name}_${rowKey}_${colKey}`] = cellValue;
                    });
                });
                break;
            }

            // ✅ Panels — recursive flatten
            case "panel": {
                (el.elements || []).forEach((child) => {
                    const childPrefix = child.name?.startsWith(`${el.name}_`)
                        ? prefix
                        : name;
                    flattenElement(child, childPrefix);
                });
                break;
            }

            // ✅ Default fallback
            default: {
                expanded[name] = value ?? "";
                break;
            }
        }
    }

    // ✅ Traverse all pages
    definition?.pages?.forEach((page) => {
        page?.elements?.forEach((el) => flattenElement(el));
    });

    // ✅ Include unmapped keys
    Object.entries(data || {}).forEach(([key, val]) => {
        if (!(key in expanded)) expanded[key] = val;
    });

    return expanded;
}



export default function SurveyPhase1() {
    const storedId = localStorage.getItem("surveyId");
    const existingId = storedId || null;

    const survey = useMemo(() => new Model(surveyJson), []);
    const uniqueIdRef = useRef(existingId || generateUniqueId());
    const locationRef = useRef({ lat: null, lon: null });
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [ipAddress, setIpAddress] = useState("Unknown");
    const [recording, setRecording] = useState(false);
    const availableLocales = survey.getUsedLocales();
    const [selectedLocale, setSelectedLocale] = useState(survey.locale || "");

    // 🧭 Request location
    const requestLocation = async () => {
        try {
            const perm = await Geolocation.requestPermissions();
            if (perm.location === "denied") throw new Error("Location denied");
            const pos = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
            });
            locationRef.current = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
            };
            return true;
        } catch (e) {
            alert("⚠️ Please enable GPS and restart the app.");
            return false;
        }
    };

    // 🎤 Voice Recorder Start
    const startAudioRecording = async () => {
        try {
            // const perm = await VoiceRecorder.requestAudioRecordingPermission();
            // if (!perm.value) throw new Error("Microphone permission denied");

            await VoiceRecorder.startRecording();
            setRecording(true);
            console.log("🎙️ Recording started...");
        } catch (e) {
            console.error("❌ Start recording error:", e);
        }
    };

    // 🎤 Voice Recorder Stop
    // 🎤 Voice Recorder Stop (fixed version)
    // ✅ Stop full audio recording safely
    const stopAudioRecording = async () => {
        try {
            const result = await VoiceRecorder.stopRecording();
            console.log("🎤 Stop Recording result:", result);

            const base64 = result?.value?.recordDataBase64;
            if (!base64) throw new Error("No audio data found");

            const folderPath = "uploads/audio";
            const timestamp = new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "")
                .slice(0, 15);
            const fileName = `audio_${uniqueIdRef.current}_${timestamp}.m4a`;

            // ✅ Ensure folder exists
            await Filesystem.mkdir({
                path: folderPath,
                directory: Directory.Data,
                recursive: true,
            }).catch(() => { });

            // ✅ Save file directly
            const filePath = `${folderPath}/${fileName}`;
            await Filesystem.writeFile({
                path: filePath,
                data: base64,
                directory: Directory.Data,
            });

            console.log("📁 Full audio saved:", filePath);

            // ✅ Upload using the same base64 (no need to read back)
            await uploadAudioToServer(filePath, uniqueIdRef.current);

            return filePath;
        } catch (e) {
            console.error("❌ Stop audio error:", e);
            return null;
        }
    };




    const startAudioRecording_Intermediate = async () => {
        try {
            // const perm = await VoiceRecorder.requestAudioRecordingPermission();
            // if (!perm.value) throw new Error("Microphone permission denied");

            await VoiceRecorder.startRecording();
            setRecording(true);
            console.log("🎙️ Recording started...");
        } catch (e) {
            console.error("❌ Start recording error:", e);
        }
    };

    // 🎤 Voice Recorder Stop
    // 🎤 Voice Recorder Stop (fixed version)
    const stopAudioRecording_Intermediate = async () => {
        try {
            const result = await VoiceRecorder.stopRecording();
            console.log("🎤 Stop Recording result:", result);

            const base64 = result?.value?.recordDataBase64;
            if (!base64) throw new Error("No audio data found");

            const folderPath = "uploads/audio";
            const pageNo = survey.currentPageNo; // <-- Add this
            // 🕒 Add timestamp (YYYYMMDD_HHMMSS)
            const timestamp = new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "")
                .slice(0, 15);

            const fileName = `audio_partial_${uniqueIdRef.current}_page${pageNo}_${timestamp}.m4a`;

            // ✅ Ensure folder exists
            try {
                await Filesystem.mkdir({
                    path: folderPath,
                    directory: Directory.Data,
                    recursive: true,
                });
            } catch (e) {
                if (!e.message.includes("already exists")) console.warn("📁 mkdir warning:", e);
            }

            const filePath = `${folderPath}/${fileName}`;
            await Filesystem.writeFile({
                path: filePath,
                data: base64,
                directory: Directory.Data,
            });

            const uriResult = await Filesystem.getUri({
                path: filePath,
                directory: Directory.Data,
            });

            console.log("📁 Partial audio saved at:", uriResult.uri);
            uploadAudioToServer(uriResult.uri, `${uniqueIdRef.current}_page${pageNo}_${timestamp}`);


            return uriResult.uri;
        } catch (e) {
            console.error("❌ Stop audio error:", e);
            return null;
        }
    };


    const uploadAudioToServer = async (filePath, uniqueId) => {
        try {
            console.log("🚀 Starting upload for:", filePath);

            // 🔹 Clean up path (remove file:// if present)
            const cleanPath = filePath.replace("file://", "");

            // 🔹 Always read from the correct directory
            const readResult = await Filesystem.readFile({
                path: cleanPath,
                directory: Directory.Data,
            });

            console.log("📂 Read file success, base64 length:", readResult.data?.length);

            // 🔹 Convert base64 → Blob safely
            const byteCharacters = atob(readResult.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([new Uint8Array(byteNumbers)], { type: "audio/m4a" });

            // 🔹 Create FormData
            const formData = new FormData();
            formData.append("uniqueId", uniqueId);
            formData.append("audio", blob, `audio_${uniqueId}.m4a`);

            // 🔹 Upload to your API
            const response = await fetch("https://api-lgbti.nnet-dataviz.com/api/upload-audio", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json", // ensure correct content-type handling on backend
                },
            });

            const result = await response.json();
            console.log("✅ Upload success:", result);
            return result;
        } catch (err) {
            console.error("🚨 Upload failed:", err);
        }
    };






    useEffect(() => {
        const backHandler = App.addListener("backButton", async () => {
            try {
                console.log("🔙 Android back button pressed");

                // ✅ 1. If not on first page, go back in survey
                if (survey.currentPageNo > 0) {
                    survey.prevPage(); // safer than manually decrementing
                    survey.render();   // ensure re-render
                    return;
                }

                // ✅ 2. If on first page, confirm before exit
                const confirmExit = window.confirm("Do you want to exit the survey?");
                if (confirmExit) {
                    const fileUri = await stopAudioRecording();
                    if (fileUri) {
                        console.log("✅ Audio saved before navigating back:", fileUri);
                    }
                    window.history.back(); // or App.exitApp() if you want to quit
                }
            } catch (err) {
                console.error("🚨 Error handling back button:", err);
            }
        });

        return () => {
            backHandler.remove(); // cleanup to prevent duplicate triggers
        };
    }, [survey]);




    // Getting IP
    const ipRef = useRef("Unknown");

    const fetchIp = async () => {
        try {
            // Use the IPv4 endpoint
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            ipRef.current = data.ip; // ✅ immediately available
            setIpAddress(data.ip); // optional, for UI display
            console.log("Your IPv4:", data.ip);
        } catch (e) {
            console.error("IP fetch error:", e);
            ipRef.current = "Unknown";
            setIpAddress("Unknown");
        }
    };

    useEffect(() => {
        const init = async () => {
            startTimeRef.current = new Date();

            const hasLocation = await requestLocation();
            if (!hasLocation) return;

            const micPerm = await VoiceRecorder.requestAudioRecordingPermission();
            if (!micPerm.value) {
                // alert("⚠️ Microphone permission denied. Enable it in Settings.");
                return;
            }

            try {
                await VoiceRecorder.initialize(); // ✅ ensures native side ready
            } catch (e) {
                console.log("VoiceRecorder.initialize skipped (handled):", e);
            }

            await startAudioRecording();
            await fetchIp();

            survey.applyTheme(SurveyThemes.DefaultLight);

            // Load existing survey data if ID exists
            if (existingId) {
                try {
                    const res = await fetch(
                        `https://api-lgbti.nnet-dataviz.com/api/get-survey/${existingId}`
                    );
                    const saved = await res.json();
                    if (saved?.data) {
                        survey.data = saved.data;
                        const lastPage = saved.lastVisitedPageNo;
                        if (lastPage !== undefined)
                            survey.currentPageNo = Math.min(lastPage, survey.pages.length - 1);
                    }
                } catch (err) {
                    console.warn("Load error:", err);
                }
            }

            localStorage.setItem("surveyId", uniqueIdRef.current);
            setLoading(false);
        };

        init();
    }, [existingId, survey]);

    // 💾 Auto-save + event handling
    useEffect(() => {
        // survey.onValueChanged.add((sender, options) => {

        // });

        survey.onCurrentPageChanged.add(async (sender) => {
            let phase1_status = "In Progress";
            if (sender.currentPageNo != 0) {
                console.log("Page 1 reached");

                // 🔸 Handle language selection only if language was set before
                const selectedLang = sender.data.language;
                if (selectedLang) {
                    console.log("Language selected:", selectedLang);
                    sender.locale = selectedLang;
                    sender.render();
                }
            }


            // if (sender.currentPageNo === 2) {
            //     console.log("🎤 Starting intermediate recording for Page 2...");
            //     await startAudioRecording_Intermediate();
            // }

            // // Example: Stop intermediate recording on Page 3
            // if (sender.currentPageNo === 3) {
            //     console.log("🛑 Stopping intermediate recording for Page 2...");
            //     await stopAudioRecording_Intermediate();
            // }


            // if (sender.currentPageNo === 6) {
            //     await startAudioRecording_Intermediate();
            // }
            // if (sender.currentPageNo === 7) {
            //     await stopAudioRecording_Intermediate();
            // }


            // if (sender.currentPageNo === 10) {
            //     await startAudioRecording_Intermediate();
            // }
            // if (sender.currentPageNo === 11) {
            //     await stopAudioRecording_Intermediate();
            // }


            if (sender.currentPageNo == 4) {
                const city = sender.data.District;
                const category = sender.data.Category;

                fetch("https://api-lgbti.nnet-dataviz.com/api/check-quota1", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        city: city,
                        category: category,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Quota check result:", data);
                        if (data.success && data.available == false) {
                            phase1_status = "Overquota";
                            sender.doComplete();
                        }
                    })
                    .catch(console.warn);
            }


            if (sender.currentPageNo == 6) {
                const city2 = sender.data.District;
                const T_Area = sender.data.T_Area;

                fetch("https://api-lgbti.nnet-dataviz.com/api/check-quota2", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        city: city2,
                        type: T_Area,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Quota check result:", data);
                        if (data.success && data.available == false) {
                            phase1_status = "Overquota";
                            sender.doComplete();
                        }
                    })
                    .catch(console.warn);
            }

            const expanded = expandSurveyData(sender.data, surveyJson);

            const processedData = {
                uniqueId: uniqueIdRef.current,
                ...expanded,
                latitude:
                    locationRef.current.lat
                        ? `${locationRef.current.lat}`
                        : "",
                longitude: locationRef.current.lon ? `${locationRef.current.lon}` : "",
                ipAddress: ipRef.current, // ✅ use ref instead of state
                startTime: formatDateToKolkata(startTimeRef.current),
                username: localStorage.getItem("username"),
                phase1_status,
                lastVisitedPageNo: sender.currentPageNo,
            };

            fetch("https://api-lgbti.nnet-dataviz.com/api/store-raw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uniqueId: uniqueIdRef.current, // ✅ Include uniqueId
                    data: sender.data,             // ✅ Send your survey data
                }),
            }).catch(console.warn);

            fetch("https://api-lgbti.nnet-dataviz.com/api/store-processed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: processedData }),
            }).catch(console.warn);

            fetch("https://api-lgbti.nnet-dataviz.com/api/store-processed_backup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: processedData }),
            }).catch(console.warn);
        });

        survey.onComplete.add(async (sender) => {
            const fileUri = await stopAudioRecording();
            if (fileUri) {
                console.log("✅ Audio saved before navigating back:", fileUri);
            }

            endTimeRef.current = new Date();
            const expanded = expandSurveyData(sender.data, surveyJson);
            let phase1_status = "Completed";
            const city = sender.data.District;
            const category = sender.data.Category;

            try {
                const res = await fetch("https://api-lgbti.nnet-dataviz.com/api/check-quota1", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ city, category }),
                });
                const data = await res.json();
                console.log("Quota check result:", data);

                if (data.success && data.available === false) {
                    phase1_status = "Overquota";
                    // You can optionally stop the survey here
                    // sender.doComplete();
                }
            } catch (err) {
                console.warn("Quota check failed:", err);
            }

            const processedData = {
                uniqueId: uniqueIdRef.current,
                ...expanded,
                latitude: locationRef.current.lat ? `${locationRef.current.lat}` : "",
                longitude: locationRef.current.lon ? `${locationRef.current.lon}` : "",
                username: localStorage.getItem("username"),
                startTime: formatDateToKolkata(startTimeRef.current),
                endTime: formatDateToKolkata(endTimeRef.current),
                ipAddress: ipRef.current,
                phase1_status
            };


            await fetch("https://api-lgbti.nnet-dataviz.com/api/store-processed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: processedData }),
            }).catch(console.warn);

            localStorage.removeItem("surveyId");
        });

    }, [survey]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#364979] rounded-full animate-spin"></div>
            </div>
        );


    return (
        <>
            <section className=" h-screen w-screen flex flex-col">
                <div className="bg-gradient-to-r from-[#2c3e50] to-[#364979] pt-[calc(env(safe-area-inset-top)+12px)] pb-2 w-full shadow-md">
                    <SurveyHeader />
                </div>

                {/* Subtle notice (can show when needed) */}
                <div className="text-center text-[11px] text-gray-500 py-2 bg-yellow-50 hidden">
                    📍 Pull down to refresh after enabling GPS or Mic
                </div>

                {/* Container for survey controls */}
                <div className="w-full flex justify-center bg-[#f8fafc] py-2 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3 w-full max-w-[480px] px-3">
                        Version 1.3.3
                    </div>
                    <div className="flex items-center gap-3 w-full max-w-[200px] px-3">
                        <select
                            id="languageSelect"
                            className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white text-[#364979] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                            value={selectedLocale}
                            onChange={(e) => {
                                const newLocale = e.target.value;
                                survey.locale = newLocale;
                                survey.render(); setSelectedLocale(newLocale);

                            }}
                        >
                            {availableLocales.map((locale, index) => (
                                <option key={index} value={locale}>
                                    {locale.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Survey */}
                <div className="px-4 py-2">
                    <Survey model={survey} />
                </div>
            </section>
        </>

    );
}
