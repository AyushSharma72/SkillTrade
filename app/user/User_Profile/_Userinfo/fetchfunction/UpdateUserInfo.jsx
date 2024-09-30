export async function UpdateUserInfo(uid, formData) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/UpdateUserInfo/${uid}`,
      {
        method: "POST",

        body: formData,
      }
    );

    const data = await response.json();

    if (response.status === 200) {
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
      message: "An error occurred while updating user info",
    };
  }
}
