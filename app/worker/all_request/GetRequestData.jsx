export default async function GetRequestData(pageNumber) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/Allrequests/${pageNumber}`
    );

    const info = await response.json();
    if (response.ok) {
      return info;
    } else {
      return info;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error try again",
    };
  }
}
