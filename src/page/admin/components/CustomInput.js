import { useState } from "react";
import { useEffect } from "react";
import { Alert, Form } from "react-bootstrap";
import { checkDuplicateCode } from "../../../redux/slices/userSlices";

const CustomInput = ({ index, onChange, value, checkDuplicate }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [error, setError] = useState(null);

    const changeHandler = async (e) => {
        const newValue = e.target.value;
        setInternalValue((value) => ({ ...value, value: newValue, isValid: true, validating: true }));
        setError(null);

        if (newValue.trim() !== '') {
            try {
                const isDuplicate = await checkDuplicate(newValue);
                if (isDuplicate) {
                    setError('Mã đã tồn tại!');
                    setInternalValue((value) => ({ ...value, isValid: false, validating: false }));
                } else {
                    setInternalValue((value) => ({ ...value, isValid: true, validating: false }));
                }
            } catch (error) {
                console.error('Lỗi trùng:', error);
            }
        } else {
            setInternalValue((value) => ({ ...value, isValid: false, validating: false }));
        }
    };

    useEffect(() => onChange(index, internalValue), [index, internalValue, onChange]);

    return (
        <div>
            <Form.Control type="text" value={internalValue.value} onChange={changeHandler} />
            {internalValue.validating && <p style={{ color: 'gray' }}>Đang kiểm tra mã...</p>}
            {error && !internalValue.validating && <p style={{ color: 'red' }}>{error}</p>}
            {internalValue.isValid === false && !internalValue.validating && !error && (
                <p style={{ color: 'red' }}>Vui lòng nhập mã!</p>
            )}
        </div>
    );
};

export default CustomInput;
