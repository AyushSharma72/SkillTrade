"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from "@/app/_context/UserAuthContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ✅ MUI Imports
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// ✅ Joy UI Imports
import { Input } from "@mui/joy";

// ✅ Ant Design Imports (Using Dynamic Import)
const Typography = dynamic(() => import("antd").then((mod) => mod.Typography), {
  ssr: false,
});
const { Title } = Typography;
const Otp = dynamic(() => import("antd").then((mod) => mod.Input), {
  ssr: false,
});

// ✅ External Library Imports
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
import "react-phone-input-2/lib/style.css";

// ✅ Custom Component Imports (Using Dynamic Import for Modal)
const ModalComponent = dynamic(() => import("../Modal"), { ssr: false });
const ResetPassModal = dynamic(() => import("./ResetPassModal"), {
  ssr: false,
});

// ✅ Toaster (Prevent SSR Issues)
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

// ✅ Other Imports
import { style } from "../../_Arrays/Arrays";

const LoginForm = () => {
  const [auth, SetAuth] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [OtpGenerate, SetOtpGenerate] = useState(false);
  const [otp, setOtp] = useState("");
  const [SendingOtp, SetSendingOtp] = useState(false);
  const [GeneratedOtp, SetGeneratedOtp] = useState("");
  const [ResetPass, SetResetPass] = useState(false);
  const [VerifyOtp, SetVerifyOtp] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleResetPassClose = () => SetResetPass(false);
  const [mobileNo, setMobileNo] = useState("");

  const verifyOtp = async () => {
    const toast = (await import("react-hot-toast")).toast;
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
      SetVerifyOtp(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/VerifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("verification successfull");
        setTimeout(() => {
          SetResetPass(true);
          setOpen(false);
        }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      SetVerifyOtp(false);
    }
  };

  const onChange = (text) => {
    setOtp(text);
  };

  const sharedProps = {
    onChange,
  };

  async function HandleLogin(event) {
    event.preventDefault();
    const toast = (await import("react-hot-toast")).toast;
    setLoading(true); // Start loading

    // Create FormData from the form event
    const formData = new FormData(event.target);

    const MobileNo = formData.get("MobileNo");
    const Password = formData.get("Password");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/UserLogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            MobileNo: mobileNo,
            Password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        SetAuth({
          ...auth,
          user: data.user ? data.user : data.worker,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: data.user ? data.user : data.worker,
            token: data.token,
          })
        );
        event.target.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  }

  function generateOTP(length = 6) {
    SetGeneratedOtp(Math.floor(100000 + Math.random() * 900000).toString()); // Generates a 6-digit OTP
  }

  async function SendOtp() {
    const toast = (await import("react-hot-toast")).toast;
    try {
      SetSendingOtp(true);
      SetOtpGenerate(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/SendOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GeneratedOtp, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent successfully");
        SetOtpGenerate(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      SetSendingOtp(false);
    }
  }

  return (
    <>
      <p className="text-5xl font-bold leading-md tracking-md  text-center sm:mt-2 mt-20">
        Welcome Back
      </p>
      <div className="relative flex justify-around sm:mt-20 mt-5">
        <Toaster position="bottom-center" reverseOrder={false} />

        <div className="flex flex-col items-center md:w-[40%] sm:w-3/4 w-[90%] formshadow py-10 px-2 rounded-md h-fit gap-3">
          <p className="font-bold text-3xl tracking-wide text-gray-800">
            LOGIN
          </p>
          <form
            className="w-full flex justify-center flex-col items-center gap-y-10"
            onSubmit={HandleLogin}
          >
            <PhoneInput
              country={"in"}
              value={mobileNo}
              onChange={(value) => setMobileNo(value)}
              inputStyle={{
                width: "100%",
                height: "56px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                paddingLeft: "48px",
              }}
              buttonStyle={{
                border: "none",
                borderRadius: "4px 0 0 4px",
              }}
            />
            <div className="w-full flex flex-col gap-2  items-end">
              <TextField
                id="standard-password"
                label="Password"
                variant="outlined"
                className="w-full"
                name="Password"
                required
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <span
                className="text-right w-[132px] cursor-pointer"
                onClick={() => {
                  handleOpen();
                }}
              >
                Forgot password?
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-3">
              {" "}
              <Button
                type="submit"
                className="sm:w-1/2 w-3/4 text-xl tracking-wider"
              >
                Login
              </Button>
              <p>
                Don&#39;t have an account?{" "}
                <Link href="/register" className="text-blue-700">
                  Register
                </Link>
              </p>
            </div>
          </form>

          {/* forgot password modal  */}

          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
              className="flex flex-col gap-3 sm:w-[400px] w-[300px]"
            >
              <RxCross1
                className="absolute right-4 top-4 cursor-pointer"
                title="close"
                onClick={handleClose}
              />
              <p className="text-center text-xl">Forgot Password ?</p>
              <Input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full"
                required
              />
              <Button
                onClick={async () => {
                  const toast = (await import("react-hot-toast")).toast;
                  if (email) {
                    generateOTP();
                    if (GeneratedOtp) {
                      SendOtp();
                    }
                  } else {
                    toast.error("Enter email");
                  }
                }}
                disabled={SendingOtp}
              >
                {SendingOtp ? "Generating..." : " Generate OTP"}
              </Button>

              {OtpGenerate ? (
                <>
                  <p className="text-center text-red-600 m-0">
                    If not received generate OTP again
                  </p>
                  <Title level={5}>Enter OTP</Title>
                  <Otp.OTP
                    formatter={(str) => str.toUpperCase()}
                    {...sharedProps}
                  />
                  <Button
                    onClick={() => {
                      verifyOtp();
                    }}
                  >
                    {VerifyOtp ? "Verifying..." : "Verify"}
                  </Button>
                </>
              ) : null}
            </Box>
          </Modal>

          {/* reset password modal */}
          <ModalComponent
            handleClose={handleResetPassClose}
            open={ResetPass}
            ModalType={ResetPassModal}
            email={email}
          />
          {/* backdrop */}
          {loading && (
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
