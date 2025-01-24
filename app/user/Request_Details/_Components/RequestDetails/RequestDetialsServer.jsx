import RequestDetails from "./RequestDetails";

async function GetData(rid) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetSingleUserRequest/${rid}`,
      { cache: "no-store" }
    );
    const info = await response.json();
    if (info.success) {
      return info.requestdetails;
    }
    throw new Error("Failed to fetch request details.");
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function RequestDetailsServer({ params }) {
  const { rid } = params;
  if (!rid) {
    return <p>Error: Request ID is missing.</p>;
  }

  const data = await GetData(rid);

  return (
    <>
      {data ? (
        <RequestDetails
          initialData={data}
          loadingstate={false}
          imgurl={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
        />
      ) : (
        <p>Failed to load request details.</p>
      )}
    </>
  );
}
