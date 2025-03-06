import React from 'react';

function Footer() {

return (
    <footer className="bg-dark text-white py-4">
    <div className="container direction_rtl" >
      <div className="row g-4">
        <div className="col-md-4">
          <h5>مزادات المغرب</h5>
          <p>
            أول منصة مزادات عبر الإنترنت في المغرب. اشتر وبع منتجات فريدة بأمان.
          </p>
          <div className="d-flex gap-3 mt-3">
            <a href="#" className="text-white">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" className="text-white">
              <i className="fab fa-instagram" />
            </a>
            <a href="#" className="text-white">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" className="text-white">
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
        <div className="col-md-2" >
          <h5>روابط سريعة</h5>
          <ul className="list-unstyled">
            <li>
              <a href="#" className="text-white">
                الرئيسية
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                المزادات
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                حسابي
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                الأسئلة الشائعة
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-2">
          <h5>الفئات</h5>
          <ul className="list-unstyled">
            <li>
              <a href="#" className="text-white">
                سيارات
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                إلكترونيات
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                عقارات
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                مجوهرات
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5>النشرة الإخبارية</h5>
          <p>احصل على أحدث المزادات والعروض الحصرية.</p>
          <div className="input-group mb-3">
            <button className="btn btn-primary" type="button">
              اشتراك
            </button>
            <input
              type="email"
              className="form-control"
              placeholder="بريدك الإلكتروني"
            />
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="row">
        <div className="col-md-6">
          <p className="mb-0">© 2025 مزادات المغرب. جميع الحقوق محفوظة.</p>
        </div>
        <div className="col-md-6 text-md-start">
          <a href="#" className="text-white ms-3">
            شروط الاستخدام
          </a>
          <a href="#" className="text-white ms-3">
            سياسة الخصوصية
          </a>
          <a href="#" className="text-white">
            اتصل بنا
          </a>
        </div>
      </div>
    </div>
  </footer>
      );
    }
    
    export default Footer;
    