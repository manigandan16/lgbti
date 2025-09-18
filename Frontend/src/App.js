import React, { useEffect, useRef, useState, useMemo } from "react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import * as SurveyThemes from "survey-core/themes";
import "survey-core/survey-core.min.css";
import { surveyJson } from "./components/json";

function generateUniqueId() {
  console.log("Generating unique ID");

  return Math.floor(10000000 + Math.random() * 9000000000).toString();
  // Generates between 8 and 10 digits
}

export default function App() {
  const startTimeRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [ipAddress, setIpAddress] = useState("Unknown");
  const [uniqueId] = useState(generateUniqueId); // stays constant for session

  // Format date to YYYY-MM-DD HH:MM:SS
  const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Format duration as mm:ss
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Get device/browser info
  const getDeviceAndBrowserInfo = () => {
    const ua = navigator.userAgent;
    const browserLanguage = navigator.language || navigator.userLanguage;
    const platform = navigator.platform;
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    return {
      userAgent: ua,
      browserLanguage,
      platform,
      screenResolution: screenRes,
    };
  };

  // 👇 Create survey only once
  const survey = useMemo(() => {
    const s = new Model(surveyJson);
    s.applyTheme(SurveyThemes.DefaultLight);

    // When page changes
    s.onCurrentPageChanged.add((sender) => {
      const currentTime = new Date();
      const startTime = startTimeRef.current;
      const duration = formatDuration(currentTime - startTime);
      const deviceInfo = getDeviceAndBrowserInfo();

      const final_result = {
        uniqueId,
        ...sender.data,
        startTime: formatDateTime(startTime),
        currentTime: formatDateTime(currentTime),
        duration,
        latitude: location.lat || "Location not available",
        longitude: location.lon || "Location not available",
        ipAddress,
        ...deviceInfo,
      };
    });


    function updateTierFromCity(sender, cityValue) {
      console.log("Updating tier based on city:", cityValue);

      const cityTierMap = {
        "Delhi NCR": "Tier 1",
        "Mumbai": "Tier 1",
        "Kolkata": "Tier 1",
        "Bengaluru": "Tier 1",
        "Chennai": "Tier 1",
        "Hyderabad": "Tier 1",
        "Pune": "Tier 1",
        "Ahmedabad": "Tier 1",
        "Surat": "Tier 1",
        "Jaipur": "Tier 1",
        "Lucknow": "Tier 1",
        "Kozhikode": "Tier 1",
        "Thrissur": "Tier 2",
        "Kochi": "Tier 2",
        "Indore": "Tier 2",
        "Kanpur": "Tier 2",
        "Nagpur": "Tier 2",
        "Coimbatore": "Tier 2",
        "Thiruvananthapuram": "Tier 2",
        "Patna": "Tier 2",
        "Bhopal": "Tier 2",
        "Agra": "Tier 2",
        "Kannur": "Tier 2",
        "Visakhapatnam": "Tier 2",
        "Vadodara": "Tier 2",
        "Nashik": "Tier 2",
        "Vijayawada": "Tier 2",
        "Nowrangapur": "Tier 2",
        "Kollam": "Tier 2",
        "Rajkot": "Tier 2",
        "Ludhiana": "Tier 2",
        "Teni": "Tier 2",
        "Haora": "Tier 2",
        "Madurai": "Tier 2",
        "Raipur": "Tier 2",
        "Meerut": "Tier 2",
        "Varanasi": "Tier 2",
        "Srinagar": "Tier 2",
        "Tiruppur": "Tier 2",
        "Jamshedpur": "Tier 2",
        "Aurangabad": "Tier 2",
        "Jodhpur": "Tier 2",
        "Ranchi": "Tier 2",
        "Kota": "Tier 2",
        "Jabalpur": "Tier 2",
        "Asansol": "Tier 2",
        "Gwalior": "Tier 2",
        "Allahabad": "Tier 2",
        "Amritsar": "Tier 2",
        "Dhanbad": "Tier 2",
        "Bareilly": "Tier 2",
        "Aligarh": "Tier 2",
        "Moradabad": "Tier 2",
        "Mysore": "Tier 2",
        "Durg-Bhilainagar": "Tier 2",
        "Bhubaneswar": "Tier 2",
        "Tiruchirappalli": "Tier 2",
        "Chandigarh": "Tier 2",
        "Saharanpur": "Tier 2",
        "Hubli-Dharwad": "Tier 2"
      };

      const tier = cityTierMap[cityValue] || "Other";
      const tierQuestion = sender.getQuestionByName("Tier");
      if (tierQuestion) {
        tierQuestion.value = tier;
        console.log(`City: ${cityValue}, Tier set to: ${tier}`);
      }
    }

    // When value changes
    s.onValueChanged.add((sender, options) => {
      console.log(`Value changed: ${options.name} = ${options.value}`);

      if (options.name === "Q21") {
        const q22 = sender.getQuestionByName("Q22");
        const selected = options.value || [];

        q22.columns.forEach((col) => {
          const shouldShow = selected.includes(Number(col.name));
          q22.setColumnVisibility(col.name, shouldShow);
          console.log(`Column ${col.name} visibility set to ${shouldShow}`);

          if (shouldShow && !col.title) {
            col.title = col.name === "1" ? "Clinical Chemistry" :
              col.name === "2" ? "Hematology" :
                col.name === "3" ? "Immunoassay" :
                  `Column ${col.name}`;
          }
        });

        const q23 = sender.getQuestionByName("Q23");
        const selected2 = options.value || [];

        q23.columns.forEach((col) => {
          const shouldShow = selected2.includes(Number(col.name));
          q23.setColumnVisibility(col.name, shouldShow);
          console.log(`Column ${col.name} visibility set to ${shouldShow}`);

          if (shouldShow && !col.title) {
            col.title = col.name === "1" ? "Clinical Chemistry" :
              col.name === "2" ? "Hematology" :
                col.name === "3" ? "Immunoassay" :
                  `Column ${col.name}`;
          }
        });
      }

      if (options.name === "City") {
        updateTierFromCity(sender, options.value);
      }
    });

    // When survey completes
    s.onComplete.add((sender) => {
      const endTime = new Date();
      const startTime = startTimeRef.current;
      const duration = formatDuration(endTime - startTime);
      const deviceInfo = getDeviceAndBrowserInfo();

      const final_result = {
        ...sender.data,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        duration,
        latitude: location.lat || "Location not available",
        longitude: location.lon || "Location not available",
        ipAddress,
        ...deviceInfo,
      };

      console.log("Final Survey results with timestamps, location, and device info:", final_result);

      fetch("http://localhost:8001/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: final_result }),
      });
    });

    return s;
  }, [location, ipAddress, uniqueId]); // rebuild survey only if these change

  // Initial setup
  useEffect(() => {
    startTimeRef.current = new Date();
    console.log("Survey started for Innovate:", formatDateTime(startTimeRef.current));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Location access denied:", err.message);
        }
      );
    }

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch((err) => console.warn("IP fetch error:", err));
  }, []);

  return <Survey model={survey} />;
}
