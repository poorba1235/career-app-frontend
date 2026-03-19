import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  Download,
  ArrowRight,
  ChevronRight,
  Clock,
  FileText,
  FileCheck,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  Calendar,
  Users,
  Award,
  HelpCircle,
  Sun,
  Moon,
  CheckCircle
} from 'lucide-react';
import '../css/Resources.css';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedResources, setSavedResources] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const resourceCategories = [
    {
      id: 1,
      title: 'Visa & Work Rights',
      icon: ShieldCheck,
      color: 'green',
      items: [
        {
          id: 101,
          type: 'Guide',
          typeColor: 'emerald',
          title: 'Complete Guide to UK Graduate Visa',
          description: 'Everything you need to know about the Graduate Route visa, including application steps and deadlines.',
          tags: ['Graduate Visa', 'Post-Study Work'],
          readTime: '12 min read'
        },
        {
          id: 102,
          type: 'Guide',
          typeColor: 'emerald',
          title: 'Skilled Worker Visa Requirements',
          description: 'Detailed breakdown of Skilled Worker visa criteria, points system, and employer sponsorship.',
          tags: ['Skilled Worker', 'Sponsorship'],
          readTime: '15 min read'
        },
        {
          id: 103,
          type: 'Checklist',
          typeColor: 'emerald',
          title: 'Visa Application Document Checklist',
          description: 'Complete list of documents required for UK visa applications with formatting guidelines.',
          tags: ['Documentation', 'Checklist'],
          readTime: '8 min read'
        },
        {
          id: 104,
          type: 'Guide',
          typeColor: 'emerald',
          title: 'Post-Study Work Rights Explained',
          description: 'Understanding your work rights and options after completing studies in the UK.',
          tags: ['Work Rights', 'Graduate'],
          readTime: '10 min read'
        }
      ]
    },
    {
      id: 2,
      title: 'Application Success',
      icon: FileCheck,
      color: 'orange',
      items: [
        {
          id: 201,
          type: 'Template',
          typeColor: 'orange',
          title: 'UK CV Template for International Students',
          description: 'Professional CV template designed specifically for the UK job market and visa status transparency.',
          tags: ['CV Template', 'UK Format'],
          readTime: '5 min read'
        },
        {
          id: 202,
          type: 'Template',
          typeColor: 'orange',
          title: 'Cover Letter Template',
          description: 'Effective cover letter template highlighting international student strengths.',
          tags: ['Cover Letter', 'Template'],
          readTime: '7 min read'
        },
        {
          id: 203,
          type: 'Guide',
          typeColor: 'orange',
          title: 'UK ATS-Friendly CV Writing',
          description: 'How to optimize your CV for Applicant Tracking Systems used by UK employers.',
          tags: ['ATS', 'CV Writing'],
          readTime: '12 min read'
        },
        {
          id: 204,
          type: 'Checklist',
          typeColor: 'orange',
          title: 'Job Application Quality Checklist',
          description: 'Ensure your applications meet UK employer standards before submitting.',
          tags: ['Quality', 'Checklist'],
          readTime: '6 min read'
        }
      ]
    },
    {
      id: 3,
      title: 'Interview Preparation',
      icon: MessageSquare,
      color: 'indigo',
      items: [
        {
          id: 301,
          type: 'Article',
          typeColor: 'indigo',
          title: 'Common Competency Questions',
          description: 'Mastering the most frequent interview questions used by top UK graduate employers.',
          tags: ['Interview', 'Preparation'],
          readTime: '20 min read'
        },
        {
          id: 302,
          type: 'Guide',
          typeColor: 'indigo',
          title: 'STAR Method Complete Guide',
          description: 'Step-by-step guide to answering behavioral questions using the STAR method.',
          tags: ['STAR Method', 'Behavioral'],
          readTime: '18 min read'
        },
        {
          id: 303,
          type: 'Checklist',
          typeColor: 'indigo',
          title: 'Interview Day Checklist',
          description: 'Everything you need to prepare for and succeed on interview day.',
          tags: ['Checklist', 'Preparation'],
          readTime: '8 min read'
        },
        {
          id: 304,
          type: 'Template',
          typeColor: 'indigo',
          title: 'Interview Question Bank',
          description: 'Comprehensive list of interview questions with suggested answer structures.',
          tags: ['Questions', 'Template'],
          readTime: '15 min read'
        }
      ]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleDownload = (resourceId, resourceTitle) => {
    console.log('Downloading:', resourceTitle);
    alert(`Downloading: ${resourceTitle}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    };
    return colors[color] || colors.green;
  };

  const getTypeColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
      orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
    };
    return colors[color] || colors.emerald;
  };

  const ResourceCard = ({ resource, category }) => {
    const Icon = category.icon;
    const TypeIcon = resource.type === 'Guide' ? BookOpen : 
                     resource.type === 'Template' ? FileText : 
                     resource.type === 'Article' ? MessageSquare : 
                     resource.type === 'Checklist' ? CheckCircle : HelpCircle;
    
    return (
      <div className="resource-card group">
        <div className="card-header">
          <div className="resource-type-container">
            
            <span className={`resource-type ${getTypeColorClasses(resource.typeColor)}`}>
              {resource.type}
            </span>
          </div>
          <div className="card-actions">
            <button 
              className="action-button"
              onClick={() => handleDownload(resource.id, resource.title)}
              title="Download"
            >
              <Download size={20} />
            </button>
            <button 
              className="action-button"
              onClick={() => toggleSaveResource(resource.id)}
              title={savedResources.includes(resource.id) ? 'Unsave' : 'Save'}
            >
              <Bookmark 
                size={20} 
                fill={savedResources.includes(resource.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
        
        <h3 className="resource-title">{resource.title}</h3>
        <p className="resource-description">{resource.description}</p>
        
        <div className="resource-tags">
          {resource.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="card-footer">
          <span className="read-time">
            <Clock size={14} />
            {resource.readTime}
          </span>
          <a href="#" className="read-more">
            Read more
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={`resources-page ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="resources-header">
        <div className="header-container">
          <div className="t">
            <h1 className="page-title">Resources</h1>
            <p className="page-subtitle">Expert editorial content for international students in the UK.</p>
          </div>
          
          <div className="header-right">
            <form onSubmit={handleSearch} className="new-search-form">
              <Search size={20} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search resources..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="resources-main">
        {resourceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.id} className="category-section">
              <div className="category-header">
                <div className="category-title-container">
                  <div className={`category-icon ${getColorClasses(category.color)}`}>
                    <Icon size={20} />
                  </div>
                  <h2 className="category-title">{category.title}</h2>
                </div>
                <a href="#" className="view-all">
                  View all
                  <ChevronRight size={16} />
                </a>
              </div>
              
              <div className="resources-grid">
                {category.items.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    category={category}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      
    </div>
  );
};

export default Resources;