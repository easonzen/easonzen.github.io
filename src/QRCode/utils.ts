const ua = navigator.userAgent;

export const isSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices ? true : false;

export const isMobile = ua.match(/AppleWebKit.*Mobile.*/);

export const isIOS = ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const isChrome = ua.indexOf('Chrome');
