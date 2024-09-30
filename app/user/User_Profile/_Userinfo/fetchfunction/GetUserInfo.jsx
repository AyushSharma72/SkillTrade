export async function GetUserInfo(uid) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/Userinfo/${uid}`
    );
    if (response.status === 200) {
      const data = await response.json();
      return {
        data,
      };
    } else {
      return {
        data,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "error try again",
    };
  }
}
