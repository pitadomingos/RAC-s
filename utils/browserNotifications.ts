
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastEventDetail {
  title: string;
  message: string;
  type: ToastType;
}

export const requestNotificationPermission = () => {
  // Disabled: User requested no browser notifications.
  // This function is kept to maintain API compatibility.
  console.log("Browser notifications disabled by configuration.");
};

export const sendBrowserNotification = (title: string, body: string, type: ToastType = 'info') => {
  // Infer type from title if not provided explicitly (helper for legacy calls)
  let inferredType = type;
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('blocked')) inferredType = 'error';
  else if (lowerTitle.includes('success') || lowerTitle.includes('approved')) inferredType = 'success';
  else if (lowerTitle.includes('warning') || lowerTitle.includes('alert')) inferredType = 'warning';

  // Dispatch custom event to be caught by ToastContainer
  const event = new CustomEvent<ToastEventDetail>('app-toast', {
    detail: { title, message: body, type: inferredType }
  });
  window.dispatchEvent(event);
};
