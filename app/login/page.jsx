"use client";
import React from "react";
import LoginForm from "../_components/login/Loginform.jsx";
import dynamic from "next/dynamic";
const CheckLogin = dynamic(
  () => import("../_components/privateroutes/CheckLogin"),
  {
    ssr: false,
  }
);

const Login = () => {
  return <LoginForm />;
};

export default CheckLogin(Login);
