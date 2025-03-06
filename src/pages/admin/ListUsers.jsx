import React, { useState, useEffect } from 'react';
import SlideAdmin from '../../components/SlideAdmin';
import axios from 'axios';
import { getApiUrl } from '../../services/api.config';
import { useNavigate } from 'react-router-dom';

function ListUsers({ 
  onAddUser, 
  onEditUser, 
  onViewUser, 
  users, 
  setUsers, 
  loading, 
  error, 
  showSuccess, 
  showError 
}) {
  const navigate = useNavigate();
  
  // État pour la liste des utilisateurs et la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // États pour les actions utilisateur
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Statistiques des utilisateurs
  const userStats = {
    total: users.length || 0,
    sellers: users.filter(user => user.role?.text === "بائع").length || 0,
    buyers: users.filter(user => user.role?.text === "متزايد").length || 0,
    admins: users.filter(user => user.role?.text === "مدير").length || 0
  };

  // Appliquer les filtres
  useEffect(() => {
    if (!users.length) return;
    
    let filtered = [...users];
    
    // Appliquer le filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName && user.lastName && 
        (`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm)))
      );
    }
    
    // Appliquer le filtre de rôle
    if (roleFilter && roleFilter !== 'جميع الأدوار') {
      filtered = filtered.filter(user => user.role && user.role.text === roleFilter);
    }
    
    // Appliquer le filtre de statut
    if (statusFilter && statusFilter !== 'جميع الحالات') {
      filtered = filtered.filter(user => user.status && user.status.text === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Calculer les éléments actuels à afficher après avoir appliqué les filtres
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Ajustement pour éviter de rester sur une page vide après filtrage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  // Gestionnaires d'événements pour les filtres
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Retour à la première page après une recherche
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Retour à la première page après changement de filtre
  };
  
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Retour à la première page après changement de filtre
  };
  
  // Ouvrir modal pour changer le statut d'un utilisateur
  const handleToggleStatusClick = (user) => {
    setUserToToggleStatus(user);
    
    // Ouvrir le modal de confirmation
    document.getElementById('toggleStatusModal').classList.add('show');
    document.getElementById('toggleStatusModal').style.display = 'block';
    document.body.classList.add('modal-open');
    // Ajouter un backdrop modal
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  };
  
  // Fermer un modal
  const closeModal = (modalId) => {
    document.getElementById(modalId).classList.remove('show');
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
  };
  
  // Confirmer le changement de statut d'un utilisateur
  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Déterminer le nouveau statut
      const newStatus = userToToggleStatus.status.text === "محظور" 
        ? getStatusDetails("active") 
        : getStatusDetails("banned");
      
      // Faire l'appel API pour changer le statut de l'utilisateur
      await axios.put(getApiUrl(`/users/${userToToggleStatus.id}/state`), {
        status: newStatus.text === "نشط" ? "active" : "banned"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour l'utilisateur dans la liste locale
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userToToggleStatus.id 
          ? { ...user, status: newStatus }
          : user
      ));
      
      // Fermer le modal
      closeModal('toggleStatusModal');
      
      // Afficher un message de succès
      showSuccess(newStatus.text === "نشط" 
        ? 'تم إلغاء حظر المستخدم بنجاح' 
        : 'تم حظر المستخدم بنجاح');
      
      // Réinitialiser l'utilisateur à modifier
      setUserToToggleStatus(null);
    } catch (error) {
      console.error("Erreur lors du changement de statut de l'utilisateur:", error);
      showError('حدث خطأ أثناء تغيير حالة المستخدم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour obtenir les détails du statut à partir de la valeur
  const getStatusDetails = (statusValue) => {
    switch(statusValue) {
      case 'active':
        return { text: "نشط", class: "bg-success" };
      case 'inactive':
        return { text: "غير نشط", class: "bg-secondary" };
      case 'pending':
        return { text: "معلق", class: "bg-warning" };
      case 'banned':
        return { text: "محظور", class: "bg-danger" };
      default:
        return { text: "نشط", class: "bg-success" };
    }
  };

  // Afficher le chargement
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );

  // Afficher l'erreur
  if (error) return (
    <div className="alert alert-danger m-5" role="alert">
      <h4 className="alert-heading">خطأ!</h4>
      <p>{error.message || 'حدث خطأ أثناء تحميل البيانات'}</p>
    </div>
  );

  return (
    <>
      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stats-card text-center">
            <div className="card-body">
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h5>إجمالي المستخدمين</h5>
              <h2>{userStats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card text-center">
            <div className="card-body">
              <i className="fas fa-user-tag fa-2x text-success mb-2"></i>
              <h5>البائعون</h5>
              <h2>{userStats.sellers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card text-center">
            <div className="card-body">
              <i className="fas fa-shopping-cart fa-2x text-info mb-2"></i>
              <h5>المشترون</h5>
              <h2>{userStats.buyers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card text-center">
            <div className="card-body">
              <i className="fas fa-user-shield fa-2x text-danger mb-2"></i>
              <h5>المدراء</h5>
              <h2>{userStats.admins}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="content-wrapper mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title mb-0">إدارة المستخدمين</h2>
          <button className="btn btn-primary" onClick={onAddUser}>
            <i className="fas fa-user-plus me-1"></i>
            إضافة مستخدم جديد
          </button>
        </div>

        {/* Filter Bar */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="ابحث عن مستخدم..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={roleFilter}
              onChange={handleRoleChange}
            >
              <option value="">جميع الأدوار</option>
              <option value="مدير">مدير</option>
              <option value="مدير عام">مدير عام</option>
              <option value="شركة القروض">شركة القروض</option>
              <option value="متزايد">متزايد</option>
              <option value="المحكمة">المحكمة</option>
              <option value="الوزارة">الوزارة</option>
            </select>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="غير نشط">غير نشط</option>
              <option value="معلق">معلق</option>
              <option value="محظور">محظور</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th style={{ width: 60 }}></th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>الدور</th>
                <th>تاريخ التسجيل</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((user, index) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>
                      <img 
                        src={user.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120"} 
                        className="user-avatar" 
                        alt="صورة المستخدم" 
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
                    </td>
                    <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                    <td>{user.email || ''}</td>
                    <td>{user.phone || ''}</td>
                    <td>
                      {user.role && (
                        <span className={`badge ${user.role.class} role-badge`}>
                          {user.role.text}
                        </span>
                      )}
                    </td>
                    <td>{user.regDate || ''}</td>
                    <td>
                      {user.status && (
                        <span className={`badge ${user.status.class}`}>
                          {user.status.text}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          title="تعديل"
                          onClick={() => onEditUser(user)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {user.status && user.status.text === "محظور" ? (
                          <button 
                            className="btn btn-sm btn-outline-success me-1"
                            title="إلغاء الحظر"
                            onClick={() => handleToggleStatusClick(user)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-danger me-1"
                            title="حظر المستخدم"
                            onClick={() => handleToggleStatusClick(user)}
                          >
                            <i className="fas fa-ban"></i>
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-info"
                          title="عرض التفاصيل"
                          onClick={() => onViewUser(user)}
                        >
                          <i className="fas fa-eye"></i>
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
        {filteredUsers.length > 0 && (
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    prevPage();
                  }}
                  disabled={currentPage === 1}
                >
                  السابق
                </button>
              </li>
              {[...Array(totalPages).keys()].map(number => (
                <li 
                  className={`page-item ${currentPage === number + 1 ? 'active' : ''}`} 
                  key={number + 1}
                >
                  <button 
                    className="page-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(number + 1);
                    }}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    nextPage();
                  }}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
      
      {/* Modal de confirmation de changement de statut */}
      <div className="modal fade" id="toggleStatusModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">تأكيد تغيير الحالة</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => closeModal('toggleStatusModal')}
              ></button>
            </div>
            <div className="modal-body text-center p-4">
              <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
              {userToToggleStatus && userToToggleStatus.status.text === "محظور" ? (
                <>
                  <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في إلغاء حظر هذا المستخدم؟</p>
                  <p className="text-muted">سيتمكن المستخدم من استخدام النظام مرة أخرى.</p>
                </>
              ) : (
                <>
                  <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في حظر هذا المستخدم؟</p>
                  <p className="text-muted">لن يتمكن المستخدم من استخدام النظام حتى يتم إلغاء الحظر.</p>
                </>
              )}
              {userToToggleStatus && (
                <div className="user-info mt-3 p-3 border rounded bg-light">
                  <div className="d-flex align-items-center">
                    <img 
                      src={userToToggleStatus.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120"} 
                      alt="صورة المستخدم" 
                      style={{ width: "40px", height: "40px", borderRadius: "50%", marginLeft: "10px" }}
                    />
                    <div className="text-start">
                      <p className="mb-0 fw-bold">{`${userToToggleStatus.firstName} ${userToToggleStatus.lastName}`}</p>
                      <p className="mb-0 small text-muted">{userToToggleStatus.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer justify-content-center">
              <button 
                type="button" 
                className="btn btn-secondary px-4" 
                onClick={() => closeModal('toggleStatusModal')}
              >
                إلغاء
              </button>
              <button 
                type="button" 
                className={`btn ${userToToggleStatus && userToToggleStatus.status.text === "محظور" ? 'btn-success' : 'btn-danger'} px-4`} 
                onClick={confirmToggleStatus}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    جار المعالجة...
                  </>
                ) : (
                  <>
                    <i className={`fas ${userToToggleStatus && userToToggleStatus.status.text === "محظور" ? 'fa-check' : 'fa-ban'} me-1`}></i> 
                    {userToToggleStatus && userToToggleStatus.status.text === "محظور" ? 'إلغاء الحظر' : 'حظر'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListUsers;