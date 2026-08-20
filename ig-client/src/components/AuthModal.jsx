import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const AuthModal = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Logged in successfully");
      } else {
        await register({ email, password, first_name: firstName, last_name: lastName });
        toast.success("Account created successfully");
      }
      onClose();
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.email?.[0]
        || err.response?.data?.password?.[0]
        || "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <ul className="nav nav-pills w-100 justify-content-center">
              <li className="nav-item">
                <button className={`nav-link ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Sign Up</button>
              </li>
            </ul>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {mode === "register" && (
                <>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </>
              )}
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
