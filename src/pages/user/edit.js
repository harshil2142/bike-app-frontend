/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const baseUrl = process.env.BACKEND_URL;
const edit = () => {
  const [token, settoken] = useState("");
  const [userdetail, setuserdetail] = useState({});
  const [initialValues, setinitialValues] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    admin: "",
    active: "",
  });
  const router = useRouter();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    settoken(data.token);
    const bikedata = JSON.parse(localStorage.getItem("editUser"));
    setuserdetail(bikedata);
  }, []);

  useEffect(() => {
    setinitialValues({
      name: userdetail ? userdetail?.name : "",
      email: userdetail ? userdetail?.email : "",
      oldPassword: "",
      newPassword: "",
      admin: userdetail ? JSON.stringify(userdetail?.admin) : "",
      active: userdetail ? JSON.stringify(userdetail?.active) : "",
    });
  }, [userdetail]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    oldPassword: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    admin: Yup.string().required("Required"),
    active: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    // Handle the form submission here, e.g., send the payload to the server
    let payload;
    console.log("Form data:", values);
    if(values.active == "false"){
      payload = {...values , active : false}
    }else{
      payload = {...values , active : true}
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/edit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        localStorage.removeItem("editUser");
        toast.success("user detail update successfully");
        router.push("/user");
      }
    } catch (error) {
      toast.error(error.response.data.message || error.response.data);
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
            Edit User Detail
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
          label="Email"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Old Password"
          name="oldPassword"
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
          }
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="New Password"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Admin"
          name="admin"
          disabled
          value={formik.values.admin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin && Boolean(formik.errors.admin)}
          helperText={formik.touched.admin && formik.errors.admin}
        />
        <TextField
          sx={{ margin: "1rem" }}
          label="Active"
          name="active"
          value={formik.values.active}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.active && Boolean(formik.errors.active)}
          helperText={formik.touched.active && formik.errors.active}
          select
          disabled={initialValues.admin ==="true" ? true : false}
          SelectProps={{ native: true }}
        >
          <option value='' disabled></option>
          <option value="true">True</option>
          <option value="false">False</option>
        </TextField>

        <Button
          sx={{ width: "6rem" }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Edit
        </Button>
      </form>
      <Box>
        <Link href="/user">
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.removeItem("editUser");
            }}
          >
            Back
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default edit;
