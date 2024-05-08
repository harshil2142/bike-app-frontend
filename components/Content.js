/* eslint-disable @next/next/no-img-element */
import { Box, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';



const Content = () => {
  return (
    <>
    <Box width="90%" sx={{margin:"2rem auto"}} height='450px' display={"flex"}>
        <Box sx={{width:"50%",textAlign:"center"}}>
        <img src="https://images.unsplash.com/photo-1525160354320-d8e92641c563?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt='image' width={450} height={450} style={{borderRadius:"2rem"}} />
        </Box>
        <Box sx={{width:"50%",margin:"auto"}}>
           <Typography sx={{fontSize:"3rem",margin:"auto 0",fontFamily:'Inter',textShadow:"3px 3px 4px #808080"}} >This is the Bike world</Typography> 
        </Box>
    </Box>
 
    </>
  )
}

export default Content
