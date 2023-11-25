
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:9000/api';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ searchData, page, size }, { rejectWithValue }) => {
    try {
        if (searchData) {
            // Nếu có searchData, thực hiện tìm kiếm
            console.log('Search Data:', searchData);
            const response = await axios.post(`${API_BASE_URL}/user/query`, { ...searchData }, { params: { page, size } });
            console.log('Response:', response.data);
            return response.data;
        } else {
            // Nếu không có searchData, thực hiện lấy dữ liệu phân trang
            const response = await axios.get(`${API_BASE_URL}/user/listUser`,
                {
                    params: { page, size }
                }
            );
            console.log('List User Response:', response.data);
            return response.data;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});



export const createUser = createAsyncThunk('users/createUser', async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/user/save`, userData);
    return response.data;
});


export const addUserCode = createAsyncThunk('userCode/addCode', async ({ userId, code }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/addCode/${userId}`, { code: code });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const checkDuplicateCode = createAsyncThunk('userCode/checkDuplicate', async ({ userId, code }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/checkDuplicateCode/${userId}/${code}`);
        return response.data;
    } catch (error) {
        console.error('Check lỗi trùng:', error);
        return false;
    }
});


export const updateUser = createAsyncThunk('users/updateUser', async (userData) => {
    const response = await axios.put(`${API_BASE_URL}/user/update`, userData);
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`${API_BASE_URL}/user/delete/${userId}`);
    return userId;
});
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        currentPage: 0,
        totalPages: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number + 1;
            })

            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const existingUser = state.list.find((user) => user.userId === updatedUser.userId);
                if (existingUser) {
                    Object.assign(existingUser, updatedUser);
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const id = action.payload;
                state.list = state.list.filter((user) => user.userId !== id);
            })
            .addCase(addUserCode.fulfilled, (state, action) => {
                state.listUser = action.payload;
            })
    },
});

export default usersSlice.reducer;

export const selectUsers = (state) => state.users.list;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectCurrentPage = (state) => state.users.currentPage;
export const selectTotalPages = (state) => state.users.totalPages;