export const surveyJson2 = {
  "title": "Innovate",
  "description": "1.1.3",
  "pages": [
    {
      "name": "page00",
      "readOnly": true,
      "elements": [
        {
          "type": "file",
          "name": "Q_audio",
          "title": "Audio Response",
          "storeDataAsText": false,
          "maxSize": 10000000
        }
        ,
        {
          "type": "dropdown",
          "name": "city",
          "title": "City",
          "choices": [
            {
              "value": "1",
              "text": "Delhi NCR"
            },
            {
              "value": "2",
              "text": "Mumbai"
            },
            {
              "value": "3",
              "text": "Kolkata"
            },
            {
              "value": "4",
              "text": "Bengaluru"
            },
            {
              "value": "5",
              "text": "Chennai"
            },
            {
              "value": "6",
              "text": "Hyderabad"
            },
            {
              "value": "7",
              "text": "Pune"
            },
            {
              "value": "8",
              "text": "Ahmedabad"
            },
            {
              "value": "9",
              "text": "Surat"
            },
            {
              "value": "10",
              "text": "Jaipur"
            },
            {
              "value": "11",
              "text": "Lucknow"
            },
            {
              "value": "12",
              "text": "Kozhikode"
            },
            {
              "value": "13",
              "text": "Thrissur"
            },
            {
              "value": "14",
              "text": "Kochi"
            },
            {
              "value": "15",
              "text": "Indore"
            },
            {
              "value": "16",
              "text": "Kanpur"
            },
            {
              "value": "17",
              "text": "Nagpur"
            },
            {
              "value": "18",
              "text": "Coimbatore"
            },
            {
              "value": "19",
              "text": "Thiruvananthapuram"
            },
            {
              "value": "20",
              "text": "Patna"
            },
            {
              "value": "21",
              "text": "Bhopal"
            },
            {
              "value": "22",
              "text": "Agra"
            },
            {
              "value": "23",
              "text": "Kannur"
            },
            {
              "value": "24",
              "text": "Visakhapatnam"
            },
            {
              "value": "25",
              "text": "Vadodara"
            },
            {
              "value": "26",
              "text": "Nashik"
            },
            {
              "value": "27",
              "text": "Vijayawada"
            },
            {
              "value": "28",
              "text": "Nowrangapur"
            },
            {
              "value": "29",
              "text": "Kollam"
            },
            {
              "value": "30",
              "text": "Rajkot"
            },
            {
              "value": "31",
              "text": "Ludhiana"
            },
            {
              "value": "32",
              "text": "Teni"
            },
            {
              "value": "33",
              "text": "Haora"
            },
            {
              "value": "34",
              "text": "Madurai"
            },
            {
              "value": "35",
              "text": "Raipur"
            },
            {
              "value": "36",
              "text": "Meerut"
            },
            {
              "value": "37",
              "text": "Varanasi"
            },
            {
              "value": "38",
              "text": "Srinagar"
            },
            {
              "value": "39",
              "text": "Tiruppur"
            },
            {
              "value": "40",
              "text": "Jamshedpur"
            },
            {
              "value": "41",
              "text": "Aurangabad"
            },
            {
              "value": "42",
              "text": "Jodhpur"
            },
            {
              "value": "43",
              "text": "Ranchi"
            },
            {
              "value": "44",
              "text": "Kota"
            },
            {
              "value": "45",
              "text": "Jabalpur"
            },
            {
              "value": "46",
              "text": "Asansol"
            },
            {
              "value": "47",
              "text": "Gwalior"
            },
            {
              "value": "48",
              "text": "Allahabad"
            },
            {
              "value": "49",
              "text": "Amritsar"
            },
            {
              "value": "50",
              "text": "Dhanbad"
            },
            {
              "value": "51",
              "text": "Bareilly"
            },
            {
              "value": "52",
              "text": "Aligarh"
            },
            {
              "value": "53",
              "text": "Moradabad"
            },
            {
              "value": "54",
              "text": "Mysore"
            },
            {
              "value": "55",
              "text": "Durg-Bhilainagar"
            },
            {
              "value": "56",
              "text": "Bhubaneswar"
            },
            {
              "value": "57",
              "text": "Tiruchirappalli"
            },
            {
              "value": "58",
              "text": "Chandigarh"
            },
            {
              "value": "59",
              "text": "Saharanpur"
            },
            {
              "value": "60",
              "text": "Hubli-Dharwad"
            }
          ]
        }
      ]
    },
    {
      "name": "page1",
      "readOnly": true,
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
          "isRequired": true,
          "validators": [
            {
              "type": "regex",
              "text": "Receptionist is not accepted",
              "regex": "^(?!.*receptionist$).*$",
              "caseInsensitive": true
            }
          ]
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
      "readOnly": true,
      "title": "Demographic",
      "elements": [
        {
          "type": "text",
          "name": "Q4",
          "title": "Q4. Name of the Institute/Organization",
          "isRequired": true
        }
      ]
    },
    {
      "name": "page3",
      "readOnly": true,
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5a",
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
      "visible": false,
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q5b",
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
          "visibleIf": "{Q5b} = 3",
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
      "name": "page7",
      "visible": false,
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
          "max": 999999,
          "maskType": "pattern",
          "maskSettings": {
            "pattern": "999999"
          }
        },
        {
          "type": "text",
          "name": "Q5j",
          "title": "Q5j. Landline No",
          "isRequired": true,
          "validators": [
            {
              "type": "regex",
              "text": "Please enter a valid landline number (6–12 digits).",
              "regex": "^[0-9]{6,12}$"
            }
          ],
          "inputType": "tel"
        }
      ]
    },
    {
      "name": "page8",
      "visible": false,
      "elements": [
        {
          "type": "text",
          "name": "Q5k",
          "title": "Q5k. Mobile No if any",
          "inputType": "number",
          "min": 6000000000,
          "max": 9999999999,
          "minErrorText": "Please provide the valid Mobile Number",
          "maxErrorText": "Please provide the valid Mobile Number"
        },
        {
          "type": "text",
          "name": "Q5l.",
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
      "visible": false,
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
              "text": "Both"
            }
          ]
        }
      ]
    },
    {
      "name": "page10",
      "visible": false,
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
      "visible": false,
      "elements": [
        {
          "type": "radiogroup",
          "name": "Q8",
          "title": "Q8. Test Done",
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
      "visible": false,
      "elements": [
        {
          "type": "multipletext",
          "name": "Q9",
          "title": "Q9. Only For Hospitals",
          "validators": [
            {
              "type": "expression",
              "text": "Operational Beds cannot exceed Total Beds.",
              "expression": "{Q9.2} <= {Q9.1}"
            },
            {
              "type": "expression",
              "text": "Occupied Beds cannot exceed Operational Beds.",
              "expression": "{Q9.3} <= {Q9.2}"
            },
            {
              "type": "expression",
              "text": "ICU Beds cannot exceed Total Beds.",
              "expression": "{Q9.4} <= {Q9.1}"
            },
            {
              "type": "expression",
              "text": "All values cannot be 0. Please enter at least one non-zero value.",
              "expression": "{Q9.1} + {Q9.2} + {Q9.3} + {Q9.4} > 0"
            }
          ],
          "items": [
            {
              "name": "1",
              "isRequired": true,
              "inputType": "number",
              "title": "Total Number of Beds"
            },
            {
              "name": "2",
              "inputType": "number",
              "title": "Operational Beds"
            },
            {
              "name": "3",
              "inputType": "number",
              "title": "Occupied Beds"
            },
            {
              "name": "4",
              "inputType": "number",
              "title": "ICU Beds"
            }
          ]
        }
      ]
    },
    {
      "name": "page13",
      "visible": false,
      "elements": [
        {
          "type": "text",
          "name": "Q10",
          "title": "Q10. Near by Railway Station",
          "description": "Do not mention junction",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q11",
          "title": "Q11. Near by Airport",
          "description": "Just mention cities",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "Q12",
          "title": "Q12. Distance from Railway Station",
          "isRequired": true,
          "validators": [
            {
              "type": "regex",
              "text": "Your answer must contain at least one number.",
              "regex": ".*\\d.*"
            }
          ]
        },
        {
          "type": "text",
          "name": "Q13",
          "title": "Q13. Distance from Airport",
          "isRequired": true,
          "validators": [
            {
              "type": "regex",
              "text": "Your answer must contain at least one number.",
              "regex": ".*\\d.*"
            }
          ]
        }
      ]
    },
    {
      "name": "page16",
      "visible": false,
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "Q14",
          "title": "Q14. Connects",
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
              "max": 9999999999,
              "minErrorText": "Please provide the valid Mobile Number",
              "maxErrorText": "Please provide the valid Mobile Number"
            },
            {
              "name": "4",
              "title": "Extn to the Landline",
              "cellType": "text",
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
      "visible": false,
      "elements": [
        {
          "type": "multipletext",
          "name": "Q15",
          "title": "Q15. Financials FY 25",
          "isRequired": true,
          "validators": [
            {
              "type": "expression",
              "text": "All values cannot be 0. Please enter at least one non-zero value.",
              "expression": "{Q15.1} + {Q15.2} + {Q15.3} + {Q15.4} + {Q15.5} > 0"
            }
          ],
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
      "visible": false,
      "elements": [
        {
          "type": "multipletext",
          "name": "Q16",
          "visible": false,
          "title": "Q16. Average Patients & Test Numbers/Day",
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
          "name": "Q17",
          "readOnly": true,
          "title": "Q17. Type of Tests that are done in the Institution",
          "choices": [
            { "value": "1", "text": "Clinical Chemistry" },
            { "value": "2", "text": "Hematology" },
            { "value": "3", "text": "Immunoassay" },
            { "value": "4", "text": "Microbiology" },
            { "value": "5", "text": "Blood Bank" },
            { "value": "6", "text": "Cytology" },
            { "value": "7", "text": "Histopathology" },
            { "value": "8", "text": "Molecular Diagnostics" },
            { "value": "9", "text": "Toxicology" }
          ],
          "showOtherItem": true,
          "otherText": "Others, If any",
          "otherReadOnly": true
        }
      ]
    }
    ,
    {
      "name": "page18",
      "elements": [
        {
          "type": "checkbox",
          "name": "Q18",
          "readOnly": true,
          "title": "Q18. Type of Tests that are done in-house by the Insitution",
          "isRequired": true,
          "choicesFromQuestion": "Q17",
          "choicesFromQuestionMode": "selected",
          "minSelectedChoices": 1
        }
      ]
    },
    {
      "name": "page19",
      "elements": [
        {
          "type": "checkbox",
          "name": "Q19",
          "title": "Q19. Type of Tests that are outsourced by the Insitution",
          "isRequired": true,
          "readOnly": true,
          "visibleIf": "({Q17} notempty) and ({Q17.length} > {Q18.length})",
          "choicesFromQuestion": "Q18",
          "choices": [
            {
              "value": "1",
              "text": "Clinical Chemistry",
              "visibleIf": "{Q17} contains 1 and {Q18} notcontains 1"
            },
            {
              "value": "2",
              "text": "Hematology",
              "visibleIf": "{Q17} contains 2  and {Q18} notcontains 2"
            },
            {
              "value": "3",
              "text": "Immunoassay",
              "visibleIf": "{Q17} contains 3  and {Q18} notcontains 3"
            },
            {
              "value": "4",
              "text": "Microbiology",
              "visibleIf": "{Q17} contains 4  and {Q18} notcontains 4"
            },
            {
              "value": "5",
              "text": "Blood Bank",
              "visibleIf": "{Q17} contains 5 and {Q18} notcontains 5"
            },
            {
              "value": "6",
              "text": "Cytology",
              "visibleIf": "{Q17} contains 6 and {Q18} notcontains 6"
            },
            {
              "value": "7",
              "text": "Histopathology",
              "visibleIf": "{Q17} contains 7 and {Q18} notcontains 7"
            },
            {
              "value": "8",
              "text": "Molecular Diagnostics",
              "visibleIf": "{Q17} contains 8 and {Q18} notcontains 8"
            },
            {
              "value": "9",
              "text": "Toxicology",
              "visibleIf": "{Q17} contains 9 and {Q18} notcontains 9"
            },
            {
              "value": "10",
              "text": "{Q19.other}",
              "visibleIf": "{Q17} contains 'other' and {Q18} notcontains 10"
            }
          ],
          "choicesFromQuestionMode": "unselected"
        }
      ]
    },
    {
      "name": "page20",
      "title": "Phase 2",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "Q20",
          "title": "Q20. Distribution of tests by total",
          "columns": [
            {
              "name": "1",
              "title": "Distribution of tests by total",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "name": "2",
              "title": "Distribution of tests by number (inhouse)",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "name": "3",
              "title": "Distribution of tests by number (outsource)",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "name": "4",
              "title": "Distribution of tests by Cost (Total)",
              "cellType": "text",
              "isRequired": true,
              "inputType": "number"
            }
          ],
          "rows": [
            {
              "value": "1",
              "text": "Clinical Chemistry",
              "visibleIf": "{Q17} contains 1"
            },
            {
              "value": "2",
              "text": "Hematology",
              "visibleIf": "{Q17} contains 2"
            },
            {
              "value": "3",
              "text": "Immunoassay",
              "visibleIf": "{Q17} contains 3"
            },
            {
              "value": "4",
              "text": "Microbiology",
              "visibleIf": "{Q17} contains 4"
            },
            {
              "value": "5",
              "text": "Blood Bank",
              "visibleIf": "{Q17} contains 5"
            },
            {
              "value": "6",
              "text": "Cytology",
              "visibleIf": "{Q17} contains 6"
            },
            {
              "value": "7",
              "text": "Histopathology",
              "visibleIf": "{Q17} contains 7"
            },
            {
              "value": "8",
              "text": "Molecular Diagnostics",
              "visibleIf": "{Q17} contains 8"
            },
            {
              "value": "9",
              "text": "Toxicology",
              "visibleIf": "{Q17} contains 9"
            },
            {
              "value": "10",
              "text": "Other Text",
              "visibleIf": "{Q17} contains 'other'"
            }
          ]
        }
      ]
    },
    // {
    //   "name": "page5",
    //   "title": "Phase 3",
    //   "elements": [
    //     {
    //       "type": "matrixdropdown",
    //       "name": "Q21",
    //       "title": "Q21. Equipment Installations & Tests Done",
    //       "isRequired": true,
    //       "columns": [
    //         {
    //           "name": "1",
    //           "title": "No of Units",
    //           "cellType": "text",
    //           "isRequired": true,
    //           "inputType": "number"
    //         },
    //         {
    //           "name": "2",
    //           "title": "Company (Model No)",
    //           "cellType": "text",
    //           "isRequired": true,
    //           "inputType": "number"
    //         },
    //         {
    //           "name": "3",
    //           "title": "Average No of Test Done/ Day",
    //           "cellType": "text",
    //           "isRequired": true,
    //           "inputType": "number"
    //         }
    //       ],
    //       "rows": [
    //         {
    //           "value": "1",
    //           "text": "Clinical Chemistry",
    //           "visibleIf": "{Q17} contains 1"
    //         },
    //         {
    //           "value": "2",
    //           "text": "Hematology",
    //           "visibleIf": "{Q17} contains 2"
    //         },
    //         {
    //           "value": "3",
    //           "text": "Immunoassay",
    //           "visibleIf": "{Q17} contains 3"
    //         },
    //         {
    //           "value": "4",
    //           "text": "Microbiology",
    //           "visibleIf": "{Q17} contains 4"
    //         },
    //         {
    //           "value": "5",
    //           "text": "Blood Bank",
    //           "visibleIf": "{Q17} contains 5"
    //         },
    //         {
    //           "value": "6",
    //           "text": "Cytology",
    //           "visibleIf": "{Q17} contains 6"
    //         },
    //         {
    //           "value": "7",
    //           "text": "Histopathology",
    //           "visibleIf": "{Q17} contains 7"
    //         },
    //         {
    //           "value": "8",
    //           "text": "Molecular Diagnostics",
    //           "visibleIf": "{Q17} contains 8"
    //         },
    //         {
    //           "value": "9",
    //           "text": "Toxicology",
    //           "visibleIf": "{Q17} contains 9"
    //         },
    //         {
    //           "value": "10",
    //           "text": "Other Text",
    //           "visibleIf": "{Q17} contains 'other'"
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   "name": "page6",
    //   "elements": [
    //     {
    //       "type": "text",
    //       "name": "Q22",
    //       "title": "Q22. Any Qualititive Comment on Model and Equipment",
    //       "isRequired": true
    //     }
    //   ]
    // },
    // {
    //   "name": "page20",
    //   "elements": [
    //     {
    //       "type": "multipletext",
    //       "name": "Q23_1",
    //       "title": "Q23.1. Expansion Plan",
    //       "isRequired": true,
    //       "items": [
    //         {
    //           "name": "1",
    //           "isRequired": true,
    //           "title": "Addition of Equipment"
    //         },
    //         {
    //           "name": "2",
    //           "isRequired": true,
    //           "title": "Duration"
    //         }
    //       ]
    //     },
    //     {
    //       "type": "multipletext",
    //       "name": "Q23_2",
    //       "title": "Q23.2. Expansion Plan",
    //       "isRequired": true,
    //       "items": [
    //         {
    //           "name": "1",
    //           "isRequired": true,
    //           "title": "Inaguration of New Lab"
    //         },
    //         {
    //           "name": "2",
    //           "isRequired": true,
    //           "title": "Duration"
    //         }
    //       ]
    //     },
    //     {
    //       "type": "multipletext",
    //       "name": "Q23_3",
    //       "title": "Q23.3. Expansion Plan",
    //       "items": [
    //         {
    //           "name": "1",
    //           "isRequired": true,
    //           "title": "Expansion of Collection Centers"
    //         },
    //         {
    //           "name": "2",
    //           "isRequired": true,
    //           "title": "Duration"
    //         }
    //       ]
    //     },
    //     {
    //       "type": "multipletext",
    //       "name": "Q23_4",
    //       "title": "Q23.4. Expansion Plan",
    //       "isRequired": true,
    //       "items": [
    //         {
    //           "name": "1",
    //           "isRequired": true,
    //           "title": "Expansion of Referal Doctor base/Speciality"
    //         },
    //         {
    //           "name": "2",
    //           "isRequired": true,
    //           "title": "Duration"
    //         }
    //       ]
    //     }
    //   ]
    // }
  ],
  "triggers": [
    {
      "type": "complete",
      "expression": "{Q6} =2 or {Q7}=2 or {Q8}=2"
    }
  ],
  "partialSendEnabled": true,
  "progressBarLocation": "bottom",
  "progressBarType": "requiredQuestions",
  "clearInvisibleValues": "onHiddenContainer",
  "questionTitlePattern": "numTitle",
  "headerView": "advanced"
};