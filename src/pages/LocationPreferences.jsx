import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/LocationPreferences.css';

const LocationPreferences = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [outsideUK, setOutsideUK] = useState(false);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const ukLocations = [
    { id: 'london', name: 'London' },
    { id: 'manchester', name: 'Manchester' },
    { id: 'birmingham', name: 'Birmingham' },
    { id: 'edinburgh', name: 'Edinburgh' },
    { id: 'bristol', name: 'Bristol' },
    { id: 'leeds', name: 'Leeds' },
    { id: 'glasgow', name: 'Glasgow' },
    { id: 'cambridge', name: 'Cambridge' },
    { id: 'oxford', name: 'Oxford' },
    { id: 'liverpool', name: 'Liverpool' },
    { id: 'sheffield', name: 'Sheffield' },
    { id: 'newcastle', name: 'Newcastle' },
    { id: 'cardiff', name: 'Cardiff' },
    { id: 'belfast', name: 'Belfast' },
    { id: 'nottingham', name: 'Nottingham' }
  ];

  const salaryRanges = [
    '20,000', '25,000', '30,000', '35,000', '40,000',
    '45,000', '50,000', '60,000', '70,000', '80,000',
    '90,000', '100,000', '120,000', '150,000', '200,000+'
  ];

  const toggleLocation = (locationId) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  const getLocationName = (locationId) => {
    const location = ukLocations.find(l => l.id === locationId);
    return location ? location.name : '';
  };

  const formatSalary = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSalaryChange = (type, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (type === 'min') {
      setMinSalary(numericValue);
    } else {
      setMaxSalary(numericValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const preferencesPayload = {
        locations: selectedLocations.map(id => getLocationName(id)),
        // You might want to add other fields like outsideUK or salary if you add them to the User model schema later
        // For now, based on the User model, we have `locations` [String] and `salary` Mixed.
        salary: {
          min: minSalary,
          max: maxSalary
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferencesPayload)
      });

      if (response.ok) {
        toast.success('Profile completed!');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup/step-3');
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="preferences-page">
      <Toaster position="top-right" />
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className="progress-line"></div>
          <div className="progress-line-filled" style={{ width: '100%' }}></div>

          <div className="progress-step completed">
            <div className="step-icon">
              <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0156 0L22.0312 6V14.0156H20.0156V7.07812L11.0156 12L0 6L11.0156 0ZM4.03125 10.1719L11.0156 14.0156L18 10.1719V14.2031L11.0156 18L4.03125 14.2031V10.1719Z" fill="white" />
              </svg>
            </div>
            <div className="step-label">Visa</div>
          </div>

          <div className="progress-step completed">
            <div className="step-icon">
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3.98438C18.5625 3.98438 19.0312 4.1875 19.4062 4.59375C19.7812 4.96875 19.9688 5.4375 19.9688 6V16.9688C19.9688 17.5312 19.7812 18.0156 19.4062 18.4219C19.0312 18.7969 18.5625 18.9844 18 18.9844H1.96875C1.40625 18.9844 0.9375 18.7969 0.5625 18.4219C0.1875 18.0156 0 17.5312 0 16.9688V6C0 5.4375 0.1875 4.96875 0.5625 4.59375C0.9375 4.1875 1.40625 3.98438 1.96875 3.98438H6V1.96875C6 1.40625 6.1875 0.9375 6.5625 0.5625C6.9375 0.1875 7.40625 0 7.96875 0H12C12.5625 0 13.0312 0.1875 13.4062 0.5625C13.7812 0.9375 13.9688 1.40625 13.9688 1.96875V3.98438H18ZM1.96875 6V16.9688H18V6H1.96875ZM12 3.98438V1.96875H7.96875V3.98438H12Z" fill="white" />
              </svg>
            </div>
            <div className="step-label">Education</div>
          </div>

          <div className="progress-step completed">
            <div className="step-icon">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.70312 15.9844C8.64062 15.9219 7.67188 15.625 6.79688 15.0938C5.95312 14.5312 5.26562 13.8125 4.73438 12.9375C4.23438 12.0312 3.98438 11.0469 3.98438 9.98438C3.98438 8.89062 4.25 7.89062 4.78125 6.98438C5.34375 6.07812 6.07812 5.35937 6.98438 4.82812C7.89062 4.26562 8.89062 3.98438 9.98438 3.98438C11.0469 3.98438 12.0156 4.25 12.8906 4.78125C13.7969 5.28125 14.5156 5.96875 15.0469 6.84375C15.6094 7.6875 15.9219 8.64062 15.9844 9.70312L13.875 9.04688C13.6562 8.17188 13.1875 7.45312 12.4688 6.89062C11.75 6.29688 10.9219 6 9.98438 6C9.23438 6 8.5625 6.1875 7.96875 6.5625C7.375 6.90625 6.89062 7.375 6.51562 7.96875C6.17188 8.5625 6 9.23438 6 9.98438C6 10.9219 6.28125 11.75 6.84375 12.4688C7.4375 13.1875 8.17188 13.6562 9.04688 13.875L9.70312 15.9844ZM19.9688 9.98438C19.9688 10.1406 19.9688 10.2969 19.9688 10.4531C19.9688 10.5781 19.9531 10.7188 19.9219 10.875L17.9531 10.3125C17.9844 10.25 18 10.2031 18 10.1719C18 10.1094 18 10.0469 18 9.98438C18 8.89062 17.7812 7.85938 17.3438 6.89062C16.9375 5.92187 16.3594 5.07812 15.6094 4.35938C14.8906 3.60938 14.0469 3.03125 13.0781 2.625C12.1094 2.1875 11.0781 1.96875 9.98438 1.96875C8.89062 1.96875 7.85938 2.1875 6.89062 2.625C5.92188 3.03125 5.0625 3.60938 4.3125 4.35938C3.59375 5.07812 3.01562 5.92187 2.57812 6.89062C2.17188 7.85938 1.96875 8.89062 1.96875 9.98438C1.96875 11.0781 2.17188 12.1094 2.57812 13.0781C3.01562 14.0469 3.59375 14.9062 4.3125 15.6562C5.0625 16.375 5.92188 16.9531 6.89062 17.3906C7.85938 17.7969 8.89062 18 9.98438 18C10.0469 18 10.0938 18 10.125 18C10.1875 18 10.25 17.9844 10.3125 17.9531L10.875 19.9219C10.7188 19.9531 10.5625 19.9688 10.4062 19.9688C10.2812 19.9688 10.1406 19.9688 9.98438 19.9688C8.60938 19.9688 7.3125 19.7188 6.09375 19.2188C4.90625 18.6875 3.84375 17.9688 2.90625 17.0625C2 16.125 1.28125 15.0625 0.75 13.875C0.25 12.6562 0 11.3594 0 9.98438C0 8.60938 0.25 7.32812 0.75 6.14062C1.28125 4.92188 2 3.85937 2.90625 2.95312C3.84375 2.01562 4.90625 1.29688 6.09375 0.796875C7.3125 0.265625 8.60938 0 9.98438 0C11.3594 0 12.6406 0.265625 13.8281 0.796875C15.0469 1.29688 16.1094 2.01562 17.0156 2.95312C17.9531 3.85937 18.6719 4.92188 19.1719 6.14062C19.7031 7.32812 19.9688 8.60938 19.9688 9.98438ZM16.2188 14.25L19.9688 12.9844L9.98438 9.98438L12.9844 19.9688L14.25 16.2188L18.5156 20.4844L20.4844 18.5156L16.2188 14.25Z" fill="white" />
              </svg>
            </div>
            <div className="step-label">Experience</div>
          </div>

          <div className="progress-step active">
            <div className="step-icon">
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.20312 8.76562C5.70312 9.23438 6.29688 9.46875 6.98438 9.46875C7.67188 9.46875 8.25 9.23438 8.71875 8.76562C9.21875 8.26562 9.46875 7.67188 9.46875 6.98438C9.46875 6.29688 9.21875 5.71875 8.71875 5.25C8.25 4.75 7.67188 4.5 6.98438 4.5C6.29688 4.5 5.70312 4.75 5.20312 5.25C4.73438 5.71875 4.5 6.29688 4.5 6.98438C4.5 7.67188 4.73438 8.26562 5.20312 8.76562ZM2.01562 2.0625C3.39062 0.6875 5.04688 0 6.98438 0C8.92188 0 10.5625 0.6875 11.9062 2.0625C13.2812 3.40625 13.9688 5.04688 13.9688 6.98438C13.9688 7.95312 13.7188 9.0625 13.2188 10.3125C12.75 11.5625 12.1719 12.7344 11.4844 13.8281C10.7969 14.9219 10.1094 15.9531 9.42188 16.9219C8.76562 17.8594 8.20312 18.6094 7.73438 19.1719L6.98438 19.9688C6.79688 19.75 6.54688 19.4688 6.23438 19.125C5.92188 18.75 5.35938 18.0312 4.54688 16.9688C3.73438 15.875 3.01562 14.8281 2.39062 13.8281C1.79688 12.7969 1.25 11.6406 0.75 10.3594C0.25 9.07812 0 7.95312 0 6.98438C0 5.04688 0.671875 3.40625 2.01562 2.0625Z" fill="#94A3B8" />
              </svg>
            </div>
            <div className="step-label">Location</div>
          </div>
        </div>

        <div className="step-counter">Step 4 of 4</div>
      </div>

      {/* Main Content */}
      <main className="preferences-content">
        <div className="preferences-card">
          <div className="header-section">
            <h1 className="page-title">Almost there!</h1>
            <p className="page-subtitle">
              Set your location and salary preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="preferences-form">
            {/* Preferred Locations */}
            <div className="preference-section">
              <div className="section-header">
                <h2 className="section-title">Preferred locations</h2>
              </div>

              <div className="locations-grid">
                {ukLocations.map(location => (
                  <button
                    key={location.id}
                    type="button"
                    className={`location-button ${selectedLocations.includes(location.id) ? 'selected' : ''}`}
                    onClick={() => toggleLocation(location.id)}
                  >
                    {location.name}
                    {selectedLocations.includes(location.id) && (
                      <span className="check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.58333 10.5833L4.25 8.25L3.5 9L6.58333 12.0833L12.5 6.16667L11.75 5.41667L6.58333 10.5833Z" fill="currentColor" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Outside UK Option */}
            <div className="preference-section">
              <div className="outside-uk-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={outsideUK}
                    onChange={(e) => setOutsideUK(e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">
                    Would you like to find a job outside the UK?
                  </span>
                </label>
                {outsideUK && (
                  <p className="toggle-note">
                    We'll show you international opportunities based on your visa status
                  </p>
                )}
              </div>
            </div>

            {/* Salary Expectations */}
            <div className="preference-section">
              <div className="section-header">
                <h2 className="section-title">Salary expectations (£ per year)</h2>
              </div>

              <div className="salary-inputs">
                <div className="salary-column">
                  <label className="salary-label">Minimum</label>
                  <div className="salary-input-wrapper">
                    <span className="currency-symbol">£</span>
                    <input
                      type="text"
                      className="salary-input"
                      placeholder="Min"
                      value={formatSalary(minSalary)}
                      onChange={(e) => handleSalaryChange('min', e.target.value)}
                    />
                  </div>
                </div>

                <div className="salary-separator">
                  <div className="separator-line"></div>
                  <span className="separator-text">to</span>
                </div>

                <div className="salary-column">
                  <label className="salary-label">Maximum</label>
                  <div className="salary-input-wrapper">
                    <span className="currency-symbol">£</span>
                    <input
                      type="text"
                      className="salary-input"
                      placeholder="Max"
                      value={formatSalary(maxSalary)}
                      onChange={(e) => handleSalaryChange('max', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Salary Range Suggestions */}
              <div className="salary-suggestions">
                <p className="suggestions-title">Quick select:</p>
                <div className="salary-chips">
                  {salaryRanges.map((range, index) => (
                    <button
                      key={index}
                      type="button"
                      className="salary-chip"
                      onClick={() => {
                        const numericValue = range.replace(/[^0-9]/g, '');
                        if (!minSalary || parseInt(minSalary) > parseInt(numericValue)) {
                          setMinSalary(numericValue);
                        }
                        if (!maxSalary || parseInt(maxSalary) < parseInt(numericValue)) {
                          setMaxSalary(numericValue);
                        }
                      }}
                    >
                      £{range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-section">
              <button
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                </svg>
                Back
              </button>

              <div className="navigation-right">
                <button
                  type="button"
                  className="skip-button"
                  onClick={handleSkip}
                >
                  Skip
                </button>

                <button
                  type="submit"
                  className="continue-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LocationPreferences;