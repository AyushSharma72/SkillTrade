import React from "react";
import WorkerProfileClient from "../WorkerProfileClient";

export default async function WorkerProfile({ params }) {
  const { wid } = params;
  let data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/workers/GetWorkerData/${wid}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch worker data: ${response.status} ${response.message}`
      );
    }

    data = await response.json();
  } catch (error) {
    console.error("Error fetching worker data:", error);

    return (
      <div className="flex flex-col items-center bg-gray-200">
        <p className="text-red-500">
          Failed to load worker data. Please try again later.
        </p>
      </div>
    );
  }

  return <WorkerProfileClient IntialWorkerData={data.worker} />;
}
