import React from "react";
import demouserimage from "../../../assests/demouserimage.jpg";
import Rating from "@mui/material/Rating";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Ratings = () => {
  return (
    <div className="mt-8 mb-20 w-full">
      <p className="text-xl font-bold tracking-wide  text-center">
        {" "}
        All Reviews
      </p>

      <Swiper
        effect={"coverflow"}
        centeredSlides={true}
        slidesPerView={3}
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
        initialSlide={0}
        breakpoints={{
          0: {
            slidesPerView: 1,
            initialSlide: 0,
          },
          480: {
            slidesPerView: 1,
            initialSlide: 0,
          },
          768: {
            slidesPerView: 1,
            initialSlide: 0,
          },

          1440: {
            slidesPerView: 1,
            initialSlide: 0,
          },
        }}
        className="mt-5 flex justify-center w-[90%] lg:w-3/4"
      >
        <SwiperSlide className="flex justify-center">
          {" "}
          <div className="flex flex-col items-ceter justify-start bg-white p-3 rounded-lg shadow-lg m-auto w-[90%] md:w-[600px]">
            {" "}
            <div className="flex items-center gap-2">
              <Avatar alt="Ayush" src={demouserimage} />
              <div>
                <p className="flex items-center font-semibold">Ayush Sharma</p>
                <p>user</p>
              </div>
            </div>
            <div className="mt-3">
              <Rating
                name="half-rating-read"
                defaultValue={4.5}
                precision={0.5}
                readOnly
              />
              <p>
                The rating can display any float number with the value prop. Use
                the precision prop to define the minimum increment value change
                allowed.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {moment("2024-12-22T04:33:47.127+00:00").format(
                  "MMMM Do, YYYY"
                )}
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col items-ceter justify-start bg-white p-3 rounded-lg shadow-lg w-[90%] md:w-[600px] m-auto">
            {" "}
            <div className="flex items-center gap-2">
              <Avatar alt="Ayush" src={demouserimage} />
              <div>
                <p className="flex items-center font-semibold">Ayush Sharma</p>
                <p>user</p>
              </div>
            </div>
            <div className="mt-3">
              <Rating
                name="half-rating-read"
                defaultValue={4.5}
                precision={0.5}
                readOnly
              />
              <p>
                The rating can display any float number with the value prop. Use
                the precision prop to define the minimum increment value change
                allowed.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {moment("2024-12-22T04:33:47.127+00:00").format(
                  "MMMM Do, YYYY"
                )}
              </p>
            </div>
          </div>{" "}
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Ratings;
