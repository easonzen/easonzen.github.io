import React, { useEffect, FC } from 'react';
import { isSupport, isMobile, isIOS, isChrome } from './utils';
import axios from 'axios';

interface QRCodeProps {
    onSuccess: (data: string) => void;
    onFail: (errorMsg?: string) => void;
}

const QRCode: FC<QRCodeProps> = ({ onSuccess, onFail }) => {
    let failTimes = 0;
    let videoStream = null as any;
    const defaultScreenWidth = 375;
    const defaultScreenHeight = 667;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const videoWidth = isMobile ? screenWidth : defaultScreenWidth;
    const videoHeight = isMobile ? screenHeight : defaultScreenHeight;
    const videoFacingMode = isMobile ? { exact: 'environment' } : undefined;

    async function parseQRCode(img_file_blob: any) {
        // 接口文档地址：https://api.qzone.work/doc/qrdecode.html

        const data = new FormData();

        data.append('img_file', img_file_blob);

        const axiosInstance = axios.create();

        axiosInstance.interceptors.response.use(response => {
            const res = response.data;

            if (res?.data?.text) {
                return res;
            } else {
                return Promise.reject({ error_msg: res.msg });
            }
        });

        try {
            const resp = (await axiosInstance.post('https://api.qzone.work/api/qr.decode', data)) as any;

            onSuccess(resp.data.text);
        } catch (error) {
            console.log(error.error_msg);
            failTimes += 1;

            if (failTimes > 10) {
                destroy();

                onFail(error.error_msg);
            } else {
                readImg();
            }
        }
    }

    function readImg() {
        // 当摄像头正常工作之后，截取当前屏幕生成图片进行解析。延迟一秒进行。
        setTimeout(() => {
            const canvas = document.getElementById('qrcode-canvas') as any;
            const video = document.getElementById('camera') as any;

            canvas.width = videoWidth;
            canvas.height = videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            canvas.toBlob((blob: any) => {
                parseQRCode(blob);
            });
        }, 1000);
    }

    async function init() {
        const constraints = {
            video: {
                width: videoWidth,
                height: videoHeight,
                facingMode: videoFacingMode
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

        // 如果<video />未设置autoPlay，需要调用video.play()方法
        video.play();

        video.oncanplay = function() {
            // 当摄像头正常工作之后，截取当前屏幕生成图片进行解析。
            readImg();
        };
    }

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
            failTimes = 0;

            destroy();
        };
    }, []);

    return isSupport ? (
        <>
            {/* 需要设置muted静音，否则Safari浏览器下无法自动播放 */}
            <video id="camera" loop muted />
            <canvas id="qrcode-canvas" style={{ display: 'none' }} />
        </>
    ) : (
        _renderNotSupport()
    );
};

export default QRCode;
