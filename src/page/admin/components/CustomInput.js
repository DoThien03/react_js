// CustomInput.js
import React, { useEffect } from 'react';
import { Field } from 'redux-form';

const CustomInput = ({ delay = 3000, input, meta }) => {
    useEffect(() => {
        let timerId = null;

        if (input.value) {
            console.log("Bắt đầu", input.value);
            meta.dispatch({ type: 'VALIDATING', meta: { ...meta } });

            timerId = setTimeout(async () => {
                const isValid = Math.random() < 0.5;
                console.log("Hoàn thành", input.value);
                meta.dispatch({ type: 'SET_VALID', payload: isValid });
            }, delay);
        }

        return () => {
            console.log("Hủy", input.value);
            clearTimeout(timerId);
            meta.dispatch({ type: 'VALIDATING', meta: { ...meta } });
        };
    }, [delay, input.value, meta]);

    return (
        <div>
            <input {...input} type="text" />
            {meta.submitFailed && meta.error && <p style={{ color: 'red' }}>{meta.error}</p>}
            {meta.validating && <p style={{ color: 'orange' }}>Đang kiểm tra...</p>}
            {meta.isValid === false && <p style={{ color: 'red' }}>Kiểm tra không thành công</p>}
        </div>
    );
};

export default CustomInput;
