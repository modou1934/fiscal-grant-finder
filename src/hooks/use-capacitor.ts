import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<string>('web');
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const initializeCapacitor = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);
      setPlatform(Capacitor.getPlatform());

      if (native) {
        // Configura StatusBar
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#1e3a8a' });
        } catch (error) {
          console.log('StatusBar not available:', error);
        }

        // Nasconde SplashScreen
        try {
          await SplashScreen.hide();
        } catch (error) {
          console.log('SplashScreen not available:', error);
        }

        // Configura Keyboard
        try {
          Keyboard.addListener('keyboardWillShow', (info) => {
            console.log('Keyboard will show with height:', info.keyboardHeight);
          });

          Keyboard.addListener('keyboardDidShow', (info) => {
            console.log('Keyboard did show with height:', info.keyboardHeight);
          });

          Keyboard.addListener('keyboardWillHide', () => {
            console.log('Keyboard will hide');
          });

          Keyboard.addListener('keyboardDidHide', () => {
            console.log('Keyboard did hide');
          });
        } catch (error) {
          console.log('Keyboard not available:', error);
        }

        // Monitora connessione di rete
        try {
          const status = await Network.getStatus();
          setNetworkStatus(status.connected);

          Network.addListener('networkStatusChange', (status) => {
            setNetworkStatus(status.connected);
          });
        } catch (error) {
          console.log('Network not available:', error);
        }

        // Ottieni info dispositivo
        try {
          const info = await Device.getInfo();
          setDeviceInfo(info);
        } catch (error) {
          console.log('Device info not available:', error);
        }

        // Gestisce back button su Android
        try {
          App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              App.exitApp();
            } else {
              window.history.back();
            }
          });
        } catch (error) {
          console.log('App listeners not available:', error);
        }
      }
    };

    initializeCapacitor();

    return () => {
      // Cleanup listeners
      if (isNative) {
        try {
          Keyboard.removeAllListeners();
          Network.removeAllListeners();
          App.removeAllListeners();
        } catch (error) {
          console.log('Error removing listeners:', error);
        }
      }
    };
  }, []);

  return {
    isNative,
    platform,
    networkStatus,
    deviceInfo,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web'
  };
};