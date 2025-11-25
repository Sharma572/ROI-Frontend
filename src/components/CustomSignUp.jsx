import React, { useState } from "react";

export default function CustomSignup() {
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 🔹 STEP 1: Create user in Auth0
   const signupResponse = await fetch(
  "https://dev-qym8p8oypn0lsq3v.uk.auth0.com/dbconnections/signup",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: "XmLyglgU5GXeSeq9EFhbgrkmNHGG4SeW",
      email: form.email,
      password: form.password,
      connection: "Username-Password-Authentication",
      user_metadata: {
        fullName: form.fullName,
        company: form.company,
        mobile: form.mobile,
      },
    }),
  }
);


      const signupData = await signupResponse.json();

      if (signupData.error) {
        setMessage(`❌ ${signupData.description}`);
        setLoading(false);
        return;
      }

      // 🔹 STEP 2: Automatically log in the new user
     const loginResponse = await fetch(
  "https://dev-qym8p8oypn0lsq3v.uk.auth0.com/oauth/token",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "password",
      username: form.email,
      password: form.password,
      audience: "https://dev-qym8p8oypn0lsq3v.uk.auth0.com/api/v2/",
      scope: "openid profile email",
      client_id: "XmLyglgU5GXeSeq9EFhbgrkmNHGG4SeW",
    }),
  }
);


      const loginData = await loginResponse.json();

      if (loginData.error) {
        setMessage(`⚠️ Login failed: ${loginData.error_description}`);
      } else {
        localStorage.setItem("auth_token", loginData.access_token);
        setMessage("✅ Signup successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <form
        onSubmit={handleSignup}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[600px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Create Your ROI Account
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="company"
            placeholder="Company Name"
            onChange={handleChange}
            required
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            onChange={handleChange}
            required
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 rounded-lg hover:scale-[1.02] transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {message && (
          <p className="text-center mt-4 text-white text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}
