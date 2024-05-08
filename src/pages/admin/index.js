/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BikeComponent from "../../../components/BikeComponent";
import { toast } from "react-toastify";

const baseUrl = process.env.BACKEND_URL;
const index = () => {
  const [bikedata, setbikedata] = useState();
  const [ratedbike, setratedbike] = useState({});
  const [totalusercount, settotalusercount] = useState();
  const [lastusercount, setlastusercount] = useState();
  const [admin, setadmin] = useState(false);

  const bikeDetails = async () => {
    try {
      const { data } = await axios.get(`
      ${baseUrl}/bike`);
      setbikedata(data.data.length);
      const rating = data?.data?.reduce((maxRatingBike, currentBike) => {
        return currentBike.rating > maxRatingBike.rating
          ? currentBike
          : maxRatingBike;
      });
      setratedbike(rating);
    } catch (error) {
      toast.error(error.response.data.message || error.response.data);
    }
    try {
      const { data: totalUser } = await axios.get(`
      ${baseUrl}/api/count`);
      settotalusercount(totalUser.totalUser);
    } catch (error) {
      toast.error(error.response.data.message || error.response.data);
    }
    try {
      const { data: lastuser } = await axios.get(`
      ${baseUrl}/api/lastcount`);
      setlastusercount(lastuser.totalUser);
    } catch (error) {
      toast.error(error.response.data.message || error.response.data);
    }
  };

  useEffect(() => {
    setadmin(JSON.parse(localStorage.getItem("user"))?.admin);
    bikeDetails();
  }, []);

  return (
    <>
      {admin ? (
        <Box>
          <Box>
            <Typography fontSize="2.5rem" textAlign="center">
              Dashboard Analytics
            </Typography>
          </Box>
          <Box margin="2rem 1rem">
            <Typography fontSize="1rem" textAlign="center">
              Total Count of Bikes : {bikedata && bikedata}
            </Typography>
            <Typography fontSize="1rem" textAlign="center">
              Most rated bike brand name : {ratedbike?.brand}
            </Typography>
            <Typography fontSize="1rem" textAlign="center">
              Most rated bike model name : {ratedbike?.model}
            </Typography>
            <Typography fontSize="1rem" textAlign="center">
              Total User Count : {totalusercount && totalusercount}
            </Typography>
            <Typography fontSize="1rem" textAlign="center">
              New User Count ( in last 24 hour) :{" "}
              {lastusercount && lastusercount}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Link href='/user'><Button variant="contained" sx={{margin:"1rem 0 2rem 0"}}>go to user details page</Button></Link>
            <BikeComponent />
            <Link href="/">
              <Button variant="outlined">Back to home page</Button>
            </Link>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography>You are not accessible for this page</Typography>
        </Box>
      )}
    </>
  );
};

export default index;
