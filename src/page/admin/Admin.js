import React, { useState, useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import { Container, Modal, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import Stack from 'react-bootstrap/Stack';
import AddIcon from '@mui/icons-material/Add';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ToastContainer, toast } from 'react-toastify';
import ModalEditUser from './components/ModalEditUser';
import ModalAddUser from './components/ModalAddUser';
import ModalSearchUser from './components/ModalSearchUser';

import {
    selectUsers,
    fetchUsers,
    deleteUser,
    selectCurrentPage,
    selectTotalPages,
} from '../../redux/slices/userSlices';
import ModalAdd from './components/ModalAdd';

const Admin = () => {


    // toggle modal add
    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => setShowAdd(false);


    // toggle modal add Code
    const [showAddCode, setShowAddCode] = useState(false);
    const handleCloseAddCode = () => setShowAddCode(false);


    // toggle modal edit
    const [showEdit, setShowEdit] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState({});
    const handleCloseEdit = () => setShowEdit(false);


    // redux
    const dispatch = useDispatch();
    const users = useSelector(selectUsers);
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);


    // lưu trữ id 
    const [userIdToDelete, setUserIdToDelete] = useState(null);


    // lưu trữ thông tin tìm kiếm
    const [searchData, setSearchData] = useState({});


    // kiểm tra search data và cập nhật trạng thái
    const [isSearching, setIsSearching] = useState(false);


    // gọi fetchusers để thực hiện tìm kiếm và lấy dữ liệu người dùng 
    useEffect(() => {
        if (isSearching) {
            dispatch(fetchUsers({ page: currentPage - 1, size: 10, searchData }));
        } else {
            dispatch(fetchUsers({ page: currentPage - 1, size: 10 }));
        }
    }, [dispatch, currentPage, searchData, isSearching]);


    // xác nhận userId cần xóa
    const handleShowDeleteConfirmation = (userId) => {
        setUserIdToDelete(userId);
    };


    // thực hiện xóa
    const handleDeleteUser = () => {
        dispatch(deleteUser(userIdToDelete));
        toast.success('Xóa thành công!');
        setUserIdToDelete(null);
        setSearchData({});
        setIsSearching(false);
    };


    // thực hiện show edit và fill dữ liệu
    const handleShowEdit = (user) => {
        setShowModalEdit(user);
        setShowEdit(true);
        setSearchData({});
        setIsSearching(false);
    };


    //thực hiện chuyển trang khi click
    const handlePaginationClick = (pageIndex) => {
        if (isSearching) {
            dispatch(fetchUsers({ page: pageIndex, size: 10, searchData }));
        } else {
            dispatch(fetchUsers({ page: pageIndex, size: 10 }));
        }
    };


    return (
        <>
            <Container>
                <Stack direction="horizontal" gap={3} style={{ marginBottom: '20px' }}>
                    <div className="p-2">
                        <ModalSearchUser
                            onSearch={(data) => {
                                setSearchData(data);
                                setIsSearching(true);
                            }}
                            isSearching={isSearching}
                        />
                    </div>
                    <div className="p-2 ms-auto">
                        <Button variant="primary" onClick={() => setShowAdd(true)}>
                            Add New
                        </Button>
                    </div>
                </Stack>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">NAME</th>
                            <th scope="col">EMAIL</th>
                            <th scope="col">PHONE</th>
                            <th scope="col">ADDRESS</th>
                            <th scope="col">ROLE</th>
                            <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.userPhone}</td>
                                    <td>{user.userAddress}</td>
                                    <td>{user.userRole}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            onClick={() => handleShowEdit(user)}
                                        >
                                            <ModeIcon />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            variant="danger"
                                            onClick={() => handleShowDeleteConfirmation(user.userId)}
                                        >
                                            <DeleteOutlineIcon />
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={() => setShowAddCode(user)}>< AddIcon /></Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}
                    </tbody>
                </Table>

                {/* === pagination === */}
                <Pagination>
                    <Pagination.First onClick={() => handlePaginationClick(0)} />
                    <Pagination.Prev
                        onClick={() => {
                            if (currentPage > 1) {
                                handlePaginationClick(currentPage - 2);
                            }
                        }}
                    />
                    {Array.from({ length: totalPages }).map((_, pageIndex) => {
                        if (pageIndex + 1 === currentPage) {
                            return (
                                <Pagination.Item
                                    key={pageIndex}
                                    active
                                    onClick={() => handlePaginationClick(pageIndex)}
                                >
                                    {pageIndex + 1}
                                </Pagination.Item>
                            );
                        }
                        if (
                            pageIndex + 1 === 1 ||
                            pageIndex + 1 === totalPages ||
                            Math.abs(pageIndex + 1 - currentPage) <= 2
                        ) {
                            return (
                                <Pagination.Item
                                    key={pageIndex}
                                    onClick={() => handlePaginationClick(pageIndex)}
                                >
                                    {pageIndex + 1}
                                </Pagination.Item>
                            );
                        }
                        if (
                            pageIndex + 1 === 2 ||
                            pageIndex + 1 === totalPages - 1 ||
                            Math.abs(pageIndex + 1 - currentPage) <= 1
                        ) {
                            return (
                                <Pagination.Ellipsis
                                    key={pageIndex}
                                    onClick={() => handlePaginationClick(pageIndex)}
                                />
                            );
                        }
                        return null;
                    })}
                    <Pagination.Next
                        onClick={() => {
                            if (currentPage < totalPages) {
                                handlePaginationClick(currentPage);
                            }
                        }}
                    />
                    <Pagination.Last onClick={() => handlePaginationClick(totalPages - 1)} />
                </Pagination>

                {/* === Modal add user === */}
                <ModalAddUser showAdd={showAdd} handleCloseAdd={handleCloseAdd} />


                {/* === Modal add Code === */}
                <ModalAdd showAddCode={showAddCode} handleCloseAddCode={handleCloseAddCode} />


                {/* === Modal edit user === */}
                <ModalEditUser showEdit={showEdit} handleCloseEdit={handleCloseEdit} showModalEdit={showModalEdit} />

                {/* === confirm delete === */}
                <Modal show={userIdToDelete !== null} onHide={() => setUserIdToDelete(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cảnh báo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc muốn xóa?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setUserIdToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteUser}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container >

            {/* === notification === */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />


        </>
    );
};

export default Admin;
