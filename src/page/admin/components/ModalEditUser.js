import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { updateUser } from '../../../redux/slices/userSlices';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function ModalEditUser(props) {

    // reudx
    const dispatch = useDispatch();

    // tạo và set các trường
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');


    // tạo các biến và lưu trạng thái kiểm tra
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [addressError, setAddressError] = useState('');


    // Kiểm tra tính hợp lệ
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPhone = /^(0[35789])[0-9]{8}\b/g;
    const validateForm = () => {

        let isValid = true;

        if (name.trim() === '') {
            setNameError('Vui lòng nhập tên');
            isValid = false;
        } else {
            setNameError('');
        }
        if (email.trim() === '') {
            setEmailError('Vui lòng nhập email');
            isValid = false;
        } else if (!regexEmail.test(email)) {
            setEmailError('Email không đúng định dạng')
            isValid = false;
        } else {
            setEmailError('');
        }
        if (phone.trim() === '') {
            setPhoneError('Vui lòng nhập SDT');
            isValid = false;
        }
        else if (!regexPhone.test(phone)) {
            setPhoneError('SĐT không đúng định dạng')
            isValid = false;
        } else {
            setPhoneError('');
        }
        if (address.trim() === '') {
            setAddressError('Vui lòng nhập tên');
            isValid = false;
        } else {
            setAddressError('');
        }



        return isValid;
    };


    // cập nhật các giá trị của các trường 
    useEffect(() => {
        if (props.showEdit && props.showModalEdit) {
            setName(props.showModalEdit.userName);
            setEmail(props.showModalEdit.userEmail);
            setPhone(props.showModalEdit.userPhone);
            setAddress(props.showModalEdit.userAddress);
            setRole(props.showModalEdit.userRole);
        }
    }, [props.showModalEdit]);


    //thực hiện edit
    const handleEdit = () => {
        const isValid = validateForm();

        if (isValid) {
            // Thực hiện thao tác chỉnh sửa
            const editedUser = {
                userId: props.showModalEdit.userId,
                userName: name,
                userEmail: email,
                userPhone: phone,
                userAddress: address,
                userRole: role,
            };

            dispatch(updateUser(editedUser));
            toast.success('Chỉnh sửa thành công!');
            props.handleCloseEdit();
        }
    };
    return (
        <Modal show={props.showEdit} onHide={props.handleCloseEdit}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa User</Modal.Title>
            </Modal.Header>
            <Modal.Body>


                <Form.Label htmlFor="name">Tên:</Form.Label>
                <Form.Control
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={nameError !== ''}
                />
                <Form.Control.Feedback type="invalid">
                    {nameError}
                </Form.Control.Feedback>


                <Form.Label htmlFor="email">Email:</Form.Label>
                <Form.Control
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={emailError !== ''}

                />
                <Form.Control.Feedback type="invalid">
                    {emailError}
                </Form.Control.Feedback>


                <Form.Label htmlFor="phone">Phone:</Form.Label>
                <Form.Control
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={phoneError !== ''}
                />
                <Form.Control.Feedback type="invalid">
                    {phoneError}
                </Form.Control.Feedback>


                <Form.Label htmlFor="address">Address:</Form.Label>
                <Form.Control
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    isInvalid={addressError !== ''}
                />
                <Form.Control.Feedback type="invalid">
                    {addressError}
                </Form.Control.Feedback>


                <Form>
                    <Form.Label htmlFor="role">Role:</Form.Label>
                    {['Admin', 'user'].map((roleOption, index) => (
                        <Form.Check
                            key={index}
                            inline
                            label={roleOption}
                            name="group1"
                            type="radio"
                            className="m-3"
                            id={`inline-radio-${index}`}
                            value={roleOption}
                            checked={role === roleOption}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseEdit}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                    Edit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditUser;