import { CheckCircle, FileText, LayoutDashboard, Loader2, TrendingUp, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import '../../css/dashboard/dashHome.css';

const DashHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    interviewCount: 0,
    cvCount: 0,
    lastInterviewScore: null
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [recentCVs, setRecentCVs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [cvChartData, setCvChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, interviewsRes, cvsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/user/stats`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/interview/history`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/cv/history`, { headers })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (interviewsRes.ok) {
          const interviewsData = await interviewsRes.json();
          // Take top 2 *completed* for table
          const completedInterviews = interviewsData.filter(i => i.overallScore != null && i.overallScore > 0);
          setRecentInterviews(completedInterviews.slice(0, 3));
          // Prepare chart data (reverse for chronological order), take last 10
          const chartData = interviewsData
            .filter(i => i.overallScore != null && i.overallScore > 0) // Filter out incomplete/0 score interviews
            .slice(0, 10)
            .reverse()
            .map(i => ({
              date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              score: Number(i.overallScore)
            }));
          setChartData(chartData);
        }

        if (cvsRes.ok) {
          const cvsData = await cvsRes.json();
          // Take top 2
          setRecentCVs(cvsData.slice(0, 2));

          // Prepare CV Chart Data
          const cvChartData = cvsData
            .filter(c => c.analysisResult?.score != null && c.analysisResult.score > 0)
            .slice(0, 10)
            .reverse() // Chronological order
            .map(c => ({
              date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              score: Number(c.analysisResult?.score)
            }));
          setCvChartData(cvChartData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="dash-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={32} color="#4f46e5" />
      </div>
    );
  }

  return (
    <div className="dash-home">
      <header className="notifications-header">
        <div className="header-left ">
          <h1>  <LayoutDashboard size={24} className="header-icon" />Overview</h1>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Interviews</span>
            <Video size={20} className="stat-icon" style={{ color: '#4f46e5' }} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.interviewCount}</span>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>Lifetime Sessions</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">CV Checks</span>
            <FileText size={20} className="stat-icon" style={{ color: '#0ea5e9' }} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.cvCount}</span>
            <span className="stat-subtext">Total Analyzed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Last Interview Score</span>
            <CheckCircle size={20} className="stat-icon" style={{ color: stats.lastInterviewScore >= 80 ? '#16a34a' : '#ca8a04' }} />
          </div>

          {/* Charts Section */}

          <div className="stat-content">
            <span className={`stat-value ${getScoreColor(stats.lastInterviewScore)}`}>
              {stats.lastInterviewScore ? `${stats.lastInterviewScore}%` : 'N/A'}
            </span>
            <span className="stat-subtext">
              {stats.lastInterviewScore ? (stats.lastInterviewScore >= 80 ? 'Great job!' : 'Keep practicing') : 'No data yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>Performance Trend</h3>
            <p className="chart-subtitle" style={{ fontSize: '0.9rem', color: '#64748b' }}>Interview scores over time</p>
          </div>
          <div className="chart-container" style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={[0, 100]}
                />
                {/* <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                /> */}
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>CV Quality Trend</h3>
            <p className="chart-subtitle" style={{ fontSize: '0.9rem', color: '#64748b' }}>Resume scores over time</p>
          </div>
          <div className="chart-container" style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cvChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={[0, 100]}
                />
                {/* <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                /> */}
                <Bar
                  dataKey="score"
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        {/* Mock Interviews Table */}
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Recent Mock Interviews</h3>
            <span className="table-view-all" onClick={() => navigate('/dashboard/mock-interviews')} style={{ cursor: 'pointer' }}>View All</span>
          </div>
          <div className="table-wrapper">
            {recentInterviews.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Role</th>
                    <th className="text-center">Score</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInterviews.map((interview) => (
                    <tr key={interview._id}>
                      <td>{new Date(interview.createdAt).toLocaleDateString()}</td>
                      <td>{interview.targetRole}</td>
                      <td className={`text-center bold ${getScoreColor(interview.overallScore)}`}>
                        {interview.overallScore}%
                      </td>
                      <td className="text-right">
                        {interview.reportPath && (
                          <a
                            href={`${import.meta.env.VITE_API_URL}${interview.reportPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-action"
                            style={{ textDecoration: 'none', display: 'inline-block' }}
                          >
                            Report
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No recent interviews</div>
            )}
          </div>
        </div>

        {/* CV Analysis Table */}
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Recent CV Analyses</h3>
            <span className="table-view-all" onClick={() => navigate('/dashboard/past-cv-evaluator')} style={{ cursor: 'pointer' }}>View All</span>
          </div>
          <div className="table-wrapper">
            {recentCVs.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>File Name</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCVs.map((cv) => (
                    <tr key={cv._id}>
                      <td>{new Date(cv.createdAt).toLocaleDateString()}</td>
                      <td>{cv.fileName}</td>
                      <td className="text-center">
                        {cv.analysisPdfPath && (
                          <a
                            href={`${import.meta.env.VITE_API_URL}/${cv.analysisPdfPath}`} // Assuming relative path stored or adjusted
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-action"
                            style={{ textDecoration: 'none', display: 'inline-block' }}
                          >
                            Download PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No recent CVs</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHome;