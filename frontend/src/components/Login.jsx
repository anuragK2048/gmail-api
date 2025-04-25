const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPE = import.meta.env.VITE_SCOPE;

function Login() {
  console.log(CLIENT_ID);
  function handleLogin() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
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
