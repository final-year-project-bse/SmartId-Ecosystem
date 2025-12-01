import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { apiService, base64ToFile } from '../services/api';
import { Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Authenticate = () => {
  const { t } = useTranslation();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setError(null);
  };

  const retake = () => {
    setImageSrc(null);
    setResult(null);
    setError(null);
  };

  const handleAuthenticate = async () => {
    if (!imageSrc) {
      setError('Please capture an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert base64 image to File object
      const imageFile = base64ToFile(imageSrc, 'face-capture.jpg');
      
      console.log('Calling verifyFace API...', imageFile);
      
      // Call real backend API
      const authResult = await apiService.verifyFace(imageFile);
      
      console.log('API Response:', authResult);
      
      // Process result
      if (authResult.success && authResult.results && authResult.results.length > 0) {
        const user = authResult.results[0];
        setResult({
          success: true,
          message: authResult.message,
          confidence: user.confidence,
          userName: user.user_name,
          userId: user.user_id,
        });
      } else {
        setResult({
          success: false,
          message: authResult.message || 'Face not recognized',
          confidence: 0,
        });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      // Check if it's a face recognition library issue
      if (err.message && err.message.includes('not installed')) {
        setError('Face recognition libraries are not installed on the server. Please install face_recognition and opencv-python packages.');
        setResult({
          success: false,
          message: 'Face recognition feature is currently unavailable. The required Python libraries (face_recognition, opencv-python) are not installed on the server.',
          confidence: 0,
        });
      } else if (err.detail) {
        setError(`Backend error: ${err.detail}`);
        setResult({
          success: false,
          message: err.detail,
          confidence: 0,
        });
      } else {
        setError(err.error || err.message || 'Authentication failed. Please ensure the backend is running.');
        setResult({
          success: false,
          message: 'Connection error. Backend may not be available.',
          confidence: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.authenticate')}</h1>
        <Badge variant="primary">Real-time Face Recognition</Badge>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Demo Mode:</strong> Face recognition libraries are not installed. The system is running in demo mode for testing. 
          To enable real face recognition, install: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">pip install face_recognition opencv-python</code>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-600 dark:text-red-400 font-medium">Error</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Face Authentication">
          <div className="space-y-4">
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
              {!imageSrc ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                />
              ) : (
                <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {!imageSrc ? (
                  <Button onClick={capture} className="flex items-center gap-2">
                    <Camera size={20} />
                    {t('buttons.capture')}
                  </Button>
                ) : (
                  <Button onClick={retake} variant="secondary">
                    {t('buttons.retake')}
                  </Button>
                )}
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Position your face clearly in the camera frame. 
                Ensure good lighting and look directly at the camera.
              </p>
            </div>

            {imageSrc && !result && (
              <Button onClick={handleAuthenticate} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Authenticating with Backend...
                  </>
                ) : (
                  'Authenticate with Face Recognition'
                )}
              </Button>
            )}
          </div>
        </Card>

        <Card title="Authentication Result">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
              <Camera size={48} className="opacity-50" />
              <p className="text-center">Capture your face and click authenticate<br/>to verify your identity</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                {result.success ? (
                  <CheckCircle size={64} className="text-green-500" />
                ) : (
                  <XCircle size={64} className="text-red-500" />
                )}
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {result.success ? 'Authentication Successful' : 'Authentication Failed'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{result.message}</p>
              </div>

              {result.success && result.userName ? (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {result.demo_mode && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        🔧 Demo Mode Active
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                    <Badge variant="success">{(result.confidence * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">User:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{result.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">User ID:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{result.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Timestamp:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : result.success === false && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {result.confidence > 0 
                      ? `Low confidence match (${(result.confidence * 100).toFixed(1)}%). Please try again with better lighting.`
                      : 'No face detected or face not enrolled in the system.'}
                  </p>
                </div>
              )}

              <Button onClick={retake} variant="secondary" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>Position your face in the camera frame</li>
          <li>Click "Capture" to take a photo</li>
          <li>Click "Authenticate" to verify with backend</li>
          <li>Backend uses facial recognition to identify you</li>
          <li>Result shows if you're recognized and confidence level</li>
        </ol>
      </div>
    </div>
  );
};

export default Authenticate;
