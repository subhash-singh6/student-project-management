import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const roles = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "mentor", label: "Mentor", icon: "🧑‍💼" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
];

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    semester: "",
    branch: "",
    expertise: "",
    organization: "",
    employeeId: "",
    department: "",
    subjects: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error("Name, email and password are required!");

    setLoading(true);
    try {
      let payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === "student") {
        if (!form.enrollmentNumber || !form.semester || !form.branch)
          return toast.error("Enrollment number, semester and branch are required!");
        payload = {
          ...payload,
          enrollmentNumber: form.enrollmentNumber,
          semester: Number(form.semester),
          branch: form.branch,
        };
      }
      if (role === "mentor") {
        if (!form.expertise || !form.organization)
          return toast.error("Expertise and organization are required!");
        payload = {
          ...payload,
          expertise: form.expertise.split(",").map((e) => e.trim()),
          organization: form.organization,
        };
      }
      if (role === "teacher") {
        if (!form.employeeId || !form.department)
          return toast.error("Employee ID and department are required!");
        payload = {
          ...payload,
          employeeId: form.employeeId,
          department: form.department,
          subjects: form.subjects.split(",").map((s) => s.trim()),
        };
      }

      await register(payload);
      const user = await login(form.email, form.password);
      toast.success(`Welcome ${user.name}! Account created successfully 🎉`);
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "mentor") navigate("/mentor/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-lg 1-8 relative z-10">
        {/* Title */}
        <div
          className="text-center mb-6 fade-in "
          style={{ paddingTop: "20px" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg,#6366f1,#22d3ee)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
              margin: "20px auto 16px",
            }}
          >
            ✨
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#f1f5f9",
              marginBottom: "25px",
            }}
          >
            Create Account
          </h1>
          {/* <p style={{ color:"#94a3b8", fontSize:14, marginTop:6 }}>SPMS mein join karo</p> */}
        </div>

        {/* Role Selector */}
        <div
          className="fade-in-2"
          style={{ marginBottom: 20, padding: "20px" }}
        >
          <label
            style={{
              fontSize: 13,
              color: "#94a3b8",
              marginBottom: 10,
              display: "block",
            }}
          >
           Who are you?
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`role-btn ${role === r.value ? "active" : ""}`}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.7 }}>
                  {r.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "20px",
          }}
        >
          {/* Common Fields */}
          <div className="fade-in-2">
            <label
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 6,
                display: "block",
              }}
            >
              Full Name
            </label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="fade-in-3">
            <label
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 6,
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="fade-in-3">
            <label
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 6,
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              margin: "2px 0",
            }}
          />

          {/* Student Fields */}
          {role === "student" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Enrollment No.
                  </label>
                  <input
                    name="enrollmentNumber"
                    placeholder="2021CSE001"
                    value={form.enrollmentNumber}
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="6"
                    min="1"
                    max="8"
                    value={form.semester}
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Branch
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="custom-input"
                >
                  <option value="">Select Your Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </>
          )}

          {/* Mentor Fields */}
          {role === "mentor" && (
            <>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Expertise{" "}
                  <span style={{ opacity: 0.6 }}>(comma separated)</span>
                </label>
                <input
                  name="expertise"
                  placeholder="React, Node.js, MongoDB"
                  value={form.expertise}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Organization
                </label>
                <input
                  name="organization"
                  placeholder="Company or College name"
                  value={form.organization}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
            </>
          )}

          {/* Teacher Fields */}
          {role === "teacher" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    placeholder="TCH2024001"
                    value={form.employeeId}
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="custom-input"
                  >
                    <option value="">Select</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Subjects{" "}
                  <span style={{ opacity: 0.6 }}>(comma se alag karo)</span>
                </label>
                <input
                  name="subjects"
                  placeholder="DBMS, Web Development, OS"
                  value={form.subjects}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
            </>
          )}

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </div>
        </form>

        <div
          style={{ textAlign: "center", marginTop: 20, marginBottom: "20px" }}
        >
          <span style={{ color: "#94a3b8", fontSize: 14 }}>
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            style={{
              color: "#818cf8",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login 
          </Link>
        </div>
      </div>
    </div>
  );
}