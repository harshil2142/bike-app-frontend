/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Input,
  Rating,
  Typography
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Link from "next/link";
import { toast } from "react-toastify";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border:"1px solid black",
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

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const baseUrl = process.env.BACKEND_URL;

const BikeDetail = () => {
  const [bikedata, setbikedata] = useState([]);
  const [state, setstate] = useState(4);
  const [filter, setfilter] = useState("");
  const [brandName, setbrandName] = useState("");
  const [bodyName, setbodyName] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [admin, setadmin] = useState(false);
  const router = useRouter();
console.log(baseUrl,"baseUrl");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {

      const user = localStorage.getItem('user')
      // console.log(JSON.parse(user));
      setUserInfo(JSON.parse(user))
      setadmin(true)
    }
    bikeDetails();
  }, [])

  const bikeDetails = async () => {
  try {
    const { data } = await axios.get(`
    ${baseUrl}/bike`);
    setbikedata(data.data);
  } catch (error) {
    toast.error(error.response.data.message || error.response.data);
  }
  };



  const filterBikes = async () => {

    if (filter === "brand") {
    try {
      const { data } = await axios.post(`
      ${baseUrl}/bike/filter`, {
          brand: brandName
        });
        if(data){
          setbikedata(data)
        }
        else{
          toast("no found")
        }
    } catch (error) {
      toast.error(error.response.data || error.response.data.message);
    }
    } else {
      try {     
        const { data } = await axios.post(`
        ${baseUrl}/bike/filter`, {
          bodyType: bodyName
        });
        setbikedata(data)
      } catch (error) {
        toast.error(error.response.data || error.response.data.message);
      }
    }

  }
  return (
    <>
     {userInfo && (JSON.parse(localStorage.getItem('user')))?.admin  && <Box sx={{ width: "100%", margin: "1rem auto 2rem auto", textAlign: "center" }}>
        <Link href='/admin'><Button variant="contained" onClick={()=>{router.push('/admin')}}>Go to Admin Dashboard</Button></Link>
      </Box>}
      <Box sx={{ width: "90%", margin: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box>
            <Typography sx={{ fontSize: "2rem" }}> All Bike Details</Typography>
          </Box>
          <Box>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search… Bike "
                onChange={async (e) => {
                  const result = e.target.value
                  try {
                    const { data } = await axios.post(`
                    ${baseUrl}/bike/search?search=${result}`);
                    setbikedata(data)      
                  } catch (error) {
                    toast.error(error.response.data.message || error.response.data);
                  }
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
          <Box>

            <Button
              id="demo-customized-button"
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Filter By
            </Button>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} onMouseUp={() => { setfilter("brand") }} disableRipple>
                Brand
              </MenuItem>
              <MenuItem onClick={handleClose} onMouseUp={() => { setfilter("body") }} disableRipple>
                Body
              </MenuItem>

            </StyledMenu>
            {filter === "brand" && <Input type="text" value={brandName} onChange={(e) => { setbrandName(e.target.value) }} placeholder="enter brand name" sx={{ margin: " 0 0.6rem" }} />}
            {filter === "body" && <Input type="text" value={bodyName} onChange={(e) => { setbodyName(e.target.value) }} placeholder="enter type of bike" sx={{ margin: "0 0.6rem" }} />}

            <Button sx={{ marginLeft: "0.6rem" }} variant="outlined" onClick={filterBikes}>Filter </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" ,justifyContent:"space-evenly"}}>
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
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        router.push(`${item.makeId}/bikedetail`);
                      }}
                    >
                      More Details
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

export default BikeDetail;
