export const surveyJson = {
  "title": "Project - Innovate",
  "pages": [
    {
      "name": "page-Intro",
      "elements": [
        {
          "type": "dropdown",
          "name": "City",
          "title": "City",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Delhi/Haryana/UP"
            },
            {
              "value": "2",
              "text": "Maharashtra"
            },
            {
              "value": "3",
              "text": "West Bengal"
            },
            {
              "value": "4",
              "text": "Karnataka"
            },
            {
              "value": "5",
              "text": "Tamil Nadu"
            },
            {
              "value": "6",
              "text": "Telangana"
            },
            {
              "value": "7",
              "text": "Gujarat"
            },
            {
              "value": "8",
              "text": "Rajasthan"
            },
            {
              "value": "9",
              "text": "Uttar Pradesh"
            },
            {
              "value": "10",
              "text": "Kerala"
            },
            {
              "value": "11",
              "text": "Madhya Pradesh"
            },
            {
              "value": "12",
              "text": "Bihar"
            },
            {
              "value": "13",
              "text": "Andhra Pradesh"
            },
            {
              "value": "14",
              "text": "Odisha"
            },
            {
              "value": "15",
              "text": "Punjab"
            },
            {
              "value": "16",
              "text": "Chhattisgarh"
            },
            {
              "value": "17",
              "text": "Jammu and Kashmir"
            },
            {
              "value": "18",
              "text": "Jharkhand"
            }
          ]
        }
      ]
    },
    {
      "name": "page7",
      "elements": [
        {
          "type": "dropdown",
          "name": "State",
          "title": "State",
          "isRequired": true,
          "choices": [
            { "value": "1", "text": "Andhra Pradesh" },
            { "value": "2", "text": "Bihar" },
            { "value": "3", "text": "Chhattisgarh" },
            { "value": "4", "text": "Delhi/Haryana/UP" },
            { "value": "5", "text": "Gujarat" },
            { "value": "6", "text": "Jammu and Kashmir" },
            { "value": "7", "text": "Jharkhand" },
            { "value": "8", "text": "Karnataka" },
            { "value": "9", "text": "Kerala" },
            { "value": "10", "text": "Madhya Pradesh" },
            { "value": "11", "text": "Maharashtra" },
            { "value": "12", "text": "Odisha" },
            { "value": "13", "text": "Punjab" },
            { "value": "14", "text": "Rajasthan" },
            { "value": "15", "text": "Tamil Nadu" },
            { "value": "16", "text": "Telangana" },
            { "value": "17", "text": "Uttar Pradesh" },
            { "value": "18", "text": "West Bengal" }
          ]
        }
      ]
    },
    {
      "name": "page0",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Tier",
          "title": "Select Tier",
          "choices": [
            {
              "value": "Tier 1",
              "text": "Tier 1"
            },
            {
              "value": "Tier 2",
              "text": "Tier 2"
            }
          ],
          "isRequired": true
        }
      ]
    },
    {
      "name": "pageq5h",
      "elements": [
        {
          "type": "comment",
          "name": "Q5h",
          "title": "Q5h. Address",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q5i",
          "title": "Q5i. Pin Code",
          "isRequired": true,
          "inputType": "number",
          "max": 999999
        },
        {
          "type": "text",
          "name": "Q5j",
          "title": "Q5j. Landline No",
          "isRequired": true,
          "inputType": "tel"
        }
      ]
    },
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "Q1",
          "title": "Q1. Name of the Respondent with whom Primary Research is done",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q2",
          "title": "Q2. Designation of the respondent (Receptionist is not accepted)",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q3",
          "title": "Q3. Contact no in which you have spoken to the respondent",
          "isRequired": true,
          "inputType": "number",
          "min": 6000000000,
          "max": 9999999999,
          "minErrorText": "Please provide the valid Mobile Number",
          "maxErrorText": "Please provide the valid Mobile Number"
        }
      ]
    },
    {
      "name": "page2",
      "title": "Demographic",
      "elements": [
        {
          "type": "text",
          "name": "Q4",
          "title": "Q4. Name of the Institute/Organization",
          "isRequired": true
        },
        {
          "type": "radiogroup",
          "name": "Q5",
          "title": "Q5. Type",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Lab"
            },
            {
              "value": "2",
              "text": "Hospital"
            }
          ]
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5a",
          "visibleIf": "{Q5} = 1",
          "title": "Q5a. Lab",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Standalone"
            },
            {
              "value": "2",
              "text": "Chain Lab"
            }
          ]
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5b",
          "visibleIf": "{Q5} = 2",
          "title": "Q5b. Hospital",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Nursing Home"
            },
            {
              "value": "2",
              "text": "Private"
            },
            {
              "value": "3",
              "text": "Public"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "Q5c",
          "visibleIf": "{Q5b} = 2",
          "title": "Q5c. Private Hospital",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Standalone"
            },
            {
              "value": "2",
              "text": "Corporate Chain"
            },
            {
              "value": "3",
              "text": "Medical College"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "Q5d",
          "title": "Q5d. Public Hospital",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Medical College"
            },
            {
              "value": "2",
              "text": "Defence (R&R-Command)"
            },
            {
              "value": "3",
              "text": "Railway"
            },
            {
              "value": "4",
              "text": "ESIC"
            },
            {
              "value": "5",
              "text": "PSU"
            },
            {
              "value": "6",
              "text": "Others"
            }
          ]
        }
      ]
    },

    {
      "name": "page6",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5f",
          "title": "Q5f. Type of City",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Metro"
            },
            {
              "value": "2",
              "text": "Semi-Metro"
            },
            {
              "value": "3",
              "text": "Tier1"
            },
            {
              "value": "4",
              "text": "Tier 2"
            },
            {
              "value": "5",
              "text": "Tier 3"
            },
            {
              "value": "6",
              "text": "Tier4"
            },
            {
              "value": "7",
              "text": "Tier5"
            },
            {
              "value": "8",
              "text": "Others"
            }
          ]
        }
      ]
    },

    {
      "name": "page8",
      "elements": [
        {
          "type": "text",
          "name": "Q5k",
          "title": "Q5k. Mobile No if any",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "Q5l",
          "title": "Q5l. Website, If Any"
        },
        {
          "type": "text",
          "name": "Q5m",
          "title": "Q5m. Toll Free No if any",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page9",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q6",
          "title": "Q6. Type of Diahnostic Tests done in your Lab ",
          "choices": [
            {
              "value": "1",
              "text": "Pathology"
            },
            {
              "value": "2",
              "text": "Imaging"
            },
            {
              "value": "3",
              "text": "Both",
              "isExclusive": true
            }
          ]
        }
      ]
    },
    {
      "name": "page10",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q7",
          "title": "Q7. Do you have your own Lab Equipment to carry out Pathology Tests",
          "choices": [
            {
              "value": "1",
              "text": "Yes"
            },
            {
              "value": "2",
              "text": "No"
            }
          ]
        }
      ]
    },
    {
      "name": "page11",
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q8",
          "title": "Q8. Test Done Only Outsourced Terminate ",
          "choices": [
            {
              "value": "1",
              "text": "Inhouse"
            },
            {
              "value": "2",
              "text": "Out Sourced"
            },
            {
              "value": "3",
              "text": "Both"
            }
          ]
        }
      ]
    },
    {
      "name": "page12",
      "elements": [
        {
          "type": "multipletext",
          "name": "Q9",
          "title": "Q9. Only For Hospitals",
          "items": [
            {
              "name": "1",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Number of Beds"
            },
            {
              "name": "2",
              "title": "Operational Beds"
            },
            {
              "name": "3",
              "title": "Occupied Beds"
            },
            {
              "name": "4",
              "title": "ICU Beds"
            }
          ]
        }
      ]
    },
    {
      "name": "page13",
      "elements": [
        {
          "type": "text",
          "name": "Q10",
          "title": "Q10. Near by Railway Station",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q11",
          "title": "Q11. Near by Airport",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q12",
          "title": "Q12. Distance from Railway Station",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q13",
          "title": "Q13. Distance from Airport",
          "isRequired": true
        }
      ]
    },
    {
      "name": "page16",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "Q16",
          "title": "Q16. Connects (Optional)",
          "columns": [
            {
              "name": "1",
              "title": "Name",
              "cellType": "text"
            },
            {
              "name": "2",
              "title": "Email ID (Best effort)",
              "cellType": "text",
              "inputType": "email"
            },
            {
              "name": "3",
              "title": "Mobile No (Best effort)",
              "cellType": "text",
              "inputType": "number",
              "min": 6000000000,
              "max": 9999999999
            },
            {
              "name": "4",
              "title": "Extn to the Landline",
              "cellType": "text",
              "inputType": "tel"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ],
          "rows": [
            {
              "value": "1",
              "text": "Lab Head/HOD"
            },
            {
              "value": "2",
              "text": "Head BioMedical"
            },
            {
              "value": "3",
              "text": "Head of Institution/Director/Superintendent of Hospital"
            }
          ]
        }
      ]
    },
    {
      "name": "page14",
      "elements": [
        {
          "type": "multipletext",
          "name": "Q17",
          "title": "Q17. Financials FY 25",
          "items": [
            {
              "name": "1",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Annual Revenue (Rs. Lakhs)"
            },
            {
              "name": "2",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Diagnostics (Path Lab +Imaging)  Revenue, Rs (Lakhs)"
            },
            {
              "name": "3",
              "isRequired": true,
              "inputType": "number",
              "title": "Lab Diagnostics Revenue, Rs. Lakhs"
            },
            {
              "name": "4",
              "isRequired": true,
              "inputType": "number",
              "title": "Breakdown of Lab Diagnostic Revenue, Rs (Lakhs)  - In-house"
            },
            {
              "name": "5",
              "isRequired": true,
              "inputType": "number",
              "title": "Breakdown of Lab Diagnostic Revenue, Rs (Lakhs)  - Out"
            }
          ]
        }
      ]
    },
    {
      "name": "page15",
      "elements": [
        {
          "type": "multipletext",
          "name": "Q18",
          "title": "Q18. Average Patients & Test Numbers/Day",
          "items": [
            {
              "name": "1",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Number of Patients Visiting for the test"
            },
            {
              "name": "2",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Number of Diagnostic Tests"
            },
            {
              "name": "3",
              "isRequired": true,
              "inputType": "number",
              "title": "Total number of Tests Outsourced"
            }
          ]
        }
      ]
    },
    {
      "name": "page17",
      "elements": [
        {
          "type": "checkbox",
          "name": "Q19",
          "title": "Q19. Type of Tests that are done in the Insitution",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Clinical Chemistry"
            },
            {
              "value": "2",
              "text": "Hematology"
            },
            {
              "value": "3",
              "text": "Immunoassay"
            },
            {
              "value": "4",
              "text": "Microbiology"
            },
            {
              "value": "5",
              "text": "Blood Bank"
            },
            {
              "value": "6",
              "text": "Cytology"
            },
            {
              "value": "7",
              "text": "Histopathology"
            },
            {
              "value": "8",
              "text": "Molecular Diagnostics"
            },
            {
              "value": "9",
              "text": "Toxicology"
            }
          ],
          "showOtherItem": true,
          "otherText": "Others, If any"
        }
      ]
    },
    {
      "name": "page18",
      "elements": [
        {
          "type": "checkbox",
          "name": "Q20",
          "title": "Q20. Type of Tests that are done in-house by the Insitution",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Clinical Chemistry",
              "visibleIf": "{Q19} contains 1"
            },
            {
              "value": "2",
              "text": "Hematology",
              "visibleIf": "{Q19} contains 2"
            },
            {
              "value": "3",
              "text": "Immunoassay",
              "visibleIf": "{Q19} contains 3"
            },
            {
              "value": "4",
              "text": "Microbiology",
              "visibleIf": "{Q19} contains 4"
            },
            {
              "value": "5",
              "text": "Blood Bank",
              "visibleIf": "{Q19} contains 5"
            },
            {
              "value": "6",
              "text": "Cytology",
              "visibleIf": "{Q19} contains 6"
            },
            {
              "value": "7",
              "text": "Histopathology",
              "visibleIf": "{Q19} contains 7"
            },
            {
              "value": "8",
              "text": "Molecular Diagnostics",
              "visibleIf": "{Q19} contains 8"
            },
            {
              "value": "9",
              "text": "Toxicology",
              "visibleIf": "{Q19} contains 9"
            },
            {
              "value": "10",
              "text": "{Q19-Comment}",
              "visibleIf": "{Q19} contains 'other'"
            }
          ]
        }
      ]
    },
    {
      "name": "page19",
      "elements": [
        {
          "type": "checkbox",
          "name": "Q21",
          "title": "Q21. Type of Tests that are outsourced by the Insitution",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Clinical Chemistry",
              "visibleIf": "{Q19} contains 1 and {Q20} notcontains 1"
            },
            {
              "value": "2",
              "text": "Hematology",
              "visibleIf": "{Q19} contains 2  and {Q20} notcontains 2"
            },
            {
              "value": "3",
              "text": "Immunoassay",
              "visibleIf": "{Q19} contains 3  and {Q20} notcontains 3"
            },
            {
              "value": "4",
              "text": "Microbiology",
              "visibleIf": "{Q19} contains 4  and {Q20} notcontains 4"
            },
            {
              "value": "5",
              "text": "Blood Bank",
              "visibleIf": "{Q19} contains 5 and {Q20} notcontains 5"
            },
            {
              "value": "6",
              "text": "Cytology",
              "visibleIf": "{Q19} contains 6 and {Q20} notcontains 6"
            },
            {
              "value": "7",
              "text": "Histopathology",
              "visibleIf": "{Q19} contains 7 and {Q20} notcontains 7"
            },
            {
              "value": "8",
              "text": "Molecular Diagnostics",
              "visibleIf": "{Q19} contains 8 and {Q20} notcontains 8"
            },
            {
              "value": "9",
              "text": "Toxicology",
              "visibleIf": "{Q19} contains 9 and {Q20} notcontains 9"
            },
            {
              "value": "10",
              "text": "{Q19-Comment}",
              "visibleIf": "{Q19} contains 'other' and {Q20} notcontains 10"
            }
          ]
        }
      ]
    },
    {
      "name": "page20",
      "title": "Phase 2",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "Q22",
          "title": "Phase 2",
          "columns": [
            {
              "value": "1",
              "title": "Clinical Chemistry",
              "visibleIf": "{Q19} contains 1",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "2",
              "title": "Hematology",
              "visibleIf": "{Q19} contains 2",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "3",
              "title": "Immunoassay",
              "visibleIf": "{Q19} contains 3",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "4",
              "title": "Microbiology",
              "visibleIf": "{Q19} contains 4",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "5",
              "title": "Blood Bank",
              "visibleIf": "{Q19} contains 5",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "6",
              "title": "Cytology",
              "visibleIf": "{Q19} contains 6",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "7",
              "title": "Histopathology",
              "visibleIf": "{Q19} contains 7",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "8",
              "title": "Molecular Diagnostics",
              "visibleIf": "{Q19} contains 8",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "9",
              "title": "Toxicology",
              "visibleIf": "{Q19} contains 9",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "10",
              "title": "{Q19-Comment}",
              "visibleIf": "{Q19} contains 'other'",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ],
          "rows": [
            {
              "value": "1",
              "text": "Distribution of tests by number (Total)"
            },
            {
              "value": "2",
              "text": "Distribution of tests by number (inhouse)"
            },
            {
              "value": "3",
              "text": "Distribution of tests by Revenue (Total)"
            },
            {
              "value": "4",
              "text": "Distribution of tests by Cost (Total)"
            },
            {
              "value": "5",
              "text": "Average Cost Per Test, Rs"
            }
          ],
          "hideIfRowsEmpty": true
        }
      ]
    },
    {
      "name": "page21",
      "title": "Phase 3",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "Q23",
          "title": "Equipment Installations & Tests Done",
          "columns": [
            {
              "value": "1",
              "title": "Clinical Chemistry",
              "visibleIf": "{Q19} contains 1",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "2",
              "title": "Hematology",
              "visibleIf": "{Q19} contains 2",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "3",
              "title": "Immunoassay",
              "visibleIf": "{Q19} contains 3",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "4",
              "title": "Microbiology",
              "visibleIf": "{Q19} contains 4",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "5",
              "title": "Blood Bank",
              "visibleIf": "{Q19} contains 5",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "6",
              "title": "Cytology",
              "visibleIf": "{Q19} contains 6",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "7",
              "title": "Histopathology",
              "visibleIf": "{Q19} contains 7",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "8",
              "title": "Molecular Diagnostics",
              "visibleIf": "{Q19} contains 8",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "9",
              "title": "Toxicology",
              "visibleIf": "{Q19} contains 9",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "value": "10",
              "title": "{Q19-Comment}",
              "visibleIf": "{Q19} contains 'other'",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ],
          "rows": [
            {
              "value": "1",
              "text": "No of Units"
            },
            {
              "value": "2",
              "text": "Company (Model No)"
            },
            {
              "value": "3",
              "text": "Average No of Test Done/ Day"
            }
          ],
          "hideIfRowsEmpty": true
        }
      ]
    },
    {
      "name": "page22",
      "elements": [
        {
          "type": "comment",
          "name": "Q24",
          "title": "Any Qualititive Comment on Model and Equipment",
          "isRequired": true
        }
      ]
    },
    {
      "name": "page23",
      "elements": [
        {
          "type": "multipletext",
          "name": "Q25",
          "title": "Expansion Plan",
          "isRequired": true,
          "items": [
            {
              "name": "1",
              "isRequired": true,
              "title": "Addition of Equipment"
            },
            {
              "name": "2",
              "isRequired": true,
              "title": "Duration"
            },
            {
              "name": "3",
              "isRequired": true,
              "title": "Inaguration of New Lab"
            },
            {
              "name": "4",
              "isRequired": true,
              "title": "Duration"
            },
            {
              "name": "5",
              "isRequired": true,
              "title": "Expansion of Collection Centers"
            },
            {
              "name": "6",
              "isRequired": true,
              "title": "Duration"
            },
            {
              "name": "7",
              "isRequired": true,
              "title": "Expansion of Referal Doctor base/Speciality"
            },
            {
              "name": "8",
              "isRequired": true,
              "title": "Duration"
            }
          ]
        }
      ]
    }
  ],
  "headerView": "advanced"
};