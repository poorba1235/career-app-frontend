import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../css/JobFinder.css';

const JobFinder = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('savedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      return [];
    }
  });
  const [filters, setFilters] = useState({
    jobTitle: '',
    location: 'All UK Locations',
    visaSponsorship: false,
    jobTypes: {
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      graduateProgramme: false
    },
    salaryMin: '',
    salaryMax: ''
  });

  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [heroSearch, setHeroSearch] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Helpers
  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const getRandomColor = (name) => {
    const colors = ['blue', 'purple', 'orange', 'green', 'indigo', 'red', 'teal'];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const deriveJobType = (title = '', snippet = '') => {
    const text = (title + ' ' + snippet).toLowerCase();
    if (text.includes('contract') || text.includes('freelance') || text.includes('temporary')) return 'Contract';
    if (text.includes('intern') || text.includes('internship')) return 'Internship';
   
    if (text.includes('part-time') || text.includes('part time')) return 'Part-time';
    return 'Full-time';
  };

  const parseSalary = (salaryStr) => {
    if (!salaryStr) return null;
    const cleanStr = salaryStr.toLowerCase().replace(/,/g, '');
    const match = cleanStr.match(/(\d+(\.\d+)?)/);
    if (!match) return null;
    let amount = parseFloat(match[1]);
    if (cleanStr.includes('k')) amount *= 1000;
    return amount;
  };

  const parseRelativeDate = (dateStr) => {
    if (!dateStr) return 0;
    const now = new Date();
    const num = parseInt(dateStr) || 1;
    if (dateStr.includes('hour') || dateStr.includes('hr')) return now - num * 3600000;
    if (dateStr.includes('day')) return now - num * 86400000;
    if (dateStr.includes('week')) return now - num * 7 * 86400000;
    if (dateStr.includes('month')) return now - num * 30 * 86400000;
    return 0;
  };

  const fetchJobs = async (searchQuery = '', searchLocation = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please login to search jobs.');
          toast.error('Session expired. Please login.');
        } else {
          throw new Error('Failed to fetch jobs');
        }
        return;
      }

      const rawJobs = await response.json();
      const mappedJobs = rawJobs.map((job, index) => {
        let jobType = 'Full-time';
        if (job.employment_type) {
          const empType = job.employment_type.toLowerCase();
          if (empType.includes('contract') || empType.includes('temp')) jobType = 'Contract';
          else if (empType.includes('part')) jobType = 'Part-time';
          else if (empType.includes('intern')) jobType = 'Internship';
        } else if (job.department) {
          jobType = deriveJobType(job.job_title || '', job.department);
        }

        const description = job.raw_description || job.job_description || '';

        return {
          id: job.job_url || job.application_url || `job-${index}`,
          title: job.job_title || 'Untitled Position',
          company: job.company || "Unknown Company",
          location: job.location || "Location not specified",
          type: jobType,
          salary: job.salary || "Not mention",
          description: description,
          visaSponsorship: job.visa_sponsorship || false,
          tags: job.department ? [job.department] : ['Job'],
          companyInitial: getCompanyInitial(job.company),
          color: getRandomColor(job.company),
          link: job.application_url || job.job_url || job.company_website || '#',
          posted: job.posted_date || "Recently",
          numericSalary: job.salary_min || parseSalary(job.salary),
          jobUrl: job.job_url,
          applicationUrl: job.application_url,
          companyWebsite: job.company_website,
          workMode: job.work_mode,
          department: job.department,
          experienceLevel: job.experience_level
        };
      });

      const heroQuery = searchQuery || heroSearch;
      const sidebarQuery = filters.jobTitle;
      const query = heroQuery || sidebarQuery;
      const location = searchLocation || (filters.location === 'All UK Locations' ? '' : filters.location);

      let filteredJobs = mappedJobs;
      if (showSavedOnly) {
        filteredJobs = filteredJobs.filter(job => savedJobs.includes(job.id));
      }
      if (query && query.trim()) {
        filteredJobs = filteredJobs.filter(job => {
          const searchText = query.toLowerCase().trim();
          return job.title.toLowerCase().includes(searchText) ||
            job.company.toLowerCase().includes(searchText) ||
            job.description.toLowerCase().includes(searchText) ||
            (job.department && job.department.toLowerCase().includes(searchText));
        });
      }
      if (location && location.trim()) {
        filteredJobs = filteredJobs.filter(job => {
          return job.location.toLowerCase().includes(location.toLowerCase().trim());
        });
      }
      setJobs(filteredJobs);
    } catch (err) {
      console.error("Job fetch error:", err);
      setError('Failed to load jobs. Please try again.');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [showSavedOnly]);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        toast.success('Job removed from bookmarks');
        return prev.filter(id => id !== jobId);
      } else {
        toast.success('Job saved to bookmarks');
        return [...prev, jobId];
      }
    });
  };

  const handleApplyNow = (job) => {
    const targetUrl = job.jobUrl;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank');
    } else {
      toast.error('No application link available for this job');
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateJobType = (type, checked) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: {
        ...prev.jobTypes,
        [type]: checked
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobTitle: '',
      location: 'All UK Locations',
      visaSponsorship: false,
      jobTypes: {
        fullTime: false,
        partTime: false,
        contract: false,
        internship: false,
        graduateProgramme: false
      },
      salaryMin: '',
      salaryMax: ''
    });
    setHeroSearch('');
    setShowSavedOnly(false);
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter(job => {
    const { fullTime, partTime, contract, internship, graduateProgramme } = filters.jobTypes;
    const hasTypeFilter = fullTime || partTime || contract || internship || graduateProgramme;
    let matchesType = true;

    if (hasTypeFilter) {
      matchesType = false;
      if (fullTime && job.type === 'Full-time') matchesType = true;
      if (partTime && job.type === 'Part-time') matchesType = true;
      if (contract && job.type === 'Contract') matchesType = true;
      if (internship && job.type === 'Internship') matchesType = true;
     
    }

    const matchesVisa = filters.visaSponsorship ? job.visaSponsorship : true;
    let matchesSalary = true;
    const min = parseFloat(filters.salaryMin);
    const max = parseFloat(filters.salaryMax);

    if (job.numericSalary) {
      if (!isNaN(min) && job.numericSalary < min) matchesSalary = false;
      if (!isNaN(max) && job.numericSalary > max) matchesSalary = false;
    } else {
      if ((!isNaN(min) || !isNaN(max)) && !job.numericSalary) matchesSalary = false;
    }

    return matchesType && matchesVisa && matchesSalary;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'Newest') {
      return (b.postedTimestamp || 0) - (a.postedTimestamp || 0);
    }
    if (sortBy === 'Salary: High to Low') {
      return (b.numericSalary || 0) - (a.numericSalary || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="job-finder">
      <section className="job-hero">
        <img
          alt="Team working together"
          className="hero-background"
          src="../job.png"
        />
        <div className="hero-content">
          <h1 className="hero-title">
            ONE SEARCH. ENDLESS OPPORTUNITIES.
          </h1>
          <div className="job-search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <span className="material-symbols-outlined">search</span>
                <input
                  className="search-input"
                  placeholder="Search jobs, companies, or keywords..."
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                />
              </div>
              <button className="search-button" type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <main className="job-main">
        <div className="layout-container">
          <aside className="filters-sidebar">
            <div className="filters-card">
              <div className="filters-header">
                <h2>Filters</h2>
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              <div className="filters-content">
                <div className="filter-group saved-jobs-toggle" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <label className="filter-label" style={{ marginBottom: 0 }}>Show Saved Jobs</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showSavedOnly}
                      onChange={(e) => setShowSavedOnly(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Job Title</label>
                  <div className="filter-input-container">
                    <input
                      className="filter-input"
                      placeholder="e.g. Software Engineer"
                      type="text"
                      value={filters.jobTitle}
                      onChange={(e) => updateFilter('jobTitle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Location</label>
                  <select
                    className="filter-select"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                  >
                    <option>All UK Locations</option>
                    <option>London</option>
                    <option>Manchester</option>
                    <option>Birmingham</option>
                    <option>Leeds</option>
                    <option>Glasgow</option>
                    <option>Edinburgh</option>
                    <option>Liverpool</option>
                    <option>Bristol</option>
                    <option>Sheffield</option>
                    <option>Newcastle</option>
                    <option>Nottingham</option>
                    <option>Cardiff</option>
                    <option>Belfast</option>
                  </select>
                </div>

                <div className="filter-group">
                  <div className="checkbox-group">
                    <input
                      className="filter-checkbox"
                      id="visa"
                      type="checkbox"
                      checked={filters.visaSponsorship}
                      onChange={(e) => updateFilter('visaSponsorship', e.target.checked)}
                    />
                    <label className="checkbox-label" htmlFor="visa">
                      <span className="checkbox-title">Visa Sponsorship</span>
                      <span className="checkbox-subtitle">Only show jobs offering visa sponsorship</span>
                    </label>
                  </div>
                </div>

                <hr className="filter-divider" />

                <div className="filter-group">
                  <label className="filter-label">Job Type</label>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        checked={filters.jobTypes.fullTime}
                        onChange={(e) => updateJobType('fullTime', e.target.checked)}
                      />
                      Full-time
                    </label>
                    <label className="checkbox-item">
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        checked={filters.jobTypes.partTime}
                        onChange={(e) => updateJobType('partTime', e.target.checked)}
                      />
                      Part-time
                    </label>
                    <label className="checkbox-item">
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        checked={filters.jobTypes.contract}
                        onChange={(e) => updateJobType('contract', e.target.checked)}
                      />
                      Contract
                    </label>
                    <label className="checkbox-item">
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        checked={filters.jobTypes.internship}
                        onChange={(e) => updateJobType('internship', e.target.checked)}
                      />
                      Internship
                    </label>
             
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Salary Range</label>
                  <div className="salary-range">
                    <input
                      className="salary-input"
                      placeholder="Min"
                      type="text"
                      value={filters.salaryMin}
                      onChange={(e) => updateFilter('salaryMin', e.target.value)}
                    />
                    <span className="salary-separator">-</span>
                    <input
                      className="salary-input"
                      placeholder="Max"
                      type="text"
                      value={filters.salaryMax}
                      onChange={(e) => updateFilter('salaryMax', e.target.value)}
                    />
                  </div>
                </div>

                <button className="apply-filters" onClick={handleSearch}>
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="jobs-list">
            <div className="jobs-header">
              <p className="jobs-count">
                Showing <span className="count-number">{sortedJobs.length} jobs</span>
              </p>
              <div className="sort-container">
                <span className="sort-label">Sort by:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                 
                  <option>Newest</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading-spinner">Loading jobs...</div>
            ) : (
              <div className="jobs-container">
                {currentJobs.length === 0 && !error && <p>No jobs found. Try adjusting your search.</p>}
                {currentJobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <button
                      className="save-button"
                      onClick={() => toggleSaveJob(job.id)}
                    >
                      <span className="material-symbols-outlined" style={{
                        fontVariationSettings: savedJobs.includes(job.id) ? "'FILL' 1" : "'FILL' 0"
                      }}>
                        bookmark
                      </span>
                    </button>

                    <div className="job-content">
                      <div className="job-details">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="company-name">{job.company}</p>

                        <div className="job-meta">
                          <span className="meta-item">
                            <span className="material-symbols-outlined">location_on</span>
                            {job.location}
                          </span>
                          <span className="meta-item">
                            <span className="material-symbols-outlined">schedule</span>
                            {job.type}
                          </span>
                          <span className="meta-item">
                            <span className="material-symbols-outlined">payments</span>
                            {job.salary}
                          </span>
                          <span className="meta-item">
                            <span className="material-symbols-outlined">calendar_today</span>
                            {job.posted}
                          </span>
                        </div>

                        <p className="job-description">{job.description}</p>

                        <div className="job-footer">
                          <div className="job-tags">
                            {job.tags.map((tag, index) => (
                              <span key={index} className={`job-tag ${tag === 'Visa Sponsorship' ? 'visa-tag' : ''}`}>
                                {tag === 'Visa Sponsorship' && <span className="material-symbols-outlined">check_circle</span>}
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            className="apply-button"
                            onClick={() => handleApplyNow(job)}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="pagination">
                <button
                  className="pagination-button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {(() => {
                  const maxButtons = 10;
                  const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;
                  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

                  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
                    <button
                      key={number}
                      className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  ));
                })()}

                <button
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobFinder;