function Login() {
  function handleLogin() {
    window.location.href = "http://localhost:3000/auth/google";
  }
  return (
    <div className="">
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => handleLogin()}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
