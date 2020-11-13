import React, { useEffect, useState } from 'react';
import { getIsSupport } from './utils';

const QRCode = () => {
    let videoStream = null as any;

    const [isSupport] = useState(getIsSupport());
    // const [srcObject, setSrcObject] = useState();

    const init = async () => {
        const constraints = {
            video: {
                width: {
                    min: 1280,
                    ideal: 1920,
                    max: 2560
                },
                height: {
                    min: 720,
                    ideal: 1080,
                    max: 1440
                }
            }
        };

        videoStream = await navigator.mediaDevices.getUserMedia(constraints);

        // 页面中有一个 <video autoplay id="video"></video> 标签
        const video = document.querySelector('#camera') as any;
        video.srcObject = videoStream;

        video.play();

        // setSrcObject(videoStream);
    };

    const destroy = () => {
        videoStream &&
            videoStream.getTracks().forEach((track: any) => {
                track.stop();
            });
    };

    useEffect(() => {
        init();

        return () => {
            destroy();
        };
    }, []);

    return isSupport ? (
        <>
            <video id="camera" />
            <button onClick={destroy}>关闭</button>
        </>
    ) : (
        <div>ssss</div>
    );
};

export default QRCode;
