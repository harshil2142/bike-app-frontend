import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { Alert, Box, Button, Input, Rating } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


const Reviews = () => {
  const router = useRouter();
  const makeId = router.query.makeId;
  //   const [error, seterror] = useState()
  const [reviews, setreviews] = useState([]);
  const [newreview, setnewreview] = useState(false);
  const [state, setstate] = useState();
  const [value, setValue] = useState();
  function humanizeDate(date_str) {
    let date_arr;
    const month = [
      "January",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    date_arr = date_str.split("-");

    return (
      month[Number(date_arr[1]) - 1] +
      " " +
      Number(date_arr[2]) +
      ", " +
      date_arr[0]
    );
  }
  const fetchReviews = async () => {
    try {
      const { data } = await axios.post(`${baseUrl}/review/filter`, {
        makeId,
      });
      setreviews(data);
    } catch (error) {
      toast.error(error.response.data.message || error.response.data);
    }
  };
  React.useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <>
      <Box margin="30px 10px" sx={{ display: "flex", flexWrap: "wrap" ,justifyContent:"space-evenly"}}>
        {reviews.length > 0 ? (
          reviews?.map((item) => (
            <Card
              key={item._id}
              sx={{
                maxWidth: 345,
                minWidth: 300,
                fontWeight: 500,
                margin: "1rem",
                border: "1px solid #D3D3D3",
                boxShadow: "5",
                borderRadius: "15px",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {item.userId.name.charAt(0)}
                  </Avatar>
                }
                title={item.userId.name}
                subheader={humanizeDate(item.updatedAt.slice(0, 10))}
              />

              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={460}
                >
                  {item.review}
                </Typography>
                <Box display="flex" margin="1rem 0 0.2rem 0.5rem">
                  <Typography>Rating :</Typography>

                  <Rating name="read-only" value={item.rating} precision={0.5} readOnly />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box>
            <Typography>No Reviews for this bike</Typography>
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-evenly"
        margin="1rem 0 2.5rem 0"
      >
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              const userDetails = localStorage.getItem("user");
              if (!userDetails) {
                // alert("you need to sign in first");
                toast(' you need to sign in first!', {
                  position: "top-right",
                  autoClose: 5000,
                  closeOnClick: true,
                  pauseOnHover: true,
                  type:"error"
                  });
              } else {
                setnewreview(true);
              }
            }}
          >
            Add Your Review
          </Button>
        </Box>
        <Box>
          {newreview && (
            <Box>
              <Box display={"flex"}>
                <Typography fontSize="1.3rem" fontWeight={300} margin=" 0 1rem">
                  Enter Your Review :
                </Typography>
                <Input
                  variant="outline"
                  placeholder="enter your review"
                  onChange={(e) => setstate(e.target.value)}
                />
              </Box>
              <Box display={"flex"} margin="1rem 0 0 0">
                <Typography fontSize="1.3rem" fontWeight={300} margin=" 0 1rem">
                  Enter Your Ratings :
                </Typography>
                {/* <Input
                  variant="outline"
                  placeholder="enter your ratings"
                  //   onChange={(e) => setPassword(e.target.value)}
                /> */}
                <Rating
                  name="simple-controlled"
                  value={value}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setValue(newValue);
                  }}
                />
              </Box>
              <Box textAlign="center" marginTop="1rem">
                <Button
                  variant="contained"
                  onClick={async () => {
                    const reviewdata = {
                      makeId: makeId,
                      review: state,
                      rating: value,
                      userEmail: JSON.parse(localStorage.getItem("user"))
                        ?.email,
                      userId: JSON.parse(localStorage.getItem("user"))?._id,
                    };

                    const { data } = await axios.post(
                      `${baseUrl}/review/add`,
                      reviewdata,
                      {
                        headers: {
                          Authorization: `Bearer ${
                            JSON.parse(localStorage.getItem("user"))?.token
                          }`,
                        },
                      }
                    );
                    if (data?.error) {
                        toast.error(data?.error);
                        setnewreview(false)
                        setValue(0)
                    }else{
                        setnewreview(false)
                        fetchReviews();
                        setValue(0)
                        toast.success("Review added successfully")
                    }
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Reviews;
