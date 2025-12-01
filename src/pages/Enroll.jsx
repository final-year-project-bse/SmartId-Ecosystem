import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { Camera, CheckCircle, Copy, Eye, EyeOff, User, BookOpen, Fingerprint, ArrowRight, ArrowLeft, UserCircle, GraduationCap } from 'lucide-react';

const Enroll = () => {
  const { t } = useTranslation();
  const { addStudent, addProfessor, courses } = useAppStore();
  const webcamRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' = front camera, 'environment' = back camera
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    userId: '',
    role: 'STUDENT',
    password: '',
    enrolledCourses: [],
    department: '',
    semester: '',
    admissionSemester: 'FA',
    admissionYear: new Date().getFullYear().toString().slice(-2),
    program: 'BSE',
    consent: false,
  });

  const steps = [
    { number: 1, title: 'Select Role', icon: UserCircle },
    { number: 2, title: 'Personal Info', icon: User },
    { number: 3, title: 'Biometric Capture', icon: Fingerprint },
  ];

  const updateFormData = (updates) => {
    setFormData({ ...formData, ...updates });
  };

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
    updateFormData({ password });
  };

  const generateUserId = () => {
    if (formData.role === 'STUDENT') {
      // Generate Student Registration Number: FA22-BSE-069 format
      const semester = formData.admissionSemester || 'FA';
      const year = formData.admissionYear || new Date().getFullYear().toString().slice(-2);
      const program = formData.program || 'BSE';
      const rollNumber = String(Math.floor(Math.random() * 900) + 1).padStart(3, '0'); // 001-999
      updateFormData({ userId: `${semester}${year}-${program}-${rollNumber}` });
    } else if (formData.role === 'PROFESSOR') {
      // Generate Teacher ID: T-001 format
      const randomNum = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
      updateFormData({ userId: `T-${randomNum}` });
    } else {
      // Admin ID
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      updateFormData({ userId: `A${randomNum}` });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const clearEnrollmentData = () => {
    setCurrentStep(1);
    setImageSrc(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      userId: '',
      role: 'STUDENT',
      password: '',
      enrolledCourses: [],
      department: '',
      semester: '',
      admissionSemester: 'FA',
      admissionYear: new Date().getFullYear().toString().slice(-2),
      program: 'BSE',
      consent: false,
    });
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

    try {
      // Generate unique username if userId is empty
      let username = formData.userId;
      if (!username) {
        // Auto-generate username from email or timestamp
        username = formData.email.split('@')[0] + '_' + Date.now();
      }
      
      // Create user via API
      const userData = {
        username: username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        first_name: formData.name.split(' ')[0],
        last_name: formData.name.split(' ').slice(1).join(' '),
      };
      
      console.log('Creating user with data:', { ...userData, password: '***' });

      const response = await fetch('/api/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('User creation error:', error);
        
        // Handle specific errors
        if (error.username) {
          throw new Error(`Username error: ${error.username[0]}`);
        }
        if (error.email) {
          throw new Error(`Email error: ${error.email[0]}`);
        }
        
        throw new Error(error.detail || error.message || JSON.stringify(error) || 'Failed to create user');
      }

      const createdUser = await response.json();
      console.log('✓ User created successfully:', createdUser);

      // Get the user ID - it might be in different fields
      const userId = createdUser.id || createdUser.user_id || createdUser.pk;
      
      console.log('User ID extracted:', userId);
      
      if (!userId) {
        console.error('❌ User ID not found in response:', createdUser);
        throw new Error('User ID not found in API response');
      }

      console.log('📸 Starting face enrollment for user ID:', userId);

      // Enroll face biometric
      const imageFile = await fetch(imageSrc)
        .then(res => {
          console.log('Converting image to blob...');
          return res.blob();
        })
        .then(blob => {
          console.log('Creating file from blob, size:', blob.size);
          return new File([blob], 'face.jpg', { type: 'image/jpeg' });
        });

      console.log('Image file created:', imageFile.name, imageFile.size, 'bytes');

      const formDataFace = new FormData();
      formDataFace.append('user_id', userId);
      formDataFace.append('image', imageFile);

      console.log('Sending face enrollment request...');

      const faceResponse = await fetch('/api/authentication/faces/enroll/', {
        method: 'POST',
        body: formDataFace,
      });

      console.log('Face enrollment response status:', faceResponse.status);

      if (!faceResponse.ok) {
        const faceError = await faceResponse.json();
        console.error('❌ Face enrollment error:', faceError);
        
        // Delete the user since face enrollment failed
        try {
          await fetch(`/api/auth/users/${userId}/`, {
            method: 'DELETE',
          });
          console.log('User deleted due to face enrollment failure');
        } catch (deleteError) {
          console.error('Failed to delete user:', deleteError);
        }
        
        throw new Error(faceError.message || faceError.error || 'Failed to enroll face');
      }

      const faceResult = await faceResponse.json();
      console.log('✓ Face enrollment successful:', faceResult);

      // Update local store
      if (formData.role === 'STUDENT') {
        addStudent({
          id: userId,
          name: formData.name,
          email: formData.email,
          enrolledCourses: formData.enrolledCourses,
          status: 'active',
          enrolledDate: new Date().toISOString().split('T')[0],
          hasAccess: true,
        });
      } else if (formData.role === 'PROFESSOR') {
        addProfessor({
          id: userId,
          name: formData.name,
          email: formData.email,
          courses: formData.enrolledCourses,
          status: 'active',
          hasAccess: true,
        });
      }

      setEnrollmentSuccess({
        name: formData.name,
        email: formData.email,
        userId: username,
        password: formData.password,
        role: formData.role,
      });

      // Clear enrollment data
      clearEnrollmentData();
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(`Enrollment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const roleOptions = [
    { value: 'STUDENT', label: t('roles.STUDENT') },
    { value: 'PROFESSOR', label: t('roles.PROFESSOR') },
  ];

  // Success Screen
  if (enrollmentSuccess) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Enrollment Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {enrollmentSuccess.role === 'STUDENT' ? 'Student' : 'Teacher'} has been successfully enrolled with system access
            </p>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-left space-y-6 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-600 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Login Credentials</h3>
                <Badge variant="success" className="text-sm px-3 py-1">
                  {enrollmentSuccess.role}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{enrollmentSuccess.name}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">User ID</span>
                  <div className="flex items-center justify-between mt-2">
                    <code className="font-mono font-bold text-primary">{enrollmentSuccess.userId}</code>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.userId)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition">
                      <Copy size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">{enrollmentSuccess.email}</span>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.email)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition">
                      <Copy size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</span>
                  <div className="flex items-center justify-between mt-2">
                    <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-300 dark:border-slate-600">
                      {enrollmentSuccess.password}
                    </code>
                    <button onClick={() => copyToClipboard(enrollmentSuccess.password)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition">
                      <Copy size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Security Notice</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Please share these credentials securely with the user. They should change their password after first login.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <Button onClick={() => {
                setEnrollmentSuccess(null);
                clearEnrollmentData();
              }} className="px-8">
                Enroll Another User
              </Button>
              <Button variant="secondary" onClick={() => copyToClipboard(
                `SmartID Login Credentials\n\nName: ${enrollmentSuccess.name}\nUser ID: ${enrollmentSuccess.userId}\nEmail: ${enrollmentSuccess.email}\nPassword: ${enrollmentSuccess.password}\nRole: ${enrollmentSuccess.role}\n\nPlease change your password after first login.`
              )} className="px-8">
                <Copy size={18} className="mr-2" />
                Copy All Details
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Main Enrollment Form
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">User Enrollment</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Enroll students or teachers with complete profile and biometric data
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${currentStep >= step.number 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'
                  }
                `}>
                  <step.icon size={24} />
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'text-slate-900 dark:text-slate-100' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 transition-all ${
                  currentStep > step.number 
                    ? 'bg-primary' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <Card>
          {/* Step 1: Select Role */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Select User Role</h2>
                <p className="text-slate-600 dark:text-slate-400">Choose whether you're enrolling a student or teacher</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <button
                  type="button"
                  onClick={() => updateFormData({ role: 'STUDENT' })}
                  className={`
                    p-8 rounded-2xl border-2 transition-all hover:scale-105
                    ${formData.role === 'STUDENT'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      formData.role === 'STUDENT' 
                        ? 'bg-primary text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <GraduationCap size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Student</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enroll a new student</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateFormData({ role: 'PROFESSOR' })}
                  className={`
                    p-8 rounded-2xl border-2 transition-all hover:scale-105
                    ${formData.role === 'PROFESSOR'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      formData.role === 'PROFESSOR' 
                        ? 'bg-primary text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <User size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Teacher</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enroll a new teacher</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end mt-8">
                <Button type="button" onClick={nextStep} className="px-8">
                  Continue <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Personal Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Enter the user's personal details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => updateFormData({ address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>

                {formData.role === 'STUDENT' && (
                  <>
                    <Select
                      label="Admission Semester *"
                      options={[
                        { value: 'FA', label: 'Fall (FA)' },
                        { value: 'SP', label: 'Spring (SP)' },
                      ]}
                      value={formData.admissionSemester}
                      onChange={(e) => updateFormData({ admissionSemester: e.target.value })}
                    />

                    <Input
                      label="Admission Year *"
                      type="text"
                      value={formData.admissionYear}
                      onChange={(e) => updateFormData({ admissionYear: e.target.value })}
                      placeholder="22, 23, 24, 25..."
                      maxLength="2"
                    />

                    <Select
                      label="Program *"
                      options={[
                        { value: 'BSE', label: 'BSE - Software Engineering' },
                        { value: 'BSCS', label: 'BSCS - Computer Science' },
                        { value: 'BSIT', label: 'BSIT - Information Technology' },
                        { value: 'BSAI', label: 'BSAI - Artificial Intelligence' },
                        { value: 'BSDS', label: 'BSDS - Data Science' },
                      ]}
                      value={formData.program}
                      onChange={(e) => updateFormData({ program: e.target.value })}
                    />
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    {formData.role === 'STUDENT' ? 'Registration Number *' : 'User ID *'}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.userId}
                      onChange={(e) => updateFormData({ userId: e.target.value })}
                      placeholder={formData.role === 'STUDENT' ? 'FA22-BSE-069' : 'Auto-generate or enter'}
                      required
                    />
                    <Button type="button" onClick={generateUserId} variant="secondary">
                      Generate
                    </Button>
                  </div>
                  {formData.role === 'STUDENT' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Format: {formData.admissionSemester}{formData.admissionYear}-{formData.program}-XXX
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Password *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateFormData({ password: e.target.value })}
                        placeholder="Generate or enter"
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
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" onClick={prevStep} variant="secondary" className="px-8">
                  <ArrowLeft size={18} className="mr-2" /> Back
                </Button>
                <Button type="button" onClick={nextStep} className="px-8">
                  Continue <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Biometric Capture */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Biometric Capture</h2>
                <p className="text-slate-600 dark:text-slate-400">Capture facial biometric data for authentication</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Camera Switch Button */}
                {!imageSrc && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Camera size={18} />
                      Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
                    </Button>
                  </div>
                )}

                <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-700">
                  {!imageSrc ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: facingMode
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    {!imageSrc ? (
                      <Button type="button" onClick={capture} className="flex items-center gap-2 px-8 py-3 text-lg">
                        <Camera size={24} />
                        Capture Photo
                      </Button>
                    ) : (
                      <Button type="button" onClick={retake} variant="secondary" className="px-8 py-3 text-lg">
                        Retake Photo
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Camera Info */}
                {!imageSrc && (
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Currently using: <strong>{facingMode === 'user' ? 'Front' : 'Back'} Camera</strong>
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={(e) => updateFormData({ consent: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="consent" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      I consent to the collection and storage of biometric data for authentication purposes. 
                      This data will be securely stored and used only for attendance verification within the SmartID system.
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" onClick={prevStep} variant="secondary" className="px-8">
                  <ArrowLeft size={18} className="mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading || !imageSrc || !formData.consent} className="px-8">
                  {loading ? 'Enrolling...' : 'Complete Enrollment'}
                </Button>
              </div>
            </div>
          )}

          {/* Old Step 4 - Now removed, biometric is step 3 */}
          {currentStep === 999 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Biometric Capture</h2>
                <p className="text-slate-600 dark:text-slate-400">Capture facial biometric data for authentication</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-700">
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
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    {!imageSrc ? (
                      <Button type="button" onClick={capture} className="flex items-center gap-2 px-8 py-3 text-lg">
                        <Camera size={24} />
                        Capture Photo
                      </Button>
                    ) : (
                      <Button type="button" onClick={retake} variant="secondary" className="px-8 py-3 text-lg">
                        Retake Photo
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={(e) => updateFormData({ consent: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="consent" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      I consent to the collection and storage of biometric data for authentication purposes. 
                      This data will be securely stored and used only for attendance verification within the SmartID system.
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" onClick={prevStep} variant="secondary" className="px-8">
                  <ArrowLeft size={18} className="mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading || !imageSrc || !formData.consent} className="px-8">
                  {loading ? 'Enrolling...' : 'Complete Enrollment'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </form>
    </div>
  );
};

export default Enroll;
