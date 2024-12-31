import LogRocket from '@logrocket/react-native';

export const initializeLogRocketMobile = () => {
  LogRocket.init('e1y6b7/pedal-assistant');
}

export const initializeLogRocketWeb = () => {
  throw new Error('LogRocket web initialization not supported');
}

export const identifyLogRocketWeb = (username: string, firstName: string, lastName: string) => {
  throw new Error('LogRocket web identification not supported');
}

export const identifyLogRocketMobile = (username: string, firstName: string, lastName: string) => {
  
  console.log('Initializing LogRocket mobile...');
  try {
    initializeLogRocketMobile();
    const name = firstName + ' ' + lastName;
    LogRocket.identify('PEDAL_ASSISTANT_USER', {
      name: name,
      email: username,

      // Add your own custom user variables here, ie:
    });
  } catch (error: any) {
    console.error('Failed to initialize LogRocket:', error);
  }
}
