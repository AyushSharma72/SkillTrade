export default async function GetRequestData(id, pageNumber) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetUserRequest/${id}/${pageNumber}`
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
