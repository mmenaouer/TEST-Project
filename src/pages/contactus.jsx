import React from "react";

const ContactUs = () => {
  return (
    <>
      {/* Section Hero */}
      <section className="contact-hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">اتصل بنا</h1>
          <p className="lead mb-0">نحن هنا لمساعدتك في أي استفسار أو اقتراح</p>
        </div>
      </section>

      {/* Section Contact */}
        <section className="py-5 bg-light">
            <div className="container" direction_rtl>
            <div className="row g-4">
                {[
                {
                    id: 1,
                    icon: "fa-phone-alt",
                    title: "اتصل بنا",
                    details: ["+212 522 123 456", "+212 661 789 012"],
                    footer: "متاح من الاثنين إلى الجمعة\n9:00 - 17:00",
                },
                {
                    id: 2,
                    icon: "fa-envelope",
                    title: "البريد الإلكتروني",
                    details: ["info@mazadat-morocco.ma", "support@mazadat-morocco.ma"],
                    footer: "نرد عادةً في غضون 24 ساعة",
                },
                {
                    id: 3,
                    icon: "fa-map-marker-alt",
                    title: "العنوان",
                    details: [
                    "شارع محمد الخامس، عمارة 45، الطابق 3",
                    "الدار البيضاء، المغرب",
                    ],
                    footer: "الرمز البريدي: 20250",
                },
                ].map((contact) => (
                <div key={contact.id} className="col-md-4">
                    <div className="card contact-card h-100 text-center p-4">
                    <div className="card-body">
                        <div className="contact-icon">
                        <i className={`fas ${contact.icon} fa-3x mb-3 text-primary`}></i>
                        </div>
                        <h4 className="mb-3">{contact.title}</h4>
                        {contact.details.map((detail, index) => (
                        <p key={index} className="mb-1">
                            {detail}
                        </p>
                        ))}
                        <p className="text-muted mt-3">{contact.footer}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

      {/* Contact Form Section */}
        <section className="py-5">
            <div className="container direction_rtl">
            <div className="row">
                <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="mb-4">أرسل لنا رسالة</h2>
                <form>
                    <div className="row g-3">
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingName"
                            placeholder="الاسم الكامل"
                        />
                        <label htmlFor="floatingName">الاسم الكامل</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingEmail"
                            placeholder="البريد الإلكتروني"
                        />
                        <label htmlFor="floatingEmail">البريد الإلكتروني</label>
                        </div>
                    </div>
                    </div>
                    <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingSubject"
                        placeholder="الموضوع"
                    />
                    <label htmlFor="floatingSubject">الموضوع</label>
                    </div>
                    <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        placeholder="رسالتك"
                        id="floatingMessage"
                        style={{ height: 150 }}
                        defaultValue={""}
                    />
                    <label htmlFor="floatingMessage">رسالتك</label>
                    </div>
                    <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue=""
                        id="privacyCheck"
                    />
                    <label className="form-check-label" htmlFor="privacyCheck">
                        أوافق على سياسة الخصوصية وشروط الاستخدام
                    </label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">
                    إرسال الرسالة
                    </button>
                </form>
                </div>
                <div className="col-lg-6">
                <h2 className="mb-4">موقعنا</h2>
                <div className="map-container">
                    <img
                    src="https://www.claudeusercontent.com/api/placeholder/600/400"
                    alt="خريطة الموقع"
                    className="img-fluid w-100 h-100 object-cover"
                    />
                </div>
                
                </div>
            </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5 bg-light">
            <div className="container direction_rtl" >
            <h2 className="text-center mb-5">الأسئلة الشائعة</h2>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                <div className="accordion" id="contactFAQ">
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                        >
                        كيف يمكنني المشاركة في المزادات؟
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#contactFAQ"
                    >
                        <div className="accordion-body">
                        للمشاركة في المزادات، يجب عليك التسجيل في الموقع أولاً وإكمال
                        عملية التحقق من هويتك. بعد ذلك، يمكنك تصفح المزادات النشطة
                        والمزايدة على المنتجات التي تهمك.
                        </div>
                    </div>
                    </div>
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                        >
                        كيف يمكنني بيع منتج في المزاد؟
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#contactFAQ"
                    >
                        <div className="accordion-body">
                        لبيع منتج في المزاد، يجب عليك التسجيل كبائع وتقديم معلومات
                        مفصلة عن المنتج الذي ترغب في بيعه. سيقوم فريقنا بمراجعة طلبك
                        والاتصال بك لترتيب التفاصيل والتحقق من صحة المنتج.
                        </div>
                    </div>
                    </div>
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                        >
                        ما هي رسوم الخدمة؟
                        </button>
                    </h2>
                    <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#contactFAQ"
                    >
                        <div className="accordion-body">
                        تختلف رسوم الخدمة حسب نوع المنتج وقيمته. عمومًا، نفرض رسومًا
                        بنسبة 5-10% من سعر البيع النهائي على البائع. يمكنك الاطلاع على
                        جدول الرسوم المفصل في صفحة الشروط والأحكام.
                        </div>
                    </div>
                    </div>
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                        >
                        كيف يتم تسليم المنتجات؟
                        </button>
                    </h2>
                    <div
                        id="collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#contactFAQ"
                    >
                        <div className="accordion-body">
                        نوفر خدمة التوصيل في جميع أنحاء المغرب من خلال شركات شحن
                        موثوقة. بالنسبة للمنتجات الثمينة أو الكبيرة، نقدم خدمات شحن
                        مخصصة مع تأمين كامل. يمكن أيضًا ترتيب استلام المنتج من مكاتبنا
                        في الدار البيضاء ومراكش والرباط.
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="text-center mt-5">
                <p className="mb-3">لم تجد إجابة على سؤالك؟</p>
                <a href="#" className="btn btn-outline-primary">
                اطلع على الأسئلة الشائعة الكاملة
                </a>
            </div>
            </div>
        </section>
    </>
  );
};

export default ContactUs;
