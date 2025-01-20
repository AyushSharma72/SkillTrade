import RequestDetailsClient from "./RequestDetailsClient"

export default async function RequestDetailsServer({params}){
  const { rid } = params;
  let data;

 try {
   const response = await fetch(
     `http://localhost:8000/api/v1/request/GetSingleUserRequest/${rid}`,
     {
       cache: "no-store", // Prevent caching
     }
   );
     if (!response.ok) {
      throw new Error(
        `Failed to fetch worker data: ${response.status} ${response.message}`
      );
    }
   
    data = await response.json();
 } catch (error) {
   return {
     success: false,
     message: "Error: Unable to fetch data. Please try again later.",
   };
 }


   return <RequestDetailsClient IntialRequestData={data.requestdetails} loadingstate={false} requestimage={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}/>;
}