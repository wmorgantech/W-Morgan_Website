import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api, { getApiError } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [setupRequired, setSetupRequired] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    api.get("/auth/setup-status")
      .then(({ data }) => active && setSetupRequired(data.setupRequired))
      .catch((requestError) => active && setError(getApiError(requestError)))
      .finally(() => active && setCheckingSetup(false));
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const path = setupRequired ? "/auth/register" : "/auth/login";
      const payload = setupRequired
        ? { name, email, password, setupCode }
        : { email, password };
      const { data } = await api.post(path, payload);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("adminProfile", JSON.stringify(data.admin));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="WMorgan Technologies" className="login-logo" />
          <h1>{setupRequired ? "Create admin account" : "Admin Login"}</h1>
          <p>W Morgan Technologies</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {setupRequired && (
            <>
              <div className="form-group">
                <label htmlFor="admin-setup-code">One-time setup code</label>
                <div className="input-wrapper">
                  <LockKeyhole size={19} />
                  <input id="admin-setup-code" type="password" autoComplete="off" value={setupCode} onChange={(event) => setSetupCode(event.target.value)} required minLength={32} maxLength={256} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="admin-name">Name</label>
                <div className="input-wrapper">
                  <UserRound size={19} />
                  <input id="admin-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={19} />
              <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-wrapper">
              <LockKeyhole size={19} />
              <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete={setupRequired ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={setupRequired ? 12 : 1} maxLength={72} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && <p className="content-error" role="alert">{error}</p>}

          <button type="submit" className="login-button" disabled={checkingSetup || submitting}>
            {checkingSetup ? "Connecting…" : submitting ? "Please wait…" : setupRequired ? "Create admin account" : "Login"}
          </button>
        </form>

        <div className="login-footer"><p>© {new Date().getFullYear()} WMorgan Technologies</p></div>
      </div>
    </div>
  );
}
