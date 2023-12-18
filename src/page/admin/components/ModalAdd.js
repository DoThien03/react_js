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
    const resetFields = () => setUserCodeRows([]);
    const [totalRequestCount, setTotalRequestCount] = useState(0);


    // Cập nhật giá trị state mới khi có sự thay đổi trong requestCount của CustomInput
    const handleRequestCountChange = (count) => {
        setTotalRequestCount((prevCount) => prevCount + count);
    }

    // đóng modal 
    const handleCloseCode = () => {
        handleCloseAddCode();
        resetFields();
    };


    // cập nhật input vào mảng
    const updateData = useCallback((index, datum) => setUserCodeRows((data) => data.map((el, i) => (i === index ? datum : el))), []);


    // khởi tạo input mới
    const newCode = { id: uniqueId(), value: '', isValid: false, validating: false, isSent: false };


    // thêm 1 input
    const handleAddUserCode = () => {
        setUserCodeRows((rows) => [...rows, newCode]);
    };

    useEffect(() => {
        // kiểm tra có lỗi hay không và cập nhật trạng thái hasError
        const hasValidationError = userCodeRows.some((row) => row.isValid === false || row.isDuplicate);
        setHasError(hasValidationError);
    }, [userCodeRows]);


    // kiểm tra và gửi dữ liệu
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





    // xóa 1 input
    const handleRemoveUserCode = (id) => {
        setUserCodeRows((rows) => rows.filter((row) => row.id !== id));
    };


    // kiểm tra mã trùng
    const checkDuplicate = async (code) => {
        try {
            const response = await dispatch(checkDuplicateCode({ userId: showAddCode.userId, code: code }));
            return response.payload;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Yêu cầu đã bị hủy");
            } else {
                console.log("Lỗi trùng:", error);
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
                                checkDuplicate={checkDuplicate}
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
