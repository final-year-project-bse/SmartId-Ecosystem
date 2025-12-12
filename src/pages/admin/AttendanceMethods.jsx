import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import useAppStore from '../../store/useAppStore';
import { Fingerprint, Scan, CreditCard, QrCode, Check, X } from 'lucide-react';

const AttendanceMethods = () => {
  const { attendanceMethods, setAttendanceMethod } = useAppStore();

  const methodIcons = {
    face: Scan,
    fingerprint: Fingerprint,
    rfid: CreditCard,
    qr: QrCode,
  };

  const methodDescriptions = {
    face: 'Use facial recognition technology for contactless attendance',
    fingerprint: 'Biometric fingerprint scanning for secure identification',
    rfid: 'RFID card scanning for quick and easy check-in',
    qr: 'QR code scanning using student mobile devices',
  };

  const handleToggle = (method) => {
    setAttendanceMethod(method, !attendanceMethods[method].enabled);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Attendance Methods</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Configure which attendance methods are available for your institution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(attendanceMethods).map(([key, method]) => {
          const Icon = methodIcons[key];
          const isEnabled = method.enabled;

          return (
            <Card key={key}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isEnabled ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{method.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {methodDescriptions[key]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      onClick={() => handleToggle(key)}
                      variant={isEnabled ? 'secondary' : 'primary'}
                      className="flex items-center gap-2"
                    >
                      {isEnabled ? (
                        <>
                          <X size={16} />
                          Disable
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Enable
                        </>
                      )}
                    </Button>
                    <span className={`text-sm font-medium ${isEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                      {isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>


    </div>
  );
};

export default AttendanceMethods;
