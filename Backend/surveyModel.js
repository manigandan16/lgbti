import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
    username: String,
    title: String,
    json: Object, // stores your SurveyJS JSON
});

export default mongoose.model("Survey", surveySchema);
