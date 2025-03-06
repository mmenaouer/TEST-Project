import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideAdmin from '../../components/SlideAdmin';

function BakendHome() {
    const navigate = useNavigate();
  
    const handleAddEnchere = () => {
      navigate("/AddEnchere"); 
    };

    // Fonction pour modifier une enchère
    const handleEditAuction = (auctionId) => {
      navigate(`/EditEnchere/${auctionId}`);
    };

    // Fonction pour ouvrir la modal de confirmation de suppression
    const openDeleteModal = (auctionId) => {
      setAuctionToDelete(auctionId);
      setShowDeleteModal(true);
    };

    // Fonction pour confirmer la suppression d'une enchère
    const confirmDeleteAuction = () => {
      if (auctionToDelete) {
        // Supprimer l'enchère du tableau des enchères
        const updatedAuctions = auctions.filter(auction => auction.id !== auctionToDelete);
        setAuctions(updatedAuctions);
        
        // Fermer la modal de confirmation
        setShowDeleteModal(false);
        
        // Afficher le toast de confirmation
        setSuccessMessage('تم حذف المزاد بنجاح');
        setShowSuccessToast(true);
        
        // Masquer le toast après 3 secondes
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      }
    };

    // Fonction pour annuler la suppression
    const cancelDeleteAuction = () => {
      setShowDeleteModal(false);
      setAuctionToDelete(null);
    };

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "سيارة مرسيدس كلاسيكية 1965",
      category: "سيارات",
      currentPrice: "172,500 درهم",
      bids: 23,
      date: "27/02/2025",
      status: { text: "نشط", class: "bg-success" }
    },
    {
      id: 2,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "ساعة رولكس سابمارينر أصلية",
      category: "مجوهرات",
      currentPrice: "65,200 درهم",
      bids: 32,
      date: "27/02/2025",
      status: { text: "نشط", class: "bg-success" }
    },
    {
      id: 3,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "فيلا فاخرة في مراكش",
      category: "عقارات",
      currentPrice: "1,200,000 درهم",
      bids: 0,
      date: "28/02/2025",
      status: { text: "مجدول", class: "bg-warning" }
    },
    {
      id: 4,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "سجادة أمازيغية قديمة",
      category: "تحف",
      currentPrice: "12,800 درهم",
      bids: 15,
      date: "25/02/2025",
      status: { text: "مكتمل", class: "bg-secondary" }
    },
    {
      id: 5,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "جهاز ماك بوك برو 2023 جديد",
      category: "إلكترونيات",
      currentPrice: "15,300 درهم",
      bids: 6,
      date: "27/02/2025",
      status: { text: "مسودة", class: "bg-info" }
    },
    {
      id: 6,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "لوحة فنية أصلية",
      category: "فن",
      currentPrice: "8,900 درهم",
      bids: 12,
      date: "26/02/2025",
      status: { text: "نشط", class: "bg-success" }
    },
    {
      id: 7,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "مجموعة كتب نادرة",
      category: "كتب",
      currentPrice: "4,500 درهم",
      bids: 8,
      date: "28/02/2025",
      status: { text: "مجدول", class: "bg-warning" }
    },
    {
      id: 8,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "أثاث منزلي عتيق",
      category: "أثاث",
      currentPrice: "22,600 درهم",
      bids: 18,
      date: "24/02/2025",
      status: { text: "مكتمل", class: "bg-secondary" }
    },
    {
      id: 9,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "هاتف آيفون 15 برو ماكس",
      category: "إلكترونيات",
      currentPrice: "9,800 درهم",
      bids: 29,
      date: "27/02/2025",
      status: { text: "نشط", class: "bg-success" }
    },
    {
      id: 10,
      image: "https://www.claudeusercontent.com/api/placeholder/50/50",
      title: "خاتم ألماس",
      category: "مجوهرات",
      currentPrice: "45,600 درهم",
      bids: 14,
      date: "26/02/2025",
      status: { text: "نشط", class: "bg-success" }
    }
  ]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...auctions];
    
    // Appliquer le filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(auction => 
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter && statusFilter !== 'جميع الحالات') {
      filtered = filtered.filter(auction => auction.status.text === statusFilter);
    }
    
    setFilteredAuctions(filtered);
  }, [auctions, searchTerm, statusFilter]);

  // Calculer les éléments actuels à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAuctions.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Aller à la page suivante
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Aller à la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Gestionnaires d'événements
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Retour à la première page après une recherche
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Retour à la première page après changement de filtre
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <SlideAdmin />
        {/* Main Content */}
        <div className="col-lg-10 py-4">
          <div className="container">
            {/* Auctions List View */}
            <div id="auctionsListView" >
              {/* Stats Row */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="fas fa-gavel fa-2x text-primary mb-2" />
                      <h5>إجمالي المزادات</h5>
                      <h2>{auctions.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="fas fa-play-circle fa-2x text-danger mb-2" />
                      <h5>مزادات نشطة</h5>
                      <h2>{auctions.filter(auction => auction.status.text === "نشط").length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="fas fa-clock fa-2x text-warning mb-2" />
                      <h5>في الانتظار</h5>
                      <h2>{auctions.filter(auction => auction.status.text === "مجدول").length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="fas fa-check-circle fa-2x text-success mb-2" />
                      <h5>مكتملة</h5>
                      <h2>{auctions.filter(auction => auction.status.text === "مكتمل").length}</h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* Auctions Management */}
              <div className="content-wrapper mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="page-title mb-0">إدارة المزادات</h2>
                  <button className="btn btn-primary" onClick={handleAddEnchere}>
                    <i className="fas fa-plus me-1" />
                    إضافة مزاد جديد
                  </button>
                </div>
                {/* Filter Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ابحث عن مزاد..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select"
                      value={statusFilter}
                      onChange={handleStatusChange}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="نشط">نشط</option>
                      <option value="مجدول">مجدول</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="مسودة">مسودة</option>
                    </select>
                  </div>
                </div>
                {/* Auctions Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 80 }}>الصورة</th>
                        <th>العنوان</th>
                        <th>الفئة</th>
                        <th>السعر الحالي</th>
                        <th>المزايدات</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((auction, index) => (
                          <tr key={auction.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                              <img
                                src={auction.image}
                                className="table-img"
                                alt="صورة المزاد"
                              />
                            </td>
                            <td>{auction.title}</td>
                            <td>{auction.category}</td>
                            <td>{auction.currentPrice}</td>
                            <td>{auction.bids}</td>
                            <td>{auction.date}</td>
                            <td>
                              <span className={`badge ${auction.status.class}`}>
                                {auction.status.text}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  onClick={() => handleEditAuction(auction.id)}
                                  title="تعديل المزاد"
                                >
                                  <i className="fas fa-edit" />
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger" 
                                  onClick={() => openDeleteModal(auction.id)}
                                  title="حذف المزاد"
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">لا توجد نتائج مطابقة</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {filteredAuctions.length > 0 && (
                  <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            prevPage();
                          }}
                          tabIndex={currentPage === 1 ? -1 : 0}
                          aria-disabled={currentPage === 1 ? "true" : "false"}
                        >
                          السابق
                        </a>
                      </li>
                      {[...Array(totalPages).keys()].map(number => (
                        <li className={`page-item ${currentPage === number + 1 ? 'active' : ''}`} key={number + 1}>
                          <a 
                            className="page-link" 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(number + 1);
                            }}
                          >
                            {number + 1}
                          </a>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a 
                          className="page-link" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            nextPage();
                          }}
                          tabIndex={currentPage === totalPages ? -1 : 0}
                          aria-disabled={currentPage === totalPages ? "true" : "false"}
                        >
                          التالي
                        </a>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">تأكيد الحذف</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelDeleteAuction}></button>
              </div>
              <div className="modal-body text-center p-4">
                <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في حذف هذا المزاد؟</p>
                <p className="text-muted">لا يمكن التراجع عن هذا الإجراء.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-secondary px-4" onClick={cancelDeleteAuction}>
                  إلغاء
                </button>
                <button type="button" className="btn btn-danger px-4" onClick={confirmDeleteAuction}>
                  <i className="fas fa-trash me-1"></i> حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de confirmation */}
      {showSuccessToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-success text-white">
              <i className="fas fa-check-circle me-2"></i>
              <strong className="me-auto">تم بنجاح</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccessToast(false)}></button>
            </div>
            <div className="toast-body d-flex align-items-center">
              <i className="fas fa-check-circle text-success me-2 fs-5"></i>
              {successMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BakendHome;