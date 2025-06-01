function Login() {
  function handleLogin() {
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  }
  function linkAnotherAccount() {
    window.location.href = "http://localhost:3000/api/v1/auth/google/link";
  }
  async function logout() {
    const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.status == 200) {
      window.location.href = "/landing";
    }
  }
  async function deleteUser() {
    const response = await fetch("http://localhost:3000/api/v1/users/me", {
      method: "DELETE",
      credentials: "include",
    });
    if (response.status == 200) {
      window.location.href = "/landing";
    }
  }
  return (
    <div className="">
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => handleLogin()}
      >
        Signup/Signin
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => linkAnotherAccount()}
      >
        Add Account +
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => logout()}
      >
        Logout
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => deleteUser()}
      >
        Delete User
      </button>
    </div>
  );
}

export default Login;
