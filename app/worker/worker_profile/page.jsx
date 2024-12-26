import React from "react";
import Image from "next/image";
import demouserimage from "../../assests/demouserimage.jpg";
const WorkerProfile = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-semibold text-3xl mt-2"> WorkerProfile</p>
      <div className="flex justify-center gap-20 items-center mt-5">
        {/* left div  */}
        <div className="flex flex-col justify-between  h-[550px]">
          {/* image */}
          <div className="w-[400px] bg-gray-400 flex flex-col justify-center items-center p-3  gap-2 rounded-lg">
            <Image
              src={demouserimage}
              alt="Sample"
              width={200}
              height={200}
              className="rounded-[50%] shadow-md"
            />
            <p className="text-2xl font-semibold">Name</p>
            <p>Ratings</p>
          </div>

          <div className="bg-gray-400 w-[400px] h-[200px] p-3  rounded-lg">
            <p>whatsapp message</p>
            <p>call number</p>
          </div>
        </div>

        {/* right div  */}
        <div className="bg-gray-400 w-[700px] h-[550px] p-3  rounded-lg">
          <div> {/* <p>Ayush</p> */}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
