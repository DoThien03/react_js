import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';

const ModalSearchUser = ({ onSearch, isSearching }) => {


    // khởi tạo searchInput để quản lý và cập nhật giá trị của đối tượng
    const [searchInput, setSearchInput] = useState(
        {
            userName: '',
            userEmail: '',
            userPhone: '',
            userAddress: '',
            userRole: '',
        }
    );


    // set các trường về trống
    const resetFields = () => {
        setSearchInput(prevSearchInput => ({
            ...prevSearchInput,
            userName: '',
            userEmail: '',
            userPhone: '',
            userAddress: '',
            userRole: '',
        }));
    };


    // toggle modal
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        resetFields();
        setShow(false);
    }

    // xử lý sự kiện khi giá trị của 1 trường nhập thay đổi
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSearchInput(prevSearchInput => ({
            ...prevSearchInput,
            [field]: value,
        }));
    };


    // thực hiện tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setShow(false);

        // Kiểm tra xem có ít nhất một trường tìm kiếm có giá trị không
        const hasSearchInput = Object.values(searchInput).some(value => value !== '');

        // Tạo một đối tượng tìm kiếm chỉ chứa các trường có giá trị
        const searchQuery = {};
        Object.entries(searchInput).forEach(([field, value]) => {
            if (value !== '') {
                searchQuery[field] = value;
            }
        });


        // Gọi hàm onSearch với đối tượng tìm kiếm
        if (hasSearchInput) {
            onSearch(searchQuery);
        } else {
            onSearch();
        }
    };




    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2">
                Search
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Search</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form >
                        <Form.Label>Họ tên:</Form.Label>
                        <Form.Control
                            type="search"
                            name="name"
                            value={searchInput.userName}
                            onChange={(e) => handleInputChange(e, 'userName')}
                        />
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="search"
                            name="email"
                            value={searchInput.userEmail}
                            onChange={(e) => handleInputChange(e, 'userEmail')}

                        />
                        <Form.Label>Phone:</Form.Label>
                        <Form.Control
                            type="search"
                            name="phone"
                            value={searchInput.userPhone}
                            onChange={(e) => handleInputChange(e, 'userPhone')}

                        />
                        <Form.Label>Address:</Form.Label>
                        <Form.Control
                            type="search"
                            name="address"
                            value={searchInput.userAddress}
                            onChange={(e) => handleInputChange(e, 'userAddress')}

                        />
                        <Form.Label>Role:</Form.Label>
                        <Form.Control
                            type="search"
                            name="role"
                            value={searchInput.userRole}
                            onChange={(e) => handleInputChange(e, 'userRole')}

                        />
                        <Button variant="primary" type="submit" onClick={handleSearch} className="mt-3">
                            Search
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default ModalSearchUser;
