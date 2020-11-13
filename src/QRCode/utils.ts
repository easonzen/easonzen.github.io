export const isSupport = () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        return true;
    }

    return false;
};

export const isMobile = () => {
    const ua = navigator.userAgent;

    return ua.match(/AppleWebKit.*Mobile.*/);
};

export const isIOS = () => {
    const ua = navigator.userAgent;

    return ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

export const isChrome = () => {
    const ua = navigator.userAgent;

    return ua.indexOf('Chrome');
};
