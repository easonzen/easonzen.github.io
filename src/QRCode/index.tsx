import React, { useEffect } from 'react';
import { isSupport, isMobile, isIOS, isChrome } from './utils';

const QRCode = () => {
    let videoStream = null as any;

    const init = async () => {
        const constraints = {
            video: {
                width: 414,
                height: 736
            }
        };

        try {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
            alert('打开摄像头失败，请刷新页面重试');
        }

        // 页面中有一个 <video autoplay id="video"></video> 标签
        const video = document.querySelector('#camera') as any;
        video.srcObject = videoStream;

        // 如果<video />为设置autoPlay，需要调用video.play()方法
        video.play();
    };

    const destroy = () => {
        videoStream &&
            videoStream.getTracks().forEach((track: any) => {
                track.stop();
            });
    };

    const _renderNotSupport = () => {
        if (isMobile && isIOS && isChrome) {
            return <div>Chrome浏览器不支持使用摄像头，请使用Safari浏览器打开此页面</div>;
        }

        return <div>当前浏览器不支持使用摄像头，请更换浏览器重新尝试</div>;
    };

    useEffect(() => {
        init();

        return () => {
            destroy();
        };
    }, []);

    return isSupport() ? (
        <>
            <video id="camera" />
            <button onClick={destroy}>关闭</button>
        </>
    ) : (
        _renderNotSupport()
    );
};

export default QRCode;
