const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const fs = require("fs");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 9005;

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

app.use(cors({
  origin: ["http://localhost", "https://localhost", "capacitor://localhost", "http://localhost:5173",
    "https://demosurveyjs.nnet-dataviz.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));

app.use(express.json({ limit: '1gb' }));  // increase as needed
app.use(express.urlencoded({ limit: '1gb', extended: true }));

app.use("/recorded_audio", express.static(path.join(__dirname, "recorded_audio")));
app.use("/uploads", express.static("uploads"));



// ------------------ MongoDB connection ------------------
require("dotenv").config();

const uri = "mongodb://neuralnet:NNetBlr@mongodb.nnet-dataviz.com/ipsos_lgbti?authSource=admin";

console.log(uri);

mongoose.connect(uri, {
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

// Backup survey scheme
const backupSurveySchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  data: Object
}, { timestamps: true });
const SurveyResponseBackup = mongoose.model("backupSurveyResponses", backupSurveySchema, "backupSurveyResponses");


// val_labels schema (Variable, Value, Label)
const valLabelSchema = new mongoose.Schema({
  Variable: String,
  Value: mongoose.Schema.Types.Mixed,
  Label: String
}, { collection: 'val_labels' });
const ValLabel = mongoose.model("ValLabel", valLabelSchema);

// var_labels schema (Variable, Label)
const varLabelSchema = new mongoose.Schema({
  Variable: String,
  Label: String
}, { collection: 'var_labels' });
const VarLabel = mongoose.model("VarLabel", varLabelSchema);

const userCredSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String
}, { collection: "user_cred" });

const UserCred = mongoose.model("UserCred", userCredSchema);


const QuotaInfoSchema = new mongoose.Schema({
  City: { type: String, required: true },
  Lesbian: { type: Number, default: 0 },
  Gay: { type: Number, default: 0 },
  Bisexual: { type: Number, default: 0 },
  Transgender: { type: Number, default: 0 },
  Intersex: { type: Number, default: 0 },
  "Rural/Semi-urban": { type: Number, default: 0 },
  Urban: { type: Number, default: 0 }
});
const QuotaInfo = mongoose.model("QuotaInfo", QuotaInfoSchema, "quota_info");

// ------------------ Utility ------------------
function generateUniqueId() {
  return Math.floor(10000000 + Math.random() * 9000000000).toString();
}

// ------------------ Routes ------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "UP" });
});

app.get("/api/update-check", (req, res) => {
  res.json({ updateAvailable: false, latestVersion: "1.1.22", changes: "Changed to multer and increased storage of body-parser - Uploaded" });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads/audio");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `audio_${req.body.uniqueId || Date.now()}.m4a`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // up to 1GB
});

// POST /api/upload-audio
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    message: "Audio uploaded successfully!",
    filePath: req.file.path,
  });
});

