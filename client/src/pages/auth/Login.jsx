import React, { useEffect, useState } from "react";
import LoginBg from "../../assets/login-bg.jpg";
import Logo from "../../assets/logo.svg";
import { Form, Link, redirect } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { setCaptcha } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineRefresh } from "react-icons/md";
import { splitErrors } from "../../../utils/showErrors";

// Action starts ------
export const action =
  (store) =>
  async ({ request }) => {
    const { captcha } = store.getState().auth;
    const formData = await request.formData();
    let data = Object.fromEntries(formData);
    data = { ...data, captcha: captcha };
    try {
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return redirect("/");
    }
    return null;
  };

// Main component starts ------
const Login = () => {
  document.title = `Login | ${import.meta.env.VITE_COMMON_TITLE}`;

  const dispatch = useDispatch();
  const { captcha } = useSelector((store) => store.auth);
  const [form, setForm] = useState({
    username: "",
    password: "",
    inputCaptcha: "",
  });
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(setCaptcha());
  }, []);

  const captchaImage = !captcha
    ? `https://dummyimage.com/120x50/000/fff&text=${`Loading ...`}`
    : `https://dummyimage.com/120x50/000/fff&text=${captcha}`;

  return (
    <div className="row g-0 flex-fill">
      <div className="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
        <div className="container container-tight my-5 px-lg-5">
          <div className="text-center mb-4">
            <Link className="navbar-brand navbar-brand-autodark" to=".">
              <img src={Logo} height="36" alt="" />
            </Link>
          </div>
          <h2 className="h3 text-center mb-3">Login to your account</h2>
          <Form method="post" autoComplete="off">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="your@email.com"
                name="username"
                id="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Password
                <span className="form-label-description">
                  <Link to="/forgot-password">I forgot password</Link>
                </span>
              </label>
              <div htmlFor="password" className="input-group input-group-flat">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Your password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <IoEyeOutline
                    className="link-secondary cursor-pointer"
                    title="Show password"
                    size={18}
                  />
                </span>
              </div>
            </div>
            <div className="row row-cards mb-3">
              <div className="col-sm-5 col-md-5">
                <div className="bg-black w-full h-full p-1 rounded text-center fw-bold">
                  <img src={captchaImage} alt={captcha} />
                </div>
              </div>
              <div className="col-sm-1 col-md-1 pt-5 align-center">
                <MdOutlineRefresh
                  size={24}
                  className="cursor-pointer"
                  onClick={() => dispatch(setCaptcha())}
                />
              </div>
              <div className="col-sm-6 col-md-6">
                <label className="form-label">Enter captcha</label>
                <input
                  type="text"
                  name="inputCaptcha"
                  className="form-control"
                  placeholder="Enter captcha"
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                  }}
                  onCut={(e) => {
                    e.preventDefault();
                  }}
                  value={form.inputCaptcha}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-check">
                <input
                  type="checkbox"
                  name="remember"
                  className="form-check-input"
                  value={remember}
                  onChange={() => setRemember(!remember)}
                />
                <span className="form-check-label">
                  Remember me on this device
                </span>
              </label>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100">
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
      <div className="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
        <img className="bg-cover h-100 min-vh-100" src={LoginBg} />
      </div>
    </div>
  );
};

export default Login;
