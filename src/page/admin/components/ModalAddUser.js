import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { createUser } from '../../../redux/slices/userSlices';
import { toast } from 'react-toastify';

function ModalAddUser(props) {


    const { showAdd, handleCloseAdd } = props;


    // tạo và set tên các trường
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');

    // quản lý trạng thái 
    const [formValidated, setFormValidated] = useState(false);

    // redux
    const dispatch = useDispatch();


    // set các trường thành trống
    const resetFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setRole('');
    };


    // đóng modal và reset các trường 
    const handleClose = () => {
        handleCloseAdd();
        resetFields();
    }

    // thực hiện thêm user
    const handleSubmit = (e) => {
        e.preventDefault();

        // set validates
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setFormValidated(true);
            return;
        }

        const itemData = {
            userName: name,
            userEmail: email,
            userPhone: phone,
            userAddress: address,
            userRole: role
        };
        if (itemData) {
            dispatch(createUser(itemData));
            toast.success("Thêm người dùng mới thành công!");
            handleCloseAdd();
            resetFields();
        }

    };

    return (
        <Modal show={showAdd} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm Người Dùng Mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={formValidated} onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Họ tên:</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập họ tên.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập địa chỉ email hợp lệ.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="phone">
                        <Form.Label>Số điện thoại:</Form.Label>
                        <Form.Control
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập số điện thoại.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label>Địa chỉ:</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập địa chỉ.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="role">
                        <Form.Label>Phân quyền:</Form.Label>
                        {['Admin', 'User'].map((userRole, index) => (
                            <Form.Check
                                key={index}
                                inline
                                label={userRole}
                                type="radio"
                                name="role"
                                id={`role-${index}`}
                                value={userRole}
                                checked={role === userRole}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        ))}
                        <Form.Control.Feedback type="invalid">
                            Vui lòng chọn phân quyền.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ModalAddUser;