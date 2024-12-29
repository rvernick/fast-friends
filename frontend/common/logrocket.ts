import LogRocket from 'logrocket';


export const initializeLogRocketWeb = () => {
  LogRocket.init('e1y6b7/pedal-assistant');
}

export const identifyLogRocketWeb = (username: string, firstName: string, lastName: string) => {
  
  console.log('Initializing LogRocket mobile...');
  try {
    initializeLogRocketWeb();
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
