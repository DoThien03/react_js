import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AddIcon from '@mui/icons-material/Add';
import { addUserCode } from '../../../redux/slices/userSlices';
import { useDispatch } from 'react-redux';

function ModalAdd(props) {
    const dispatch = useDispatch();
    const { showAddCode, handleCloseAddCode } = props;
    const [userCode, setUserCode] = useState('');
    const [isUserCodeRowVisible, setIsUserCodeRowVisible] = useState(false);
    const [promoCode, setPromoCode] = useState('');

    const resetFields = () => {
        setUserCode('');
        setPromoCode('');
    };

    const handleCloseCode = () => {
        handleCloseAddCode();
        resetFields();
        setIsUserCodeRowVisible(false);
    };


    const handleSubmit = () => {
        const userCodeData = {
            userId: showAddCode.userId,
            code: userCode
        };

        console.log('userCodeData', userCodeData);


        dispatch(addUserCode(userCodeData));
        handleCloseAddCode();
        resetFields();

    };


    const handleAddUserCode = () => {
        setIsUserCodeRowVisible(!isUserCodeRowVisible);
    };



    return (
        <Modal show={showAddCode} onHide={handleCloseCode}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="nameCode">
                        <Form.Label>Mã:</Form.Label>
                        <Form.Control
                            type="text"
                            id="nameCode"
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                        />
                    </Form.Group>
                    {/* {isUserCodeRowVisible && (
                        <Form.Group controlId="formPromoCode">
                            <Form.Label>Mã:</Form.Label>
                            <Form.Control
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                        </Form.Group>
                    )} */}
                    <Button variant="primary" className="my-4" size="sm" onClick={handleAddUserCode}>
                        < AddIcon />
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
