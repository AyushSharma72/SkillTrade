import RequestDetails from "./RequestDetails";

export default async function RequestDetailsServer({ params }) {
  const { rid } = params;
  if (!rid) {
    return <p>Error: Request ID is missing.</p>;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetSingleUserRequest/${rid}`,
      { cache: "no-store" }
    );
    const info = await response.json();
    if (info.success) {
      return (
        <RequestDetails
          initialData={info.requestdetails}
          loadingstate={false}
          imgurl={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
        />
      );
    }
    throw new Error("Failed to fetch request details.");
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Failed to load request details.</p>;
  }
}
