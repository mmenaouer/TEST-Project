import { useState, useEffect, useCallback } from "react";


const AuctionPage = () => {
    // États pour gérer la caution
    const [depositStatus, setDepositStatus] = useState("pending"); // pending, confirmed, rejected
    const [depositMethod, setDepositMethod] = useState("");
    const [depositFile, setDepositFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");

    // Fonction pour soumettre la caution
    const submitDeposit = (e) => {
      e.preventDefault();
      if (!depositMethod || !depositFile) {
        alert("الرجاء اختيار طريقة الدفع وإرفاق إيصال الدفع");
        return;
      }
      
      setIsSubmitting(true);
      
      // Simuler une requête API
      setTimeout(() => {
        setDepositStatus("pending");
        setAdminMessage("تم استلام طلبك. سيتم مراجعته في غضون 24 ساعة");
        setIsSubmitting(false);
      }, 1500);
    };

    // Gérer le changement de fichier
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت");
          e.target.value = "";
          return;
        }
        
        setDepositFile(file);
      }
    };

    // Obtenir la couleur du statut
    const getStatusColor = () => {
      switch (depositStatus) {
        case "confirmed": return "success";
        case "rejected": return "danger";
        default: return "warning";
      }
    };

    // Obtenir le texte du statut
    const getStatusText = () => {
      switch (depositStatus) {
        case "confirmed": return "تم التأكيد";
        case "rejected": return "مرفوض";
        default: return //"قيد المراجعة";
      }
    };

    // Obtenir la progression du statut
    const getStatusProgress = () => {
      switch (depositStatus) {
        case "confirmed": return "100%";
        case "rejected": return "100%";
        default: return "50%";
      }
    };


  // État pour gérer le statut de l'enchère (active ou à venir)
  const [auctionStatus, setAuctionStatus] = useState("upcoming"); // "active" ou "upcoming"
  
  // États pour gérer les données dynamiques
  const [currentBid, setCurrentBid] = useState(172500);
  const [cautionStatus, setCautionStatus] = useState("pending"); // "none", "pending", "validated"
  const [bidHistory, setBidHistory] = useState([
    { id: 1, bidder: "43758", time: "35 ثانية", amount: 172500, isHighest: true },
    { id: 2, bidder: "25641", time: "2 دقيقة", amount: 170000, isHighest: false },
    { id: 3, bidder: "43758", time: "5 دقائق", amount: 168000, isHighest: false },
    { id: 4, bidder: "78910", time: "8 دقائق", amount: 165500, isHighest: false },
    { id: 5, bidder: "25641", time: "15 دقيقة", amount: 162000, isHighest: false },
    { id: 6, bidder: "65432", time: "22 دقيقة", amount: 160000, isHighest: false },
    { id: 7, bidder: "12345", time: "30 دقيقة", amount: 155000, isHighest: false },
    { id: 8, bidder: "98765", time: "42 دقيقة", amount: 150000, isHighest: false }
  ]);
  const [bidCount, setBidCount] = useState(23);
  const [activeParticipants, setActiveParticipants] = useState(12);
  
  // Compte à rebours pour l'enchère en cours ou à venir
  const [countdown, setCountdown] = useState({ 
    days: auctionStatus === "upcoming" ? 2 : 0,
    hours: auctionStatus === "upcoming" ? 12 : 0, 
    minutes: auctionStatus === "upcoming" ? 45 : 24, 
    seconds: auctionStatus === "upcoming" ? 30 : 36 
  });
  
  const [userBidAmount, setUserBidAmount] = useState(currentBid + 1000);
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [autoBidMaxAmount, setAutoBidMaxAmount] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  // Pour la démo, permet de basculer entre les états
  const toggleAuctionStatus = () => {
    setAuctionStatus(prevStatus => {
      const newStatus = prevStatus === "active" ? "upcoming" : "active";
      
      // Mise à jour du compte à rebours en fonction du nouveau statut
      if (newStatus === "active") {
        setCountdown({ days: 0, hours: 0, minutes: 24, seconds: 36 });
      } else {
        setCountdown({ days: 2, hours: 12, minutes: 45, seconds: 30 });
      }
      
      return newStatus;
    });
  };
  
  // Pour la démo, permet de basculer entre les états de la caution
  const toggleCautionStatus = () => {
    setCautionStatus(prevStatus => {
      if (prevStatus === "none") return "pending";
      if (prevStatus === "pending") return "validated";
      return "none";
    });
  };

  // Images pour le diaporama
  const galleryImages = Array.from({ length: 10 }, (_, i) => 
    `https://www.claudeusercontent.com/api/placeholder/800/600?text=${i + 1}`
  );
  
  // Fonction pour passer à l'image suivante
  const nextImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Fonction pour revenir à l'image précédente
  const prevImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days -= 1;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
          // Si le compte à rebours pour une enchère à venir est terminé, activer l'enchère
          if (auctionStatus === "upcoming") {
            setAuctionStatus("active");
            setCountdown({ days: 0, hours: 0, minutes: 30, seconds: 0 });
          }
          return prevTime;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auctionStatus]);

  // Fonction pour soumettre une enchère
  const submitBid = useCallback((amount) => {
    if (auctionStatus !== "active") {
      alert("المزاد لم يبدأ بعد");
      return;
    }
    
    if (amount <= currentBid) {
      alert("المبلغ المدخل يجب أن يكون أكبر من المزايدة الحالية");
      return;
    }
    
    const newBid = {
      id: bidHistory.length + 1,
      bidder: "USER" + Math.floor(Math.random() * 10000),
      time: "الآن",
      amount: amount,
      isHighest: true
    };
    
    // Mettre à jour l'enchère actuelle
    setCurrentBid(amount);
    
    // Mettre à jour l'historique des enchères
    const updatedHistory = [newBid, ...bidHistory.map(bid => ({ ...bid, isHighest: false }))];
    setBidHistory(updatedHistory);
    
    // Mettre à jour le nombre d'enchères
    setBidCount(prevCount => prevCount + 1);
    
    // Reset le montant de l'enchère de l'utilisateur
    setUserBidAmount(amount + 1000);
    
    // Ajouter 5 minutes au compte à rebours si nous sommes dans les 2 dernières minutes
    if (countdown.hours === 0 && countdown.minutes < 2) {
      setCountdown(prevTime => ({
        ...prevTime,
        minutes: prevTime.minutes + 5
      }));
    }
  }, [bidHistory, currentBid, countdown, auctionStatus]);

  // Fonction pour définir le montant de l'enchère avec l'incrément rapide
  const handleQuickBid = (increment) => {
    setUserBidAmount(currentBid + increment);
  };

  // Fonction pour changer l'image active dans la galerie
  const changeActiveImage = (index) => {
    setActiveImageIndex(index);
  };

  // Fonction pour changer l'image dans le modal
  const changeModalImage = (index) => {
    setModalImageIndex(index);
  };

  // Fonction pour activer/désactiver l'enchère automatique
  const toggleAutoBid = () => {
    if (auctionStatus !== "active") {
      alert("المزاد لم يبدأ بعد");
      return;
    }
    
    if (!autoBidMaxAmount || parseInt(autoBidMaxAmount) <= currentBid) {
      alert("الرجاء إدخال مبلغ صالح أكبر من المزايدة الحالية");
      return;
    }
    setIsAutoBidEnabled(!isAutoBidEnabled);
  };

  // Formater le nombre avec séparateur de milliers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculer le pourcentage de progression
  const progressPercentage = Math.min(
    Math.round(((currentBid - 150000) / (200000 - 150000)) * 100),
    100
  );

  return (
    <section className="py-4">
      <div className="container direction_rtl">
        {/* Admin Controls - For demo purposes */}
        <div className="mb-3 bg-light p-3 rounded">
          <h6>وضع العرض التوضيحي</h6>
          <div className="d-flex gap-2 mb-2">
            <button 
              className="btn btn-primary"
              onClick={toggleAuctionStatus}
            >
              {auctionStatus === "active" ? "تحويل إلى مزاد قادم" : "تحويل إلى مزاد نشط"}
            </button>
            <span className="ms-3 d-flex align-items-center">الحالة الحالية: {auctionStatus === "active" ? "مزاد نشط" : "مزاد قادم"}</span>
          </div>
          
          <div className="mt-2">
            <button 
              className="btn btn-info"
              onClick={toggleCautionStatus}
            >
              تغيير حالة التأمين
            </button>
            <span className="ms-3 d-flex align-items-center">
              حالة التأمين: 
              {cautionStatus === "none" && <span className="badge bg-danger ms-2">غير مدفوع</span>}
              {cautionStatus === "pending" && <span className="badge bg-warning text-dark ms-2">قيد التحقق</span>}
              {cautionStatus === "validated" && <span className="badge bg-success ms-2">تم التحقق</span>}
            </span>
          </div>
        </div>
      
        {/* Auction Title & Status */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">سيارة مرسيدس كلاسيكية 1965</h1>
            <p className="text-muted">
              <span className={`badge ${auctionStatus === "active" ? "bg-success" : "bg-warning text-dark"} me-2`}>
                {auctionStatus === "active" ? "المزاد جارٍ" : "سيبدأ قريبًا"}
              </span>
              رقم المزاد: #M12345 | تاريخ النشر: 25/02/2025
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className={`btn btn-outline-${isFavorite ? 'danger' : 'secondary'}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <i className={isFavorite ? "fas fa-heart" : "far fa-heart"} />
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-share-alt" />
            </button>
          </div>
        </div>
        
        {/* Main Content Row */}
        <div className="row g-4">
          {/* Left Column - Product Info */}
          <div className="col-lg-8">
            {/* Product Card */}
            <div className="card product-card mb-4">
              <div className="position-relative">
                {/* Image principale avec navigation */}
                <div className="position-relative">
                  <img
                    src={galleryImages[activeImageIndex]}
                    className="card-img-top"
                    alt="سيارة مرسيدس"
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                  <span className={`auction-badge badge ${auctionStatus === "active" ? "bg-danger" : "bg-warning text-dark"} p-2 position-absolute top-0 end-0 m-3`}>
                    {auctionStatus === "active" ? "مزاد جارٍ" : "سيبدأ قريبًا"}
                  </span>
                  
                  {/* Flèches de navigation */}
                  <button 
                    onClick={prevImage}
                    className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
                    style={{ opacity: 0.8, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <button 
                    onClick={nextImage}
                    className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2"
                    style={{ opacity: 0.8, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  
                  {/* Indicateur de position */}
                  <div className="position-absolute bottom-0 end-0 bg-dark bg-opacity-50 text-white px-3 py-1 m-3 rounded">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </div>
                  
                  {/* Bouton pour ouvrir toutes les photos */}
                  <button 
                    className="btn btn-light btn-sm position-absolute bottom-0 start-0 m-3"
                    data-bs-toggle="modal"
                    data-bs-target="#photoModal"
                  >
                    <i className="fas fa-th me-1"></i> عرض المزيد
                  </button>
                </div>
              </div>
              
              <div className="card-body p-4">
                <div className="mb-4">
                  <div className="row">
                    <div className="col-md-7">
                      <h4 className="mb-3">مرسيدس بنز SL 1965</h4>
                      <p>
                        سيارة كلاسيكية نادرة في حالة ممتازة، تم ترميمها بالكامل مع
                        الحفاظ على أصالتها. تعتبر هذه السيارة من أيقونات التصميم
                        الألماني في ستينيات القرن العشرين.
                      </p>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-user-circle text-muted me-2" />
                          <span>
                            البائع:{" "}
                            <a href="#" className="text-decoration-none">
                              سلمان المغربي
                            </a>
                          </span>
                          <span className="badge bg-success ms-2">
                            بائع موثوق
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <i className="fas fa-map-marker-alt text-muted me-2" />
                          <span>الموقع: الدار البيضاء، المغرب</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="auction-info mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>رقم الشاسيه:</span>
                          <span className="fw-bold">MER19650023145</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>سنة الصنع:</span>
                          <span className="fw-bold">1965</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>المحرك:</span>
                          <span className="fw-bold">6 اسطوانات</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>عدد الكيلومترات:</span>
                          <span className="fw-bold">86,200 كم</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>حالة السيارة:</span>
                          <span className="fw-bold text-success">
                            ممتازة (مجددة)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modal pour afficher les photos en grand format */}
                <div
                  className="modal fade"
                  id="photoModal"
                  tabIndex={-1}
                  aria-labelledby="photoModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="photoModalLabel">
                          معرض الصور
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div className="text-center mb-3 position-relative">
                          <img
                            id="modalMainImage"
                            src={galleryImages[modalImageIndex]}
                            className="img-fluid rounded"
                            alt="صورة كبيرة"
                            style={{ maxHeight: '70vh' }}
                          />
                          
                          {/* Flèches de navigation dans le modal */}
                          <button 
                            onClick={() => {
                              const newIndex = modalImageIndex === 0 ? galleryImages.length - 1 : modalImageIndex - 1;
                              changeModalImage(newIndex);
                            }}
                            className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
                            style={{ opacity: 0.8, width: '40px', height: '40px' }}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          
                          <button 
                            onClick={() => {
                              const newIndex = modalImageIndex === galleryImages.length - 1 ? 0 : modalImageIndex + 1;
                              changeModalImage(newIndex);
                            }}
                            className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ opacity: 0.8, width: '40px', height: '40px' }}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                        <div className="d-flex overflow-auto gap-2 pb-2">
                          {galleryImages.map((img, index) => (
                            <img
                              key={`modal-thumb-${index}`}
                              src={img}
                              className={`thumbnail modal-thumb ${modalImageIndex === index ? 'border border-primary' : ''}`}
                              alt={`صورة ${index + 1}`}
                              onClick={() => changeModalImage(index)}
                              style={{ cursor: 'pointer', width: '100px', height: '75px', objectFit: 'cover' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bid History ou information sur l'enchère à venir */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  {auctionStatus === "active" ? (
                    <><i className="fas fa-history me-2" /> سجل المزايدات</>
                  ) : (
                    <><i className="fas fa-clock me-2" /> معلومات المزاد القادم</>
                  )}
                </h5>
              </div>
              
              {auctionStatus === "active" ? (
                <>
                  <div className="bid-history">
                    <ul className="list-group list-group-flush">
                      {bidHistory.map((bid) => (
                        <li 
                          className={`list-group-item bid-item ${bid.isHighest ? 'highest-bid' : ''}`}
                          key={bid.id}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="bid-number me-2">{bid.id}</div>
                              <div>
                                <div className={bid.isHighest ? "fw-bold" : ""}>{`المزايد #${bid.bidder}`}</div>
                                <small className="text-muted">{`منذ ${bid.time}`}</small>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className={`fw-bold ${bid.isHighest ? "text-success" : ""}`}>
                                {formatNumber(bid.amount)} درهم
                              </div>
                              {bid.isHighest && <small className="text-muted">أعلى عرض</small>}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">إجمالي المزايدات: {bidCount}</span>
                      <span className="text-muted">المزايدين المشاركين: {activeParticipants}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card-body">
                  <div className="text-center py-3">
                    <h6 className="mb-3">سيبدأ المزاد خلال</h6>
                    <div className="display-6 fw-bold mb-3">
                      {countdown.days} يوم {countdown.hours} ساعة {countdown.minutes} دقيقة {countdown.seconds} ثانية
                    </div>
                    <p className="mb-4">
                      يمكنك متابعة هذا المزاد للحصول على إشعار عند بدء المزاد
                    </p>
                    <button className="btn btn-warning mb-2" onClick={() => setIsFavorite(true)}>
                      <i className="far fa-bell me-2"></i> متابعة المزاد
                    </button>
                    <div className="alert alert-info mt-3">
                      <i className="fas fa-info-circle me-2"></i>
                      " سيبدأ هذا المزاد يوم الأربعاء، 28 février 2025 في تمام الساعة 10:00 صباحًا"







</div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6>الأشخاص المهتمين بهذا المزاد</h6>
                        <p className="mb-0"><i className="fas fa-user text-muted me-2"></i> {isFavorite ? 88 : 87} شخص</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6>سعر بداية المزاد</h6>
                        <p className="mb-0 fw-bold">150,000 درهم</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Auction Summary */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2" /> ملخص المزاد
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="text-muted mb-2">سعر البداية</div>
                      <h5 className="mb-0">150,000 درهم</h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="text-muted mb-2">
                        {auctionStatus === "active" ? "أعلى مزايدة" : "السعر المتوقع"}
                      </div>
                      <h5 className={`mb-0 ${auctionStatus === "active" ? "text-success" : ""}`}>
                        {auctionStatus === "active" 
                          ? `${formatNumber(currentBid)} درهم` 
                          : "175,000 - 200,000 درهم"}
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="text-muted mb-2">
                        {auctionStatus === "active" ? "نسبة الزيادة" : "مدة المزاد"}
                      </div>
                      <h5 className="mb-0">
                        {auctionStatus === "active"
                          ? `${Math.round(((currentBid - 150000) / 150000) * 100)}%`
                          : "3 أيام"}
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="text-muted mb-2">
                        {auctionStatus === "active" ? "معدل المزايدات" : "تاريخ انتهاء المزاد"}
                      </div>
                      <h5 className="mb-0">
                        {auctionStatus === "active"
                          ? "3.2 / ساعة"
                          : "03/03/2025"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Auction Rules */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2" /> قواعد المزاد
                </h5>
              </div>
              <div className="card-body">
                <ul className="mb-0">
                  <li className="mb-2">
                    الحد الأدنى للزيادة هو 1,000 درهم عن السعر الحالي.
                  </li>
                  <li className="mb-2">
                    يتم تمديد وقت المزاد تلقائيًا لمدة 5 دقائق إذا تم تقديم عرض في
                    آخر دقيقتين.
                  </li>
                  <li className="mb-2">
                    يجب دفع تأمين بقيمة 10% من قيمة العرض المبدئي للمشاركة في
                    المزاد.
                  </li>
                  <li className="mb-2">
                    يلتزم الفائز بدفع كامل المبلغ خلال 48 ساعة من انتهاء المزاد.
                  </li>
                  <li>جميع العروض نهائية ولا يمكن إلغاؤها بعد تقديمها.</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Column - Bidding Info */}
          <div className="col-lg-4">
            {/* Current Bid Info */}
            <div className={`card mb-4 border-${auctionStatus === "active" ? "danger" : "warning"}`}>
              <div className={`card-header ${auctionStatus === "active" ? "bg-danger text-white" : "bg-warning"}`}>
                <h5 className="mb-0">
                  {auctionStatus === "active" ? (
                    <><i className="fas fa-gavel me-2" /> معلومات المزايدة</>
                  ) : (
                    <><i className="fas fa-clock me-2" /> المزاد سيبدأ قريبًا</>
                  )}
                </h5>
              </div>
              <div className="card-body">
                {/* Timer */}
                <div className="timer-container mb-3 text-center">
                  <p className="mb-2">
                    {auctionStatus === "active" ? "ينتهي المزاد خلال" : "سيبدأ المزاد خلال"}
                  </p>
                  {auctionStatus === "active" ? (
                    <div className="d-flex justify-content-center gap-2" id="countdown-display">
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.hours.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">ساعة</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.minutes.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">دقيقة</span>
                      </div>
                      <div className="timer-box">
                      <span className="timer-value">
                          {countdown.seconds.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">ثانية</span>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center gap-2" id="countdown-display">
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.days.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">يوم</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.hours.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">ساعة</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.minutes.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">دقيقة</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value">
                          {countdown.seconds.toString().padStart(2, '0')}
                        </span>
                        <span className="timer-unit">ثانية</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Current Bid - seulement affiché si l'enchère est active */}
                {auctionStatus === "active" && (
                  <>
                    <div className="text-center mb-3">
                      <p className="mb-0 text-muted">المزايدة الحالية</p>
                      <h1 className="display-4 fw-bold price-change">{formatNumber(currentBid)} درهم</h1>
                      <p className="mb-0">
                        <span className="badge bg-secondary me-1">{bidCount} مزايدة</span>
                        آخر مزايدة منذ{" "}
                        <span className="text-danger fw-bold">{bidHistory[0]?.time || "الآن"}</span>
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <p className="mb-1 d-flex justify-content-between">
                        <span>سعر البداية</span>
                        <span>السعر المتوقع</span>
                      </p>
                      <div className="progress mb-1">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${progressPercentage}%` }}
                          aria-valuenow={progressPercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mb-0 d-flex justify-content-between">
                        <small>150,000 درهم</small>
                        <small>200,000 درهم</small>
                      </p>
                    </div>
                    
                    {/* Bid Quick Selection */}
                    <p className="mb-2">المزايدة السريعة:</p>
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      {[1000, 2500, 5000, 10000].map((increment) => (
                        <div 
                          key={`increment-${increment}`}
                          className="increment-bid border rounded p-2 text-center"
                          onClick={() => handleQuickBid(increment)}
                          style={{ cursor: 'pointer', flexBasis: 'calc(25% - 8px)' }}
                        >
                          +{formatNumber(increment)}
                        </div>
                      ))}
                    </div>
                    
                    {/* Bid Input */}
                    <div className="input-group mb-3">
                      <span className="input-group-text">درهم</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="أدخل قيمة المزايدة"
                        value={userBidAmount}
                        onChange={(e) => setUserBidAmount(parseInt(e.target.value) || currentBid)}
                      />
                    </div>
                    
                    {/* Bid Button - désactivé si la caution n'est pas validée */}
                    <button 
                      className={`btn ${cautionStatus === "validated" ? "btn-danger bid-pulse" : "btn-secondary"} w-100 mb-3 btn-lg`}
                      onClick={() => submitBid(userBidAmount)}
                      disabled={cautionStatus !== "validated"}
                    >
                      <i className="fas fa-gavel me-2" /> قدم مزايدة
                    </button>
                    
                    {/* Message d'erreur si la caution n'est pas validée */}
                    {cautionStatus !== "validated" && (
                      <div className="alert alert-warning mb-3">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {cautionStatus === "none" 
                          ? "يجب دفع التأمين للمشاركة في المزاد" 
                          : "التأمين قيد التحقق، يرجى الانتظار"}
                      </div>
                    )}
                  </>
                )}
                
                {/* Options pour l'enchère à venir */}
                {auctionStatus === "upcoming" && (
                  <>
                    <div className="text-center mb-4">
                      <h5>سعر بداية المزاد</h5>
                      <h2 className="mb-3">150,000 درهم</h2>
                      <p className="mb-4">احصل على تنبيه عند بدء المزاد</p>
                      <button
                        className="btn btn-warning w-100 mb-3"
                        onClick={() => setIsFavorite(true)}
                      >
                        <i className="far fa-bell me-2"></i> تنبيهني عند بدء المزاد
                      </button>
                    </div>
                    
                    <div className="alert alert-info mb-3">
                      <h6 className="mb-2"><i className="fas fa-info-circle me-2"></i> معلومات عن المزاد</h6>
                      <p className="mb-1">سيبدأ المزاد يوم الأربعاء ٢٨ فبراير ٢٠٢٥</p>
                      <p className="mb-1">وقت البدء: ١٠:٠٠ صباحًا</p>
                      <p className="mb-0">مدة المزاد: ٣ أيام</p>
                    </div>
                    
                    <div className="border rounded p-3 mb-3">
                      <h6>للمشاركة في المزاد يجب:</h6>
                      <ul className="mb-0">
                        <li>التسجيل في المنصة</li>
                        <li>تأكيد رقم الهاتف والبريد الإلكتروني</li>
                        <li>إيداع تأمين بقيمة 10% من قيمة المزاد</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {/* Bid Info - affiché dans les deux états */}
                <div className="auction-info mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>سعر البداية:</span>
                    <span className="fw-bold">150,000 درهم</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>الحد الأدنى للزيادة:</span>
                    <span className="fw-bold">1,000 درهم</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>عدد المزايدين:</span>
                    <span className="fw-bold">{activeParticipants} مزايد</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>رسوم المنصة:</span>
                    <span className="fw-bold">5%</span>
                  </div>
                </div>
                
                {/* Dépôt de caution - affiché dans les deux états */}
                <div className="card border-warning mb-3">
        <div className="card-header bg-warning">
          <h6 className="mb-0">
            <i className="fas fa-shield-alt me-2" /> كفالة المشاركة
          </h6>
        </div>
        
        <div className="card-body">
          <div className={`alert alert-${getStatusColor()} small`} role="alert">
            <i className="fas fa-info-circle me-2"></i>
            يجب إيداع كفالة قدرها 15,000 درهم للمشاركة في هذا المزاد. سيتم التحقق من الكفالة يدويًا من قبل المسؤول.
          </div>
          
          {adminMessage && (
            <div className={`alert alert-${depositStatus === "rejected" ? "danger" : "info"} small`}>
              <i className={`fas fa-${depositStatus === "rejected" ? "exclamation-triangle" : "comment"} me-2`}></i>
              {adminMessage}
            </div>
          )}
          
          <div className="deposit-status mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>حالة الكفالة:</span>
              <span className={`badge bg-${getStatusColor()}`}>{getStatusText()}</span>
            </div>
            <div className="progress" style={{ height: "5px" }}>
              <div
                className={`progress-bar bg-${getStatusColor()}`}
                role="progressbar"
                style={{ width: getStatusProgress() }}
                aria-valuenow={depositStatus === "pending" ? 50 : 100}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          
          {/* Formulaire de caution */}
              {depositStatus !== "confirmed" && (
                <form onSubmit={submitDeposit}>
                  <div className="mb-3">
                    <label htmlFor="depositMethod" className="form-label">طريقة الدفع</label>
                    <select 
                      className="form-select" 
                      id="depositMethod"
                      value={depositMethod}
                      onChange={(e) => setDepositMethod(e.target.value)}
                      disabled={depositStatus === "rejected" || isSubmitting}
                    >
                      <option value="">اختر طريقة الدفع</option>
                      <option value="bank">تحويل بنكي</option>
                      <option value="card">بطاقة ائتمان</option>
                      <option value="wallet">محفظة إلكترونية</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="depositFile" className="form-label">إرفاق إيصال الدفع</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="depositFile" 
                      onChange={handleFileChange}
                      disabled={depositStatus === "rejected" || isSubmitting}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div className="form-text">صيغ مقبولة: PDF، JPG، PNG (أقصى حجم: 5MB)</div>
                  </div>
                  
                  <button 
                    className="btn btn-warning w-100" 
                    type="submit"
                    disabled={depositStatus === "rejected" || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload me-2"></i>
                        {depositStatus === "pending" && depositFile ? "إعادة إرسال إثبات الكفالة" : "إرسال إثبات الكفالة"}
                      </>
                    )}
                  </button>
                </form>
              )}
              
              {/* Message pour les utilisateurs confirmés */}
              {depositStatus === "confirmed" && (
                <div className="text-center py-2">
                  <i className="fas fa-check-circle text-success display-1 mb-3"></i>
                  <p className="mb-0">تم تأكيد الكفالة الخاصة بك</p>
                  <p>يمكنك الآن المشاركة في المزاد بكل حرية</p>
                </div>
              )}
            </div>
          </div>
                
               
              </div>
            </div>

            
            
            {/* Documents et certificats */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-file-alt me-2"></i> المستندات والشهادات
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-file-pdf text-danger me-2"></i> شهادة فحص السيارة</span>
                    <button className="btn btn-sm btn-outline-primary">عرض</button>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-file-pdf text-danger me-2"></i> تاريخ الصيانة</span>
                    <button className="btn btn-sm btn-outline-primary">عرض</button>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-file-pdf text-danger me-2"></i> شهادة أصالة</span>
                    <button className="btn btn-sm btn-outline-primary">عرض</button>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-file-pdf text-danger me-2"></i> وثائق الترميم</span>
                    <button className="btn btn-sm btn-outline-primary">عرض</button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CSS pour les styles spécifiques */}
      <style jsx>{`
        .direction_rtl {
          direction: rtl;
          text-align: right;
        }
        
        .timer-box {
          background-color: #f8f9fa;
          border-radius: 5px;
          padding: 8px 12px;
          min-width: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .timer-value {
          font-size: 24px;
          font-weight: bold;
        }
        
        .timer-unit {
          font-size: 12px;
          color: #6c757d;
        }
        
        .increment-bid {
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .increment-bid:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd;
        }
        
        .bid-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }
        
        .highest-bid {
          background-color: rgba(25, 135, 84, 0.1);
        }
        
        .price-change {
          transition: all 0.3s;
        }
        
        .price-change:hover {
          color: #198754;
        }
        
        .bid-number {
          background-color: #f8f9fa;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default AuctionPage;