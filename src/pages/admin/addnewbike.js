/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Input } from "@chakra-ui/react";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from "react-toastify";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const addnewbike = () => {
  const router = useRouter();
  const [token, settoken] = useState("");
  const [bikedetail, setbikedetail] = useState({});
  const [pic, setPic] = useState();
  const [loading, setloading] = useState(false)
  const [initialValues, setinitialValues] = useState({
    name: "",
    type: "",
    year: "",
    brand: "",
    model: "",
    makeId: "",
    rating: "",
    review: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    settoken(data.token);
    const bikedata = JSON.parse(localStorage.getItem("bike"));
    setbikedetail(bikedata);
  }, []);

  const postDetails = (pics) => {
    setloading(true)
    if (pics === undefined) {
      alert("please select image");
      setloading(false);
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg" ||
      pics.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dzpj3bymr");
      fetch("https://api.cloudinary.com/v1_1/dzpj3bymr/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      alert("please select image");
      setloading(false);
      return;
    }
  };

  useEffect(() => {
    setinitialValues({
      name: bikedetail ? bikedetail?.name : "",
      type: bikedetail ? bikedetail?.type : "",
      year: bikedetail ? bikedetail?.year : "",
      brand: bikedetail ? bikedetail?.brand : "",
      model: bikedetail ? bikedetail?.model : "",
      makeId: bikedetail ? bikedetail?.makeId : "",
      rating: bikedetail ? bikedetail?.rating : "",
      review: bikedetail ? bikedetail?.review : "",
    });
  }, [bikedetail]);
  // console.log(initialValues);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    year: Yup.number()
      .typeError("Must be a number")
      .integer("Year must be an integer")
      .required("Required"),
    brand: Yup.string().required("Required"),
    model: Yup.string().required("Required"),
    makeId: Yup.number()
      .typeError("Must be a number")
      .integer("Make ID must be an integer")
      .required("Required"),
    rating: Yup.number()
      .typeError("Must be a number")
      .min(0, "Rating must be at least 0")
      .max(5, "Rating cannot exceed 5")
      .required("Required"),
    review: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    // Handle the form submission here, e.g., send the payload to the server
    // console.log("Form data:", values);
    if (bikedetail) {
      // console.log(values);
      try {
        const payload = { ...values, pic: pic };
        const { data } = await axios.put(
          `${baseUrl}/bike/edit`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data) {
          toast.success("bike detail edited successfully");
          router.push("/admin");
        }
      } catch (error) {
        toast.error(error.response.data.message || error.response.data);
      }
    } else {
      const payload = { ...values, pic: pic };
      try {
        const { data } = await axios.post(
          `${baseUrl}/bike/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data) {
          toast.success("bike detail added successfully");
          router.push("/admin");
        }
      } catch (error) {
        toast.error(error.response.data.message || error.response.data);
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 500 }}>
            {bikedetail ? "Edit Bike Detail" : "Add New Bike"}
          </Typography>
        </Box>
        <TextField
          sx={{ margin: "1rem" }}
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          type="text"
        />
        <TextField
          sx={{ margin: "1rem" }}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
          label="Type"
          name="type"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.type}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Year"
          name="year"
          value={formik.values.year}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.year && Boolean(formik.errors.year)}
          helperText={formik.touched.year && formik.errors.year}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Brand"
          name="brand"
          value={formik.values.brand}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.brand && Boolean(formik.errors.brand)}
          helperText={formik.touched.brand && formik.errors.brand}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Model"
          name="model"
          value={formik.values.model}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.model && Boolean(formik.errors.model)}
          helperText={formik.touched.model && formik.errors.model}
        />
        {bikedetail ? (
          <TextField
            sx={{ margin: "1rem" }}
            label="Make ID"
            name="makeId"
            disabled
            value={formik.values.makeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.makeId && Boolean(formik.errors.makeId)}
            helperText={formik.touched.makeId && formik.errors.makeId}
          />
        ) : (
          <TextField
            sx={{ margin: "1rem" }}
            label="Make ID"
            name="makeId"
            value={formik.values.makeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.makeId && Boolean(formik.errors.makeId)}
            helperText={formik.touched.makeId && formik.errors.makeId}
          />
        )}
        <TextField
          sx={{ margin: "1rem" }}
          label="Rating"
          name="rating"
          value={formik.values.rating}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.rating && Boolean(formik.errors.rating)}
          helperText={formik.touched.rating && formik.errors.rating}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Description"
          name="review"
          multiline
          rows={4}
          value={formik.values.review}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.review && Boolean(formik.errors.review)}
          helperText={formik.touched.review && formik.errors.review}
        />
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
        {/* {!bikedetail && <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
          
        />} */}
        <LoadingButton sx={{width:"6rem"}}  type="submit" variant="contained" loading={loading}  color="primary">
          {bikedetail ? "Edit" : "Submit"}
        </LoadingButton>
      </form>
      <Box>
        <Link href="/admin">
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.removeItem("bike");
            }}
          >
            Back
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default addnewbike;
