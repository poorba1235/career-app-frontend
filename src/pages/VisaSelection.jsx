import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/VisaSelection.css';

const VisaSelection = () => {
    const [selectedVisa, setSelectedVisa] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const visaOptions = [
        {
            id: 'student',
            title: 'Student Visa (Tier 4)',
            description: 'Currently studying in the UK',
            icon: 'school'
        },
        {
            id: 'graduate',
            title: 'Graduate Visa (PSW)',
            description: '2-3 year post-study work visa',
            icon: 'work_outline'
        },
        {
            id: 'skilled',
            title: 'Skilled Worker Visa',
            description: 'Employer-sponsored work visa',
            icon: 'badge'
        },
        {
            id: 'other',
            title: 'Other / Not Sure',
            description: 'Need guidance on visa options',
            icon: 'help_outline'
        }
    ];

    const handleContinue = async () => {
        if (!selectedVisa) {
            toast.error('Please select a visa status to continue');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ visaStatus: selectedVisa })
            });

            if (response.ok) {
                navigate('/signup/step-2');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating visa status:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/signup/step-2');
    };

    return (
        <div className={`visa-selection-page`}>
            <Toaster position="top-right" />
            {/* Progress Steps */}
            <div className="progress-container">
                <div className="progress-steps">
                    <div className="progress-line"></div>

                    <div className="progress-step active">
                        <div className="step-icon">
                            <span className="material-icons-outlined"><svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.0156 0L22.0312 6V14.0156H20.0156V7.07812L11.0156 12L0 6L11.0156 0ZM4.03125 10.1719L11.0156 14.0156L18 10.1719V14.2031L11.0156 18L4.03125 14.2031V10.1719Z" fill="white" />
                            </svg>
                            </span>
                        </div>
                        <div className="step-label">Visa Status</div>
                    </div>

                    <div className="progress-step">
                        <div className="step-icon">
                            <span className="material-icons-outlined"><svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 3.98438C18.5625 3.98438 19.0312 4.1875 19.4062 4.59375C19.7812 4.96875 19.9688 5.4375 19.9688 6V16.9688C19.9688 17.5312 19.7812 18.0156 19.4062 18.4219C19.0312 18.7969 18.5625 18.9844 18 18.9844H1.96875C1.40625 18.9844 0.9375 18.7969 0.5625 18.4219C0.1875 18.0156 0 17.5312 0 16.9688V6C0 5.4375 0.1875 4.96875 0.5625 4.59375C0.9375 4.1875 1.40625 3.98438 1.96875 3.98438H6V1.96875C6 1.40625 6.1875 0.9375 6.5625 0.5625C6.9375 0.1875 7.40625 0 7.96875 0H12C12.5625 0 13.0312 0.1875 13.4062 0.5625C13.7812 0.9375 13.9688 1.40625 13.9688 1.96875V3.98438H18ZM1.96875 6V16.9688H18V6H1.96875ZM12 3.98438V1.96875H7.96875V3.98438H12Z" fill="#94A3B8" />
                            </svg>
                            </span>
                        </div>
                        <div className="step-label">Education</div>
                    </div>

                    <div className="progress-step">
                        <div className="step-icon">
                            <span className="material-icons-outlined"><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.70312 15.9844C8.64062 15.9219 7.67188 15.625 6.79688 15.0938C5.95312 14.5312 5.26562 13.8125 4.73438 12.9375C4.23438 12.0312 3.98438 11.0469 3.98438 9.98438C3.98438 8.89062 4.25 7.89062 4.78125 6.98438C5.34375 6.07812 6.07812 5.35937 6.98438 4.82812C7.89062 4.26562 8.89062 3.98438 9.98438 3.98438C11.0469 3.98438 12.0156 4.25 12.8906 4.78125C13.7969 5.28125 14.5156 5.96875 15.0469 6.84375C15.6094 7.6875 15.9219 8.64062 15.9844 9.70312L13.875 9.04688C13.6562 8.17188 13.1875 7.45312 12.4688 6.89062C11.75 6.29688 10.9219 6 9.98438 6C9.23438 6 8.5625 6.1875 7.96875 6.5625C7.375 6.90625 6.89062 7.375 6.51562 7.96875C6.17188 8.5625 6 9.23438 6 9.98438C6 10.9219 6.28125 11.75 6.84375 12.4688C7.4375 13.1875 8.17188 13.6562 9.04688 13.875L9.70312 15.9844ZM19.9688 9.98438C19.9688 10.1406 19.9688 10.2969 19.9688 10.4531C19.9688 10.5781 19.9531 10.7188 19.9219 10.875L17.9531 10.3125C17.9844 10.25 18 10.2031 18 10.1719C18 10.1094 18 10.0469 18 9.98438C18 8.89062 17.7812 7.85938 17.3438 6.89062C16.9375 5.92187 16.3594 5.07812 15.6094 4.35938C14.8906 3.60938 14.0469 3.03125 13.0781 2.625C12.1094 2.1875 11.0781 1.96875 9.98438 1.96875C8.89062 1.96875 7.85938 2.1875 6.89062 2.625C5.92188 3.03125 5.0625 3.60938 4.3125 4.35938C3.59375 5.07812 3.01562 5.92187 2.57812 6.89062C2.17188 7.85938 1.96875 8.89062 1.96875 9.98438C1.96875 11.0781 2.17188 12.1094 2.57812 13.0781C3.01562 14.0469 3.59375 14.9062 4.3125 15.6562C5.0625 16.375 5.92188 16.9531 6.89062 17.3906C7.85938 17.7969 8.89062 18 9.98438 18C10.0469 18 10.0938 18 10.125 18C10.1875 18 10.25 17.9844 10.3125 17.9531L10.875 19.9219C10.7188 19.9531 10.5625 19.9688 10.4062 19.9688C10.2812 19.9688 10.1406 19.9688 9.98438 19.9688C8.60938 19.9688 7.3125 19.7188 6.09375 19.2188C4.90625 18.6875 3.84375 17.9688 2.90625 17.0625C2 16.125 1.28125 15.0625 0.75 13.875C0.25 12.6562 0 11.3594 0 9.98438C0 8.60938 0.25 7.32812 0.75 6.14062C1.28125 4.92188 2 3.85937 2.90625 2.95312C3.84375 2.01562 4.90625 1.29688 6.09375 0.796875C7.3125 0.265625 8.60938 0 9.98438 0C11.3594 0 12.6406 0.265625 13.8281 0.796875C15.0469 1.29688 16.1094 2.01562 17.0156 2.95312C17.9531 3.85937 18.6719 4.92188 19.1719 6.14062C19.7031 7.32812 19.9688 8.60938 19.9688 9.98438ZM16.2188 14.25L19.9688 12.9844L9.98438 9.98438L12.9844 19.9688L14.25 16.2188L18.5156 20.4844L20.4844 18.5156L16.2188 14.25Z" fill="#94A3B8" />
                            </svg>
                            </span>
                        </div>
                        <div className="step-label">Location</div>
                    </div>
                </div>

                <div className="step-counter">Step 1 of 4</div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-card">
                    <div className="header-section">
                        <h1 className="page-title">Tell us about your visa status</h1>
                        <p className="page-subtitle">
                            This helps us show you relevant job opportunities with visa sponsorship
                        </p>
                    </div>

                    {/* Visa Options */}
                    <div className="options-container">
                        {visaOptions.map((option) => (
                            <button
                                key={option.id}
                                className={`visa-option ${selectedVisa === option.id ? 'selected' : ''}`}
                                onClick={() => setSelectedVisa(option.id)}
                            >
                                <div className="option-content">
                                    <div className="option-text">
                                        <h3 className="option-title">{option.title}</h3>
                                        <p className="option-description">{option.description}</p>
                                    </div>
                                </div>
                                {selectedVisa === option.id && (
                                    <span className="material-icons-outlined check-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.96875 15L16.9688 6L15.5625 4.54688L7.96875 12.1406L4.40625 8.57812L3 9.98438L7.96875 15ZM2.90625 2.95312C4.875 0.984375 7.23438 0 9.98438 0C12.7344 0 15.0781 0.984375 17.0156 2.95312C18.9844 4.89062 19.9688 7.23438 19.9688 9.98438C19.9688 12.7344 18.9844 15.0938 17.0156 17.0625C15.0781 19 12.7344 19.9688 9.98438 19.9688C7.23438 19.9688 4.875 19 2.90625 17.0625C0.96875 15.0938 0 12.7344 0 9.98438C0 7.23438 0.96875 4.89062 2.90625 2.95312Z" fill="#2D5A4C" />
                                    </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="navigation-sectionss">
                        <button
                            className="skip-button"
                            onClick={handleSkip}>
                            Skip
                        </button>
                        <button
                            className="continue-button"
                            onClick={handleContinue}
                            disabled={loading}
                        >
                            <span>{loading ? 'Saving...' : 'Continue'}</span>
                            <span className="material-icons-outlined"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor" />
                            </svg></span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VisaSelection;
