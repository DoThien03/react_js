import React from 'react';
import { useEffect } from 'react';
import { Field } from 'redux-form';

const CustomInput = ({ delay = 3000, index, input, meta }) => {
    useEffect(() => input.onChange(input.value), [input]);

    useEffect(() => {
        let timerId = null;

        if (input.value) {
            console.log("Start", input.value);
            input.onChange({ ...input.value, validating: true });

            timerId = setTimeout(async () => {
                const isValid = Math.random() < 0.5;
                console.log("Complete", input.value);
                input.onChange({ ...input.value, isValid: true ^ isValid, validating: false });
            }, delay);
        }

        return () => {
            console.log("Cancel", input.value);
            clearTimeout(timerId);
            input.onChange({ ...input.value, validating: true });
        };
    }, [delay, input.value]);

    return (
        <div>
            <input type="text" {...input} />
            {meta.touched && meta.error && <p style={{ color: 'red' }}>{meta.error}</p>}
            {input.value.validating && <p style={{ color: 'red' }}>Vui lòng nhập mã!</p>}
            {input.value.isValid === false && <p style={{ color: 'red' }}>Kiểm tra không thành công</p>}
        </div>
    );
};
export default CustomInput;
