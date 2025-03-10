import { Button } from "../components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () => import("./_components/homepageanimation"),
  { ssr: false }
);

const Footer = dynamic(() => import("./_components/Footer"), { ssr: false });

export default function Home() {
  return (
    <div>
      {/* hero section  */}

      <div
        className="flex items-center flex-col sm:h-[400px] h-[550px] justify-center
       bg-[url('/hero_backGround.webp')] bg-cover bg-center bg-no-repeat 
       gap-7 sm:gap-5 p-3 sm:mt-0 mt-[70px]"
      >
        <h1 className="text-5xl sm:text-6xl font-bold font-sans text-white text-center">
          Your Trusted Partner for Home Services
        </h1>

        <p className="text-[#d1d1d1] text-xl sm:text-2xl leading-[32px] tracking-normal text-center">
          Book reliable electricians, plumbers, carpenters, and more with just a
          few clicks!
        </p>
        <div className="flex gap-2  flex-col sm:flex-row">
          <Button className="bg-white text-black hover:bg-gray-300 font-bold">
            <Link href="user/create_request"> Book A Service Now</Link>
          </Button>
        </div>
      </div>

      {/* Worker section  */}
      <div className="flex flex-col mt-10">
        <p className=" text-3xl sm:text-5xl text-center textshadow font-bold">
          Showcase Your Skills And Find Opportunities
        </p>

        <div className="flex flex-col md:flex-row justify-around items-center mt-10 px-5">
          {/* Lottie Animation Section */}

          <div className="md:w-[45%] xl:w-1/2">
            <LottieAnimation />
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left md:w-[50%] xl:w-1/2 space-y-5 p-2">
            <p className="text-2xl mt-2 sm:mt-0 sm:text-3xl font-bold">
              Are you a skilled professional looking to expand your reach?
            </p>

            <ul className="list-disc list-inside space-y-3 text-left text-gray-700 text-lg ">
              <li>
                Showcase your skills and find opportunities with people who need
                your services.
              </li>
              <li>
                Communicate directly, review their work, and collaborate
                seamlessly.
              </li>
              <li>
                Build your reputation and expand your professional network.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* User section */}

      <div className="flex flex-col mt-20">
        <p className=" text-3xl sm:text-5xl text-center textshadow font-bold">
          Find the Right Expertise for Your Needs
        </p>

        <div className="flex flex-col md:flex-row justify-around items-center mt-10 px-5">
          {/* Lottie Animation Section */}
          {/* Text Section */}
          <div className="text-center md:text-left md:w-[55%] xl:w-1/2 space-y-5 p-2"></div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
