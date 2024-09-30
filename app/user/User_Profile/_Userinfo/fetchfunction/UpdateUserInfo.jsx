export async function UpdatesuerInfo(uid, formData) {
  try {
    // formData.append("Name", Name);
    // formData.append("MobileNo", MobileNo);
    // formData.append("Address", Address);
    // formData.append("Pincode", Pincode);

    const response = await fetch(
      `http://localhost:8000/api/v1/users//UpdateUserInfo/${uid}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        updateduser: data.updateduser,
      };
    } else {
      return {
        success: data.success,
        message: data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "error",
    };
  }
}
