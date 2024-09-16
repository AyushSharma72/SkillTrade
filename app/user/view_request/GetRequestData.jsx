export default async function GetRequestData(id, pageNumber) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetUserRequest/${id}/${pageNumber}`
    );

    if (response.status === 200) {
      const info = await response.json();
      return  info ;
    } else {
      return info ;
    }
  } catch (error) {
    return {
      success: false,
      message: "Error try again",
    };
  }
}
