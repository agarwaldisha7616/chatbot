"use client";
import React, { useState } from "react"; // Combined imports for hooks
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Typography, Link } from '@mui/material';
import '../auth.css';

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  // Use the Firebase hook for creating a user
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  async function handleLogIn(event) {
    event.preventDefault(); // Prevent page reload on form submission

    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log("Login response:", res);

      // Check if user login was successful
      if (res.user) {

        setEmail('');
        setPassword('');
        router.push('/');
       
      }
    } catch (err) {
      console.error("Error logging in:", err.message);
    }
  }

  return (
    <div className="container">

      <form className="form" onSubmit={handleLogIn}>
        <h1>Log In</h1>

        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={email} // Controlled component
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
        </div>
        <br />
        <div>

          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={password} // Controlled component
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Error message display */}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

        <Typography>
          New to website? Register {" "}
          <Link
            onClick={() => router.push('sign-up')}
            underline="hover"
            style={{ cursor: 'pointer' }}>
            here
          </Link>

        </Typography>
      </form>
    </div>
  );
}
