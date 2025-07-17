import { useParams } from "react-router-dom";

function Login() {
  const params = useParams();
  const id = params["*"];
  console.log(id);
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
  async function unlinkGmailAccount(
    accountId = "6f0b071f-fccc-4c28-ad10-579da94ac4c5"
  ) {
    const response = await fetch(
      `http://localhost:3000/api/v1/gmail-accounts/${accountId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.status == 200) {
      window.location.href = "/inbox:primaryGmailAccount";
    }
  }
  // Assume you have a list of accounts, and each account object has an 'id'
  // const linkedAccounts = [
  //   { id: 'uuid-for-account-1', gmail_address: 'user.a@gmail.com' },
  //   { id: 'uuid-for-account-2', gmail_address: 'user.b@gmail.com' }
  // ];

  async function fetchProfileForAccount(accountId) {
    // You must have the accountId to build the URL
    if (!accountId) {
      console.error("Account ID is missing!");
      return;
    }

    try {
      // Construct the full URL for the API endpoint
      const API_URL = `http://localhost:3000/api/v1/gmail-accounts/${accountId}/profile`;

      // Make the fetch request. The browser automatically sends the session cookie.
      const response = await fetch(API_URL, {
        credentials: "include",
        method: "GET", // GET request as defined in the route
        headers: {
          "Content-Type": "application/json",
          // No need to manually add Authorization header if using session cookies
        },
      });

      if (!response.ok) {
        // Handle errors, e.g., 401 Unauthorized, 404 Not Found
        const errorData = await response.json();
        console.error(`Error fetching profile: ${errorData.message}`);
        if (errorData.reauthRequired) {
          alert("Authentication expired for this account. Please re-link it.");
          // Trigger re-auth flow
        }
        return;
      }
      const profileData = await response.json();
      console.log("Profile for", accountId, ":", profileData);
    } catch (error) {
      console.error("Network error or other issue:", error);
    }
  }
  async function syncEmailToDB(accountId) {
    // You must have the accountId to build the URL
    if (!accountId) {
      console.error("Account ID is missing!");
      return;
    }

    try {
      // Construct the full URL for the API endpoint
      const API_URL = `http://localhost:3000/api/v1/emails/${accountId}/sync`;

      // Make the fetch request. The browser automatically sends the session cookie.
      const response = await fetch(API_URL, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No need to manually add Authorization header if using session cookies
        },
      });

      if (!response.ok) {
        // Handle errors, e.g., 401 Unauthorized, 404 Not Found
        const errorData = await response.json();
        console.error(`Error fetching profile: ${errorData.message}`);
        if (errorData.reauthRequired) {
          alert("Authentication expired for this account. Please re-link it.");
          // Trigger re-auth flow
        }
        return;
      }
      const res = await response.json();
      console.log("Sync req successfull", res);
    } catch (error) {
      console.error("Network error or other issue:", error);
    }
  }
  async function getEmails(accountId) {
    // You must have the accountId to build the URL
    if (!accountId) {
      console.error("Account ID is missing!");
      return;
    }

    try {
      // Construct the full URL for the API endpoint
      const API_URL = `http://localhost:3000/api/v1/emails/emailList/${accountId}`;

      // Make the fetch request. The browser automatically sends the session cookie.
      const response = await fetch(API_URL, {
        credentials: "include",
        method: "GET",
      });

      if (!response.ok) {
        // Handle errors, e.g., 401 Unauthorized, 404 Not Found
        const errorData = await response.json();
        console.error(`Error fetching profile: ${errorData.message}`);
        return;
      }
      const emails = await response.json();
      console.log("Emails", accountId, ":", emails);
    } catch (error) {
      console.error("Network error or other issue:", error);
    }
  }
  async function getSingleEmail(emailId) {
    // You must have the accountId to build the URL
    if (!accountId) {
      console.error("Account ID is missing!");
      return;
    }

    try {
      // Construct the full URL for the API endpoint
      const API_URL = `http://localhost:3000/api/v1/emails/${emailId}`;

      // Make the fetch request. The browser automatically sends the session cookie.
      const response = await fetch(API_URL, {
        credentials: "include",
        method: "GET",
      });

      if (!response.ok) {
        // Handle errors, e.g., 401 Unauthorized, 404 Not Found
        const errorData = await response.json();
        console.error(`Error fetching profile: ${errorData.message}`);
        return;
      }
      const emails = await response.json();
      console.log("Email Details", accountId, ":", emails);
    } catch (error) {
      console.error("Network error or other issue:", error);
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
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => unlinkGmailAccount()}
      >
        Unlink Gmail Account
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => fetchProfileForAccount(id)}
      >
        Fetch Profile
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => syncEmailToDB(id)}
      >
        Sync emails to DB
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => getEmails(id)}
      >
        Get Emails
      </button>
      <button
        className="m-1 p-2 rounded-2xl bg-amber-200 text-lg"
        onClick={() => getSingleEmail("19801be4-8e7d-4c14-bb20-7eaf745357eb")}
      >
        Get Single Email
      </button>
    </div>
  );
}

export default Login;
