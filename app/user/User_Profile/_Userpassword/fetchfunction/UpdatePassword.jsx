export async function UpdatePassword(uid, passwords) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/UserPassword/${uid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwords }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating password",
    };
  }
}
