import React from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WoundResult = () => {
  const { state } = useLocation();

  // Accept either: state = { predicted_class, confidence } OR state = { mlOutput: 'Abrasions' } OR state = { mlOutput: { predicted_class, confidence } }
  let predictedClass = undefined;
  let confidence = undefined;

  if (state) {
    if (state.mlOutput && typeof state.mlOutput === 'object') {
      predictedClass = state.mlOutput.predicted_class || state.mlOutput.class || state.mlOutput.label;
      confidence = state.mlOutput.confidence ?? state.confidence ?? undefined;
    } else if (state.mlOutput && typeof state.mlOutput === 'string') {
      predictedClass = state.mlOutput;
      confidence = state.confidence ?? undefined;
    } else {
      predictedClass = state.predicted_class || state.class || state.mlOutput;
      confidence = state.confidence ?? undefined;
    }
  }

  // Confidence is expected to be a number between 0 and 1.
  // If a numeric value is provided, clamp it to the 0..1 range to avoid out-of-bounds values.
  if (typeof confidence === 'number') {
    confidence = Math.max(0, Math.min(1, confidence));
  }

  // fallback values for demo when nothing passed
  if (!predictedClass) {
    predictedClass = 'Normal';
  }

  // Do not infer confidence from a full probabilities list — only accept
  // an explicit `confidence` value passed in router state or inside `mlOutput`.
  // If no explicit confidence provided, leave it as null so UI shows N/A.
  if (confidence === undefined) {
    confidence = null;
  }

  const classesInfo = {
    'Abrasions': {
      description: 'Superficial damage to the skin caused by scraping or rubbing.',
      severity: 'Low - Superficial',
      nextSteps: ['Clean the area with mild soap and water', 'Apply an antibiotic ointment', 'Cover with sterile dressing', 'Monitor for signs of infection']
    },
    'Bruises': {
      description: 'Discoloration caused by bleeding under the skin from trauma.',
      severity: 'Low - Usually benign',
      nextSteps: ['Rest and ice to reduce swelling', 'Elevate the injured area if possible', 'Seek care if very painful or rapidly worsening']
    },
    'Burns': {
      description: 'Skin damage caused by heat, chemicals, electricity, or radiation.',
      severity: 'Variable - May be serious',
      nextSteps: ['Cool the burn with running water', 'Cover loosely with sterile dressing', 'Seek urgent care for larger or deeper burns']
    },
    'Cut': {
      description: 'A laceration to the skin often requiring cleaning and possibly sutures.',
      severity: 'Medium - Depends on depth',
      nextSteps: ['Clean the wound thoroughly', 'Apply pressure to stop bleeding', 'Seek medical attention for deep cuts or if bleeding does not stop']
    },
    'Diabetic Wounds': {
      description: 'Chronic wounds in patients with diabetes; higher risk of infection and poor healing.',
      severity: 'High - Monitor closely',
      nextSteps: ['Urgent evaluation by specialist', 'Control blood sugar', 'Follow prescribed wound care and offloading instructions']
    },
    'Laceration': {
      description: 'Tear or cut of the skin often from trauma.',
      severity: 'Medium - May need closure',
      nextSteps: ['Clean and apply pressure', 'Assess need for stitches or specialist care', 'Watch for infection']
    },
    'Normal': {
      description: 'No wound detected or image appears to be healthy skin.',
      severity: 'None',
      nextSteps: ['No immediate action required', 'Perform routine skin checks']
    },
    'Pressure Wounds': {
      description: 'Ulcers caused by sustained pressure, common in immobile patients.',
      severity: 'Medium to High - Requires care',
      nextSteps: ['Relieve pressure', 'Specialized wound care', 'Consult wound care team']
    },
    'Surgical Wounds': {
      description: 'Post-operative incisions that require monitoring for signs of infection.',
      severity: 'Variable',
      nextSteps: ['Keep incision clean and dry', 'Report redness, drainage or fever to provider']
    },
    'Venous Wounds': {
      description: 'Ulcers due to venous insufficiency, often around the ankles.',
      severity: 'Medium - Chronic',
      nextSteps: ['Compression therapy as directed', 'Wound care specialist referral', 'Manage underlying venous disease']
    }
  };

  const info = classesInfo[predictedClass] || {
    description: 'No detailed information available for this class.',
    severity: 'Unknown',
    nextSteps: ['Consult a healthcare professional for evaluation']
  };

  const isLowConfidence = typeof confidence === 'number' ? confidence < 0.9 : false;

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto my-4 mt-16 bg-slate-800 rounded-lg shadow-lg">
        <div className="bg-red-800 text-white p-6 overflow-hidden rounded-t-lg mb-4">
          <h1 className="text-2xl font-bold">Wound Analysis Results</h1>
          <p className="text-slate-200 mt-1">Analysis completed</p>
        </div>

        <div className="px-6 pb-6">
          {isLowConfidence ? (
            <div className="bg-red-900 p-6 rounded-lg border border-red-800">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-300 mr-2" />
                <h2 className="text-xl font-semibold text-red-100">Invalid Image</h2>
              </div>
              <p className="text-red-200">The model confidence is below 90% ({Math.round((confidence || 0) * 100)}%). Please upload a clearer wound image (well-lit, focused, and unobstructed) and try again.</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800 p-6 rounded-lg mb-8 border border-slate-700">
                <div className="flex items-center mb-4">
                  <AlertCircle className="text-blue-300 mr-2" />
                  <h2 className="text-xl font-semibold text-slate-100">Primary Diagnosis</h2>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">{predictedClass}</h3>
                  <p className="text-slate-300 mt-1">{info.description}</p>
                  <div className="mt-2 flex items-center">
                    <span className={`font-medium ${info.severity.includes('High') ? 'text-red-300' : info.severity.includes('Medium') ? 'text-amber-300' : 'text-green-300'}`}>
                      {info.severity}
                    </span>
                    <span className="ml-4 text-sm text-slate-400">Confidence: {typeof confidence === 'number' ? `${Math.round(confidence * 100)}%` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Check className="text-green-300 mr-2" />
                  <h2 className="text-xl font-semibold text-slate-100">Recommended Next Steps</h2>
                </div>

                <ul className="space-y-3">
                  {info.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
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

                <p className="text-slate-300">This analysis is based on image processing and is a preliminary screening. It does not replace professional medical advice. Seek clinical evaluation for definitive diagnosis and treatment.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WoundResult;
