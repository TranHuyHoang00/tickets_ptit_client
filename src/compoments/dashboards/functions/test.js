import React, { useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const Test = () => {
    const qrReaderRef = useRef(null);

    useEffect(() => {
        const video = qrReaderRef.current?.state?.mediaStream?.getVideoTracks()[0];
        console.log('qrReaderRef', qrReaderRef);
        if (video && 'getCapabilities' in video) {
            const capabilities = video.getCapabilities();
            if (capabilities.zoom && capabilities.zoom.max > 1) {
                video.applyConstraints({ advanced: [{ zoom: 2 }] }); // Thay đổi giá trị zoom tại đây
            }
        }
    }, []);

    const handleScan = (data) => {
        if (data) {
            console.log(data);
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return <QrReader ref={qrReaderRef} onScan={handleScan} onError={handleError} />;
};

export default Test;
