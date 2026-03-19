import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/CvAnalysis.css';

const LoginGate = ({ feature }) => (
  <div className="login-gate">
    <div className="login-gate-card">
      <div className="login-gate-icon">🔒</div>
      <h2 className="login-gate-title">Login Required</h2>
      <p className="login-gate-desc">
        You need to be logged in to use <strong>{feature}</strong>.
        Create a free account or sign in to get started.
      </p>
      <div className="login-gate-actions">
        <a href="/login" className="login-gate-btn login-gate-btn--primary">Login</a>
        <a href="/signup" className="login-gate-btn login-gate-btn--secondary">Create Account</a>
      </div>
      <p className="login-gate-hint">It's free and takes less than a minute ✨</p>
    </div>
  </div>
);

const CVAnalysis = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.');
        return;
      }
      setUploadedFile(file);
      analyzeCV(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.');
        return;
      }
      setUploadedFile(file);
      analyzeCV(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const analyzeCV = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to analyze your CV');
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cv/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login.');
        }
        throw new Error('Failed to analyze CV');
      }

      const data = await response.json();
      console.log("Analysis Data:", data);
      setAnalysisResult(data);
      toast.success('CV Analysis Complete!');

    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error('Failed to analyze CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // 1. Try to download Backend Generated PDF (Professional Report)
    if (analysisResult && analysisResult.reportPath) {
      try {
        // Construct base URL from API URL (remove '/api' suffix if present)
        const apiUrl = import.meta.env.VITE_API_URL;
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

        // Normalize path separators from Windows to Web
        const reportPath = analysisResult.reportPath.replace(/\\/g, '/');

        // Full URL: http://localhost:5000/uploads/reports/filename.pdf
        const fileUrl = `${baseUrl}/${reportPath}`;

        window.open(fileUrl, '_blank');
        toast.success("Downloading Professional Report...");
        return;
      } catch (e) {
        console.error("Error constructing download URL:", e);
        toast.error("Error downloading report. Falling back to screenshot.");
      }
    }

    // 2. Fallback: Client-side Screenshot Generation
    const input = document.querySelector('.analysis-main');
    if (!input) {
      toast.error("Could not find report to export");
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Generating PDF Snapshot...");

    import('html2canvas').then(html2canvas => {
      import('jspdf').then(jspdf => {
        const jsPDF = jspdf.default ? jspdf.default : jspdf.jsPDF || jspdf;

        html2canvas.default(input, { scale: 2, useCORS: true }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 30; // Top margin

          // Add title
          pdf.setFontSize(18);
          pdf.text("CV Analysis Snapshot", 105, 20, { align: "center" });

          pdf.addImage(imgData, 'PNG', 0, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(`CV-Analysis-Snapshot-${new Date().toISOString().slice(0, 10)}.pdf`);

          toast.dismiss(toastId);
          toast.success("PDF exported successfully!");
        }).catch(err => {
          console.error("PDF Export Error:", err);
          toast.dismiss(toastId);
          toast.error("Failed to generate PDF");
        });
      });
    });
  };

  const viewProfessionalSamples = () => {
    navigate('/sample-cv');
  };

  // Helper to determine color class for ATS Match
  const getAtsColorClass = (match) => {
    const m = (match || 'Low').toLowerCase();
    if (m === 'high') return 'high-match'; // green
    if (m === 'moderate') return 'moderate-match'; // orange
    return 'low-match'; // red
  };

  const token = localStorage.getItem('token');
  if (!token) return <LoginGate feature="CV Analyzer & Optimizer" />;

  return (
    <div className={`cv-analysis-page ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="cv-analysis-header">
        <h1 className="page-title">CV Analyzer & Optimizer</h1>
        <p className="">
          Upload your resume to receive AI-powered insights and improve your ATS compatibility.
        </p>
      </header>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-container">
          {/* Upload Card */}
          <div
            className="upload-card"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleBrowseClick}
          >
            <div className="upload-icon">
              <span className="material-symbols-outlined">cloud_upload</span>
            </div>
            <h3 className="upload-title">Upload your Resume</h3>
            <p className="upload-description">
              Drag and drop your PDF resume here or click to browse.
            </p>
            <button className="upload-button" disabled={loading}>
              {loading ? 'Analyzing...' : 'Browse Files'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              className="file-input"
              style={{ display: 'none' }}
            />
            {uploadedFile && (
              <div className="uploaded-file">
                <span className="material-symbols-outlined">description</span>
                <span className="file-name">{uploadedFile.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* View Sample CVs Banner */}
      <div className="sample-cv-banner">
        <div className="sample-cv-banner-text">
          <span className="material-symbols-outlined">auto_stories</span>
          <div>
            <strong>Looking for inspiration?</strong>
            <p>Browse professionally crafted CV templates and real-world examples.</p>
          </div>
        </div>
        <button className="sample-cv-btn" onClick={viewProfessionalSamples}>
          <span className="material-symbols-outlined">open_in_new</span>
          View Sample CVs
        </button>
      </div>

      {/* Loading State */}
      {/* {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your CV with AI...</p>
        </div>
      )} */}

      {/* Analysis Report */}
      {analysisResult && !loading && (
        <main className="analysis-main">
          {/* Report Header */}
          <div className="report-header">
            <div className="report-title">
              <span className="material-symbols-outlined">analytics</span>
              <h2>Resume Analysis Report</h2>
            </div>
            <button className="export-button" onClick={exportToPDF}>
              <span className="material-symbols-outlined">download</span>
              Export PDF
            </button>
          </div>


          {/* Metrics Below Summary */}
          <div className="score-cards">
            {/* Overall Score */}
            <div className="score-card">
              <p className="score-label">Overall Score</p>
              <div className="score-value">
                {analysisResult.score || 0}<span className="score-max">/100</span>
              </div>
              <div className="score-progress">
                <div
                  className="score-progress-bar"
                  style={{ width: `${analysisResult.score || 0}%` }}
                ></div>
              </div>
            </div>

            {/* ATS Match - Dynamic from Backend */}
            <div className="score-card">
              <div className="optimized-badge">Check</div>
              <div className={`score-icon`}>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div className={`score-value ${getAtsColorClass(analysisResult.atsMatch)}`}>
                {analysisResult.atsMatch || 'Moderate'}
              </div>
              <p className="score-label">ATS Match & Readability</p>
            </div>

            {/* Key Strengths Count */}
            <div className="score-card">
              <div className="score-icon strength">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="score-value">
                {analysisResult.strengths?.length || 0}
              </div>
              <p className="score-label">Key Strengths Identified</p>
            </div>

            {/* Critical Keywords Missing Count */}
            <div className="score-card" style={{ marginBottom: '20px' }}>
              <div className="score-icon keyword">
                <span className="material-symbols-outlined">vpn_key</span>
              </div>
              <div className="score-value">
                {analysisResult.missingKeywords?.length || 0}
              </div>
              <p className="score-label">Critical Keywords Missing</p>
            </div>
          </div>

          <div className="score-card summary-card full-width-summary" style={{ marginBottom: "20px" }}>
            <div className="score-icon">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <p className="score-label">AI Summary</p>
            <p className="summary-text">{analysisResult.summary}</p>
          </div>


          {/* Analysis Details */}
          <div className="analysis-details">
            {/* Strengths Column */}
            <div className="analysis-column strengths">
              <div className="column-header">
                <span className="material-symbols-outlined">verified_user</span>
                <h3>Key Strengths</h3>
              </div>
              <div className="column-content">
                {analysisResult.strengths?.map((strength, index) => (
                  <div key={index} className="strength-item">
                    <span className="strength-item-icon material-symbols-outlined">
                      {strength.icon || 'check_circle'}
                    </span>
                    <div className="strength-item-content">
                      <h4>{strength.title}</h4>
                      <p>{strength.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Keywords Column */}
            {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
              <div className="analysis-column keywords">
                <div className="column-header">
                  <span className="material-symbols-outlined">vpn_key</span>
                  <h3>Missing Keywords</h3>
                </div>
                <div className="column-content">
                  <p className="keywords-description">
                    Add these terms to rank higher:
                  </p>
                  <div className="keywords-list">
                    {analysisResult.missingKeywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formatting and Improvements Combined or Separate */}
          <div className="analysis-details">
            {/* Improvements Column */}
            <div className="analysis-column improvements">
              <div className="column-header">
                <span className="material-symbols-outlined">trending_up</span>
                <h3>Improvements Needed</h3>
              </div>
              <div className="column-content">
                {analysisResult.improvements?.map((improvement, index) => (
                  <div key={index} className="strength-item improvement">
                    <span className="strength-item-icon material-symbols-outlined warning">
                      {improvement.icon || 'warning'}
                    </span>
                    <div className="strength-item-content">
                      <h4>{improvement.title}</h4>
                      <p>{improvement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formatting Column */}
            {analysisResult.formattingIssues && analysisResult.formattingIssues.length > 0 && (
              <div className="analysis-column formatting">
                <div className="column-header">
                  <span className="material-symbols-outlined">edit_note</span>
                  <h3>Formatting</h3>
                </div>
                <div className="column-content">
                  {analysisResult.formattingIssues.map((suggestion, index) => (
                    <div key={index} className="strength-item">
                      <span className="strength-item-icon material-symbols-outlined">
                        {suggestion.icon || 'format_shapes'}
                      </span>
                      <div className="strength-item-content">
                        <h4>{suggestion.title}</h4>
                        <p>{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </main>
      )}
    </div>
  );
};

export default CVAnalysis;