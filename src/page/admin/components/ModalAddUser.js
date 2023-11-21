import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { createUser } from '../../../redux/slices/userSlices';
import { toast } from 'react-toastify';

function ModalAddUser(props) {
    const { showAdd, handleCloseAdd } = props;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const dispatch = useDispatch();
    const [isUserCodeRowVisible, setIsUserCodeRowVisible] = useState(false);
    const [promoCode, setPromoCode] = useState('');

    const resetFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setRole('');
        setPromoCode('');
    };

    const handleClose = () => {
        handleCloseAdd();
        resetFields();
        setIsUserCodeRowVisible(false);
    };

    const phoneRegex = /^(0[35789])[0-9]{8}\b/g;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check validate
        if (!name || !email || !phone || !address || !role) {
            toast.error("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        // Kiểm tra số điện thoại
        if (!phoneRegex.test(phone)) {
            toast.error("Vui lòng nhập số điện thoại hợp lệ.");
            return;
        }

        // Kiểm tra địa chỉ email
        if (!emailRegex.test(email)) {
            toast.error("Vui lòng nhập địa chỉ email hợp lệ.");
            return;
        }

        const itemData = {
            userName: name,
            userEmail: email,
            userPhone: phone,
            userAddress: address,
            userRole: role,
            promoCode: isUserCodeRowVisible ? promoCode : null,
        };

        dispatch(createUser(itemData));
        toast.success("Thêm người dùng mới thành công!");
        handleCloseAdd();
        resetFields();
    };

    const handleAddUserCode = () => {
        setIsUserCodeRowVisible(!isUserCodeRowVisible);
    };

    return (
        <Modal show={showAdd} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm Người Dùng Mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Họ tên:</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                        <Form.Label>Số điện thoại:</Form.Label>
                        <Form.Control
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Địa chỉ:</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                        <Form.Label>Phân quyền:</Form.Label>
                        {['Admin', 'User'].map((userRole, index) => (
                            <Form.Check
                                key={index}
                                type="radio"
                                label={userRole}
                                name="role"
                                value={userRole}
                                checked={role === userRole}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        ))}
                    </Form.Group>
                    {isUserCodeRowVisible && (
                        <Form.Group controlId="formPromoCode">
                            <Form.Label>Mã Khuyến Mại:</Form.Label>
                            <Form.Control
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                        </Form.Group>
                    )}
                    <Button variant="primary" className="my-4" size="sm" onClick={handleAddUserCode}>
                        <AddIcon />
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAddUser;
