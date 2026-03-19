import { Briefcase, GraduationCap, Mail, MapPin, Plus, Save, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../css/dashboard/profile.css';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        visaStatus: '',
        education: [],
        locations: [],
        rolesInterest: {
            roles: [],
            industries: []
        },
        salary: {
            min: '',
            max: '',
            currency: 'USD'
        }
    });

    // Temp state for inputs that add to lists
    const [newEducation, setNewEducation] = useState({
        university: '',
        degreeLevel: '',
        fieldOfStudy: '',
        graduationDate: ''
    });
    const [newLocation, setNewLocation] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newIndustry, setNewIndustry] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Ensure array/object fields exist even if empty in DB
                setFormData({
                    ...data,
                    education: data.education || [],
                    locations: data.locations || [],
                    rolesInterest: {
                        roles: data.rolesInterest?.roles || [],
                        industries: data.rolesInterest?.industries || []
                    },
                    salary: data.salary || { min: '', max: '', currency: 'USD' }
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'An error occurred while saving' });
        } finally {
            setSaving(false);
        }
    };

    // List Management Helpers
    const addLocation = () => {
        if (newLocation.trim()) {
            setFormData(prev => ({
                ...prev,
                locations: [...prev.locations, newLocation.trim()]
            }));
            setNewLocation('');
        }
    };

    const removeLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index)
        }));
    };

    const addRole = () => {
        if (newRole.trim()) {
            setFormData(prev => ({
                ...prev,
                rolesInterest: {
                    ...prev.rolesInterest,
                    roles: [...prev.rolesInterest.roles, newRole.trim()]
                }
            }));
            setNewRole('');
        }
    };

    const removeRole = (index) => {
        setFormData(prev => ({
            ...prev,
            rolesInterest: {
                ...prev.rolesInterest,
                roles: prev.rolesInterest.roles.filter((_, i) => i !== index)
            }
        }));
    };

    const addIndustry = () => {
        if (newIndustry.trim()) {
            setFormData(prev => ({
                ...prev,
                rolesInterest: {
                    ...prev.rolesInterest,
                    industries: [...prev.rolesInterest.industries, newIndustry.trim()]
                }
            }));
            setNewIndustry('');
        }
    };

    const removeIndustry = (index) => {
        setFormData(prev => ({
            ...prev,
            rolesInterest: {
                ...prev.rolesInterest,
                industries: prev.rolesInterest.industries.filter((_, i) => i !== index)
            }
        }));
    };

    const addEducation = () => {
        if (newEducation.university && newEducation.degreeLevel) {
            setFormData(prev => ({
                ...prev,
                education: [...prev.education, newEducation]
            }));
            setNewEducation({ university: '', degreeLevel: '', fieldOfStudy: '', graduationDate: '' });
        }
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="profile-page">
            <header className="notifications-header">
                <div className="header-left">
                    <h1><User size={24} className="header-icon" />Profile Settings</h1>
                </div>
                <button
                    className="primary-action"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                </button>
            </header>

            {message.text && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-grid">
                {/* Personal Info Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Personal Information</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-icon-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="readonly" // Users shouldn't typically change email freely without verification
                                />
                            </div>
                            <span className="input-hint">Email cannot be changed directly.</span>
                        </div>
                        <div className="form-group">
                            <label>Visa Status</label>
                            <select
                                name="visaStatus"
                                value={formData.visaStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select Status</option>
                                <option value="US Citizen">US Citizen</option>
                                <option value="Green Card">Green Card</option>
                                <option value="H1B">H1B</option>
                                <option value="F1 (OPT/CPT)">F1 (OPT/CPT)</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Locations & Preferences Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Work Preferences</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label>Target Locations</label>
                            <div className="add-item-row">
                                <div className="input-icon-wrapper">
                                    <MapPin size={18} />
                                    <input
                                        type="text"
                                        placeholder="City, State, or Country"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                                    />
                                </div>
                                <button type="button" className="icon-btn" onClick={addLocation}><Plus size={20} /></button>
                            </div>
                            <div className="tags-container">
                                {Array.isArray(formData.locations) && formData.locations.map((loc, index) => (
                                    <span key={index} className="tag">
                                        {loc}
                                        <button onClick={() => removeLocation(index)}><Trash2 size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Target Roles</label>
                            <div className="add-item-row">
                                <div className="input-icon-wrapper">
                                    <Briefcase size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Developer"
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addRole()}
                                    />
                                </div>
                                <button type="button" className="icon-btn" onClick={addRole}><Plus size={20} /></button>
                            </div>
                            <div className="tags-container">
                                {Array.isArray(formData.rolesInterest?.roles) && formData.rolesInterest.roles.map((role, index) => (
                                    <span key={index} className="tag">
                                        {role}
                                        <button onClick={() => removeRole(index)}><Trash2 size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Education Card */}
                <div className="profile-card full-width">
                    <div className="card-header">
                        <h2>Education History</h2>
                    </div>
                    <div className="card-content">
                        <div className="education-list">
                            {formData.education.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <div className="edu-icon">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div className="edu-details">
                                        <h4>{edu.university}</h4>
                                        <p>{edu.degreeLevel} in {edu.fieldOfStudy}</p>
                                        <span className="edu-date">Graduated: {new Date(edu.graduationDate).toLocaleDateString()}</span>
                                    </div>
                                    <button className="delete-action" onClick={() => removeEducation(index)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="add-education-form">
                            <h3>Add Education</h3>
                            <div className="education-inputs">
                                <input
                                    type="text"
                                    placeholder="University Name"
                                    value={newEducation.university}
                                    onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })}
                                />
                                <select
                                    value={newEducation.degreeLevel}
                                    onChange={(e) => setNewEducation({ ...newEducation, degreeLevel: e.target.value })}
                                >
                                    <option value="">Degree Level</option>
                                    <option value="Bachelor's">Bachelor's</option>
                                    <option value="Master's">Master's</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Associate">Associate</option>
                                    <option value="Certificate">Certificate</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Field of Study"
                                    value={newEducation.fieldOfStudy}
                                    onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                                />
                                <input
                                    type="date"
                                    placeholder="Graduation Date"
                                    value={newEducation.graduationDate}
                                    onChange={(e) => setNewEducation({ ...newEducation, graduationDate: e.target.value })}
                                />
                                <button type="button" className="add-btn" onClick={addEducation}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
