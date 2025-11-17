import React from 'react';
import { AlertCircle, Check, Info, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SkinDiseaseResult = () => {
  // Sample patient result data (would be passed as props in a real app)
  const diagnosis_Decode = {
    1: "Actinic Keratosis",
    2: "Pigmented Benign Keratosis",
    3: "Melanoma",
    4: "Vascular Lesion",
    5: "Squamous Cell Carcinoma",
    6: "Basal Cell Carcinoma",
    7: "Seborrheic Keratosis",
    8: "Dermatofibroma",
    9: "Nevus"
  }
  const { state } = useLocation();

  // Determine diagnosis label from the router state. Accept multiple shapes and
  // be robust to 1-based (1..9) and 0-based (0..8) numeric indices coming
  // from different models or backends. Also accept numeric strings.
  let incoming = state?.mlOutput ?? state;
  let diagnosisLabel = null;

  const getLabelFromNumber = (raw) => {
    if (raw == null) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    // try direct (works when model outputs 1..9)
    if (diagnosis_Decode[n]) return diagnosis_Decode[n];
    // if model returned 0..8 (0-based), try +1
    if (diagnosis_Decode[n + 1]) return diagnosis_Decode[n + 1];
    // as a last resort try -1 (in case mapping is shifted the other way)
    if (diagnosis_Decode[n - 1]) return diagnosis_Decode[n - 1];
    return null;
  };

  if (incoming && typeof incoming === 'object') {
    // prefer explicit predicted_class / label / class_index fields
    const predField = incoming.predicted_class ?? incoming.predicted_label ?? incoming.label ?? incoming.class_index ?? incoming.class ?? null;

    if (typeof predField === 'number' || (typeof predField === 'string' && /^\d+$/.test(predField))) {
      diagnosisLabel = getLabelFromNumber(predField);
    } else if (typeof predField === 'string' && predField.trim()) {
      diagnosisLabel = predField;
    }

    // fallback: sometimes the router state itself may include predicted_class at top level
    if (!diagnosisLabel && state) {
      const top = state.predicted_class ?? state.class_index ?? null;
      if (top != null) diagnosisLabel = getLabelFromNumber(top) || (typeof top === 'string' ? top : null);
    }
  } else if (typeof incoming === 'number') {
    diagnosisLabel = getLabelFromNumber(incoming);
  } else if (typeof incoming === 'string') {
    // numeric string or label
    if (/^\d+$/.test(incoming)) diagnosisLabel = getLabelFromNumber(incoming);
    else diagnosisLabel = incoming;
  }


  // default to Melanoma if nothing provided (preserve previous demo behaviour)
  if (!diagnosisLabel) diagnosisLabel = diagnosis_Decode[3];
  
  
  const patientResult = {
    patientName: "Varun Jethani",
    diagnosisDate: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    primaryDiagnosis: diagnosisLabel,
    supportCount: 97,
    recommendedActions: [
      "Schedule an appointment with a dermatologist within 1 week",
      "Avoid sun exposure to the affected area",
      "Do not scratch or irritate the lesion",
      "Take photos to monitor any changes"
    ]
  };

  // Disease info based on the classification results in the image
  const diseaseInfo = {
    "Actinic Keratosis": {
      description: "A rough, scaly patch on skin that develops from years of sun exposure",
      severity: "Medium - Precancerous",
      nextSteps: [
        "Visit a dermatologist within 2-4 weeks",
        "Use prescribed topical treatments",
        "Apply broad-spectrum sunscreen daily"
      ]
    },
    "Pigmented Benign Keratosis": {
      description: "A non-cancerous growth on the skin that develops from sun damage",
      severity: "Low - Benign",
      nextSteps: [
        "Annual skin check with dermatologist",
        "Monitor for changes in size or color",
        "No immediate treatment necessary"
      ]
    },
    "Melanoma": {
      description: "A serious form of skin cancer that begins in melanocytes (cells that make pigment)",
      severity: "High - Malignant",
      nextSteps: [
        "Urgent dermatology appointment (within 1 week)",
        "Surgical excision likely required",
        "Further imaging or tests may be needed",
        "Follow-up care plan will be developed"
      ]
    },
    "Vascular Lesion": {
      description: "An abnormal collection of blood vessels in the skin",
      severity: "Low to Medium - Usually benign",
      nextSteps: [
        "Dermatology consultation within 1 month",
        "Possible laser treatment options",
        "Monitor for changes in size or bleeding"
      ]
    },
    "Squamous Cell Carcinoma": {
      description: "A common form of skin cancer that develops from squamous cells",
      severity: "Medium to High - Malignant",
      nextSteps: [
        "Dermatology appointment within 2 weeks",
        "Surgical removal often recommended",
        "Discuss treatment options with specialist"
      ]
    },
    "Basal Cell Carcinoma": {
      description: "The most common type of skin cancer that rarely spreads but can be disfiguring",
      severity: "Medium - Malignant but rarely spreads",
      nextSteps: [
        "Dermatology appointment within 2-3 weeks",
        "Various treatment options available",
        "Regular follow-ups recommended"
      ]
    },
    "Seborrheic Keratosis": {
      description: "A common benign skin growth that appears as a waxy, scaly patch",
      severity: "Low - Benign",
      nextSteps: [
        "Regular skin checks with dermatologist",
        "Treatment only necessary if lesions cause discomfort",
        "Monitor for changes"
      ]
    },
    "Dermatofibroma": {
      description: "A common benign skin growth that usually appears as a small, firm bump",
      severity: "Low - Benign",
      nextSteps: [
        "Annual skin check with dermatologist",
        "No treatment necessary unless symptomatic",
        "Monitor for changes"
      ]
    },
    "Nevus": {
      description: "A common mole (melanocytic nevus) that appears as a small, dark spot",
      severity: "Low - Benign",
      nextSteps: [
        "Annual skin checks with dermatologist",
        "Self-examine monthly using the ABCDE rule",
        "Report any changes promptly"
      ]
    }
  };

  // Get information based on diagnosed condition (be defensive to avoid runtime errors)
  const diagnosis = patientResult.primaryDiagnosis;
  const currentDiseaseInfo = diseaseInfo[diagnosis] || {
    description: "No information available for this diagnosis.",
    severity: "Unknown",
    nextSteps: [
      "Consult a dermatologist for a professional evaluation",
    ],
  };

  // Determine severity color (dark theme friendly) — defensive for missing/unknown severity
  const getSeverityColor = (severity = "") => {
    if (typeof severity !== 'string' || severity.length === 0) return "text-slate-300";
    if (severity.includes("High")) return "text-red-300";
    if (severity.includes("Medium")) return "text-amber-300";
    return "text-green-300";
  };

  return (
    // Full-viewport dark background wrapper (changes limited to this file)
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto my-4 mt-16 bg-slate-800 rounded-lg shadow-lg">
        <div className="bg-red-800 text-white p-6 overflow-hidden rounded-t-lg mb-4">
          <h1 className="text-2xl font-bold">Skin Analysis Results</h1>
          <p className="text-slate-200 mt-1">Analysis completed on {patientResult.diagnosisDate}</p>
        </div>
        <div className='px-6 pb-6'>

          <div className="bg-slate-800 p-6 rounded-lg mb-8 border border-slate-700">
        <div className="flex items-center mb-4">
          <AlertCircle className="text-blue-300 mr-2" />
          <h2 className="text-xl font-semibold text-slate-100">Primary Diagnosis</h2>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white">{diagnosis}</h3>
          <p className="text-slate-300 mt-1">{currentDiseaseInfo.description}</p>
          <div className="mt-2 flex items-center">
            <span className={`font-medium ${getSeverityColor(currentDiseaseInfo.severity)}`}>
              {currentDiseaseInfo.severity}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ArrowRight className="text-green-300 mr-2" />
          <h2 className="text-xl font-semibold text-slate-100">Recommended Next Steps</h2>
        </div>
        
        <ul className="space-y-3">
          {currentDiseaseInfo.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start">
              <div className="shrink-0 h-6 w-6 rounded-full bg-green-900 flex items-center justify-center mr-3 mt-0.5">
                <Check size={16} className="text-green-300" />
              </div>
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center mb-4">
          <Info className="text-slate-300 mr-2" />
          <h2 className="text-lg font-semibold text-slate-100">Important Information</h2>
        </div>
        
        <p className="text-slate-300">
          This analysis is based on image processing technology and should not replace professional medical advice. 
          Please consult with a healthcare professional for complete evaluation and treatment.
        </p>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SkinDiseaseResult;