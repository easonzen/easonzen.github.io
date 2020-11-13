export const getIsSupport = () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        return true;
    }

    return false;
};
