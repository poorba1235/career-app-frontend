import React from 'react';
import '../css/Blog.css';

const Blog = () => {
  const blogCategories = [
    'All Articles',
    'Career Advice',
    'Visa News',
    'Success Stories',
    'UK Lifestyle',
    'Industry Trends'
  ];

  const blogPosts = [
    {
      id: 1,
      category: 'Visa News',
      title: 'Understanding the 2024 UK Graduate Visa Updates',
      description: 'Essential reading for all final year students considering their post-study options under the current immigration rules.',
      author: 'Career Sphere Team',
      readTime: '5 min read',
      bgColor: '#4895EF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCprrVH8MIdVRYLyDrmhg2KblrVVlO7rRSMiwkZHH8_EiemzcjcC2kSgUqoqu2XtYAQSkM6CTLSipAroio-YKhizyYVhcRQvdW2ug3-9_NHdr9534Bzfm5FA77wexLIwEc_D4gflbUcQ3PQqzDm1W5LmO9Dmqeq4-WxFkqzVw-7lP04b-EDJDnwLEJVy19pJMbGmENdhNq2ocB5x7vHI0n8mpgLVQxegvKxFhjMW9jzFxwAFO3q5bXaj3mXUyeV_dZcNK59yrb249E',
      overlayText: 'VISA'
    },
    {
      id: 2,
      category: 'Success Stories',
      title: 'From Student to Senior Analyst: An Interview with Amara',
      description: 'Amara shares her journey from a Nigerian international student to a leadership role in London\'s fintech scene.',
      author: 'Career Sphere Team',
      readTime: '12 min read',
      bgColor: '#95D5B2',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrr405LaEWg80HbGx7Ed6R05xOB-3IDUXCpUcTWvx5MIrXyd7JLnCuAK1bvXRraYO1y-iKLRTJcOz5aRte8N9C-n9XbSwnUd1_jC4MhIfZj7vA-X13_8_scTYiVsTVwTgn5a3wu22gDhZzJCbqksQqzep5gXciMriH2PWLjwu3AdIJoo0W63e9AJVuS__LDdibnklRKGRtiQHjzDvUQsWb3AT3GSFkJVvIDflXHgVYjghOtNliMBigjz3SayE7ER8uy07j12Rrd7M',
      overlayText: 'SUCCESS STORY'
    },
    {
      id: 3,
      category: 'Career Advice',
      title: 'Mastering Virtual Interviews: Top 10 Pro Tips',
      description: 'How to handle digital assessments and video calls with the confidence of a seasoned professional.',
      author: 'Career Sphere Team',
      readTime: '7 min read',
      bgColor: '#2D513A',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtV9fyVVMtTysCVBY_o7X-I4FSWesjpJNNruquzFPGFv-jf60Ue71FWJpdMGU1wiNYnCg61IAMa9ZIgDUnezeFSDbpgE9pCKyv4-bmWqyqN4EOO6Ky0J1UXRvJK8hsC4qqLqJQ8R2frTSLgDWpDYcoGHA9KRoJL_Utc0ZmsMsqnqai1oyZWxXyn2-WE28h34rSzqr_mIzefTP_sqrMXn052-HsHwx9ucfOJw46zelVVbOlvzqlcY2cloXIvT7lCmUNJKQhoc7--K8',
      overlayText: 'INTERVIEWS',
      overlaySubtext: 'mastering the screen'
    },
    {
      id: 4,
      category: 'UK Lifestyle',
      title: 'Balancing Work and Studies: A Guide to Wellbeing',
      description: 'Managing the pressure of part-time jobs while excelling in your Master\'s program in the UK.',
      author: 'Career Sphere Team',
      readTime: '6 min read',
      bgColor: '#4B6E64',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK_PgpFrM3xC3Co1I6MENnnXiThUZDO-B9mfXknLpL9bvN-mkZwhK4FeVG2gEPIGSaUazeInlCIOmi1cNDXW4lY6nJw7TKbVrBctVq2gCUiin8-xmk7arDaAANjG-QljOIddSLsf34aoHJA8aUfUJno74VBgQGBjzaOTc0YzIFxAy6uo49Vw9bpQVv8vbZTPyKh34FbYVCBbtkg_YpRzUXRW4hiPNmVHOF2I7oFDy1wMkLbEwtVPvQcGoX6-5ejoTn5QA7mWYKP5c'
    },
    {
      id: 5,
      category: 'Industry Trends',
      title: 'The Future of AI in Graduate Recruitment',
      description: 'How top UK firms are using artificial intelligence to screen CVs and what it means for your application.',
      author: 'Career Sphere Team',
      readTime: '10 min read',
      bgColor: '#1B263B',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-7rIvjQ8cWLv9WCEm3szNX09PL3Q_HHUs06jJPFq_xiKKkWvHJu4IDDuLoanc5lTfLGRZSUmqLKKtIUvWhfSXSaeGRuoOt2X90lpLAI-qA0X6pZtJZy9tO4x75P_buPyvd584qZ2ZFfMYmyH_OmOtfV1AlQl6SK1oLMHyMXTPJ1h9xTwvgOh5-mFeByqKU-wxFjv_FQjlRndRZxOLnIhTST49U4QH0KbuZytwYWMwnrrvpOhmbD-agBrUKZIvjuvgJ4byTLpoWeM',
      overlayText: 'Industry Trends',
      overlaySubtext: 'MINIMAL | FUTURE | NATURAL'
    },
    {
      id: 6,
      category: 'Success Stories',
      title: 'Securing Sponsorship: A Practical Guide',
      description: 'Real-world advice from international graduates who successfully transitioned to Skilled Worker visas.',
      author: 'Career Sphere Team',
      readTime: '9 min read',
      bgColor: '#0D1B2A',
      image: '',
      overlayText: 'Success Stories',
      overlayMainText: 'MINIMALI TO REPORT'
    }
  ];

  return (
    <main className="blog-container">
      <header className="blog-header">
        <div className="category-scroll-container">
          <div className="category-scroll">
            {blogCategories.map((category, index) => (
              <button
                key={index}
                className={`category-button ${index === 0 ? 'category-button-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search articles..."
            className="search-input"
          />
        </div>
      </header>

      <section className="featured-article-section">
        <div className="featured-article">
          <div className="featured-image-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE801D-5TRpRq5IjQiL_4ReQ8Y6L_paAn2Fs3BuY9mL0FAE_xkV_2twAcNRkxMyJnzCw1XqLha2_n0kAvxeG4b10TYi6kialuGCunL5910vH_imuvYGfxgGvHWQSFDjOoc8Ac0PD-9wImeB71eJ3cZcFQsFyxm4LZIAx_EPAYL1hsbNsVwZcjjKYs55NG3NhcOBVACRyeSxT0ELq2E6vCWvDSrc3TKkgo4CLYy9bH8ZBD6s5KDyW4w8AJqevPmeXTF9ijtL4evmio"
              alt="London Skyline at sunset"
              className="featured-image"
            />
          </div>
          <div className="featured-content">
            <div className="featured-badge">
              Featured Article
            </div>
            <h1 className="featured-title">
              Navigating the 2024 UK Job Market as an International Student
            </h1>
            <p className="featured-description">
              The UK graduate market is evolving rapidly. From new visa regulations to the rise of AI in recruitment, discover how you can position yourself for success this year.
            </p>
            <div className="author-info">
              <div className="author-avatar">
                <span className="avatar-icon">person</span>
              </div>
              <div>
                <p className="author-name">Career Sphere Team</p>
                <p className="publish-date">Published June 12, 2024 • 8 min read</p>
              </div>
            </div>
            <div>
              <a href="#" className="read-article-button">
                Read Full Article
                <span className="button-icon">east</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-articles-header">
        <h2>Recent Articles</h2>
        {/* <a href="#" className="browse-all-link">
          Browse all
          <span className="link-icon">open_in_new</span>
        </a> */}
      </section>

      <section className="blog-grid">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-card">
            <div 
              className="blog-card-image" 
              style={{ backgroundColor: post.bgColor }}
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="card-image"
                />
              )}
              {post.overlayText && (
                <div className="image-overlay">
                  {post.overlayMainText ? (
                    <>
                      <p className="overlay-subtext">{post.overlayText}</p>
                      <h3 className="overlay-main-text">{post.overlayMainText}</h3>
                      <div className="overlay-divider"></div>
                    </>
                  ) : post.id === 3 ? (
                    <>
                      <h3 className="overlay-text-large">{post.overlayText}</h3>
                      <p className="overlay-subtext-small">{post.overlaySubtext}</p>
                    </>
                  ) : post.id === 4 ? (
                    <div className="wellbeing-overlay">
                      <div className="wellbeing-icon-container">
                        <span className="wellbeing-icon">spa</span>
                      </div>
                    </div>
                  ) : post.id === 5 ? (
                    <>
                      <h3 className="trends-overlay-text">{post.overlayText}</h3>
                      <p className="trends-overlay-subtext">{post.overlaySubtext}</p>
                    </>
                  ) : post.id === 1 ? (
                    <div className="visa-overlay">
                      <div className="visa-overlay-content">
                        <h3 className="visa-text">{post.overlayText}</h3>
                      </div>
                    </div>
                  ) : post.id === 2 ? (
                    <div className="success-overlay">
                      <div className="success-overlay-content">
                        <h3 className="success-text">{post.overlayText}</h3>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
              {post.id === 6 && !post.image && (
                <>
                  <div className="gradient-overlay"></div>
                  <div className="radial-overlay"></div>
                  <div className="minimal-overlay">
                    <p className="minimal-subtext">{post.overlayText}</p>
                    <h3 className="minimal-text">{post.overlayMainText}</h3>
                    <div className="minimal-divider"></div>
                  </div>
                </>
              )}
            </div>
            <div className="blog-card-content">
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-description">{post.description}</p>
              <div className="blog-card-footer">
                <span className="blog-card-author">{post.author}</span>
                <span className="blog-card-read-time">
                  <span className="time-icon">schedule</span>
                  {post.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Blog;