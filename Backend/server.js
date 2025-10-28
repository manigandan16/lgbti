const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 9002;

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
  origin: [
    "http://localhost:5175",
    "https://neuralnetdatascience.com",
    "http://localhost:5174",
    "http://localhost:5173"
  ],
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.json());

// ------------------ MongoDB connection ------------------
require("dotenv").config();

const uri = "mongodb://neuralnet:NNetBlr@mongodb.nnet-dataviz.com/innovate?authSource=admin";

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


const ValLabel = mongoose.model("ValLabel", new mongoose.Schema({
  field: String,
  choices: Object
}, { collection: 'val_labels' }));

const userCredSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String
}, { collection: "user_cred" });

const UserCred = mongoose.model("UserCred", userCredSchema);

// ------------------ Utility ------------------
function generateUniqueId() {
  return Math.floor(10000000 + Math.random() * 9000000000).toString();
}

// ------------------ Routes ------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "UP" });
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
    let phase2_status = rawData.phase2_status || "Unknown";
    let phase3_status = rawData.phase3_status || "Unknown";

    if (rawData.data?.Q6 == "2" || rawData.data?.Q7 == "2" || rawData.data?.Q8 == "2") {
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
    if (age <= 20) {
      B1_PostCode = "1";
    }
    else if (age >= 21 && age <= 24) {
      B1_PostCode = "2";
    }
    else if (age >= 25 && age <= 35) {
      B1_PostCode = "3";
    }
    else if (age >= 36 && age <= 45) {
      B1_PostCode = "4";
    }
    else if (age >= 46 && age <= 60) {
      B1_PostCode = "5";
    }
    else if (age > 60) {
      B1_PostCode = "6";
    }

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

    if (flattened.Q6 == "2" || flattened.Q7 == "2" || flattened.Q8 == "2") {
      phase1_status = "Terminated";
    }

    // Merge UID + calculated values
    const surveyData = { uid, ...flattened, B1_PostCode, state, phase1_status, phase2_status, phase3_status };

    // 5️⃣ Save flattened data into surveyresponses (insert or update)
    await SurveyResponse.findOneAndUpdate(
      { uid },
      { uid, data: surveyData },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Survey saved/updated in both collections", uid });
  } catch (err) {
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

    // 🏙️ Tier calculation
    let tier = null;
    if (city && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(city)) {
      tier = "1";
    } else if (city) {
      tier = "2";
    }

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

    // Add to raw data
    enrichedData.tier = tier;
    enrichedData.state = state;

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

    // 1️⃣ Auto-calculate derived fields
    const city = cleanedData.city ? parseInt(cleanedData.city, 10) : null;

    // 🏙️ Tier calculation
    let tier = null;
    if (city && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(city)) {
      tier = "1";
    } else if (city) {
      tier = "2";
    }

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

    // Save them in processed data
    cleanedData.tier = tier;
    cleanedData.state = state;

    // 2️⃣ Handle "other" in Q20
    if (Array.isArray(data.Q20) && data.Q20.includes("other")) {
      cleanedData["Q20_10"] = 1;
    }

    // 3️⃣ Handle "other" in Q21
    if (Array.isArray(data.Q21) && data.Q21.includes("other")) {
      cleanedData["Q21_10"] = 1;
    }

    // 4️⃣ Delete unwanted raw keys
    const keysToDelete = ["Q17", "Q18", "Q19", "Q19-Comment", "Q20", "Q21", "Q23_1", "Q23_2", "Q23_3", "Q23_4"];
    keysToDelete.forEach(key => {
      if (cleanedData.hasOwnProperty(key)) {
        delete cleanedData[key];
      }
    });

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
        "data.Q4": 1,
        "data.Q5": 1,
        "data.Q6": 1,
        "data.Q17": 1,
        "data.Q18": 1,
        "data.Q19": 1,
        "data.city": 1,
        "data.tier": 1,
        "data.state": 1,
        "data.phase1_status": 1,
        "data.phase2_status": 1,
        "data.phase3_status": 1,
        "data.createdAt": 1,
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
      valLabels[labelDoc.field] = labelDoc.choices;
    });

    // 3️⃣ City, Tier, State labels
    const cityLabels = {
      1: "Delhi", 2: "Mumbai", 3: "Kolkata", 4: "Bangalore", 5: "Chennai", 6: "Hyderabad",
      7: "Pune", 8: "Ahmedabad", 9: "Surat", 10: "Jaipur", 11: "Lucknow", 12: "Thiruvananthapuram",
      13: "Kochi", 14: "Kozhikode", 15: "Bhopal", 16: "Kanpur", 17: "Nagpur", 18: "Coimbatore",
      19: "Kollam", 20: "Patna", 21: "Indore", 22: "Agra", 23: "Kochi", 24: "Vijayawada",
      25: "Rajkot", 26: "Nashik", 27: "Visakhapatnam", 28: "Bhubaneswar", 29: "Kottayam",
      30: "Vadodara", 31: "Amritsar", 32: "Madurai", 33: "Howrah", 34: "Tirunelveli",
      35: "Raipur", 36: "Varanasi", 37: "Kanpur", 38: "Srinagar", 39: "Salem", 40: "Dhanbad",
      41: "Thane", 42: "Jodhpur", 43: "Ranchi", 44: "Udaipur", 45: "Gwalior", 46: "Darjeeling",
      47: "Rewa", 48: "Meerut", 49: "Jalandhar", 50: "Hazaribagh", 51: "Noida", 52: "Allahabad",
      53: "Moradabad", 54: "Mysore", 55: "Raigarh", 56: "Cuttack", 57: "Tiruppur", 58: "Chandigarh",
      59: "Ghaziabad", 60: "Mangalore"
    };

    const tierLabels = { "1": "Tier 1", "2": "Tier 2" };

    const stateLabels = {
      "1": "Delhi/Haryana/UP", "2": "Maharashtra", "3": "West Bengal", "4": "Karnataka",
      "5": "Tamil Nadu", "6": "Telangana", "7": "Gujarat", "8": "Rajasthan",
      "9": "Uttar Pradesh", "10": "Kerala", "11": "Madhya Pradesh", "12": "Bihar",
      "13": "Andhra Pradesh", "14": "Odisha", "15": "Punjab", "16": "Chhattisgarh",
      "17": "Jammu and Kashmir", "18": "Jharkhand", "19": "Chandigarh"
    };

    const Q5Labels = {
      "1": "Lab",
      "2": "Hospital"
    };

    const Q6Labels = {
      "1": "Pathology",
      "2": "Imaging",
      "3": "Both"
    };
    // 4️⃣ Map numeric codes and calculate tier/state
    const mappedSurveys = surveys.map(entry => {
      const data = entry.data;
      const city = parseInt(data.city);

      // Calculate tier
      let tier = city && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(city) ? "1" : city ? "2" : null;

      // Calculate state
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

      const mapped = { uniqueId: data.uniqueId };

      // Map fields with labels if available, else retain original
      for (const key in data) {
        if (key === "city") mapped.city = cityLabels[city] ?? data.city;
        else if (key === "tier") mapped.tier = tierLabels[tier] ?? data.tier ?? tier;
        else if (key === "state") mapped.state = stateLabels[state] ?? data.state ?? state;
        else if (key === "Q5") mapped.Q5 = Q5Labels[data.Q5] ?? data.Q5;
        else if (key === "Q6") mapped.Q6 = Q6Labels[data.Q6] ?? data.Q6;

        else if (valLabels[key]) mapped[key] = valLabels[key][String(data[key])] ?? data[key];

        else mapped[key] = data[key]; // retain original if label missing
      }

      return mapped;
    });

    res.json(mappedSurveys);

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


app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ------------------ Start server ------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
