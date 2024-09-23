export default async function UpdateRequest(date, time, address, rid) {
  try {
    const formData = new FormData();
    formData.append("date", date);
    formData.append("time", time);
    formData.append("address", address);

    const response = await fetch(
      `http://localhost:8000/api/v1/request/EditRequest/${rid}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "request updated",
      };
    } else {
      return {
        success: false,
        message: "request not found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "please try again",
    };
  }
}
