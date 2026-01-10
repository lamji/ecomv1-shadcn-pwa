export const isInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const win = window as unknown as { opera?: string };
  const ua = (navigator.userAgent || navigator.vendor || win.opera) as string;

  // Facebook, Messenger, Instagram
  const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
  const isInstagram = ua.indexOf('Instagram') > -1;

  // Line, Wechat, TikTok
  const isLine = ua.indexOf('Line') > -1;
  const isWeChat = ua.indexOf('MicroMessenger') > -1;
  const isTikTok = ua.indexOf('TikTok') > -1;

  // Generic in-app check
  const isInApp = ua.indexOf('Mobile/') > -1 && ua.indexOf('Safari/') === -1;

  return isFacebook || isInstagram || isLine || isWeChat || isTikTok || isInApp;
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as { MSStream?: unknown };
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !win.MSStream;
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};
