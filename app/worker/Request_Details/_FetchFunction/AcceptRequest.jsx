export async function AcceptRequestFetchFunction(
  wid,
  rid,
  EstimatedPrice,
  description,
  date
) {
  console.log(date);
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/workers/AcceptRequest/${wid}/${rid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EstimatedPrice,
          description,
          date,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      message: "Error try again",
    };
  }
}
