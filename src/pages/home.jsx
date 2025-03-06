import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      
        <section className="hero-section text-center">
            <div className="container">
            <h1 className="display-4 fw-bold mb-4">مزادات حصرية في المغرب</h1>
            <p className="lead mb-4">
                اكتشف قطعًا فريدة وقدم أفضل العروض عبر الإنترنت أو مباشرة
            </p>
            <div className="d-flex justify-content-center gap-3">
                <Link to="/auctions" className="btn btn-primary btn-lg">
                تصفح المزادات
                </Link>
                <Link to="/live-auctions" className="btn btn-danger btn-lg">
                المزادات المباشرة
                </Link>
            </div>
            </div>
        </section>

        <section className="py-5 bg-light">
      <div className="container direction_rtl" >
        <h2 className="text-center mb-4">الفئات الشائعة</h2>
        <div className="row g-4">
          {[
            { id: 1, icon: "fa-car", name: "سيارات" },
            { id: 2, icon: "fa-laptop", name: "إلكترونيات" },
            { id: 3, icon: "fa-gem", name: "مجوهرات" },
            { id: 4, icon: "fa-couch", name: "أثاث" },
          ].map((category) => (
            <div key={category.id} className="col-6 col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className={`fas ${category.icon} fa-3x mb-3 text-primary`}></i>
                  <h5>{category.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </section>
      
        <section className="py-5">
            <div className="container direction_rtl" >
            <h2 className="mb-4">المزادات القادمة</h2>
            <div className="row g-4">
                {[
                {
                    id: 1,
                    title: "سيارة مرسيدس كلاسيكية",
                    description: "مرسيدس بنز SL 1965، تم ترميمها، بحالة ممتازة.",
                    price: "150,000 درهم",
                    bidders: 12,
                    time: "2023-12-25T10:00:00",
                    img: "https://www.claudeusercontent.com/api/placeholder/400/300",
                },
                {
                    id: 2,
                    title: "لوحة فنية مغربية",
                    description: "عمل أصلي للفنان أحمد شرقاوي، 1970.",
                    price: "45,000 درهم",
                    bidders: 8,
                    time: "2023-12-26T14:00:00",
                    img: "https://www.claudeusercontent.com/api/placeholder/400/300",
                },
                {
                    id: 3,
                    title: "سجادة أمازيغية قديمة",
                    description:
                    "سجادة من الأطلس المتوسط، مصنوعة يدويًا، صوف طبيعي، 3×2م.",
                    price: "12,000 درهم",
                    bidders: 15,
                    time: "2023-12-24T09:00:00",
                    img: "https://www.claudeusercontent.com/api/placeholder/400/300",
                },
                ].map((auction) => (
                <div key={auction.id} className="col-md-6 col-lg-4">
                    <div className="card product-card h-100">
                    <img src={auction.img} className="card-img-top" alt={auction.title} />
                    <div className="card-body">
                        <h5 className="card-title">{auction.title}</h5>
                        <p className="card-text">{auction.description}</p>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold">سعر البداية: {auction.price}</span>
                        <span className="badge bg-secondary">{auction.bidders} مزايد</span>
                        </div>
                        <div className="countdown-container border p-2 rounded bg-light mb-3">
                        <small>يبدأ في:</small>
                        <div className="countdown" data-time={auction.time}>
                            {/* Ajouter une fonction pour afficher le temps restant dynamiquement */}
                            {new Date(auction.time).toLocaleDateString("ar-MA")}
                        </div>
                        </div>
                        <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => navigate(`/auction/${auction.id}`)}
                        >
                        التفاصيل
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        <section className="py-5 bg-dark text-white">
      <div className="container direction_rtl" >
        <h2 className="text-center mb-4">المزادات المباشرة</h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-dark border-light product-card h-100 position-relative">
              <span className="badge bg-danger live-badge p-2">
                <i className="fas fa-circle me-1"></i> مباشر
              </span>
              <div className="row g-0">
                <div className="col-md-5">
                  <img
                    src="https://www.claudeusercontent.com/api/placeholder/300/400"
                    className="img-fluid rounded-start h-100"
                    alt="منتج"
                  />
                </div>
                <div className="col-md-7">
                  <div className="card-body">
                    <h5 className="card-title">ساعة فاخرة</h5>
                    <p className="card-text">
                      موديل رولكس سابمارينر، حالة جديدة مع شهادة أصالة.
                    </p>
                    <div className="alert alert-danger bid-pulse">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>المزايدة الحالية:</span>
                        <span className="fw-bold">65,200 درهم</span>
                      </div>
                      <small>بواسطة مزايد_456</small>
                    </div>
                    <div className="input-group mb-3">
                      <button className="btn btn-success" type="button">
                        المزايدة
                      </button>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="مزايدتك"
                      />
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <small>المشاركون: 32</small>
                      <small>الوقت المتبقي: 05:47</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-dark border-light product-card h-100 position-relative">
              <span className="badge bg-danger live-badge p-2">
                <i className="fas fa-circle me-1"></i> مباشر
              </span>
              <div className="row g-0">
                <div className="col-md-5">
                  <img
                    src="https://www.claudeusercontent.com/api/placeholder/300/400"
                    className="img-fluid rounded-start h-100"
                    alt="منتج"
                  />
                </div>
                <div className="col-md-7">
                  <div className="card-body">
                    <h5 className="card-title">ساعة فاخرة</h5>
                    <p className="card-text">
                      موديل رولكس سابمارينر، حالة جديدة مع شهادة أصالة.
                    </p>
                    <div className="alert alert-danger bid-pulse">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>المزايدة الحالية:</span>
                        <span className="fw-bold">65,200 درهم</span>
                      </div>
                      <small>بواسطة مزايد_456</small>
                    </div>
                    <div className="input-group mb-3">
                      <button className="btn btn-success" type="button">
                        المزايدة
                      </button>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="مزايدتك"
                      />
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <small>المشاركون: 32</small>
                      <small>الوقت المتبقي: 05:47</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Live Auctions */}
        <div className="mt-5">
          <h4 className="mb-3">المبيعات المباشرة القادمة</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>الفئة</th>
                  <th>الوصف</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "27/02/2025",
                    time: "14:00",
                    category: "فن",
                    description: "مجموعة لوحات لفنانين مغاربة",
                  },
                  {
                    date: "28/02/2025",
                    time: "10:00",
                    category: "عقارات",
                    description: "فيلات في مراكش والدار البيضاء",
                  },
                  {
                    date: "01/03/2025",
                    time: "15:30",
                    category: "تحف",
                    description: "قطع فنية قديمة من المغرب",
                  },
                ].map((auction, index) => (
                  <tr key={index}>
                    <td>{auction.date}</td>
                    <td>{auction.time}</td>
                    <td>{auction.category}</td>
                    <td>{auction.description}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-light">
                        تذكير
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </section>

        <section className="py-5">
    <div className="container direction_rtl" >
      <h2 className="text-center mb-5">كيفية المشاركة</h2>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-user-plus fa-2x" />
              </div>
              <h5 className="card-title">سجل</h5>
              <p className="card-text">
                أنشئ حسابك مجانًا في غضون دقائق قليلة.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-search fa-2x" />
              </div>
              <h5 className="card-title">تصفح</h5>
              <p className="card-text">استكشف المزادات الحالية والقادمة.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-gavel fa-2x" />
              </div>
              <h5 className="card-title">زايد</h5>
              <p className="card-text">ضع مزايداتك عبر الإنترنت أو مباشرة.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-trophy fa-2x" />
              </div>
              <h5 className="card-title">اربح</h5>
              <p className="card-text">استلم منتجك وأكد المعاملة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </section>
    </>
  );
};

export default Home;
