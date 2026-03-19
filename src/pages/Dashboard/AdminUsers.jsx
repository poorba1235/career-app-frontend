import { AlertTriangle, Ban, CheckCircle, ChevronLeft, ChevronRight, Search, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../../css/dashboard/adminUsers.css'; // New dedicated styles

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        newStatus: null,
        actionType: null // 'activate' or 'suspend'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/all-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const initiateAction = (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'hold' : 'active';
        const actionType = newStatus === 'active' ? 'activate' : 'suspend';

        setConfirmModal({
            isOpen: true,
            userId,
            newStatus,
            actionType
        });
    };

    const executeAction = async () => {
        const { userId, newStatus, actionType } = confirmModal;
        if (!userId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-status/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`User ${actionType}d successfully`);
                fetchUsers(); // Refresh list
                setConfirmModal({ isOpen: false, userId: null, newStatus: null, actionType: null });
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="admin-users-container">
            <header className="admin-header">
                <h1>
                    <Users size={28} className="admin-header-icon" />
                    User Management
                </h1>
            </header>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by  email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="admin-search-input"
                    />
                </div>
            </div>

            <div className="users-table-card">
                <div className="table-header-row">
                    <h3 className="table-title">All Registered Users</h3>
                    <span className="user-count">{filteredUsers.length} total</span>
                </div>

                <div className="users-table-wrapper">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                            Loading users...
                        </div>
                    ) : (
                        <>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User Details</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-info-cell">
                                                    <div className="user-avatar">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                                                    </div>
                                                    <div className="user-details">
                                                        <div className="user-name">{user.name || 'Unknown'}</div>
                                                        <div className="user-email">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${user.role === 'admin' ? 'admin' : 'pending'}`}>
                                                    <span className="status-dot"></span>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${user.status === 'active' ? 'active' : 'hold'}`}>
                                                    <span className="status-dot"></span>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        className={`action-btn ${user.status === 'active' ? 'hold' : 'activate'}`}
                                                        onClick={() => initiateAction(user._id, user.status || 'active')}
                                                    >
                                                        {user.status === 'active' ? (
                                                            <> <Ban size={16} /> Suspend </>
                                                        ) : (
                                                            <> <CheckCircle size={16} /> Activate </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {currentUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
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
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-icon-wrapper warning">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="modal-title">Confirm Action</h3>
                            <p className="modal-description">
                                Are you sure you want to <strong>{confirmModal.actionType}</strong> this user?
                                {confirmModal.actionType === 'suspend' && " They won't be able to access the platform."}
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            >
                                Cancel
                            </button>
                            <button
                                className={`modal-btn ${confirmModal.actionType === 'suspend' ? 'danger' : 'confirm'}`}
                                onClick={executeAction}
                            >
                                {confirmModal.actionType === 'suspend' ? 'Yes, Suspend' : 'Yes, Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
