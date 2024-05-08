import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Input,
  Rating,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Link from "next/link";
import { toast } from "react-toastify";


const baseUrl = process.env.BACKEND_URL;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const BikeComponent = () => {
  const [bikedata, setbikedata] = useState([]);
  const [state, setstate] = useState(4);
  const [token, settoken] = useState("");
  const router = useRouter();
  const bikeDetails = async () => {
    try {
      const { data } = await axios.get(`
      ${baseUrl}/bike`);
      setbikedata(data.data); 
    } catch (error) {
      toast(error.response.data.message || error.response.data, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        type:"error"
        });
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    settoken(data.token);
    bikeDetails();
  }, []);

  return (
    <>
      <Box sx={{ width: "90%", margin: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box>
            <Typography sx={{ fontSize: "2rem" }}> All Bike Details</Typography>
          </Box>
          <Box>
            <Link href={"/admin/addnewbike"}>
              <Button variant="contained">Add New Bike</Button>
            </Link>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap",justifyContent:'space-evenly' }}>
          {bikedata &&
            bikedata?.slice(0, state).map((item) => (
              <Box key={item.makeId}>
                <Card sx={{ maxWidth: 345, minWidth: 300, margin: 2 }}>
                  <CardMedia sx={{ height: 140 }} image={item.pic} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.review}
                    </Typography>
                  </CardContent>
                  <Rating
                    sx={{ marginLeft: "0.6rem" }}
                    name="half-rating-read"
                    defaultValue={item.rating}
                    precision={0.5}
                    readOnly
                  />
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* <Button
                                            size="small"
                                         
                                            onClick={() => {
                                                router.push(`${item.makeId}`);
                                            }}
                                        >
                                            More Details
                                        </Button> */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // router.push(`${item.makeId}`);
                        localStorage.setItem("bike", JSON.stringify(item));
                        router.push("/admin/addnewbike");
                      }}
                    >
                      Edit Bike Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: "#ff4747",
                        ":hover": {
                          background: "red",
                        },
                      }}
                      onClick={async () => {
                        try {                        
                          const { data } = await axios.delete(
                            `${baseUrl}/bike/delete/${item.makeId}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          setbikedata(data.data)
                          localStorage.removeItem('bike')
                        } catch (error) {
                          toast(error.response.data.message || error.response.data, {
                            position: "top-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            type:"error"
                            });
                        }
                      }}
                    >
                      Delete Bike
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
        </Box>
        {!(state >= bikedata.length) && (
          <Button variant="contained" onClick={() => setstate(state + 4)}>
            Load More
          </Button>
        )}
      </Box>
    </>
  );
};

export default BikeComponent;
