import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/UserAuthContent";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import moment from "moment";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const RecommadedJobs = () => {
  const [auth, SetAuth] = useAuth();
  const [jobs, SetJobs] = useState([]);
  const [error, SetError] = useState(false);

  async function fetchRecommandedForYou() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/workers/RecommandedForYou/${auth?.user?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        SetError(true);
        return;
      }
      const data = await response.json();
      if (data.success) {
        SetJobs(data.requests);
      } else {
        SetError(true);
      }
    } catch (error) {
      SetError(true);

      console.log(error);
    }
  }

  useEffect(() => {
    fetchRecommandedForYou();
  }, []);

  return (
    <div className="bg-slate-200 mt-5 p-4">
      <p className="text-center text-2xl font-semibold">Recommended for you</p>
      {error ? (
        <div className="text-red-500 text-center h-[100px] mt-10">
          There was an error loading jobs
        </div>
      ) : (
        <Swiper
          effect={"coverflow"}
          
          slidesPerView={1}
          navigation={true}
          grabCursor={true}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            modifier: 0,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 }, // Smallest screens
            480: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 1, spaceBetween: 20 }, // Tablets
            1024: { slidesPerView: 2, spaceBetween: 40 }, // Laptops
            1440: { slidesPerView: 3, spaceBetween: 40 }, // Larger screens
          }}
          className="mt-5 "
        >
          {jobs?.map((data, index) => (
            <SwiperSlide key={index} className="w-full ">
              <div className="flex flex-col items-start bg-white p-4 rounded-lg shadow-lg w-full max-w-[90%] sm::max-w-[400px]">
                <div className="font-bold">{data.service}</div>
                <Divider className="w-full mb-2" />
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Location:</span>{" "}
                  {data.location}, {data.city}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Visiting Time:</span>{" "}
                  {data.time}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Visiting Date:</span>{" "}
                  {moment(data.date || new Date()).format("MMMM Do, YYYY")}
                </p>
                <Divider className="w-full !mt-2" />
                <Link href={`Request_Details/${data._id}`}>
                  <p className="mt-2 text-blue-500 flex items-center gap-1">
                    View Details <FaChevronRight />
                  </p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default RecommadedJobs;
