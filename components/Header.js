import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Header = () => {
  const [userData, setUserData] = useState();
  const router = useRouter()
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")));
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    setUserData()
    
    toast.success('Logout Successfully');
    router.push('/')
    // window.location.reload();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box>
          <TwoWheelerIcon fontSize="large" />
        </Box>
        <Box fontSize="36px" fontFamily='Inter' sx={{textShadow:"3px 3px 3px #808080"}}>Bike Web APP</Box>
        <Box>
          {userData ? (
             <Link href="/">
            <Button variant="contained" onClick={logoutHandler}>
              Logout
            </Button>
            </Link>
          ) : (
            <Link href="/login">
            <Button variant="contained">LOGIN</Button>
          </Link>
          )}
       
        </Box>
      </Box>
    </>
  );
};

export default Header;
