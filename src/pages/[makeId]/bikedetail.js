/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Stack, Typography,Paper, Rating, Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Link from "next/link";
import Reviews from "../../../components/Reviews";
import { toast } from "react-toastify";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const bikedetail = () => {
  const router = useRouter();
  const [makeid, setmakeid] = useState();
  const [bikedata, setbikedata] = useState();
  useEffect(() => {
    setmakeid(Number(router.query.makeId));
  }, []);

  const getBikeDetail = async () => {
    
    if (makeid) {
      try {
        const { data } = await axios.post(`${baseUrl}/bike/search`, {
          makeId: makeid,
        });
        setbikedata(data);
        
      } catch (error) {
        toast.error(error.response.data.message || error.response.data);
      }
    }
  };
  useEffect(() => {
    getBikeDetail();
  }, [makeid]);
  return (
    <>
      {bikedata && (
        <Box
          sx={{
            width: "80%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography sx={{ textAlign: "center", fontSize: "3rem" }}>
              {bikedata?.name}
            </Typography>
          </Box>
          <Box
            sx={{
              margin: "1rem 0",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Box>
              <img
                src={bikedata.pic}
                alt="image"
                width={700}
                height={500}
                style={{ borderRadius: "20px" }}
              />
            </Box>
            <Box sx={{fontWeight:500}}>
              <Stack spacing={2}>
                <Item>Name : {bikedata?.name}</Item>
                <Item>Type : {bikedata?.type}</Item>
                <Item>Year : {bikedata?.year}</Item>
                <Item>Brand : {bikedata?.brand}</Item>
                <Item>Model : {bikedata?.model}</Item>
                <Item>Description : {bikedata?.review}</Item>
                <Item>Make Id : {bikedata?.makeId}</Item>
                <Item><Typography>Rating :</Typography> <Rating name="half-rating-read" defaultValue={bikedata?.rating} precision={0.5} readOnly /></Item>
              </Stack>
              {/* <Box sx={{marginTop:"0.5rem",textAlign:"center"}}>

              
              </Box> */}
            </Box>
          </Box>
          <Reviews/>
          <Box sx={{textAlign:"center"}}>
          <Link href="/"><Button variant="contained" sx={{width:"10%"}}>Back</Button></Link>
          </Box>
        </Box>
      )}
    </>
  );
};

export default bikedetail;
