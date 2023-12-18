import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({ index, onChange, value, checkDuplicate, onRequestCountChange }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [error, setError] = useState(null);
    const [requestCount, setRequestCount] = useState(0);
    const [cancelToken, setCancelToken] = useState(null);

    const changeHandler = async (e) => {
        setRequestCount((count) => count + 1);
        onRequestCountChange(1);
        const newValue = e.target.value;
        setInternalValue((value) => ({ ...value, value: newValue, isValid: true, validating: true }));
        setError(null);

        // Hủy yêu cầu trước đó nếu có
        if (cancelToken) {
            cancelToken.cancel("Yêu cầu trước đã bị hủy");
        }

        if (newValue.trim() !== '') {
            // Tạo cancelToken mới
            const source = axios.CancelToken.source();
            setCancelToken(source);

            try {
                const isDuplicate = await checkDuplicate(newValue, source.token);

                if (isDuplicate) {
                    setError('Mã đã tồn tại!');
                    setInternalValue((value) => ({ ...value, isValid: false, validating: false }));
                } else {
                    setInternalValue((value) => ({ ...value, isValid: true, validating: false }));
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Lỗi trùng:', error);
                }
            } finally {
                // Đặt cancelToken thành null sau khi yêu cầu hoàn thành
                setCancelToken(null);
                onRequestCountChange(-1);
                setRequestCount((count) => count - 1);
            }
        } else {
            setInternalValue((value) => ({ ...value, isValid: false, validating: false }));
            onRequestCountChange(-1);
            setRequestCount((count) => count - 1);
        }
    };

    useEffect(() => onChange(index, internalValue), [index, internalValue, onChange]);

    return (
        <div>
            <Form.Control type="text" value={internalValue.value} onChange={changeHandler} />
            {requestCount > 0 && <p style={{ color: 'gray' }}>Đang kiểm tra mã...</p>}
            {error && !internalValue.validating && <p style={{ color: 'red' }}>{error}</p>}
            {internalValue.isValid === false && !internalValue.validating && !error && (
                <p style={{ color: 'red' }}>Vui lòng nhập mã!</p>
            )}
        </div>
    );
};

export default CustomInput;
