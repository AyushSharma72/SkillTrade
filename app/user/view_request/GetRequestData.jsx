export default async function GetRequestData(id, pageNumber) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetUserRequest/${id}/${pageNumber}`
    );

    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error try again",
    };
  }
}
