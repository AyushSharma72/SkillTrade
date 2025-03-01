const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const WorkerModal = require("../modals/WorkerModal");
const UserModal = require("../modals/UserModal");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");

async function RegisterUser(req, resp) {
  try {
    const { Name, MobileNo, Email, Password, Address, Pincode } = req.body;

    if (!Name || !MobileNo || !Email || !Password || !Address) {
      return resp.status(400).send({
        success: false,
        error: "All fields are required",
      });
    }
    const userEmailExists = await UserModal.findOne({ Email });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });

    if (userEmailExists) {
      return resp.status(409).send({
        success: false,
        message: "User already exists, please login",
      });
    }
    if (userMobileExists || WorkerMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newuser = new UserModal({
      Name,
      MobileNo,
      Email,
      Password: hashedPassword,
      Address,
      Pincode,
    });
    await newuser.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function UserLogin(req, resp) {
  try {
    const { MobileNo, Password } = req.body;
    if (!MobileNo || !Password) {
      return resp.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModal.findOne({ MobileNo }).select(
      "-Password -image"
    );
    const worker = await WorkerModal.findOne({ MobileNo }).select(
      "-Password -image"
    );

    if (!user && !worker) {
      return resp.status(401).send({
        success: false,
        message: "No such user found",
      });
    }
    let hashedPassword;
    if (user) {
      hashedPassword = await UserModal.findOne({ MobileNo }).select("Password");
    } else {
      hashedPassword = await WorkerModal.findOne({ MobileNo }).select(
        "Password"
      );
    }
    const matchpassword = await bcrypt.compare(
      Password,
      hashedPassword.Password
    );

    if (!matchpassword) {
      return resp.status(210).send({
        success: false,
        message: "Invalid number or password",
      });
    }
    let token;

    if (user) {
      token = JWT.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        user,
      });
    } else {
      token = JWT.sign({ _id: worker._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        worker,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "server error",
    });
  }
}

async function GetUserInfo(req, resp) {
  try {
    const { uid } = req.params;
    const user = await UserModal.findById(uid).select("-image");
    if (user) {
      return resp.status(200).send({
        success: true,
        user,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "error",
    });
  }
}

async function UpdateUserInfo(req, resp) {
  const { uid } = req.params;

  const user = await UserModal.findById(uid);
  if (!user) {
    return resp.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  const { fields, files } = req;

  // console.log("All fields:", fields);

  const updatedData = {
    Name: fields.Name || user.Name,
    MobileNo: fields.MobileNo || user.MobileNo,
    Address: fields.Address || user.Address,
    Pincode: fields.Pincode || user.Pincode,
  };

  const updatedUser = await UserModal.findByIdAndUpdate(uid, updatedData, {
    new: true,
  });

  const image = files.image;

  if (image) {
    try {
      // Read image data and attach it to the user's record
      updatedUser.image = {
        data: await fs.readFile(image.filepath || image.path),
        contentType: image.mimetype || image.type,
      };
    } catch (error) {
      return resp.status(400).send({
        success: false,
        message: "Image processing failed",
      });
    }
  } else {
    console.log("No image exists");
  }

  await updatedUser.save();

  return resp.status(200).send({
    success: true,
    message: "User updated successfully",
    updateduser: updatedUser,
  });
}

async function GetUserImage(req, resp) {
  try {
    const user = await UserModal.findById(req.params.uid).select("image");

    if (!user || !user.image || !user.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", user.image.contentType);
    return resp.status(200).send(user.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

async function UserPassword(req, resp) {
  try {
    const { uid } = req.params;

    const user = await UserModal.findById(uid);
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "No such user found",
      });
    } else {
      if (!req.body.passwords.oldpassword || !req.body.passwords.newpass) {
        return resp.status(400).send({
          message: "All fields are required",
        });
      }
      // console.log(req.body.passwords.newpassword);
      // check the old password is correct or not
      const verify = await bcrypt.compare(
        req.body.passwords.oldpassword,
        user.Password
      );
      if (verify) {
        //if yes then update the pass with the new password
        const newpassword = await bcrypt.hash(req.body.passwords.newpass, 10);
        user.Password = newpassword;
        user.save();
        return resp.status(200).send({
          success: true,
          message: "password was changed",
        });
      } else {
        return resp.status(400).send({
          success: false,
          message: "incorrect password",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function SendOtp(req, resp) {
  const { GeneratedOtp, email } = req.body;

  try {
    if (!GeneratedOtp || !email) {
      return resp.status(400).send({
        success: false,
        message: "OTP and Email are required",
      });
    }

    const user = await UserModal.findOne({ Email: email });
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = GeneratedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (!process.env.email_id || !process.env.pass_key) {
      return resp.status(500).send({
        success: false,
        message: "Email configuration missing on the server",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email_id,
        pass: process.env.pass_key,
      },
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
        <img src="https://yourdomain.com/path-to-your-image/skill-trade-logo.png" alt="Skill Trade Logo" style="width: 250px; margin-bottom: 10px; background-color: black;">

          <h1 style="color: #333;">Your Otp To Reset Password</h1>
          <p style="font-size: 18px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the OTP below to proceed:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${GeneratedOtp}</p>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Skill Trade. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.email_id,
      to: email,
      subject: "Reset Password - Skill Trade",
      html: emailTemplate, // No need for attachments, the image is now linked
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).send({
          success: false,
          message: "Error sending email. Please try again later.",
        });
      } else {
        console.log("Email sent:", info.response);
        return resp.status(200).send({
          success: true,
          message: "OTP sent successfully to the provided email",
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    resp.status(500).send({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function VerifyOtp(req, resp) {
  try {
    const { email, otp, foremail = false } = req.body;

    if (!email || !otp) {
      return resp.status(400).send({
        success: false,
        message: "Email or otp not received",
      });
    }

    const user = await UserModal.findOne({ Email: email });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return resp.status(400).send({
        success: false,
        message: "Incorrect otp. Please try again.",
      });
    }

    if (new Date() > user.otpExpiry) {
      return resp.status(400).send({
        success: false,
        message: "otp has expired. Please request a new one.",
      });
    }
    if (foremail) {
      user.email_verified = true;
      await user.save();
    }
    return resp.status(200).send({
      success: true,
      message: "Verification successfull",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function ResetPassword(req, resp) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(email);
    if (newPassword !== confirmPassword) {
      return resp.status(400).send({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await UserModal.findOne({ Email: email });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.Password = hashedPassword;
    await user.save();

    return resp.status(200).send({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "internal Server error",
    });
  }
}

async function SubmitForReview(req, resp) {
  try {
    const { rid } = req.params;
    const report = await ReportModal.findOne({ requestId: rid });
    const request = await RequestModal.findById(rid);

    if (!report) {
      return resp.status(404).send({
        success: false,
        message: "Report not found ",
      });
    }
    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found ",
      });
    }
    request.ReportedInfo.Review = true;
    report.ReviewRequested = true;
    await report.save();
    await request.save();
    resp.status(200).send({
      success: true,
      message: "requested review",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function SendEmailVerificationOtp(req, resp) {
  const { GeneratedOtp, email } = req.body;

  try {
    if (!GeneratedOtp || !email) {
      return resp.status(400).send({
        success: false,
        message: "OTP and Email are required",
      });
    }

    const user = await UserModal.findOne({ Email: email });
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = GeneratedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (!process.env.email_id || !process.env.pass_key) {
      return resp.status(500).send({
        success: false,
        message: "Email configuration missing on the server",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email_id,
        pass: process.env.pass_key,
      },
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
        <img src="https://yourdomain.com/path-to-your-image/skill-trade-logo.png" alt="Skill Trade Logo" style="width: 250px; margin-bottom: 10px; background-color: black;">

          <h1 style="color: #333;">Your Otp To Verify Email</h1>
          <p style="font-size: 18px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">We received a request to verify your email. Use the OTP below to proceed:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${GeneratedOtp}</p>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn't request a email verification, you can safely ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Skill Trade. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.email_id,
      to: email,
      subject: "Reset Password - Skill Trade",
      html: emailTemplate, // No need for attachments, the image is now linked
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).send({
          success: false,
          message: "Error sending email. Please try again later.",
        });
      } else {
        console.log("Email sent:", info.response);
        return resp.status(200).send({
          success: true,
          message: "OTP sent successfully to the provided email",
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    resp.status(500).send({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function ListWorkers(req, resp) {
  try {
    const { ServiceType, Coordinates, Pincode } = req.body;
    let { page } = req.params;
    let query = {};
    const limit = 5;

    page = parseInt(page) || 1;

    if (ServiceType) {
      query.ServiceType = ServiceType;
    }

    let Workers = [];
    let totalWorkers = 0;
    const maxDistanceInMeters = 10000;

    // Search by coordinates
    if (
      Coordinates &&
      Coordinates.coordinates &&
      Coordinates.coordinates.length === 2
    ) {
      const [lon, lat] = Coordinates.coordinates;

      if (!isNaN(lat) && !isNaN(lon)) {
        console.log("Searching by coordinates:", lat, lon);

        const geoResults = await WorkerModal.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [lon, lat],
              },
              distanceField: "distance",
              maxDistance: maxDistanceInMeters,
              spherical: true,
              query: {
                "coordinates.coordinates": { $exists: true, $ne: null },
                "Banned.ban": { $ne: true }, // Exclude banned workers
                ...query,
              },
            },
          },
          {
            $sort: { overAllSentimentScore: -1, OverallRaitngs: -1 },
          },
          {
            $project: { password: 0 },
          },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ]);

        totalWorkers = await WorkerModal.countDocuments(query);
        Workers = geoResults;
      }
    }

    // If no workers found by coordinates, search by Pincode
    if (!Workers.length && Pincode) {
      console.log("Searching by Pincode:", Pincode);

      query.pincode = Pincode;

      totalWorkers = await WorkerModal.countDocuments(query);
      Workers = await WorkerModal.find(query)
        .select(
          "Name MobileNo ServiceType coordinates city OverallRaitngs Reviews SubSerives"
        )
        .sort({ overAllSentimentScore: -1, OverallRaitngs: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
    }

    if (!Workers.length) {
      return resp.status(400).send({
        success: false,
        message: "No workers found. Please check Coordinates or Pincode.",
      });
    }

    return resp.status(200).send({
      success: true,
      Workers,
      totalPages: Math.ceil(totalWorkers / limit),
    });
  } catch (error) {
    console.error("Error in ListWorkers:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

// async function SendHireRequest(req, resp) {
//   try {
//     const { wid, uid } = req.params;
//     const { description, time, date, address, Coordinates } = req.body;

//     if (!description || !time || !date || !address) {
//       return resp.status(400).send({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const worker = await WorkerModal.findById(wid);
//     if (!worker) {
//       return resp.status(404).send({
//         success: false,
//         message: "Worker not found",
//       });
//     }

//     const existingRequest = worker.HireRequests.find(
//       (request) => request.user.toString() === uid
//     );

//     if (existingRequest) {
//       return resp.status(400).send({
//         success: false,
//         message: "You have already sent a hire request to this worker",
//       });
//     }
//     if (Coordinates) {
//       var [longitude, latitude] = Coordinates.coordinates;
//     }
//     const currentdate = new Date();

//     worker.HireRequests.push({
//       user: uid,
//       description,
//       visitingDate: date,
//       time,
//       address,
//       coordinates: {
//         type: "Point",
//         coordinates: [longitude, latitude],
//       },
//       Creationdate: currentdate,
//     });

//     await worker.save();

//     return resp.status(200).send({
//       success: true,
//       message: "Hire request sent successfully",
//     });
//   } catch (error) {
//     console.error("Error in SendHireRequest:", error);
//     return resp.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }

module.exports = {
  RegisterUser,
  UserLogin,
  GetUserInfo,
  UpdateUserInfo,
  GetUserImage,
  UserPassword,
  SendOtp,
  VerifyOtp,
  ResetPassword,
  SubmitForReview,
  SendEmailVerificationOtp,
  ListWorkers,
  // SendHireRequest,
};
