import { ChevronLeft, ChevronRight, FileText, Loader2, Plus, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard/mockInterview.css';

const PastMockInterview = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            setInterviews(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load interview history');
        } finally {
            setLoading(false);
        }
    };

    const handleNewInterview = () => {
        navigate('/mock-interview'); // Ensure this route exists and is correct
    };

    const getScoreColor = (score) => {
        if (!score) return 'text-gray-500';
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInterviews = interviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(interviews.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="past-cv-evaluator">
            {/* Header Section */}
            <header className="notifications-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-left ">
                    <h1>  <Video size={24} className="header-icon" />Past Mock Interviews</h1>
                </div>
                <button
                    className="primary-action"
                    onClick={handleNewInterview}
                >
                    <Plus size={20} />
                    New Interview
                </button>
            </header>

            {/* Mock Interview History Table */}
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">History ({interviews.length})</h3>
                </div>
                <div className="table-wrapper">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: '0.5rem' }} />
                            Loading history...
                        </div>
                    ) : interviews.length > 0 ? (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Role</th>
                                        <th className="text-center">Score</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInterviews.map((interview) => (
                                        <tr key={interview._id}>
                                            <td>{new Date(interview.createdAt).toLocaleDateString()}</td>
                                            <td>{interview.targetRole}</td>
                                            <td className={`text-center bold ${getScoreColor(interview.overallScore)}`}>
                                                {interview.overallScore ? `${interview.overallScore}%` : 'N/A'}
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge ${interview.status === 'completed' ? 'high' : 'medium'}`}>
                                                    {interview.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {interview.reportPath ? (
                                                    <a
                                                        href={interview.reportPath.startsWith('http')
                                                            ? interview.reportPath
                                                            : `${import.meta.env.VITE_API_URL}${interview.reportPath.startsWith('/') ? '' : '/'}${interview.reportPath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="table-action"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                                    >
                                                        <FileText size={16} /> Report
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Processing...</span>
                                                )}
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
                                                onClick={() => setCurrentPage(page)}
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
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, interviews.length)} of {interviews.length} entries
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No interview history found. Start a new session!
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PastMockInterview;
