import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      
      setUser(response.data.user);

      alert(response.data.message);

     
      navigate("/chat");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center px-6">

    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">

      <div className="flex flex-col items-center mb-8">

        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-4xl text-white shadow-lg">
          💬
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mt-4">
          Welcome Back
        </h1>

        <p className="text-slate-500 mt-2">
          Login to continue chatting
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>

          <label className="block text-slate-700 font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="john@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-2">
              {errors.email}
            </p>
          )}

        </div>

        <div>

          <label className="block text-slate-700 font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-2">
              {errors.password}
            </p>
          )}

        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-emerald-300"
        >
          Login
        </button>

      </form>

      <p className="text-center text-slate-500 mt-8">

        Don't have an account?

        <Link
          to="/register"
          className="ml-2 text-emerald-600 font-semibold hover:underline"
        >
          Register
        </Link>

      </p>

    </div>

  </div>
);
}

export default Login;