
export const requestNotificationPermission = () => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
};

export const sendBrowserNotification = (title: string, body: string) => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    alert(`${title}\n\n${body}`); // Fallback for older browsers
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { 
        body, 
        icon: '/assets/DigiSol_Logo.png', // Assuming asset exists, else browser default
        requireInteraction: false
    });
  } else {
    // Fallback to native alert if permission denied or not granted yet
    // This ensures the message is ALWAYS delivered "direct from system"
    alert(`${title}\n\n${body}`);
  }
};
