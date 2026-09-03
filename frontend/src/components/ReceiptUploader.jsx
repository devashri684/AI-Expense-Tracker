import React, { useState } from "react";

export default function ReceiptUploader({ onScanComplete }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      // Points to your backend scan route
      const res = await fetch("http://localhost:8080/api/expenses/scan-receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to scan receipt");

      const data = await res.json();
      onScanComplete(data);
    } catch (err) {
      console.error(err);
      alert("Error scanning receipt. Please enter details manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card receipt-scanner-card">
      <label className="scanner-dropzone">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          disabled={loading}
        />
        <div className="scanner-cta">
          <span className="scanner-icon">📷</span>
          <strong>
            {loading ? "Analyzing receipt with AI..." : "Scan Receipt or Invoice"}
          </strong>
          <p>
            {loading
              ? "Extracting title, amount, and category..."
              : "Click to upload a receipt photo to auto-fill the form"}
          </p>
        </div>
      </label>

      {preview && (
        <div className="scanner-preview">
          <img src={preview} alt="Receipt preview" className="scanner-thumb" />
        </div>
      )}
    </div>
  );
}