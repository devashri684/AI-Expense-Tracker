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
    // Appending both 'file' and 'receipt' so it matches whatever your Spring Boot @RequestParam expects
    formData.append("file", file);
    formData.append("receipt", file);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:8080/api/expenses/scan-receipt", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend scan failed:", res.status, errorText);
        throw new Error(`Server returned status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (onScanComplete) {
        onScanComplete(data);
      }
    } catch (err) {
      console.error("Receipt Scan Error:", err);
      alert(`Error scanning receipt: ${err.message || "Please enter details manually."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card receipt-scanner-card">
      <label className="scanner-dropzone" style={{ cursor: loading ? "not-allowed" : "pointer" }}>
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
        <div className="scanner-preview" style={{ marginTop: "1rem", textAlign: "center" }}>
          <img
            src={preview}
            alt="Receipt preview"
            className="scanner-thumb"
            style={{ maxHeight: "150px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>
      )}
    </div>
  );
}