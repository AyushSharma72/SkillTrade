import RequestDetails from "./RequestDetails";

export default async function RequestDetailsServer({ params }) {
  const { rid } = params;
  if (!rid) {
    return <p>Error: Request ID is missing.</p>;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`,
      { next: { revalidate: 100 } }
    );
    const info = await response.json();
    if (info.success) {
      return (
        <RequestDetails
          initialData={info.requestdetails}
          loadingstate={false}
          intialimage={`${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/request/GetRequestPhotoController/${rid}`}
        />
      );
    }
    throw new Error("Failed to fetch request details.");
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <p className="text-red-600  text-center text-2xl">
        Failed to load request details.
      </p>
    );
  }
}
