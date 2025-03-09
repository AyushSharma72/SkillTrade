"use client";
import React from "react";
import dynamic from "next/dynamic";
import LoginForm from "../_components/login/Loginform.jsx";

// Dynamically import CheckLogin to prevent SSR issues
const CheckLogin = dynamic(
  () => import("../_components/privateroutes/CheckLogin"),
  { ssr: false }
);

const Login = () => {
  return <LoginForm />;
};

export default CheckLogin(Login);
