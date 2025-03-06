import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../services/api.config";

const Login = () => {
  localStorage.setItem("userRole","admin")
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldName = id.replace("floating", "").charAt(0).toLowerCase() + id.replace("floating", "").slice(1);
    
    setFormData({
      ...formData,
      [fieldName === "email" ? "email" : 
       fieldName === "password" ? "password" : 
       fieldName === "rememberCheck" ? "rememberMe" : fieldName]: type === "checkbox" ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      // Prepare data for API
      const apiData = {
        email: formData.email,
        password: formData.password
      };
            
      // Make API call
      const response = await axios.post(getApiUrl("/auth/login-json"), apiData);
      console.log("Response received:", response);

      // Handle success - store token or user data
      if (response.data && response.data.access_token) {
        // Store token in localStorage or sessionStorage based on "remember me"
        if (formData.rememberMe) {
          localStorage.setItem("authToken", response.data.access_token);
          localStorage.setItem("userRole", response.data.role || "user");
          localStorage.setItem("userId", response.data.user_id.toString());
          localStorage.setItem("FullName", response.data.user_full_name);
        } else {
          sessionStorage.setItem("authToken", response.data.access_token);
          sessionStorage.setItem("userRole", response.data.role || "user");
          sessionStorage.setItem("userId", response.data.user_id.toString());
          sessionStorage.setItem("FullName", response.data.user_full_name);
        }
        
        // Redirect to dashboard or home
        window.location.href = "/";
      } else {
        setError("حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
      
    } catch (err) {
      // Handle error from API
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response && err.response.status === 401) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError("حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="login-container">
      <div className="container direction_rtl" >
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card login-card">
              <div className="row g-0">
                {/* Sidebar (visible sur desktop) */}
                <div className="col-md-5 d-none d-md-block">
                  <div className="login-sidebar h-100 d-flex flex-column justify-content-between">
                    <div className="login-sidebar-content">
                      <div className="text-center mb-5">
                        <i className="fas fa-gavel logo-gavel"></i>
                        <h3 className="mb-3">مزادات المغرب</h3>
                        <p>منصة المزادات الرائدة في المغرب</p>
                      </div>
                      <div className="mt-5">
                        <h5 className="mb-3">مرحبًا بعودتك!</h5>
                        <p>
                          سجل دخولك للوصول إلى حسابك ومتابعة مزاداتك المفضلة أو
                          تقديم عروض جديدة.
                        </p>
                        <div className="mt-4">
                          <h6>مزايا العضوية:</h6>
                          <ul>
                            <li>متابعة المزادات المباشرة</li>
                            <li>الوصول لتنبيهات الأسعار</li>
                            <li>حفظ المنتجات المفضلة</li>
                            <li>تتبع مزايداتك بسهولة</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Form */}
                <div className="col-md-7">
                  <div className="login-form">
                    <div className="text-center d-block d-md-none mb-4">
                      <i className="fas fa-gavel fa-3x mb-3 text-primary"></i>
                      <h3>مزادات المغرب</h3>
                    </div>
                    <h2 className="mb-4 text-center">تسجيل الدخول</h2>
                    
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingEmail"
                          placeholder="البريد الإلكتروني"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="floatingEmail">البريد الإلكتروني</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="كلمة المرور"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="floatingPassword">كلمة المرور</label>
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberCheck"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberCheck"
                          >
                            تذكرني
                          </label>
                        </div>
                        <a href="/forgot-password" className="text-decoration-none">
                          نسيت كلمة المرور؟
                        </a>
                      </div>
                      <div className="d-grid gap-2 mb-4">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              جاري تسجيل الدخول...
                            </>
                          ) : (
                            'دخول'
                          )}
                        </button>
                      </div>
                      <div className="divider">
                        <span>أو</span>
                      </div>
                     
                      <div className="text-center mt-4">
                        <p>
                          ليس لديك حساب؟{" "}
                          <a href="/register" className="text-decoration-none fw-bold">
                            سجل الآن
                          </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
                {/* End Login Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;