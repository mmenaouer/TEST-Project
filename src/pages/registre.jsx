import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../services/api.config";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cin: "",
    cityId: "",
    countryId: "",
    isCompany: false,
    companyName: "",
    rcNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Récupérer la liste des pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await axios.get(getApiUrl("/utilities/pays"));
        setCountries(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des pays:", err);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Récupérer la liste des villes basée sur le pays sélectionné
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.countryId) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        // Supposons que l'API des villes nécessite un paramètre countryId
        const response = await axios.get(getApiUrl("/utilities/villes"));
        setCities(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des villes:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [formData.countryId]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let fieldName = id.replace("floating", "").charAt(0).toLowerCase() + id.replace("floating", "").slice(1);
    
    // Handle checkbox for isCompany separately
    if (id === "isCompanyCheck") {
      fieldName = "isCompany";
    }
    
    // Handle select elements for country and city
    if (id === "countrySelect") {
      fieldName = "countryId";
      // Reset city when country changes
      setFormData({
        ...formData,
        countryId: value,
        cityId: ""
      });
      return;
    }
    
    if (id === "citySelect") {
      fieldName = "cityId";
    }
    
    setFormData({
      ...formData,
      [fieldName]: type === "checkbox" ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    
    /*if (!formData.termsAccepted) {
      setError("يرجى الموافقة على الشروط والأحكام");
      return;
    }*/
    
    try {
      setLoading(true);
      setError("");
      
      // Prepare data for API
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        cin: formData.cin,
        ville_id: formData.cityId,
        pays_id: formData.countryId,
        denomination_societe: formData.isCompany ? formData.companyName : "",
        registre_commerce: formData.isCompany ? formData.rcNumber : "",
        password: formData.password,
        password_confirm: formData.confirmPassword,
        address: formData.address,
        role : "encherisseur"
      };
      console.log("Mouuuuuuuuuuuuunir")
      console.log(apiData)
      // Make API call
      const response = await axios.post(getApiUrl("/auth/register", apiData));
      console.log("Mouuuuuuuuuuuuunir")
      console.log(response.data)
      // Handle success
      setSuccess("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
      
      // You could redirect to login page after successful registration
      window.location.href = "/login";
      
    } catch (err) {
      // Handle error from API
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="register-container">
      <div className="container direction_rtl">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card register-card">
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
                        <h5 className="mb-3">انضم إلينا اليوم!</h5>
                        <p>
                          سجل حساب جديد للوصول إلى جميع مزايا منصة المزادات الرائدة في المغرب.
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

                {/* Register Form */}
                <div className="col-md-7">
                  <div className="login-form">
                    <div className="text-center d-block d-md-none mb-4">
                      <i className="fas fa-gavel fa-3x mb-3 text-primary"></i>
                      <h3>مزادات المغرب</h3>
                    </div>
                    <h2 className="mb-4 text-center">إنشاء حساب جديد</h2>
                    
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="alert alert-success" role="alert">
                        {success}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      {/* Personal Information Section */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="floatingFirstName"
                              placeholder="الاسم الأول"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="floatingFirstName">الاسم الأول</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="floatingLastName"
                              placeholder="الاسم الأخير"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="floatingLastName">الاسم الأخير</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Added CIN */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingCin"
                          placeholder="رقم البطاقة الوطنية"
                          value={formData.cin}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="floatingCin">رقم البطاقة الوطنية (CIN)</label>
                      </div>
                      
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
                          type="tel"
                          className="form-control"
                          id="floatingPhone"
                          placeholder="رقم الهاتف"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="floatingPhone">رقم الهاتف</label>
                      </div>
                      
                      {/* Location Information */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              id="countrySelect"
                              value={formData.countryId}
                              onChange={handleChange}
                              required
                              disabled={loadingCountries}
                            >
                              <option value="">-- اختر البلد --</option>
                              {countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                  {country.nom_ar}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="countrySelect">البلد</label>
                            {loadingCountries && (
                              <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                                   style={{ right: "10px", top: "15px" }} 
                                   role="status">
                                <span className="visually-hidden">جاري التحميل...</span>
                              </div>
                            )}
                          </div>
                        </div>
                       
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              id="citySelect"
                              value={formData.cityId}
                              onChange={handleChange}
                              required
                              disabled={loadingCities || !formData.countryId}
                            >
                              <option value="">-- اختر المدينة --</option>
                              {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.nom_ar}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="citySelect">المدينة</label>
                            {loadingCities && (
                              <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                                   style={{ right: "10px", top: "15px" }} 
                                   role="status">
                                <span className="visually-hidden">جاري التحميل...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="textarea"
                          className="form-control"
                          id="address"
                          placeholder="العنوان"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          minLength="5"
                        />
                        <label htmlFor="floatingPassword">العنوان</label>
                      </div>
                      
                      {/* Company Information Toggle */}
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isCompanyCheck"
                          checked={formData.isCompany}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isCompanyCheck">
                          التسجيل كشركة
                        </label>
                      </div>
                      
                      {/* Conditional Company Fields */}
                      {formData.isCompany && (
                        <div className="company-fields mb-3 p-3 border rounded bg-light">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="floatingCompanyName"
                              placeholder="اسم الشركة"
                              value={formData.companyName}
                              onChange={handleChange}
                              required={formData.isCompany}
                            />
                            <label htmlFor="floatingCompanyName">اسم الشركة</label>
                          </div>
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="floatingRcNumber"
                              placeholder="رقم السجل التجاري"
                              value={formData.rcNumber}
                              onChange={handleChange}
                              required={formData.isCompany}
                            />
                            <label htmlFor="floatingRcNumber">رقم السجل التجاري (RC)</label>
                          </div>
                        </div>
                      )}
                      
                      {/* Password Section */}
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="كلمة المرور"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <label htmlFor="floatingPassword">كلمة المرور</label>
                      </div>
                      
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="floatingConfirmPassword"
                          placeholder="تأكيد كلمة المرور"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <label htmlFor="floatingConfirmPassword">تأكيد كلمة المرور</label>
                      </div>
                      
                      {/* Terms and Submit */}
                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="termsCheck"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="termsCheck">
                          أوافق على <a href="#" className="text-decoration-none">الشروط والأحكام</a>
                        </label>
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
                              جاري التسجيل...
                            </>
                          ) : (
                            'إنشاء حساب'
                          )}
                        </button>
                      </div>
                      
                      <div className="divider">
                        <span>أو</span>
                      </div>
                      
                      <div className="text-center mt-4">
                        <p>
                          لديك حساب بالفعل؟{" "}
                          <a href="#" className="text-decoration-none fw-bold">
                            تسجيل الدخول
                          </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
                {/* End Register Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;