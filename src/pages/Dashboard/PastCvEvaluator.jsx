import { ChevronLeft, ChevronRight, Eye, FileCheck, FileText, Loader, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard/cvevaluator.css';

const PastCvEvaluator = () => {
    const navigate = useNavigate();
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cv/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCvs(data);
            }
        } catch (error) {
            console.error('Error fetching CV history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAnalysis = () => {
        navigate('/cv-analysis');
    };

    const getStatusBadge = (match) => {
        const status = match?.toLowerCase() || 'low';
        return <span className={`status-badge ${status}`}>{match || 'Unknown'}</span>;
    };

    const handleViewReport = (path) => {
        if (!path) {
            toast.error('Report not available');
            return;
        }

        // 1. Auto-Repair Legacy Localhost Links (for old data in DB)
        let normalizedPath = path.replace(/\\/g, '/');
        const apiUrl = import.meta.env.VITE_API_URL;
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

        console.log("Original Path:", path);

        if (normalizedPath.toLowerCase().includes('localhost:5000')) {
            console.log("Repairing link from localhost to:", baseUrl);
            normalizedPath = normalizedPath.replace(/http[s]?:\/\/localhost:5000/gi, baseUrl);
            normalizedPath = normalizedPath.replace(/http[s]?:\/localhost:5000/gi, baseUrl);
        }

        // 2. Resolve final URL
        let finalUrl;
        if (normalizedPath.toLowerCase().startsWith('http')) {
            finalUrl = normalizedPath;
        } else {
            const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
            finalUrl = `${baseUrl}${finalPath}`;
        }

        console.log("Opening URL:", finalUrl);
        window.open(finalUrl, '_blank');
    };

    const handleViewCV = (path) => {
        if (!path) {
            toast.error('Original CV not available');
            return;
        }

        // 1. Auto-Repair Legacy Localhost Links
        let normalizedPath = path.replace(/\\/g, '/');
        const apiUrl = import.meta.env.VITE_API_URL;
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

        console.log("Original CV Path:", path);

        if (normalizedPath.toLowerCase().includes('localhost:5000')) {
            console.log("Repairing CV link to:", baseUrl);
            normalizedPath = normalizedPath.replace(/http[s]?:\/\/localhost:5000/gi, baseUrl);
            normalizedPath = normalizedPath.replace(/http[s]?:\/localhost:5000/gi, baseUrl);
        }

        // 2. Resolve final URL
        let finalUrl;
        if (normalizedPath.toLowerCase().startsWith('http')) {
            finalUrl = normalizedPath;
        } else {
            const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
            finalUrl = `${baseUrl}${finalPath}`;
        }

        console.log("Opening CV URL:", finalUrl);
        window.open(finalUrl, '_blank');
    };

    // Pagination calculations
    const totalPages = Math.ceil(cvs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cvs.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="past-cv-evaluator">
            {/* Header Section */}
            <header className="notifications-header" style={{ marginBottom: '2rem' }}>
                <div className="header-left ">
                    <h1>  <FileText size={24} className="header-icon" />Past CV Analysis</h1>
                </div>
                <button
                    className="primary-action"
                    onClick={handleNewAnalysis}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2D5A4C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={20} />
                    New CV Analysis
                </button>
            </header>

            {/* CV Analysis History Table */}
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">History</h3>
                </div>
                <div className="table-wrapper">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <Loader className="animate-spin" size={24} /> Loading history...
                        </div>
                    ) : cvs.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No past analyses found. Start a new one!
                        </div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th className="text-center">Score</th>
                                        <th className="text-center">ATS Match</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((cv) => (
                                        <tr key={cv._id}>
                                            <td>{new Date(cv.createdAt).toLocaleDateString()}</td>
                                            <td>{cv.fileName}</td>
                                            <td className="text-center bold">{cv.analysisResult?.score || 0}%</td>
                                            <td className="text-center">
                                                {getStatusBadge(cv.analysisResult?.atsMatch)}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    className="table-action"
                                                    onClick={() => handleViewCV(cv.cvFilePath)}
                                                    title="View Uploaded CV"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <FileCheck size={16} /> CV
                                                </button>
                                                <button
                                                    className="table-action"
                                                    onClick={() => handleViewReport(cv.analysisPdfPath)}
                                                    title="View Analysis Report"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Eye size={16} /> Report
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                backgroundColor: currentPage === 1 ? '#f1f5f9' : 'white',
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    backgroundColor: currentPage === page ? '#2D5A4C' : 'white',
                                                    color: currentPage === page ? 'white' : '#64748b',
                                                    cursor: 'pointer',
                                                    fontWeight: currentPage === page ? '600' : '400'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                backgroundColor: currentPage === totalPages ? '#f1f5f9' : 'white',
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, cvs.length)} of {cvs.length} entries
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PastCvEvaluator;
