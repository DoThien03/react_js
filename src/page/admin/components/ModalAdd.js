import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addUserCode, fetchUsers } from '../../../redux/slices/userSlices';
import { uniqueId } from 'lodash';

const CustomInput = ({ delay = 3000, index, onChange, value }) => {
    const [internalValue, setInternalValue] = useState(value);

    const changeHandler = (e) => setInternalValue({ ...internalValue, value: e.target.value });

    useEffect(() => onChange(index, internalValue), [index, internalValue, onChange]);

    useEffect(() => {
        let timerId = null;

        if (internalValue.value) {
            console.log("Start", internalValue.value);
            setInternalValue((value) => ({ ...value, validating: true }));

            timerId = setTimeout(async () => {
                const isValid = Math.random() < 0.5;
                console.log("Complete", internalValue.value);
                setInternalValue((value) => ({ ...value, isValid: true ^ isValid, validating: false }));
            }, delay);
        }

        return () => {
            console.log("Cancel", internalValue.value);
            clearTimeout(timerId);
            setInternalValue((value) => ({ ...value, validating: true }));
        };
    }, [delay, internalValue.value]);

    return (
        <div>
            <Form.Control type="text" value={internalValue.value} onChange={changeHandler} />
            {internalValue.validating && <p style={{ color: 'red' }}>Vui lòng nhập mã!</p>}
            {internalValue.isValid === false && <p style={{ color: 'red' }}>Kiểm tra không thành công</p>}
        </div>
    );
};

function ModalAdd({ showAddCode, handleCloseAddCode }) {
    const dispatch = useDispatch();
    const [userCodeRows, setUserCodeRows] = useState([]);

    const resetFields = () => setUserCodeRows([]);

    const handleCloseCode = () => {
        handleCloseAddCode();
        resetFields();
    };

    const updateData = useCallback((index, datum) => setUserCodeRows((data) => data.map((el, i) => (i === index ? datum : el))), []);

    const newCode = { id: uniqueId(), value: '', isSent: false };

    const handleAddUserCode = () => {
        setUserCodeRows((rows) => [...rows, newCode]);

    };

    const handleSubmit = async () => {
        const codesToSubmit = userCodeRows.filter((row) => !row.isSent && row.value.trim() !== '');
        const isEmpty = userCodeRows.some((row) => !row.value.trim());

        if (codesToSubmit.length === 0) {
            console.log('Không có mã mới hoặc đã sửa để gửi');
            return;
        }

        if (isEmpty) {
            console.log('Lỗi empty');
            return;
        }

        await Promise.all(
            codesToSubmit.map(async (row) => {
                await dispatch(addUserCode({ userId: showAddCode.userId, code: row.value }));
                row.isSent = true;
            })
        );

        //dispatch(fetchUsers());
    };

    const handleRemoveUserCode = (id) => {
        setUserCodeRows((rows) => rows.filter((row) => row.id !== id));
    };

    return (
        <Modal show={showAddCode} onHide={handleCloseCode}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {userCodeRows.map((row, index) => (
                        <Form.Group key={row.id} controlId={`userCode_${row.id}`}>
                            <Form.Label>Mã:</Form.Label>
                            <CustomInput
                                index={index}
                                onChange={updateData}
                                value={row}
                            />
                            <Button variant="danger" className="my-3" onClick={() => handleRemoveUserCode(row.id)}>
                                Xoá
                            </Button>
                        </Form.Group>
                    ))}
                    <Button variant="primary" className="my-4" size="sm" onClick={handleAddUserCode}>
                        Thêm Mã
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseCode}>
                    Đóng
                </Button>
                <Button variant="primary" type="button" onClick={handleSubmit}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAdd;
