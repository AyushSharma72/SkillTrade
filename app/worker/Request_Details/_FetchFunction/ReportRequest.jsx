export async function ReportRequest(wid, rid, IssueType, description) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/workers/report/${wid}/${rid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IssueType,
          description,
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
