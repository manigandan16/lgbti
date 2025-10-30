const res = await fetch("https://api-lgbti.nnet-dataviz.com/api/readjson");
export const surveyJson = await res.json();