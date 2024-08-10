"use client";
import React, { useState } from "react"; // Combined imports for hooks
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Typography, Link } from "@mui/material";
import '../auth.css';

export default function Signup() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  // Use the Firebase hook for creating a user
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  async function handleSignUp(event) {
    event.preventDefault(); // Prevent page reload on form submission

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log("User creation response:", res);

      // Check if user creation was successful
      if (res.user) {
        

        resetForm();
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        router.push('/');
       
      }
    } catch (err) {
      console.error("Error creating user:", err.message);
    }
  }

  return (
    <div className="container">

      <form className="form" onSubmit={handleSignUp}>
        <h1>Sign up</h1>

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
        <br />
        <div>

          <label htmlFor="confirm_password">Confirm Password:</label>
          <br />
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={confirmPassword} // Controlled component
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>

        {/* Error message display */}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

        <Typography>
          Already a user? Sign-in {" "}
          <Link
            onClick={() => router.push('log-in')}
            underline="hover"
            style={{ cursor: 'pointer' }}
          >
            here
          </Link>

        </Typography>
      </form>
    </div>
  );
}
