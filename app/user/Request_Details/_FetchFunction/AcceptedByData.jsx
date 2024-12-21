export async function GetAcceptedByData(uid, pageNumber) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request/GetUpdatedRequest/${uid}/${pageNumber}`
    );
    if (response) {
      const data = await response.json();
      return data;
    } else {
      return {
        message: "error try again later",
      };
    }
  } catch (error) {
    return {
      message: "error try again later",
    };
  }
}
  