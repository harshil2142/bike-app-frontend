/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, Button, FormControl, InputLabel, Select, MenuItem, Modal, Fade, Backdrop, Typography } from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const baseUrl = process.env.BACKEND_URL;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '3px solid #808080',
    boxShadow: 24,
    p: 4,
    borderRadius:"2rem",

};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    border: "1px solid black",
    borderRadius: "25px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


const index = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user'))?.token) : null;
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const handleClose = () => setOpen(false);

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/search?search=&size=${rowsPerPage}&page=${page + 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(data.data);
            setTotalUsers(data.pagination.totalItems);
        } catch (error) {
            //   console.error('Error fetching user data:', error);
            toast.error(error.response.data.message || error.response.data);
        }
    };
    useEffect(() => {
        fetchUserData()
    }, [rowsPerPage, page])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    return (
        <>
            <Box sx={{ width: "90%", display: 'flex', justifyContent: "space-evenly", margin: "1.5rem 0" }}>
                <Box width='30%' textAlign='center'>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search… User "
                            onChange={async (e) => {
                                const result = e.target.value
                                if (result === "") {
                                    fetchUserData()
                                } else {

                                    try {
                                        const { data } = await axios.get(`
                                        ${baseUrl}/api/search?search=${result}&size=${rowsPerPage}&page=${page + 1}`, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        });
                                        setUsers(data.data);
                                        setTotalUsers(data.pagination.totalItems);
                                    } catch (error) {
                                        toast.error(error.response.data.message || error.response.data);
                                    }
                                }
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Box>
                <Box>
                    <Link href='/register'><Button variant='contained'>Add new user</Button></Link>
                </Box>
            </Box>

            <Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Active</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                {/* Add more table headers based on your data */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(users)
                                .map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{JSON.stringify(user.admin)}</TableCell>
                                        <TableCell>{JSON.stringify(user.active)}</TableCell>
                                        <TableCell>{user.createdAt.slice(0, 10)}</TableCell>
                                        <TableCell><Button><EditIcon onClick={() => {
                                            localStorage.setItem('editUser',JSON.stringify(user))
                                            router.push("/user/edit")
                                        }} /></Button></TableCell>
                                        <TableCell><Button><DeleteIcon onClick={() => {
                                            setOpen(true);
                                            setSelectedUser(user)
                                        }} /></Button></TableCell>
                                       
                                        {/* Add more table cells based on your data */}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 10]}
                    component="div"
                    count={totalUsers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Box>
                <Link href='/admin'><Button variant='contained'>Back</Button></Link>
            </Box>
            <Box>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                 
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            {selectedUser && <Box>
                                <Box margin='1rem 0'>
                                    <Typography fontSize='1.rem' textAlign={'center'}>Are you sure you want to delete the user whose name is {selectedUser.name}</Typography>
                                </Box>
                                <Box width="90%" display='flex' justifyContent='space-evenly'>
                                    <Button variant='contained' onClick={handleClose}>Cancel</Button>
                                    <Button variant='contained' onClick={async () => {
                                        try {
                                            const { data } = await axios.delete(`
                                            ${baseUrl}/api/delete?email=${selectedUser.email}`, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            });
                                            if (data) {
                                                handleClose()
                                                fetchUserData()
                                                toast.error("User deleted successfully");
                                            }
                                        } catch (error) {
                                            toast.error(error.response.data.message || error.response.data);
                                        }
                                    }}>Delete</Button>
                                </Box>
                            </Box>}
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    )
}

export default index
