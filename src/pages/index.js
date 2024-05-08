"use client";

import Header from "../../components/Header";
import { Box } from "@mui/material";
import Content from "../../components/Content";
import BikeDetail from "../../components/BikeDetail";

export default function Home() {

  return (
    <>
      <Box>
        <Header />
        <Content />
        <BikeDetail />

      </Box>
    </>
  );
}
