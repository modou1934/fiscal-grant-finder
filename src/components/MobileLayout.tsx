import React from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const { isNative, networkStatus, platform } = useCapacitor();

  return (
    <div className={`min-h-screen ${isNative ? 'pt-safe-area-inset-top pb-safe-area-inset-bottom' : ''}`}>
      {/* Indicatore connessione di rete per app native */}
      {isNative && !networkStatus && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Connessione di rete non disponibile. Alcune funzionalità potrebbero non funzionare.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Contenuto principale */}
      <div className={`${isNative ? 'mobile-app' : ''}`}>
        {children}
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && isNative && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 z-50">
          Platform: {platform} | Network: {networkStatus ? 'Connected' : 'Disconnected'}
        </div>
      )}
    </div>
  );
};

export default MobileLayout;