import { useState } from 'react';
import '../css/SampleCvs.css';

const SampleCVs = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const cvTemplates = [
    {
      id: 1,
      title: "Modern Tech Professional",
      atsScore: 98,
      description: "Best for Software Engineers, Product Managers",
      industry: "technology",
      color: "#3a6161",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbFEbz5Vous9U5AkpFuy2DYjJhblXGMPuzfzaNcjHAIr_UEJk0pHK0C198k-BoIZJ6vJl-DiOU65gH73z6_1Wizm9kKjzny-ZmDdUTURV-UpnVo40E2RFM_avIONK3NFp5Xqt4CWFm7BRpU_eczosJB_gHnC3cHSJz-Ml-Bd4lL_ykkZqA9k6CDFTAfFB_c44fO-EE1o1H98SNO8_t-1TQW3nZetIflShSZU1isPiTbPOeQZwr2KuE-pOhmEK07YOodz6IVCrOwuc"
    },
    {
      id: 2,
      title: "Executive Finance",
      atsScore: 95,
      description: "Best for Investment Banking, Financial Analysis",
      industry: "finance",
      color: "#E5CDC1",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE2sPtxy7SLl4HjqMSj9-1iNFK4GpPr2kXn5-iiXATZ9QKMI8iUN71jWvpJOBOEMIuuLNEZ7TrwEtIqSGjSqS82VU0wXugdZKWZH1BrSlocxdvpSK4q7PKs_fHkG9HUSEvRPCXKixdx05lUQFJK5b-UjBchgDqiGIgK_Lpyz-7yAYQA_gIY4scInhW-TeGHZ1ljUyl7OhlzmEPcEE-jshqEmL0zfaiaT334F6WP3i1JmShWuTG4VciqOfUVG2DMPfnTUOQllfDlok"
    },
    {
      id: 3,
      title: "Creative Minimalist",
      atsScore: 92,
      description: "Best for Graphic Designers, Content Strategists",
      industry: "creative",
      color: "#F3D9C1",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXPSJJ8fFxslfrEYRgi4RKHhu90vSy_3GJL3b82TheK6MCaZQNx6nFhQe8UbsJlJdXgJv6LF7456HcJFOc4h84E_mU3INdR2LgUwZM-8n0N9MkmHjqTRIsokp89goARyQpCQVNS0aPMrLbdNn7gIN_gt3CT9yYJO0Kj9VzV6YGgDjGTqTANzOXD4o_drJ1sOZEGAOyJ_1GEM36KRLElirA4LWNW5t08g0BHZGyOHTG9YvFe06ULTliXnf5LvOkSIV0d7yQ4b8lLoY"
    },
    {
      id: 4,
      title: "Marketing Specialist",
      atsScore: 96,
      description: "Best for Brand Managers, SEO Specialists",
      industry: "marketing",
      color: "#F2F2F2",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtpjIErkNlw8CqiIqk3EwSSxcZvl-S56Hg00EVRD9IK8dhLspTZDoi_f-sP9SkEbLEZnaRPWz7TYz9C_q2tKNXW67qzYgQ0rnpxViA-ZCE7V0XcqDauzuzaqT5HboELlzZoyMwipdziclXLCYtreOQDNiBwA5KZkkSs2EgLrxlKpr3pU9OvIZi7l_TuD_vglRFlTJJ9Yc9AbYvQFf4u-HNxfyp5UKPOp3NHbDDEo1VuW4yCLMgyoB0sF9cjWsra1GQ_MXm4rAcNlg"
    },
    {
      id: 5,
      title: "Healthcare Leader",
      atsScore: 94,
      description: "Best for Hospital Admin, Clinical Re",
      industry: "healthcare",
      color: "#D6A982",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvVRBomOc7y-LC4uBkJApd5pSuhMGP3spdPSnqrdPg9k5t5qjCCL-GbdmX0VlUWm7yFhKnyeiJ1hYJBi5KVPhTkMg0lrxFCiLvE91W1d333oyNcL_i6A561XGJwQInp0IxQ_2uWv4GLgz5LT-MTz5l1LhypmjIbvbL-qTB_QHVgloZL9F5xg68tN3sR5eAF8tWWAKLMJ3NtyAtCuC1pxrT_83iqJoxF_C3A4CL89bOuMglhprdqOjKQnYfr-HYJSNfaMyHA0QvkrA"
    },
    {
      id: 6,
      title: "Client Success Pro",
      atsScore: 97,
      description: "Best for CS Managers, Account Executives",
      industry: "client-services",
      color: "#F0F0F0",
      imageUrl: null
    }
  ];

  const industries = [
    { id: 'all', name: 'All Templates' },
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance & Banking' },
    { id: 'creative', name: 'Creative & Design' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'marketing', name: 'Marketing & Sales' }
  ];

  const filteredTemplates = activeFilter === 'all'
    ? cvTemplates
    : cvTemplates.filter(template => template.industry === activeFilter);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  return (
    <div className="sample-cvs-container">
      {/* Sidebar for larger screens */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <p className="sidebar-title">Industries</p>
          {industries.map(industry => (
            <button
              key={industry.id}
              className={`sidebar-link ${activeFilter === industry.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(industry.id)}>
              {industry.name}
            </button>
          ))}
        </nav>
        {/*         
        <div className="sidebar-promo">
          <h3 className="promo-title">Need a custom review?</h3>
          <p className="promo-text">
            Upload your existing CV to our AI analyzer for personalized feedback.
          </p>
          <button className="promo-button">
            Try Analyzer
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="cvmain-content">
        <header className="page-header">
          <div className="header-text">
            <h2 className="page-title">Resume Library</h2>
            <p className="cvpage-subtitle">Choose from our professionally designed, ATS-friendly templates.</p>
          </div>

          {/* <div className="header-actions">
            <button className="icon-button">
              <span className="material-icons-round"></span>
            </button>
            <button className="filter-button">
              <span className="material-icons-round"></span>
              Filter
            </button>
          </div> */}
        </header>

        {/* Mobile filter tabs */}
        <div className="mobile-filter-tabs">
          <div className="tabs-container">
            {industries.map(industry => (
              <button
                key={industry.id}
                className={`mobile-tab ${activeFilter === industry.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(industry.id)}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>

        {/* CV Templates Grid */}
        <div className="cv-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="cv-card">
              <div
                className="cv-preview"
                style={{ backgroundColor: template.color }}
              >
                {template.imageUrl ? (
                  <img
                    src={template.imageUrl}
                    alt={`${template.title} Resume Preview`}
                    className="cv-image"
                  />
                ) : (
                  <div className="placeholder-image">
                    <div className="placeholder-circle">
                      <div className="placeholder-inner"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="cv-info">
                <div className="cv-header">
                  <h3 className="cv-title">{template.title}</h3>
                  <span className="ats-badge">
                    ATS {template.atsScore}%
                  </span>
                </div>
                <p className="cv-description">{template.description}</p>

                <div className="cv-actions">
                  <button className="preview-button">
                    <span className="material-icons-round"></span>
                    Preview
                  </button>
                  <button className="download-button">
                    <span className="material-icons-round"></span>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-button">
            <span className="material-icons-round"></span>
          </button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">
            <span className="material-icons-round"></span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SampleCVs;