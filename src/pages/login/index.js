/* eslint-disable react-hooks/rules-of-hooks */
// import { Input, Stack, Tabs } from "@chakra-ui/react";
import { Box, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginHanler = async () => {
    if (!email || !password) {
      alert("enter email and password");
    } else {
      try {
        const { data } = await axios.post(
          `
          ${baseUrl}/api/login`,
          {
            email,
            password,
          }
        );
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("token", data.token);
          toast.success('User Login Successfully');
          router.push("/");
        }
      } catch (error) {
        toast.error(error.response.data.message || error.response.data);
      }
    }
  };
  return (
    <>
      <Box sx={{ width: "100%", margin: "auto" }}>
        <Box sx={{ fontSize: "3rem" }}>Login Form</Box>
        {/* <Stack spacing={3} width="30%"> */}
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin=" 0 1rem">
            Enter email :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin=" 0 1rem">
            Enter password :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Link href="/">
          <Button variant="contained" sx={{ marginLeft: "1rem" }}>
            Back
          </Button>
        </Link>
        {/* </Stack> */}
        <Button
          sx={{ margin: "1rem" }}
          variant="contained"
          onClick={loginHanler}
        >
          Login
        </Button>
        <Link href="/register">
          <Button
            variant="contained"
            sx={{
              background: "#D3D3D3",
              color: "black",
              ":hover": {
                background: "#D3D3D3",
              },
            }}
          >
            New User .. want to sign in?
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default index;
