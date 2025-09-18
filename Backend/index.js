const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 8001;

// ------------------ Flatten survey data ------------------
function flattenSurveyData(data, parentKey = "", result = {}) {
  for (const key in data) {
    const value = data[key];
    const newKey = parentKey ? `${parentKey}_${key}` : key;

    if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === "string" && v.toLowerCase() === "other") {
          // Map "other" values with comment if available
          const commentKey = `${newKey}_other`;
          result[commentKey] = data[`${key}-Comment`] || 1;
        } else {
          result[`${newKey}_${v}`] = 1;
        }
      });
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenSurveyData(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// ------------------ Middleware ------------------
app.use(express.static(path.join(__dirname, "dist")));
app.use(cors({
  origin: ["http://localhost:5175", "https://neuralnetdatascience.com/"],
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.json());

// ------------------ MongoDB connection ------------------
mongoose.connect("mongodb://127.0.0.1:27017/innovate", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ------------------ Schemas ------------------
// Raw logs collection (untouched JSON)
const rawLogSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  data: Object
}, { timestamps: true });
const RawJsLog = mongoose.model("RawJsLog", rawLogSchema, "raw_jslog");

// Flattened survey responses collection
const surveySchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  data: Object
}, { timestamps: true });
const SurveyResponse = mongoose.model("SurveyResponse", surveySchema, "surveyresponses");

// ------------------ Utility ------------------
function generateUniqueId() {
  return Math.floor(10000000 + Math.random() * 9000000000).toString();
}

// ------------------ Routes ------------------

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// Serve survey frontend
app.get("/survey", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Save survey response
app.post("/store", async (req, res) => {
  try {
    const uid = generateUniqueId();
    const rawData = req.body.text;

    // 1️⃣ Save raw JSON into raw_jslog
    await RawJsLog.create({ uid, data: rawData });

    // 2️⃣ Flatten data
    const flattened = flattenSurveyData(rawData);

    // Merge UID at top level
    const surveyData = { uid, ...flattened };

    // 3️⃣ Save flattened data into surveyresponses
    await SurveyResponse.create({ uid, data: surveyData });

    res.status(201).json({ message: "Survey saved in both collections", uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all raw survey responses
app.get("/raw-responses", async (req, res) => {
  try {
    const responses = await RawJsLog.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all flattened survey responses
app.get("/responses", async (req, res) => {
  try {
    const responses = await SurveyResponse.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Start server ------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
