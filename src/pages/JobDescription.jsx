import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/JobDescription.css';

const JobDescription = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get job data from location state or use default
  const jobData = location.state?.job || {
    id: 1,
    title: "Graduate Software Engineer",
    company: "Google UK",
    location: "London",
    type: "Full-time",
    salary: "£45,000 - £55,000",
    posted: "2 days ago",
    isFavorite: false,
    description: "Join our graduate programme and work on cutting-edge technology projects. We're looking for talented graduates with strong problem-solving skills and passion for innovation.",
    tags: ["Visa Sponsorship", "Graduate Role"],
    companyInitial: "G"
  };

  const [isFavorite, setIsFavorite] = useState(jobData.isFavorite);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleApplyNow = () => {
    console.log('Applying for job:', jobData.id);
    // Implement application logic here
    alert(`Applying for ${jobData.title} at ${jobData.company}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites:`, jobData.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobData.title,
        text: `Check out this job: ${jobData.title} at ${jobData.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="job-description-page">
      {/* Add Material Symbols link in index.html or here */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />

      {/* Main Content */}
      <main className="job-description-main">
        {/* Back Button */}
        <button
          className="back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to all jobs
        </button>

        {/* Job Header */}
        <div className="job-header-card">
          <div className="job-header-content">
            <div className="job-header-left">
              {/* <div className="company-logo" data-color={jobData.companyInitial === 'G' ? 'blue' :
                jobData.companyInitial === 'M' ? 'purple' :
                  jobData.companyInitial === 'D' ? jobData.company === 'Deliveroo' ? 'orange' : 'green' : 'indigo'}>
                {jobData.companyInitial}
              </div> */}
              <div className="job-header-details">
                <h1 className="desc-job-title">{jobData.title}</h1>
                <p className="job-company">{jobData.company}</p>
                <div className="job-meta">
                  <span className="job-meta-item">
                    <span className="material-symbols-outlined">location_on</span>
                    {jobData.location}
                  </span>
                  <span className="job-meta-item">
                    <span className="material-symbols-outlined">work</span>
                    {jobData.type}
                  </span>
                  <span className="job-meta-item">
                    <span className="material-symbols-outlined">payments</span>
                    {jobData.salary}
                  </span>
                  {jobData.posted && (
                    <span className="job-meta-item">
                      <span className="material-symbols-outlined">schedule</span>
                      {jobData.posted}
                    </span>
                  )}
                </div>
                <div className="job-tags">
                  {jobData.tags?.map((tag, index) => (
                    <span key={index} className={`job-tag ${tag === 'Visa Sponsorship' ? 'visa-tag' : ''}`}>
                      {tag === 'Visa Sponsorship' && <span className="material-symbols-outlined">check_circle</span>}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="job-header-right">
              <button
                className="apply-button"
                onClick={handleApplyNow}
              >
                Apply Now
              </button>
              <div className="job-actions">
                <button
                  className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                  onClick={toggleFavorite}
                >
                  <span className="material-symbols-outlined">
                    {isFavorite ? 'favorite' : 'favorite'}
                  </span>
                </button>
                <button
                  className="share-button"
                  onClick={handleShare}
                >
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Sections */}
        <div className="job-sections">
          {/* Job Description */}
          <section className="job-section">
            <div className="new-section-header">
              <div className="section-indicator"></div>
              <h2 className="section-title">Job Description</h2>
            </div>
            <div className="section-content">
              <p className="section-paragraph">
                {jobData.description}
              </p>
              <p className="section-paragraph">
                As a Graduate Software Engineer at {jobData.company}, you'll be part of an innovative team that's shaping the future of technology. You'll contribute to real projects from day one, with mentorship from experienced engineers.
              </p>
            </div>
          </section>

          {/* About the Role */}
          <section className="job-section">
            <div className="new-section-header">
              <div className="section-indicator"></div>
              <h2 className="section-title">About the Role</h2>
            </div>
            <div className="section-content">
              <p className="section-paragraph">
                We are looking for a motivated Graduate Software Engineer to join our growing engineering team. In this role, you will work closely with senior developers to design, develop, and maintain high-quality software solutions.
              </p>
              <p className="section-paragraph">
                You will have the opportunity to work across the full stack, utilizing modern technologies such as React, Node.js, and AWS. We value curiosity, a willingness to learn, and a passion for building products that make a real difference.
              </p>
            </div>
          </section>

          {/* Requirements */}
          <section className="job-section">
            <div className="new-section-header">
              <div className="section-indicator"></div>
              <h2 className="section-title">Requirements</h2>
            </div>
            <div className="requirements-list">
              <div className="requirement-item">

                <span className="requirement-text">Bachelor's or Master's degree in Computer Science or a related field.</span>
              </div>
              <div className="requirement-item">

                <span className="requirement-text">Strong foundation in data structures, algorithms, and software design.</span>
              </div>
              <div className="requirement-item">

                <span className="requirement-text">Familiarity with at least one modern programming language (JavaScript, Python, Java).</span>
              </div>
              <div className="requirement-item">

                <span className="requirement-text">Excellent communication skills and ability to work in a collaborative team environment.</span>
              </div>
            </div>
          </section>

          {/* Perks & Benefits */}
          <section className="job-section">
            <div className="new-section-header">
              <div className="section-indicator"></div>
              <h2 className="section-title">Perks & Benefits</h2>
            </div>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <span className="benefit-text">Private Health Insurance</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">laptop_mac</span>
                </div>
                <span className="benefit-text">Hybrid Work Model</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <span className="benefit-text">Gym Membership</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="benefit-text">Learning & Development</span>
              </div>
            </div>
          </section>

          {/* Apply Section */}
          {/* <section className="job-section">
            <div className="new-section-header">
              <div className="section-indicator"></div>
              <h2 className="section-title">Ready to Apply?</h2>
            </div>
            <div className="section-content">
              <p className="section-paragraph">
                If you're excited about this opportunity and meet the requirements, we'd love to hear from you. Click the "Apply Now" button below to submit your application.
              </p>
              <button 
                className="apply-button large"
                onClick={handleApplyNow}
              >
                Apply Now
              </button>
            </div>
          </section> */}
        </div>

        {/* Spacer for fixed Apply Button */}
        <div className="bottom-spacer"></div>
      </main>

      {/* Fixed Apply Button for Mobile */}
      <div className="fixed-apply-button">
        <button
          className="apply-button mobile"
          onClick={handleApplyNow}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDescription;