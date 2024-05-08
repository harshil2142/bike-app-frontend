/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, Box, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const index = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [state, setstate] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (password === confirmpassword) {
      setstate(false);
    } else {
      setstate(true);
    }
  }, [password, confirmpassword]);
  return (
    <>
      <Box>
        <Box textAlign={"center"}>
          <Typography fontSize="2.5rem" fontWeight={500}>
            Register a new user
          </Typography>
        </Box>
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin="0 1rem">
            Enter Full Name :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter full name"
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin="0 1rem">
            Enter email :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin="0 1rem">
            Enter Password :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box display={"flex"}>
          <Typography fontSize="1.3rem" fontWeight={300} margin="0 1rem">
            Enter Confirm Password :
          </Typography>
          <Input
            variant="outline"
            placeholder="enter confirmpassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
        {state && (
          <Box>
            <Typography color="red">
              Password and confirmpassword does not matches
            </Typography>
          </Box>
        )}
        <Box>
          <Link href="/login">
            <Button variant="contained" sx={{ margin: "1rem" }}>
              Back
            </Button>
          </Link>
          <Button
            variant="contained"
            sx={{ margin: "1rem" }}
            onClick={async () => {
              if (password !== confirmpassword) {
                setstate(true);
              } else {
                try {
                  const newdata = { name, email, password };
                  const { data } = await axios.post(
                    `${baseUrl}/api`,
                    newdata
                  );
                  if (data) {
                    toast.success("User Registered successfully");
                    router.push("/login");
                  }
                } catch (error) {
                  toast.error(error.response.data.message || error.response.data);
                }
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default index;
