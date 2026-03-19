import {
  Bell,
  Briefcase,
  Clock,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/dashboard/notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/recommendations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const jobs = await response.json();
        const jobNotifications = jobs.map(job => ({
          id: `job-${job._id}`,
          type: 'job_match',
          title: ` ${job.title}`,
          description: `${job.company} is hiring in ${job.location}. This matches your profile preferences.`,
          time: job.datePosted || 'Recently',
          icon: Briefcase,
          priority: 'high',
          action: 'Apply Now',
          link: job.link
        }));

        setNotifications(prev => [...jobNotifications, ...prev]);
      }
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
    }
  };

  const priorityColors = {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#6B7280'
  };

  const priorityLabels = {
    high: 'Important',
    medium: 'Update',
    low: 'Info'
  };

  const handleAction = (notification) => {
    if (notification.type === 'job_match' && notification.link) {
      window.open(notification.link, '_blank');
    }
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <header className="notifications-header">
        <div className="header-left ">

          <h1>  <Bell size={24} className="header-icon" />Notifications</h1>
        </div>

      </header>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div key={notification.id} className="notification-card">
                <div className="notification-icon">
                  <div className="icon-wrapper" style={{ backgroundColor: `${priorityColors[notification.priority]}15` }}>
                    <Icon size={24} style={{ color: priorityColors[notification.priority] }} />
                  </div>
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <div className="notification-badge" style={{
                      backgroundColor: priorityColors[notification.priority],
                      color: notification.priority === 'high' ? 'white' : '#1F2937'
                    }}>
                      {priorityLabels[notification.priority]}
                    </div>
                    <span className="notification-time">
                      <Clock size={14} />
                      {notification.time}
                    </span>
                  </div>

                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-description">{notification.description}</p>

                  <div className="notification-actions">
                    <button className="primary-action" onClick={() => handleAction(notification)}>
                      {notification.action}
                    </button>
                    {/* <button className="delete-action">
                      <Trash2 size={18} />
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })

        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>No new notifications at this time.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>We'll notify you when new jobs match your profile.</p>
            <Link to="/dashboard/profile" style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#2D5A4C',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}>
              Update Profile Preferences
            </Link>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {/* <div className="load-more-container">
          <button className="load-more-button">
            View Older Notifications
            <ChevronDown size={20} />
          </button>
        </div> */}


    </div>
  );
};


export default Notifications;