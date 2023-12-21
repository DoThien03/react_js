import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addUserCode, checkDuplicateCode } from '../../../redux/slices/userSlices';
import { uniqueId } from 'lodash';
import CustomInput from './CustomInput';
import axios from 'axios';

function ModalAdd({ showAddCode, handleCloseAddCode }) {
    const [hasError, setHasError] = useState(false);
    const dispatch = useDispatch();
    const [userCodeRows, setUserCodeRows] = useState([]);
    const [totalRequestCount, setTotalRequestCount] = useState(0);

    const handleRequestCountChange = (count) => {
        setTotalRequestCount((prevCount) => prevCount + count);
    };

    const handleCloseCode = () => {
        handleCloseAddCode();
        resetFields();
    };

    const resetFields = () => {
        setUserCodeRows([]);
    };

    const updateData = useCallback(
        (index, datum) => setUserCodeRows((data) => data.map((el, i) => (i === index ? datum : el))),
        []
    );

    const generateNewCode = useCallback(() => {
        const newCode = {
            id: uniqueId(),
            value: '',
            isValid: false,
            validating: false,
            isSent: false,
        };

        console.log('New Input ID:', newCode.id);

        return newCode;
    }, []);

    const handleAddUserCode = () => {
        setUserCodeRows((rows) => [...rows, generateNewCode()]);
    };

    const handleRemoveUserCode = (id) => {
        const indexToRemove = userCodeRows.findIndex((row) => row.id === id);
        if (indexToRemove !== -1) {
            setUserCodeRows((rows) => {
                const newRows = [...rows];
                newRows.splice(indexToRemove, 1);
                return newRows;
            });
        }
    };

    useEffect(() => {
        const hasValidationError = userCodeRows.some((row) => row.isValid === false || row.isDuplicate);
        setHasError(hasValidationError);
    }, [userCodeRows]);

    const handleSubmit = async () => {
        const codesToSubmit = userCodeRows.filter((row) => !row.isSent && row.value.trim() !== '');
        const isPending = userCodeRows.some((row) => row.validating);

        if (isPending) {
            console.log('Có mã đang trong trạng thái kiểm tra, vui lòng đợi!');
            return;
        }

        await Promise.all(
            codesToSubmit.map(async (row, index) => {
                await dispatch(addUserCode({ userId: showAddCode.userId, code: row.value }));
            })
        );

        handleCloseCode();
    };

    const checkDuplicate = async (code, id) => {
        try {
            const response = await dispatch(checkDuplicateCode({ userId: showAddCode.userId, code, id }));
            return response.payload;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Yêu cầu đã bị hủy');
            } else {
                console.log('Lỗi trùng:', error);
            }
            return false;
        }
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
                                checkDuplicate={(code) => checkDuplicate(code, row.id)}
                                onRequestCountChange={handleRequestCountChange}
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
                <Button variant="primary" type="button" onClick={handleSubmit} disabled={hasError || totalRequestCount > 0}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAdd;
