import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { mockApi } from '../services/mockApi';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

const Authenticate = () => {
  const { t } = useTranslation();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const retake = () => {
    setImageSrc(null);
    setResult(null);
  };

  const handleAuthenticate = async () => {
    if (!imageSrc) {
      alert('Please capture an image first');
      return;
    }

    setLoading(true);
    const authResult = await mockApi.authenticateUser(imageSrc);
    setLoading(false);
    setResult(authResult);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.authenticate')}</h1>

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

            {imageSrc && !result && (
              <Button onClick={handleAuthenticate} className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Authenticate'}
              </Button>
            )}
          </div>
        </Card>

        <Card title="Authentication Result">
          {!result ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p>Capture and authenticate to see results</p>
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

              {result.success && (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                    <Badge variant="success">{(result.confidence * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">User:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">Ahmed Ali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Student ID:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">S001</span>
                  </div>
                </div>
              )}

              <Button onClick={retake} variant="secondary" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Authenticate;
