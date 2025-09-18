import React, { useEffect, useRef, useState } from "react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import * as SurveyThemes from "survey-core/themes";
import "survey-core/survey-core.min.css";
import { surveyJson } from "./components/json";

export default function App() {
  const survey = new Model(surveyJson);
  const startTimeRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [ipAddress, setIpAddress] = useState("Unknown");

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
  //IP Address & Device Make & Model
  useEffect(() => {
    startTimeRef.current = new Date(); // Store raw Date
    console.log("Survey started at:", formatDateTime(startTimeRef.current));

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
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

  survey.applyTheme(SurveyThemes.DefaultLight);

  survey.onComplete.add((sender) => {
    const endTime = new Date();
    const startTime = startTimeRef.current;
    const duration = formatDuration(endTime - startTime);

    const deviceInfo = getDeviceAndBrowserInfo();

    const final_result = {
      ...sender.data,
      startTime: formatDateTime(startTime),
      endTime: formatDateTime(endTime),
      duration: duration,
      latitude: location.lat || "Location not available",
      longitude: location.lon || "Location not available",
      ipAddress: ipAddress,
      ...deviceInfo
    };

    console.log("Survey results with timestamps, location, and device info:", final_result);

    // Example: send to backend
    fetch("/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: final_result })  // wrap final_result here
    });

  });

  return <Survey model={survey} />;
}
