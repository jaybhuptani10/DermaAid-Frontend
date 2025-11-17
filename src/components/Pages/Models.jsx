import React, { useState } from "react";
import { Upload, FileCheck, Loader2, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Galaxy from "../Comp/Galaxy";

const mlBackenLink = "http://127.0.0.1:5000";

const medicalRecords = [
  {
    id: 1,
    name: "Skin Microscopy",
    description: "Upload your skin microscopy for cancer screening.",
    image:
      "https://images.unsplash.com/photo-1720733785347-32ead62731f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    link: "/skinresult",
    endpoint: "/predict_skin_cancer",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    name: "Wound Pre Diagnosis",
    description: "Upload your wound/injury image for analysis.",
    image:
      "https://images.unsplash.com/photo-1609840534195-e6385ca0d10a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "/woundresult",
    endpoint: "/predict_wound",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    name: "Nails Scan",
    description: "Coming soon — nails scan support will be available shortly.",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    name: "Hair Disease Detection",
    description: "Coming soon — hair disease detection will be available soon.",
    image:
      "https://images.unsplash.com/photo-1633179963355-44f57f194d54?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    color: "from-green-500 to-emerald-500",
  },
];

const MedicalRecords = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState({});
  const [mlOutput, setMlOutput] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleFileUpload = async (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const recordCheck = medicalRecords.find((r) => r.id === id);
    if (!recordCheck || !recordCheck.endpoint) {
      // Endpoint missing (coming soon) — ignore uploads
      setUploadedFiles((prev) => ({ ...prev, [id]: undefined }));
      setMlOutput((prev) => ({ ...prev, [id]: "Coming soon" }));
      return;
    }

    setLoading((prev) => ({ ...prev, [id]: true }));
    setUploadedFiles((prev) => ({ ...prev, [id]: file.name }));

    const formData = new FormData();
    formData.append("image", file);
    const record = medicalRecords.find((record) => record.id === id);
    const ep = record.endpoint;

    try {
      const response = await fetch(
        `${mlBackenLink.replace(/\/$/, "")}/${ep.replace(/^\//, "")}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

//     const data = {
//     "all_probabilities": [
//         0.9965529441833496,
//         2.32233196584275e-05,
//         1.5592728459523642e-06,
//         0.0034139978233724833,
//         4.879730647333602e-11,
//         7.0706587393942755e-06,
//         1.1832980817416683e-06,
//         2.308396182537642e-11,
//         2.3039119501078176e-09,
//         3.5538516574007417e-10
//     ],
//     "class_index": 0,
//     "confidence": 0.985529441833496,
//     "predicted_class":"Abrasions"
// }
// const data = {
//     "all_probabilities": [
//         4.308329275042123e-18,
//         6.342008949250522e-12,
//         6.829818488540695e-08,
//         4.30478364066289e-09,
//         1.8105009955844224e-17,
//         1.0441004311134705e-10,
//         1.7564044663131995e-10,
//         5.773824523203075e-05,
//         0.9999421834945679
//     ],
//     "confidence": 0.9999421834945679,
//     "predicted_class": 9
// }

      console.log("Server Response:", data);
      // Save the full response so result pages can access predicted_class, confidence, etc.
      setMlOutput((prev) => ({ ...prev, [id]: data }));
      // Note: mlOutput won't reflect this change immediately due to state batching;
      // use the logged `data` to inspect server response.
    } catch (error) {
      console.error("Upload error:", error);
      setMlOutput((prev) => ({ ...prev, [id]: "Upload failed" }));
    }

    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      {/* Background galaxy (transparent) */}
      <div className="absolute inset-0 -z-10">
        <Galaxy
          transparent={false}
          mouseInteraction={false}
          density={1.0}
          glowIntensity={0.35}
          hueShift={200}
          saturation={0.2}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-800 rounded-full mb-4">
            <Activity className="w-8 h-8 text-blue-200" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            AI-Powered Pre-Screening
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload your medical images for instant AI-powered analysis and
            preliminary screening
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicalRecords.map((record) => (
            <div
              key={record.id}
              className="group relative bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(record.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={record.image}
                  alt={record.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-linear-to-br ${record.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <Activity className="w-5 h-5 text-slate-200" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {record.name}
                </h3>
                <p className="text-sm text-slate-300 mb-6 line-clamp-2">
                  {record.description}
                </p>

                {/* Upload Button */}
                {record.endpoint ? (
                  <label className="relative block">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => handleFileUpload(record.id, event)}
                      disabled={loading[record.id]}
                    />
                    <div
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 ${
                        uploadedFiles[record.id]
                          ? "bg-green-900 text-green-200 border-2 border-green-700"
                          : "bg-linear-to-r " +
                            record.color +
                            " text-white hover:shadow-lg"
                      }`}
                    >
                      {loading[record.id] ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : uploadedFiles[record.id] ? (
                        <>
                          <FileCheck className="w-5 h-5" />
                          <span className="truncate text-sm">
                            {uploadedFiles[record.id]}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-slate-700 text-slate-300 cursor-not-allowed">
                    <span>Coming Soon</span>
                  </div>
                )}

                {/* Result Button */}
                {mlOutput[record.id] && !loading[record.id] && record.link && (
                  <Link
                    to={record.link}
                    state={{ mlOutput: mlOutput[record.id] }}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all duration-300 group/btn"
                  >
                    <span>View Results</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                )}

                {/* Result Preview */}
                {mlOutput[record.id] && mlOutput[record.id] !== "Upload failed" && (
                  <div className="mt-4 p-3 bg-blue-900 rounded-lg border border-blue-800">
                    <p className="text-xs font-semibold text-blue-300 mb-1">Analysis Complete</p>
                    <p className="text-sm text-slate-200 font-medium truncate">
                      {typeof mlOutput[record.id] === 'object'
                        ? mlOutput[record.id].predicted_class || mlOutput[record.id].predicted_label || JSON.stringify(mlOutput[record.id])
                        : mlOutput[record.id]}
                    </p>
                  </div>
                )}

                {/* Error State */}
                {mlOutput[record.id] === "Upload failed" && (
                  <div className="mt-4 p-3 bg-red-900 rounded-lg border border-red-800">
                    <p className="text-sm text-red-300 font-medium">
                      Upload failed. Please try again.
                    </p>
                  </div>
                )}
              </div>

              {/* Hover Effect Border */}
              <div
                className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${
                  hoveredCard === record.id
                    ? "border-blue-300 opacity-100"
                    : "border-transparent opacity-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full shadow-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-200">
              AI Models Ready • Secure & Private
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;