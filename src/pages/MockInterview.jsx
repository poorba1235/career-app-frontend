import { Mic, RefreshCw, StopCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import '../css/MockInterview.css';

const LoginGate = ({ feature }) => (
  <div className="login-gate">
    <div className="login-gate-card">
      <div className="login-gate-icon">🔒</div>
      <h2 className="login-gate-title">Login Required</h2>
      <p className="login-gate-desc">
        You need to be logged in to use <strong>{feature}</strong>.
        Create a free account or sign in to get started.
      </p>
      <div className="login-gate-actions">
        <a href="/login" className="login-gate-btn login-gate-btn--primary">Login</a>
        <a href="/signup" className="login-gate-btn login-gate-btn--secondary">Create Account</a>
      </div>
      <p className="login-gate-hint">It's free and takes less than a minute ✨</p>
    </div>
  </div>
);

// ─── Confidence Badge ─────────────────────────────────────────────────────────
const ConfidenceBadge = ({ label, score }) => {
  const colorMap = {
    High: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
    Medium: { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
    Low: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  };
  const style = colorMap[label] || colorMap['Medium'];
  return (
    <div className="confidence-badge" style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: style.bg, color: style.color,
      border: `1px solid ${style.border}`,
      borderRadius: '999px', padding: '4px 14px', fontWeight: '700', fontSize: '0.9rem'
    }}>
      <span>{label === 'High' ? '💪' : label === 'Medium' ? '🙂' : '😕'}</span>
      Confidence: {label} ({score}/100)
    </div>
  );
};

