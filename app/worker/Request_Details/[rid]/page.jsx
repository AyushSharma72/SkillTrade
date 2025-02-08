import RequestDetailsClient from "./RequestDetailsClient";

export default async function RequestDetailsServer({ params }) {
  const { rid } = params;
  let data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`,
      {
        next: { revalidate: 100 }, // ISR: Page revalidates every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch worker data: ${response.status} ${response.statusText}`
      );
    }

    data = await response.json();
  } catch (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Error: Unable to fetch data. Please try again later.
      </div>
    );
  }

  return (
    <RequestDetailsClient
      IntialRequestData={data.requestdetails}
      loadingstate={false}
      requestimage={`${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/request/GetRequestPhotoController/${rid}`}
    />
  );
}