// Save survey response
app.post("/api/store", async (req, res) => {
  try {
    // Defensive: accept either { text: {...} } or {...} directly
    let rawData = req.body.text ?? req.body;
    // if client used root property `uniqueId` inside body, handle too
    rawData = rawData.text ?? rawData; // double-check nested shape

    if (!rawData || typeof rawData !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    let uid = rawData.uniqueId || generateUniqueId(); // ✅ Reuse uniqueId if provided
    let phase1_status = rawData.phase1_status || "Unknown";

    if (rawData.data?.A2 == "2" || rawData.data?.B3 == "1") {
      phase1_status = "Terminated";
    }

    // 1️⃣ Save raw JSON into raw_jslog (insert or update)
    await RawJsLog.findOneAndUpdate(
      { uid },
      { uid, data: rawData },
      { upsert: true, new: true }
    );

    // 2️⃣ Flatten data
    let flattened = flattenSurveyData(rawData);

    // 3️⃣ Auto-calculate derived fields
    const age = flattened.B1 ? parseInt(flattened.B1, 10) : null;
    let B1_PostCode = null;
    if (age !== null) {
      if (age <= 20) {
        B1_PostCode = "1";
      } else if (age <= 24) {
        B1_PostCode = "2";
      } else if (age <= 35) {
        B1_PostCode = "3";
      } else if (age <= 45) {
        B1_PostCode = "4";
      } else if (age <= 60) {
        B1_PostCode = "5";
      } else {
        B1_PostCode = "6";
      }
    }

    // Merge UID + calculated values
    // NOTE: removed undefined `state` reference (was causing crash)
    const surveyData = { uid, ...flattened, B1_PostCode, phase1_status };

    // 5️⃣ Save flattened data into surveyresponses (insert or update)
    await SurveyResponse.findOneAndUpdate(
      { uid },
      { uid, data: surveyData },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Survey saved/updated in both collections", uid });
  }
  catch (err) {
    console.error("❌ Store error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all raw survey responses
app.get("/api/raw-responses", async (req, res) => {
  try {
    const responses = await RawJsLog.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all flattened survey responses
app.get("/api/responses", async (req, res) => {
  try {
    const responses = await SurveyResponse.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/store-raw", async (req, res) => {
  try {
    const { data, uniqueId } = req.body;  // pull uniqueId from body root
    const uid = uniqueId;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: "Invalid payload for store-raw" });
    }

    // Clone data
    let enrichedData = { ...data };

    // 1️⃣ Auto-calculate derived fields
    const city = enrichedData.city ? parseInt(enrichedData.city, 10) : null;
    const A2 = enrichedData.A2 || null;
    const B3 = enrichedData.B3 || null;
    const age = enrichedData.B1 ? parseInt(enrichedData.B1, 10) : null;
    let B1_PostCode = null;
    if (age !== null) {
      if (age <= 20) B1_PostCode = "1";
      else if (age <= 24) B1_PostCode = "2";
      else if (age <= 35) B1_PostCode = "3";
      else if (age <= 45) B1_PostCode = "4";
      else if (age <= 60) B1_PostCode = "5";
      else B1_PostCode = "6";
    }

    enrichedData.B1_PostCode = B1_PostCode;

    // 🏛️ State calculation
    let state = null;
    if (city === 1) state = "1";
    else if ([2, 7, 17, 26, 41].includes(city)) state = "2";
    else if ([3, 33, 46].includes(city)) state = "3";
    else if ([4, 54, 60].includes(city)) state = "4";
    else if ([5, 18, 32, 34, 39, 57].includes(city)) state = "5";
    else if (city === 6) state = "6";
    else if ([8, 9, 25, 30].includes(city)) state = "7";
    else if ([10, 42, 44].includes(city)) state = "8";
    else if ([11, 16, 22, 36, 37, 48, 51, 52, 53, 59].includes(city)) state = "9";
    else if ([12, 13, 14, 19, 23, 29].includes(city)) state = "10";
    else if ([15, 21, 45, 47].includes(city)) state = "11";
    else if (city === 20) state = "12";
    else if ([24, 27].includes(city)) state = "13";
    else if ([28, 56].includes(city)) state = "14";
    else if ([31, 49].includes(city)) state = "15";
    else if ([35, 55].includes(city)) state = "16";
    else if (city === 38) state = "17";
    else if ([40, 43, 50].includes(city)) state = "18";
    else if (city === 58) state = "19";

    enrichedData.state = state;
    let phase1_status = enrichedData.phase1_status || "Unknown";

    if (A2 == "2" || B3 == "1") {
      phase1_status = "Terminated";
    }
    enrichedData.phase1_status = phase1_status;

    let district = enrichedData.District;
    if (district == "1" || district == "2" || district == "3" || district == "4") {
      enrichedData.zone = "1"; //East
    }
    if (district == "5" || district == "6" || district == "7" || district == "8" || district == "9") {
      enrichedData.zone = "2"; //North
    }
    if (district == "10" || district == "11") {
      enrichedData.zone = "3"; //North East
    }
    if (district == "12" || district == "13" || district == "14") {
      enrichedData.zone = "4"; //South
    }
    if (district == "15" || district == "16" || district == "17" || district == "18") {
      enrichedData.zone = "5"; //West
    }

    // 2️⃣ Save in raw collection
    await RawJsLog.findOneAndUpdate(
      { uid },
      { uid, data: enrichedData },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Raw survey saved WITH CITY AND STATE", uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/store-processed", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: "Invalid payload for store-processed" });
    }
    let uniqueId = data.uniqueId;
    const uid = uniqueId;

    // Clone data
    let cleanedData = { ...data };

    const age = cleanedData.B1 ? parseInt(cleanedData.B1, 10) : null;
    let B1_PostCode = null;
    if (age !== null) {
      if (age > 0 && age <= 20) B1_PostCode = "1";
      else if (age > 20 && age <= 24) B1_PostCode = "2";
      else if (age > 24 && age <= 35) B1_PostCode = "3";
      else if (age > 35 && age <= 45) B1_PostCode = "4";
      else if (age > 45 && age <= 60) B1_PostCode = "5";
      else if (age > 60) B1_PostCode = "6";
    }

    let phase1_status = cleanedData.phase1_status || "Unknown";

    // If the client explicitly sent "Overquota", preserve it
    if (phase1_status !== "Overquota" && phase1_status !== "In Progress") {
      // Only set Terminated if screening questions match
      if (cleanedData.A2 == "2" || cleanedData.B3 == "1") {
        phase1_status = "Terminated";
      } else {
        // Default to Completed if not terminated or overquota
        phase1_status = "Completed";
      }
    }

    const keysToFlatten = [
      "C4", "C5", "E2", "E4",
      "D18aa", "D18bb",
      "D4_2", "D4_3", "D4_4", "D4_5", "D4_6", "D4_7", "D4_8", "D4_9", "D4_10", "D4_11", "D4_12", "D4_13", "D4_14"
    ];

    keysToFlatten.forEach((key) => {
      if (cleanedData[key]?.value !== undefined) {
        cleanedData[key] = cleanedData[key].value;
      }
    });

    let district = cleanedData.District;
    if (district == "1" || district == "2" || district == "3" || district == "4") {
      cleanedData.zone = "1";
    }
    if (district == "5" || district == "6" || district == "7" || district == "8" || district == "9") {
      cleanedData.zone = "2";
    }
    if (district == "10" || district == "11") {
      cleanedData.zone = "3";
    }
    if (district == "12" || district == "13" || district == "14") {
      cleanedData.zone = "4";
    }
    if (district == "15" || district == "16" || district == "17" || district == "18") {
      cleanedData.zone = "5";
    }

    cleanedData.B1_PostCode = B1_PostCode;
    cleanedData.phase1_status = phase1_status;

    // 2️⃣ Handle "other" in Q20
    if (Array.isArray(data.Q20) && data.Q20.includes("other")) {
      cleanedData["Q20_10"] = 1;
    }

    // 3️⃣ Handle "other" in Q21
    if (Array.isArray(data.Q21) && data.Q21.includes("other")) {
      cleanedData["Q21_10"] = 1;
    }
    // // 4️⃣ Delete unwanted raw keys
    // const keysToDelete = ["B6", "B7", "Int1", "Int2", "Int3", "Int4", "D1", "D2", "D3", "D4", "D11", "D12", "F1",
    //   "B2", "B3", "C1", "C7", "C8", "C11", "C12", "C13", "D1_1", "D1_2", "D11_1", "D11_3", "D11_2", "D11_5", "D15", "D16", "D17", "D18", "D18-Comment", "F2", "F3",
    //   "D1_3", "D1_4", "D1_5", "D4_5", "D11_4", "E2-Comment"
    // ];
    // keysToDelete.forEach(key => {
    //   if (cleanedData.hasOwnProperty(key)) {
    //     delete cleanedData[key];
    //   }
    // });

    // 🧹 Remove "_$&" from keys
    cleanedData = Object.fromEntries(
      Object.entries(cleanedData).map(([key, value]) => [key.replace("_$&", ""), value])
    );
    // 🕒 Add last_accessed_time in Asia/Kolkata
    const kolkataTime = DateTime.now().setZone("Asia/Kolkata").toFormat("yyyy-MM-dd HH:mm:ss");
    cleanedData.last_accessed_time = kolkataTime;
    // 5️⃣ Save to surveyresponses collection
    await SurveyResponse.findOneAndUpdate(
      { uid },
      { uid, data: cleanedData },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Processed survey saved  WITH CITY AND STATE", uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/store-processed_backup", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: "Invalid payload for store-processed" });
    }
    let uniqueId = data.uniqueId;
    const uid = uniqueId;

    // Clone data
    let cleanedData = { ...data };

    const age = cleanedData.B1 ? parseInt(cleanedData.B1, 10) : null;
    let B1_PostCode = null;
    if (age !== null) {
      if (age > 0 && age <= 20) B1_PostCode = "1";
      else if (age > 20 && age <= 24) B1_PostCode = "2";
      else if (age > 24 && age <= 35) B1_PostCode = "3";
      else if (age > 35 && age <= 45) B1_PostCode = "4";
      else if (age > 45 && age <= 60) B1_PostCode = "5";
      else if (age > 60) B1_PostCode = "6";
    }

    let phase1_status = cleanedData.phase1_status || "Unknown";

    // If the client explicitly sent "Overquota", preserve it
    if (phase1_status !== "Overquota") {
      // Only set Terminated if screening questions match
      if (cleanedData.A2 == "2" || cleanedData.B3 == "1") {
        phase1_status = "Terminated";
      } else {
        // Default to Completed if not terminated or overquota
        phase1_status = "Completed";
      }
    }

    const keysToFlatten = [
      "C4", "C5", "E2", "E4",
      "D18aa", "D18bb",
      "D4_2", "D4_3", "D4_4", "D4_5", "D4_6", "D4_7", "D4_8", "D4_9", "D4_10", "D4_11", "D4_12", "D4_13", "D4_14"
    ];

    keysToFlatten.forEach((key) => {
      if (cleanedData[key]?.value !== undefined) {
        cleanedData[key] = cleanedData[key].value;
      }
    });

    let district = cleanedData.District;
    if (district == "1" || district == "2" || district == "3" || district == "4") {
      cleanedData.zone = "1";
    }
    if (district == "5" || district == "6" || district == "7" || district == "8" || district == "9") {
      cleanedData.zone = "2";
    }
    if (district == "10" || district == "11") {
      cleanedData.zone = "3";
    }
    if (district == "12" || district == "13" || district == "14") {
      cleanedData.zone = "4";
    }
    if (district == "15" || district == "16" || district == "17" || district == "18") {
      cleanedData.zone = "5";
    }

    cleanedData.B1_PostCode = B1_PostCode;
    cleanedData.phase1_status = phase1_status;

    // 2️⃣ Handle "other" in Q20
    if (Array.isArray(data.Q20) && data.Q20.includes("other")) {
      cleanedData["Q20_10"] = 1;
    }

    // 3️⃣ Handle "other" in Q21
    if (Array.isArray(data.Q21) && data.Q21.includes("other")) {
      cleanedData["Q21_10"] = 1;
    }
    // // 4️⃣ Delete unwanted raw keys
    // const keysToDelete = ["B6", "B7", "Int1", "Int2", "Int3", "Int4", "D1", "D2", "D3", "D4", "D11", "D12", "F1",
    //   "B2", "B3", "C1", "C7", "C8", "C11", "C12", "C13", "D1_1", "D1_2", "D11_1", "D11_3", "D11_2", "D11_5", "D15", "D16", "D17", "D18", "D18-Comment", "F2", "F3",
    //   "D1_3", "D1_4", "D1_5", "D4_5", "D11_4", "E2-Comment"
    // ];
    // keysToDelete.forEach(key => {
    //   if (cleanedData.hasOwnProperty(key)) {
    //     delete cleanedData[key];
    //   }
    // });

    // 🧹 Remove "_$&" from keys
    cleanedData = Object.fromEntries(
      Object.entries(cleanedData).map(([key, value]) => [key.replace("_$&", ""), value])
    );
    // 🕒 Add last_accessed_time in Asia/Kolkata
    const kolkataTime = DateTime.now().setZone("Asia/Kolkata").toFormat("yyyy-MM-dd HH:mm:ss");
    cleanedData.last_accessed_time = kolkataTime;
    // 5️⃣ Save to surveyresponses collection
    await SurveyResponseBackup.findOneAndUpdate(
      { uid },
      { uid, data: cleanedData },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Processed survey saved  WITH CITY AND STATE", uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get-survey/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find raw survey answers
    const raw = await RawJsLog.findOne({ uid: id });

    // Find processed survey (metadata like last page)
    const processed = await SurveyResponse.findOne({ uid: id });

    if (!raw && !processed) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json({
      data: raw ? raw.data : {},   // answers
      lastVisitedPageNo: processed?.data?.lastVisitedPageNo ?? 0,
      lastVisitedPageName: processed?.data?.lastVisitedPageName ?? "",
      phase1_status: processed?.data?.phase1_status ?? "In Progress",
      phase2_status: processed?.data?.phase2_status ?? "In Progress",
      phase3_status: processed?.data?.phase3_status ?? "In Progress",
    });
  } catch (err) {
    console.error("Error fetching survey:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/visualize", async (req, res) => {
  try {
    // 1️⃣ Fetch survey data
    const surveys = await SurveyResponse.find(
      {},
      {
        "data.uniqueId": 1,
        "data.State": 1,
        "data.District": 1,
        "data.N_Area": 1,
        "data.phase1_status": 1,
        "data.last_accessed_time": 1,
        "data.username": 1,
        _id: 0
      }
    );

    if (!surveys || surveys.length === 0) {
      return res.status(404).json({ message: "No surveys found" });
    }

    // 2️⃣ Fetch all label mappings from val_labels collection
    const labelsArray = await ValLabel.find({});
    const valLabels = {};
    labelsArray.forEach(labelDoc => {
      // labelDoc has Variable, Value, Label
      if (!valLabels[labelDoc.Variable]) valLabels[labelDoc.Variable] = {};
      valLabels[labelDoc.Variable][String(labelDoc.Value)] = labelDoc.Label;
    });

    res.json(surveys);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Credentials API ------------------
app.post("/api/cred", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserCred.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Check password (⚠️ plain-text for now)
    if (user.password === password) {
      res.json({
        success: true,
        message: "Login successful",
        userId: user.id,
        username: user.username
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.get("/api/count-by-gender", async (req, res) => {
  try {
    const result = await SurveyResponse.aggregate([
      // Only completed surveys with B4 (gender) set
      {
        $match: {
          "data.B4": { $exists: true, $ne: null },
          "data.phase1_status": "Completed"
        }
      },

      // Lookup state name
      { $addFields: { "data.StateInt": { $toInt: "$data.State" } } },
      {
        $lookup: {
          from: "val_labels",
          localField: "data.StateInt",
          foreignField: "Value",
          as: "stateInfo"
        }
      },
      { $unwind: "$stateInfo" },
      { $match: { "stateInfo.Variable": "State" } },

      // Lookup gender label
      { $addFields: { "data.B4Int": { $toInt: "$data.B4" } } },
      {
        $lookup: {
          from: "val_labels",
          localField: "data.B4Int",
          foreignField: "Value",
          as: "genderInfo"
        }
      },
      { $unwind: "$genderInfo" },
      { $match: { "genderInfo.Variable": "B4" } },

      // Group by state and gender
      {
        $group: {
          _id: { state: "$stateInfo.Label", gender: "$genderInfo.Label" },
          count: { $sum: 1 }
        }
      },

      // Group by state and build gender counts object
      {
        $group: {
          _id: "$_id.state",
          counts: {
            $push: { k: "$_id.gender", v: "$count" }
          }
        }
      },

      // Convert array of k/v to object
      {
        $project: {
          _id: 0,
          State: "$_id",
          counts: { $arrayToObject: "$counts" }
        }
      },

      { $sort: { State: 1 } }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error counting by gender:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ------------------ data_by_values (returns only data array) ------------------
app.get("/api/data_by_values", async (req, res) => {
  try {
    const allResponses = await SurveyResponse.find();

    if (!allResponses || allResponses.length === 0) {
      return res.status(404).json([]);
    }

    const formattedData = allResponses.map(doc => {
      const obj = doc.toObject();
      const flat = {
        _id: obj._id,
        uid: obj.uid,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        ...obj.data
      };
      return flat;
    });

    res.json(formattedData); // only data array
  } catch (err) {
    console.error("Error fetching data_by_values:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ data_by_labels (map values -> labels, fallback to original value) ------------------
// ------------------ data_by_labels (map values -> labels, fallback to original value) ------------------
app.get("/api/data_by_labels", async (req, res) => {
  try {
    // fetch responses
    const allResponses = await SurveyResponse.find();
    if (!allResponses || allResponses.length === 0) return res.status(404).json([]);

    // fetch label collections
    const valLabels = await ValLabel.find({});

    // build valLabelMap: { Variable: { Value: Label } }
    const valLabelMap = {};
    valLabels.forEach(item => {
      if (!item.Variable) return;
      if (!valLabelMap[item.Variable]) valLabelMap[item.Variable] = {};
      valLabelMap[item.Variable][String(item.Value)] = item.Label;
    });

    // (you intentionally skipped var_labels)
    const varLabelMap = {};

    // transform each document
    const labeledData = allResponses.map(doc => {
      const obj = doc.toObject();
      const flat = {
        _id: obj._id,
        uid: obj.uid,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      };

      for (const [key, value] of Object.entries(obj.data || {})) {
        // handle arrays (multi-select)
        if (Array.isArray(value)) {
          flat[key] = value.map(v => {
            const lbl = valLabelMap[key]?.[String(v)];
            return lbl ? normalizeValue(lbl) : normalizeValue(v);
          });
        } else {
          const lbl = valLabelMap[key]?.[String(value)];
          flat[key] = lbl ? normalizeValue(lbl) : normalizeValue(value);
        }
      }

      // rename keys if varLabelMap has a label (currently unused)
      const renamed = {};
      for (const [k, v] of Object.entries(flat)) {
        const newKey = varLabelMap[k] || k;
        renamed[newKey] = v;
      }

      return renamed;
    });

    res.json(labeledData);
  } catch (err) {
    console.error("Error fetching data_by_labels:", err);
    res.status(500).json({ error: err.message });
  }
});

// CATEGORY MAP (from survey JSON)
const categoryMap = {
  "1": "Lesbian",
  "2": "Gay",
  "3": "Bisexual",
  "4": "Transgender",
  "5": "Intersex"
};

// DISTRICT MAP (from survey JSON)
const districtMap = {
  "1": "Bhubaneshwar",
  "2": "Kolkata",
  "3": "Patna",
  "4": "Raipur",
  "5": "Bhopal",
  "6": "Chandigarh",
  "7": "Varanasi",
  "8": "Lucknow",
  "9": "Delhi",
  "10": "Imphal",
  "11": "Guwahati",
  "12": "Bangalore",
  "13": "Chennai",
  "14": "Hyderabad",
  "15": "Ahmedabad",
  "16": "Mumbai",
  "17": "Pune",
  "18": "Goa"
};

const areaTypeMap = {
  "1": "Urban",
  "2": "Rural",
  "3": "Semi-urban"
}

// District*Category
app.post("/api/check-quota1", async (req, res) => {
  try {
    let { city, category } = req.body;

    if (!city || !category) {
      return res.status(400).json({ success: false, message: "city and category are required" });
    }

    const mappedCity = districtMap[city] || city;
    const mappedCategory = categoryMap[category] || category;

    const quotaDoc = await QuotaInfo.findOne({ City: mappedCity });
    if (!quotaDoc) {
      return res.status(404).json({ success: false, message: `City quota not found for ${mappedCity}` });
    }

    const quota = quotaDoc[mappedCategory];
    if (quota === undefined) {
      return res.status(404).json({ success: false, message: `Quota not defined for ${mappedCategory}` });
    }

    // 🔹 Flexible count query
    const count = await SurveyResponse.countDocuments({
      $and: [
        {
          $or: [
            { "data.District": city },
            { "data.District": Number(city) }
          ]
        },
        {
          $or: [
            { "data.Category": category },
            { "data.Category": Number(category) }
          ]
        },
        { "data.phase1_status": { $regex: /^Completed$/i } }
      ]
    });

    const remaining = quota - count;
    const available = remaining > 0;

    res.json({
      success: true,
      city: mappedCity,
      category: mappedCategory,
      totalQuota: quota,
      used: count,
      remaining: Math.max(remaining, 0),
      available
    });

  } catch (err) {
    console.error("Error checking quota:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


app.get("/api/readjson", (req, res) => {
  fs.readFile('survey.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    let data2 = JSON.parse(data);
    res.send(data2);
  });
});
// City*T_Area
app.post("/api/check-quota2", async (req, res) => {
  try {
    const { city, type } = req.body;

    if (!city || !type) {
      return res.status(400).json({
        success: false,
        message: "city and type are required",
      });
    }

    // 🔹 1. Convert numeric codes to readable labels
    const mappedCity = districtMap[city] || city; // handles code or label

    let mappedCategory;
    if (type === "1") mappedCategory = "Urban";
    else if (type === "2" || type === "3") mappedCategory = "Rural/Semi-urban";
    else mappedCategory = type; // fallback if already text

    // 🔹 2. Find quota info for the city
    const quotaDoc = await QuotaInfo.findOne({ City: mappedCity });

    if (!quotaDoc) {
      return res.status(404).json({
        success: false,
        message: `City quota not found for ${mappedCity}`,
      });
    }

    // 🔹 3. Ensure category exists in quota document
    const quota = quotaDoc[mappedCategory];
    if (quota === undefined) {
      return res.status(404).json({
        success: false,
        message: `Quota not defined for ${mappedCategory}`,
      });
    }

    // 🔹 4. Count how many have already completed for this city+category
    const count = await SurveyResponse.countDocuments({
      "data.District": city, // stored as code (e.g., "1", "2")
      "data.T_Area": type,       // stored as code (e.g., "1", "2")
      "data.phase1_status": "Completed",
    });

    // 🔹 5. Calculate availability
    const remaining = quota - count;
    const available = remaining > 0;

    // 🔹 6. Send clean structured response
    res.json({
      success: true,
      cityCode: city,
      cityLabel: mappedCity,
      typeCode: type,
      categoryLabel: mappedCategory,
      totalQuota: quota,
      used: count,
      remaining: Math.max(remaining, 0),
      available,
    });
  } catch (err) {
    console.error("Error checking quota2:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});




// ------------------ helper ------------------
function normalizeValue(val) {
  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    if (lower === "selected") return 1;
    if (lower === "not selected") return 0;
  }
  return val;
}



// ------------------ Start server ------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
