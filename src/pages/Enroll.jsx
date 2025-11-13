import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { Camera, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';

const Enroll = () => {
  const { t } = useTranslation();
  const { addStudent, addProfessor, courses } = useAppStore();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '',
    role: 'STUDENT',
    password: '',
    enrolledCourses: [],
    consent: false,
  });

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const retake = () => {
    setImageSrc(null);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const generateUserId = () => {
    const prefix = formData.role === 'STUDENT' ? 'S' : formData.role === 'PROFESSOR' ? 'P' : 'A';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    setFormData({ ...formData, userId: `${prefix}${randomNum}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageSrc) {
      alert('Please capture a face image first');
      return;
    }
    if (!formData.consent) {
      alert('Please provide consent for biometric data collection');
      return;
    }
    if (!formData.password) {
      alert('Please generate or enter a password');
      return;
    }
    if (!formData.userId) {
      alert('Please generate or enter a user ID');
      return;
    }

    setLoading(true);

    // Simulate enrollment process
    setTimeout(() => {
      const enrollmentData = {
        id: formData.userId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        status: 'active',
        hasAccess: true,
        enrolledDate: new Date().toISOString().split('T')[0],
      };

      if (formData.role === 'STUDENT') {
        addStudent({
          ...enrollmentData,
          enrolledCourses: formData.enrolledCourses,
        });
      } else if (formData.role === 'PROFESSOR') {
        addProfessor({
          ...enrollmentData,
          courses: formData.enrolledCourses,
        });
      }

      setEnrollmentSuccess({
        name: formData.name,
        email: formData.email,
        userId: formData.userId,
        password: formData.password,
        role: formData.role,
      });

      setLoading(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        userId: '',
        role: 'STUDENT',
        password: '',
        enrolledCourses: [],
        consent: false,
      });
      setImageSrc(null);
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const roleOptions = [
    { value: 'STUDENT', label: t('roles.STUDENT') },
    { value: 'PROFESSOR', label: t('roles.PROFESSOR') },
  ];

  if (enrollmentSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Enrollment Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {enrollmentSuccess.role === 'STUDENT' ? 'Student' : 'Professor'} has been enrolled and granted system access
            </p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 text-left space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Login Credentials</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Name:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{enrollmentSuccess.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">User ID:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{enrollmentSuccess.userId}</Badge>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.userId)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{enrollmentSuccess.email}</span>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.email)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Password:</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                      {enrollmentSuccess.password}
                    </code>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.password)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Role:</span>
                  <Badge variant="success">{enrollmentSuccess.role}</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> Please share these credentials securely with the user. They can now log in at the login page.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={() => setEnrollmentSuccess(null)}>
                Enroll Another User
              </Button>
              <Button variant="secondary" onClick={() => copyToClipboard(
                `User ID: ${enrollmentSuccess.userId}\nEmail: ${enrollmentSuccess.email}\nPassword: ${enrollmentSuccess.password}`
              )}>
                Copy All Credentials
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Enroll User</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Enroll students or professors and grant them system access
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biometric Capture */}
          <Card title="Biometric Capture">
            <div className="space-y-4">
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                {!imageSrc ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  {!imageSrc ? (
                    <Button type="button" onClick={capture} className="flex items-center gap-2">
                      <Camera size={20} />
                      {t('buttons.capture')}
                    </Button>
                  ) : (
                    <Button type="button" onClick={retake} variant="secondary">
                      {t('buttons.retake')}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="consent" className="text-sm text-slate-700 dark:text-slate-300">
                  {t('labels.consent')}
                </label>
              </div>
            </div>
          </Card>

          {/* User Information */}
          <Card title="User Information">
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
              
              <Input
                label={t('labels.email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                required
              />
              
              <Select
                label={t('labels.role')}
                options={roleOptions}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  User ID
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Auto-generate or enter manually"
                    required
                  />
                  <Button type="button" onClick={generateUserId} variant="secondary">
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Generate or enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Button type="button" onClick={generatePassword} variant="secondary">
                    Generate
                  </Button>
                </div>
              </div>

              {formData.role === 'STUDENT' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Enroll in Courses
                  </label>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <label key={course.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <input
                          type="checkbox"
                          checked={formData.enrolledCourses.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, enrolledCourses: [...formData.enrolledCourses, course.id] });
                            } else {
                              setFormData({ ...formData, enrolledCourses: formData.enrolledCourses.filter(id => id !== course.id) });
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {course.name} ({course.code})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.role === 'PROFESSOR' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Assign Courses
                  </label>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <label key={course.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <input
                          type="checkbox"
                          checked={formData.enrolledCourses.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, enrolledCourses: [...formData.enrolledCourses, course.id] });
                            } else {
                              setFormData({ ...formData, enrolledCourses: formData.enrolledCourses.filter(id => id !== course.id) });
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {course.name} ({course.code})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? 'Enrolling...' : 'Enroll User & Grant Access'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Enroll;
