function Login() {
  function handleLogin() {
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  }
  function linkAnotherAccount() {
    window.location.href = "http://localhost:3000/api/v1/auth/google/link";
  }
  return (
    <div className="">
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => handleLogin()}
      >
        Login
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => linkAnotherAccount()}
      >
        Add Account +
      </button>
    </div>
  );
}

export default Login;