// ─── Metric Bar ───────────────────────────────────────────────────────────────
const MetricBar = ({ label, value }) => {
  const color = value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p style={{ color: '#64748b', fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>{displayLabel}</p>
        <span style={{ fontWeight: '800', color, fontSize: '1.1rem' }}>{value}/100</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MockInterview = () => {
  const [stage, setStage] = useState('welcome'); // 'welcome', 'setup', 'prepare', 'session', 'results'
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Session State
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [questionCount, setQuestionCount] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Results State
  const [finalReport, setFinalReport] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Mic Permission State
  const [micStatus, setMicStatus] = useState('idle');

  // End Interview Modal
  const [showEndModal, setShowEndModal] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(new Audio());

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  // Answer Timer (90s)
  const [answerTimeLeft, setAnswerTimeLeft] = useState(90);

  // Expanded Q&A cards
  const [expandedQA, setExpandedQA] = useState({});

  useEffect(() => {
    let interval = null;
    if (isRecording && answerTimeLeft > 0) {
      interval = setInterval(() => setAnswerTimeLeft(prev => prev - 1), 1000);
    } else if (isRecording && answerTimeLeft === 0) {
      stopRecordingAndSend();
      toast('Time limit reached! Answer submitted automatically.', { icon: '⏳' });
    }
    return () => clearInterval(interval);
  }, [isRecording, answerTimeLeft]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (stage === 'prepare') checkMicPermission();
  }, [stage]);

  const checkMicPermission = async () => {
    setMicStatus('checking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicStatus('granted');
    } catch {
      setMicStatus('denied');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
  };

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const playAudio = (base64Audio) => {
    if (!base64Audio) return;
    audioPlayerRef.current.src = `data:audio/mp3;base64,${base64Audio}`;
    setIsPlaying(true);
    audioPlayerRef.current.play().catch(e => console.error("Audio play error:", e));
    audioPlayerRef.current.onended = () => setIsPlaying(false);
  };

  const handleGenerateInterview = async (e) => {
    e.preventDefault();
    if (targetRole && jobDescription) {
      if (targetRole === 'Other' && !customRole) {
        toast.error('Please enter your specific role');
        return;
      }
      setStage('prepare');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleStartInterview = async () => {
    setIsProcessing(true);
    try {
      const roleToSend = targetRole === 'Other' ? customRole : targetRole;
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ targetRole: roleToSend, jobDescription, questionCount })
      });

      if (!response.ok) throw new Error('Failed to start interview');
      const data = await response.json();

      setTotalQuestions(questionCount);
      setInterviewId(data.interviewId);
      setCurrentQuestionText(data.question);
      setStage('session');
      setElapsedTime(0);
      startTimer();
      playAudio(data.audio);

    } catch (error) {
      console.error(error);
      toast.error('Failed to start interview. Check backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.start();
      setAnswerTimeLeft(90);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone.");
    }
  };

  const stopRecordingAndSend = async () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');
      formData.append('interviewId', interviewId);
      formData.append('questionIndex', currentQuestionNumber);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/response`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (!response.ok) throw new Error('Failed to send response');
        const data = await response.json();

        // Non-English detection notice
        if (data.isNonEnglish) {
          toast.error('⚠️ Please respond in English. Moving to the next question.', { duration: 4000 });
        }

        if (data.isCompleted) {
          if (data.audio) playAudio(data.audio);
          setIsProcessing(true);
          handleEndInterview(false);
          return;
        }

        setCurrentQuestionNumber(prev => prev + 1);
        setCurrentQuestionText(data.nextQuestion);
        setTimeout(() => playAudio(data.audio), 500);

      } catch (error) {
        console.error(error);
        toast.error('Error processing answer. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };
  };

  const handleEndInterview = async (stopAudio = true) => {
    stopTimer();
    if (stopAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ interviewId })
      });

      if (!response.ok) throw new Error('Failed to end interview');
      const data = await response.json();

      setFinalReport(data.report);
      setFinalScore(data.score);
      setQuestions(data.questions || []);
      setAnalysis(data.analysis || null);
      setPdfUrl(data.reportPath || null);
      setStage('results');

    } catch (error) {
      console.error(error);
      toast.error('Error generating report.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartNewSession = () => {
    setStage('welcome');
    setTargetRole('');
    setJobDescription('');
    setInterviewId(null);
    setCurrentQuestionNumber(1);
    setFinalReport(null);
    setAnalysis(null);
    setQuestions([]);
    setPdfUrl(null);
    stopTimer();
  };

  const toggleQA = (index) => setExpandedQA(prev => ({ ...prev, [index]: !prev[index] }));

  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  const token = localStorage.getItem('token');
  if (!token) return <LoginGate feature="Mock Interview" />;

  return (
    <div className="mock-interview-container">

      {/* ── Welcome Stage ─────────────────────────────────────────────────── */}
      {stage === 'welcome' && (
        <div className="welcome-stage">
          <div className="welcome-card">
            <div className="welcome-avatar-wrap">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
                alt="Sarah AI Interviewer"
                className="welcome-avatar-img"
              />
              <div className="welcome-avatar-ring" />
            </div>

            {/* <div className="welcome-badge">🤖 AI Interviewer</div> */}
            <h1 className="welcome-title">Hi, I'm Sarah!</h1>
            <p className="welcome-subtitle">
              I'll be your interviewer today. Think of this as a real conversation —
              I'll ask you questions and listen carefully to your answers.
            </p>

            <div className="welcome-rules">
              <div className="welcome-rule">
                <span className="welcome-rule-icon">🇬🇧</span>
                <span>Please answer <strong>in English only</strong></span>
              </div>
              <div className="welcome-rule">
                <span className="welcome-rule-icon">🎙️</span>
                <span>Speak clearly — voice recording is used for each answer</span>
              </div>
              <div className="welcome-rule">
                <span className="welcome-rule-icon">❓</span>
                <span>You'll answer the custom number of questions tailored to your role</span>
              </div>
              <div className="welcome-rule">
                <span className="welcome-rule-icon">📊</span>
                <span>You'll get a detailed AI report after the session</span>
              </div>
            </div>

            <button className="welcome-start-btn" onClick={() => setStage('setup')}>
              Let's Get Started →
            </button>
            <p className="welcome-note">Takes about 10–15 minutes · Free · No sign-up required</p>
          </div>
        </div>
      )}

      {/* ── Setup Stage ───────────────────────────────────────────────────── */}
      {stage === 'setup' && (
        <div className="setup-stage">
          <div className="layout-content-container">
            <div className="headline-section">
              <div className="headline-icon">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h1>Set Up Your Interview</h1>
              <p>Tell me about the role you're preparing for and I'll ask targeted questions.</p>
            </div>

            <form className="interview-form" onSubmit={handleGenerateInterview}>
              <div className="form-field">
                <label>
                  <span className="field-label">Target Role</span>
                  <div className="select-wrapper">
                    <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="custom-select" required>
                      <option value="">Select your target role...</option>
                      <option value="">Select your target role...</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="UX Designer">UX Designer</option>
                      <option value="Marketing Specialist">Marketing Specialist</option>


                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Mobile App Developer">Mobile App Developer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Cloud Engineer">Cloud Engineer</option>
                      <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                      <option value="QA Engineer">QA Engineer</option>
                      <option value="UI Designer">UI Designer</option>
                      <option value="Graphic Designer">Graphic Designer</option>
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                      <option value="AI Engineer">AI Engineer</option>
                      <option value="Technical Writer">Technical Writer</option>
                      <option value="System Administrator">System Administrator</option>
                      <option value="Network Engineer">Network Engineer</option>
                      <option value="IT Support Specialist">IT Support Specialist</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Human Resources Manager">Human Resources Manager</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Finance Analyst">Finance Analyst</option>
                      <option value="Content Creator">Content Creator</option>
                      <option value="SEO Specialist">SEO Specialist</option>
                      <option value="Digital Marketing Manager">Digital Marketing Manager</option>
                      <option value="Other">Other (Specify)</option>
                    </select>
                  </div>
                </label>
                {targetRole === 'Other' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter your specific role (e.g., DevOps Engineer)"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="text-input"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '1rem' }}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-field">
                <label>
                  <span className="field-label">Job Description</span>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job responsibilities here..."
                    required
                  />
                </label>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-label">Number of Questions (Max 30)</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="text-input"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '1rem', marginTop: '0.5rem' }}
                    required
                  />
                </label>
              </div>

              <div className="action-section">
                <button type="submit" className="generate-button">
                  <span>Prepare Interview</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Prepare Stage ─────────────────────────────────────────────────── */}
      {stage === 'prepare' && (
        <div className="prepare-stage">
          <div className="prepare-container">
            <header className="prepare-header">
              <h1 className="prepare-title">Almost Ready!</h1>
              <p>Check your microphone and read the tips below before we start.</p>
            </header>

            <div className="instructions-grid">
              <div className="instruction-card">
                <div className="card-icon"><span className="material-symbols-outlined">quiet_time</span></div>
                <h3>Quiet Space</h3>
                <p>Find a quiet room — background noise can affect transcription quality.</p>
              </div>
              <div className="instruction-card">
                <div className="card-icon"><Mic size={24} /></div>
                <h3>Microphone Ready</h3>
                <p>Allow browser mic permissions when prompted. Speak clearly and directly.</p>
              </div>
              <div className="instruction-card">
                <div className="card-icon"><span className="material-symbols-outlined">translate</span></div>
                <h3>English Only</h3>
                <p>All answers must be in English. Non-English responses will be skipped.</p>
              </div>
              <div className="instruction-card">
                <div className="card-icon"><span className="material-symbols-outlined">timer</span></div>
                <h3>Time Per Answer</h3>
                <p>You have 90 seconds per answer. Take your time — speak thoughtfully.</p>
              </div>
            </div>

            <div className="mic-check-wrapper">
              {micStatus === 'idle' && (
                <div className="mic-status-banner mic-status-banner--idle">
                  <span className="mic-status-icon">🎙️</span>
                  <div className="mic-status-text">
                    <strong>Microphone check</strong>
                    <span>We'll verify your mic before the session starts.</span>
                  </div>
                  <button className="mic-retry-btn" onClick={checkMicPermission}>Check Now</button>
                </div>
              )}
              {micStatus === 'checking' && (
                <div className="mic-status-banner mic-status-banner--checking">
                  <span className="mic-status-spinner" />
                  <div className="mic-status-text">
                    <strong>Checking microphone…</strong>
                    <span>Please allow access in your browser prompt.</span>
                  </div>
                </div>
              )}
              {micStatus === 'granted' && (
                <div className="mic-status-banner mic-status-banner--granted">
                  <span className="mic-status-icon">✅</span>
                  <div className="mic-status-text">
                    <strong>Microphone ready!</strong>
                    <span>Your mic is working perfectly. You're all set.</span>
                  </div>
                </div>
              )}
              {micStatus === 'denied' && (
                <div className="mic-status-banner mic-status-banner--denied">
                  <span className="mic-status-icon">🚫</span>
                  <div className="mic-status-text">
                    <strong>Microphone access denied</strong>
                    <span>Please allow microphone access in your browser settings and try again.</span>
                  </div>
                  <button className="mic-retry-btn mic-retry-btn--danger" onClick={checkMicPermission}>Retry</button>
                </div>
              )}
            </div>

            <div className="prepare-actions">
              {!isProcessing ? (
                <button
                  className={`start-button ${micStatus !== 'granted' ? 'start-button--disabled' : ''}`}
                  onClick={handleStartInterview}
                  disabled={micStatus !== 'granted'}
                >
                  I'm Ready — Start Interview
                </button>
              ) : (
                <div className="initializing-message">
                  <span className="mic-status-spinner" />
                  Sarah is getting ready…
                </div>
              )}
              <button className="new-back-button" onClick={() => setStage('setup')}>← Back to Setup</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Session Stage ─────────────────────────────────────────────────── */}
      {stage === 'session' && (
        <div className="session-stage">
          {/* Progress Bar */}
          <div className="session-progress-bar-wrap">
            <div className="session-progress-bar" style={{ width: `${progressPercentage}%` }} />
          </div>

          <main className="interview-main">
            <div className="video-container">
              <div className="video-wrapper">
                <div className="interview-visuals">
                  {/* AI Avatar */}
                  <div className={`ai-avatar-section ${isPlaying ? 'speaking' : ''}`}>
                    {isPlaying && <div className="ai-avatar-pulse" />}
                    <div className={`ai-avatar-circle ${isPlaying ? 'ai-avatar-circle--speaking' : ''}`}>
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
                        alt="AI Interviewer"
                        className={`ai-avatar-img ${isPlaying ? 'ai-avatar-img--speaking' : ''}`}
                      />
                    </div>
                    <p className="ai-avatar-name">Sarah · AI Interviewer</p>
                  </div>

                  {/* Transcript Box */}
                  <div className="transcript-box">
                    <p className="transcript-label">
                      <span className="transcript-label-dot" />
                      {isPlaying ? 'Sarah is speaking...' : 'Question'}
                    </p>
                    <p className="transcript-question-text">
                      {currentQuestionText ? `"${currentQuestionText}"` : "Getting ready..."}
                    </p>
                    <div className="transcript-progress-info">
                      Question {currentQuestionNumber} of {totalQuestions}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <div className="mic-button-container mic-button-container--visible">
            {isProcessing ? (
              <div className="processing-indicator">
                {currentQuestionNumber === totalQuestions ? 'Generating Your Report...' : 'Processing answer...'}
              </div>
            ) : (
              <button
                className={`mic-button-round ${isRecording ? 'mic-button-round--recording' : ''} ${isPlaying ? 'mic-button-round--disabled' : ''}`}
                onClick={isRecording ? stopRecordingAndSend : startRecording}
                disabled={isPlaying}
              >
                {isRecording ? <StopCircle size={32} color="white" /> : <Mic size={32} color="white" />}
              </button>
            )}
            {isRecording && (
              <div className={`answer-timer ${answerTimeLeft <= 15 ? 'answer-timer--urgent' : ''}`}>
                <div className="answer-timer-row">
                  <span className="material-symbols-outlined" style={{ animation: answerTimeLeft <= 15 ? 'pulse 1s infinite' : 'none' }}>timer</span>
                  <span>{answerTimeLeft}s remaining</span>
                </div>
                {answerTimeLeft <= 15 && <span className="answer-timer-warning">Time is running out!</span>}
              </div>
            )}
            <span className="mic-label">
              {isPlaying ? '🔊 Sarah is speaking...' : isRecording ? '🔴 Listening... Tap to stop' : '🎙️ Tap to speak'}
            </span>
          </div>

          <footer className="interview-footer">
            <div className="footer-controls">
              <button className="exit-button" onClick={() => setShowEndModal(true)}>End Early</button>
            </div>
            <div className="footer-info">
              <div className="timer-display">
                <span className="timer-text">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ── End Modal ─────────────────────────────────────────────────────── */}
      {showEndModal && (
        <div className="end-modal-overlay" onClick={() => setShowEndModal(false)}>
          <div className="end-modal" onClick={e => e.stopPropagation()}>
            <div className="end-modal-icon">⚠️</div>
            <h2 className="end-modal-title">End Interview Early?</h2>
            <p className="end-modal-desc">
              You have <strong>{totalQuestions - currentQuestionNumber + 1} question{totalQuestions - currentQuestionNumber + 1 !== 1 ? 's' : ''}</strong> remaining.
              A partial report will be generated from your answers so far.
            </p>
            <div className="end-modal-actions">
              <button className="end-modal-cancel" onClick={() => setShowEndModal(false)}>Continue Interview</button>
              <button className="end-modal-confirm" onClick={() => { setShowEndModal(false); handleEndInterview(); }}>
                Yes, End Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Results Stage ─────────────────────────────────────────────────── */}
      {stage === 'results' && (
        <div className="results-stage">
          <div className="results-container">

            {/* Left Column: Score */}
            <div className="score-column">
              <div className="score-card-inline">
                <div className="hero-icon"><span className="material-symbols-outlined">celebration</span></div>
                <h1 className="score-card-title">Interview Complete!</h1>
                <p className="score-card-subtitle">Here's your full performance report</p>

                {/* Score Circle */}
                <div className="score-circle-inline">
                  <span className="score-number">{finalScore}</span>
                  <span className="score-out-of">/ 100</span>
                </div>

                {/* Confidence Badge */}
                {analysis?.confidence_level && (
                  <div style={{ margin: '1rem 0' }}>
                    <ConfidenceBadge label={analysis.confidence_level.label} score={analysis.confidence_level.score} />
                  </div>
                )}

                <button className="new-session-button" onClick={handleStartNewSession} style={{ width: '100%' }}>
                  <RefreshCw size={20} /> Start New Session
                </button>

                {pdfUrl && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}${pdfUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.75rem',
                      border: '1px solid #3b82f6', color: '#3b82f6', padding: '10px 16px',
                      borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span> Download PDF Report
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Analysis */}
            <div className="feedback-column">

              {/* Interview Summary */}
              {analysis?.interview_summary && (
                <div className="report-section">
                  <h2 className="report-section-title">
                    <span className="material-symbols-outlined">summarize</span> Interview Summary
                  </h2>
                  <div className="interview-summary-box">
                    <p style={{ color: '#334155', lineHeight: '1.8', margin: 0, fontSize: '1rem' }}>
                      {analysis.interview_summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Metrics */}
              {analysis?.metrics && Object.keys(analysis.metrics).length > 0 && (
                <div className="report-section">
                  <h2 className="report-section-title">
                    <span className="material-symbols-outlined">bar_chart</span> Performance Metrics
                  </h2>
                  <div className="metrics-grid-inline">
                    {Object.entries(analysis.metrics).map(([key, value]) => (
                      <MetricBar key={key} label={key} value={value} />
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              {analysis && (
                <div className="strengths-improvements-grid">
                  <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #bbf7d0' }}>
                    <h3 style={{ color: '#166534', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined">check_circle</span> Key Strengths
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {analysis.key_takeaways?.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.6rem', color: '#14532d', fontSize: '0.92rem', display: 'flex', gap: '8px' }}>
                          <span>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: '#fff7ed', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #fed7aa' }}>
                    <h3 style={{ color: '#9a3412', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined">trending_up</span> Points to Improve
                    </h3>
                    <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                      {analysis.areas_for_improvement?.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.6rem', color: '#7c2d12', fontSize: '0.92rem', lineHeight: '1.5' }}>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Q&A Detailed Feedback */}
              <div className="report-section">
                <h2 className="report-section-title">
                  <span className="material-symbols-outlined">quiz</span> Question-by-Question Feedback
                </h2>
                <div className="qa-section">
                  {questions.length > 0 ? questions.map((q, index) => (
                    <div key={index} className="qa-card">
                      {/* Card Header */}
                      <div className="qa-card-header" onClick={() => toggleQA(index)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="qa-num">Q{index + 1}</span>
                          <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>
                            {q.questionText?.length > 80 ? q.questionText.substring(0, 80) + '...' : q.questionText}
                          </p>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: '#64748b', transition: 'transform 0.2s', transform: expandedQA[index] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          expand_more
                        </span>
                      </div>

                      {/* Expandable Content */}
                      {expandedQA[index] && (
                        <div className="qa-card-body">
                          {/* Full Question */}
                          <div className="qa-question-full">
                            <p className="qa-label">Full Question</p>
                            <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>{q.questionText}</p>
                          </div>

                          {/* User Answer */}
                          <div className="qa-answer-box">
                            <p className="qa-label">Your Answer</p>
                            <p style={{ color: '#334155', fontStyle: 'italic', margin: 0 }}>
                              {(() => {
                                const ans = q.userTranscribedAnswer || '';
                                const isMeaningless = ans === '[No answer / silence]' || ans === '[Audio could not be processed]' || ans.trim().toLowerCase() === 'you';
                                return isMeaningless ? '" "' : `"${ans}"`;
                              })()}
                            </p>
                          </div>

                          {/* AI Feedback */}
                          {q.aiFeedback && (
                            <div className="qa-feedback-box">
                              <p className="qa-label" style={{ color: '#1e40af' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle' }}>auto_awesome</span> AI Feedback
                              </p>
                              <p style={{ color: '#1e3a8a', margin: 0, lineHeight: '1.6' }}>{q.aiFeedback}</p>
                            </div>
                          )}

                          {/* Ideal Answer */}
                          {q.idealAnswer && (
                            <div className="qa-ideal-box">
                              <p className="qa-label" style={{ color: '#166534' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle' }}>lightbulb</span> What a Strong Answer Looks Like
                              </p>
                              <p style={{ color: '#14532d', margin: 0, lineHeight: '1.6' }}>{q.idealAnswer}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )) : (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No questions recorded.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;