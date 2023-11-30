import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addUserCode, checkDuplicateCode } from '../../../redux/slices/userSlices';
import { uniqueId } from 'lodash';
import CustomInput from './CustomInput';
function ModalAdd({ showAddCode, handleCloseAddCode }) {
    const dispatch = useDispatch();
    const [userCodeRows, setUserCodeRows] = useState([]);
    const resetFields = () => setUserCodeRows([]);


    const handleCloseCode = () => {
        handleCloseAddCode();
        resetFields();
    };


    const updateData = useCallback((index, datum) => setUserCodeRows((data) => data.map((el, i) => (i === index ? datum : el))), []);
    const newCode = { id: uniqueId(), value: '', isValid: false, validating: false, isSent: false };


    const handleAddUserCode = () => {
        setUserCodeRows((rows) => [...rows, newCode]);
    };

    const handleSubmit = async () => {
        const codesToSubmit = userCodeRows.filter((row) => !row.isSent && row.value.trim() !== '');
        const isEmpty = userCodeRows.some((row) => !row.value.trim());

        if (codesToSubmit.length === 0) {
            console.log('Không có mã mới để gửi');
            return;
        }

        if (isEmpty) {
            console.log('Mã không được để trống!');
            return;
        }

        // Kiểm tra nếu có mã trùng và hiển thị thông báo
        if (userCodeRows.some((row) => row.isValid === false || row.isDuplicate)) {
            console.log('Có mã trùng lặp!')
            return;
        }

        // Gửi dữ liệu lên cơ sở dữ liệu chỉ khi không có mã trùng lặp
        await Promise.all(
            codesToSubmit.map(async (row, index) => {
                await dispatch(addUserCode({ userId: showAddCode.userId, code: row.value }));

            })
        );
        handleCloseCode()
    };


    const handleRemoveUserCode = (id) => {
        setUserCodeRows((rows) => rows.filter((row) => row.id !== id));
    };


    const checkDuplicate = async (code) => {
        try {
            const response = await dispatch(checkDuplicateCode({ userId: showAddCode.userId, code: code }));
            return response.payload;

        } catch (error) {
            console.log('Lỗi trùng', error);
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
                                checkDuplicate={checkDuplicate}
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
