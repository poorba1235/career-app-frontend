import { ChevronLeft, ChevronRight, Eye, Globe, Loader, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../../css/dashboard/webscrape.css';

const WebScrape = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputUrl, setInputUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // Initial load
        setLoading(true);
        fetchUrls().catch((error) => {
            console.error('Failed to load scraper URLs:', error);
            toast.error('Failed to load scraper URLs');
            setLoading(false);
        });
    }, []);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape/urls`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUrls(data);
            } else {
                throw new Error('Failed to fetch URLs');
            }
        } catch (error) {
            console.error('Error fetching URLs:', error);
            throw error; // Re-throw so the refresh button can catch it
        } finally {
            setLoading(false);
        }
    };

    const handleLoadData = async (e) => {
        e.preventDefault();

        if (!inputUrl.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        // Basic URL validation
        try {
            new URL(inputUrl);
        } catch (e) {
            toast.error('Please enter a valid URL');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape/load`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url: inputUrl })
            });

            if (response.ok) {
                const data = await response.json();
                toast('Processing will take approximately 1 minute for detailed extraction', {
                    duration: 5000,
                    icon: 'ℹ️',
                    style: {
                        background: '#3b82f6',
                        color: '#fff',
                    }
                });
                setInputUrl('');
                // Refresh the list
                fetchUrls();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add URL');
            }
        } catch (error) {
            console.error('Error adding URL:', error);
            toast.error('Failed to add URL');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUrl = async (id) => {
        if (!confirm('Are you sure you want to delete this URL?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape/url/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('URL deleted successfully');
                fetchUrls();
            } else {
                toast.error('Failed to delete URL');
            }
        } catch (error) {
            console.error('Error deleting URL:', error);
            toast.error('Failed to delete URL');
        }
    };

    const handleRescrape = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape/rescrape/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast('Re-scraping started. This will take approximately 1 minute.', {
                    duration: 5000,
                    icon: 'ℹ️',
                    style: {
                        background: '#3b82f6',
                        color: '#fff',
                    }
                });
                // Refresh the list to show updated status
                fetchUrls();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to re-scrape URL');
            }
        } catch (error) {
            console.error('Error re-scraping URL:', error);
            toast.error('Failed to re-scrape URL');
        }
    };

    const handleViewUrl = (url) => {
        window.open(url, '_blank');
    };

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase() || 'pending';
        return <span className={`status-badge ${statusLower}`}>{status || 'Pending'}</span>;
    };

    // Pagination calculations
    const totalPages = Math.ceil(urls.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = urls.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="web-scrape">
            {/* Header Section */}
            <header className="notifications-header" style={{ marginBottom: '2rem' }}>
                <div className="header-left">
                    <h1><Globe size={24} className="header-icon" />Web Scrape</h1>
                </div>
            </header>

            {/* URL Input Form */}
            <div className="url-input-container">
                <div className="table-header">
                    <h3 className="table-title">Add New URL</h3>
                </div>
                <form onSubmit={handleLoadData} className="url-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Enter URL to scrape (e.g., https://example.com/careers)"
                            className="url-input"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            className="primary-action"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} />
                                    Load Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* URLs Grid/Table */}
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Scraped URLs History</h3>
                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await fetchUrls();
                                toast.success('Data refreshed successfully!');
                            } catch (error) {
                                toast.error('Failed to refresh data');
                            }
                        }}
                        className="refresh-button"
                        disabled={loading}
                        title="Refresh table"
                    >
                        <Globe className={loading ? 'animate-spin' : ''} size={20} />
                        Refresh
                    </button>
                </div>
                <div className="table-wrapper">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <Loader className="animate-spin" size={24} /> Loading URLs...
                        </div>
                    ) : urls.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No URLs added yet. Add your first URL above!
                        </div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date Added</th>
                                        <th>URL</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item._id}>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="url-cell" title={item.url}>
                                                {item.url.length > 60 ? item.url.substring(0, 60) + '...' : item.url}
                                            </td>
                                            <td className="text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    className="table-action"
                                                    onClick={() => window.open(item.url, '_blank')}
                                                    title="Open URL in new tab"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                                <button
                                                    className="table-action reload-action"
                                                    onClick={() => handleRescrape(item._id)}
                                                    title="Re-scrape this URL"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <RefreshCw size={16} /> Reload
                                                </button>
                                                <button
                                                    className="table-action delete-action"
                                                    onClick={() => handleDeleteUrl(item._id)}
                                                    title="Delete URL"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <div className="pagination-controls">
                                        <button
                                            className="page-btn"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            className="page-btn"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                    <div className="pagination-info">
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, urls.length)} of {urls.length} entries
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebScrape;
