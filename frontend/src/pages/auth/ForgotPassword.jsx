import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      // future API call here

      toast.success(
        "Password updated successfully!"
      );

    } catch (error) {

      toast.error(
        "Failed to update password."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#060A12] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

        <h1 className="text-3xl font-black mb-3">

          Reset Password

        </h1>

        <p className="text-slate-400 mb-8">

          Enter your email and new password.

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black"
          >

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>

        <p className="text-center text-sm text-slate-400 mt-6">

          Back to
          {" "}

          <Link
            to="/login"
            className="text-amber-400 font-bold"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}