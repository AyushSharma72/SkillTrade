export default async function GetRequestData(rid) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/request//GetSingleUserRequest/${rid}`
    );

    if (response.status === 200) {
      const info = await response.json();
      return info;
    } else {
      return info;
    }
  } catch (error) {
    return {
      success: false,
      message: "Error try again",
    };
  }
}
