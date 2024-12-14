export async function GetRequestFilteredData(ServiceType, checkedValues, wid) {
  try {
    let queryParams = new URLSearchParams(checkedValues).toString();

    queryParams += `&ServiceType=${ServiceType}`;

    // Construct the final URL
    const response = await fetch(
      `http://localhost:8000/api/v1/request/Filterrequest/${wid}?${queryParams}`
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
      message: "Error, try again",
    };
  }
}
