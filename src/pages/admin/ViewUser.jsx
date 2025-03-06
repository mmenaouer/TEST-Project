import React from 'react';

function ViewUser({ selectedUser, onCancel, onEditUser }) {
  // Fonction pour obtenir la classe de badge appropriée selon le statut
  const getBadgeClass = (status) => {
    if (!status) return "bg-secondary";
    
    if (typeof status === 'object' && status.class) {
      return status.class;
    }
    
    switch (status) {
      case 'active':
      case 'نشط':
        return 'bg-success';
      case 'pending':
      case 'معلق':
        return 'bg-warning text-dark';
      case 'banned':
      case 'محظور':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    if (!status) return "غير محدد";
    
    if (typeof status === 'object' && status.text) {
      return status.text;
    }
    
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'معلق';
      case 'banned':
        return 'محظور';
      default:
        return status;
    }
  };

  if (!selectedUser) {
    return (
      <div className="alert alert-warning m-5" role="alert">
        <h4 className="alert-heading">تنبيه!</h4>
        <p>لم يتم تحديد أي مستخدم للعرض</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">بيانات المستخدم</h2>
        <div>
          
          <button className="btn btn-outline-secondary" onClick={onCancel}>
            <i className="fas fa-arrow-right me-1"></i>
            عودة إلى قائمة المستخدمين
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <img 
                src={selectedUser.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120"} 
                alt="صورة المستخدم" 
                className="img-fluid rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h5>{`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`}</h5>
              {selectedUser.role && (
                <span className={`badge ${getBadgeClass(selectedUser.role)} role-badge`}>
                  {typeof selectedUser.role === 'object' ? selectedUser.role.text : selectedUser.role}
                </span>
              )}
              <p className="mt-2 mb-0 text-muted">
                تاريخ التسجيل: {selectedUser.regDate || 'غير محدد'}
              </p>
            </div>
            <div className="col-md-9">
              <h5 className="border-bottom pb-2 mb-3">معلومات الاتصال</h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">البريد الإلكتروني:</p>
                  <p className="mb-0"><i className="fas fa-envelope text-muted me-2"></i> {selectedUser.email || 'غير محدد'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">رقم الهاتف:</p>
                  <p className="mb-0"><i className="fas fa-phone text-muted me-2"></i> {selectedUser.phone || 'غير محدد'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">الحالة:</p>
                  <p className="mb-0">
                    <span className={`badge ${getBadgeClass(selectedUser.status)}`}>
                      {getStatusText(selectedUser.status)}
                    </span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">معرف المستخدم:</p>
                  <p className="mb-0"><i className="fas fa-id-card text-muted me-2"></i> {selectedUser.id || 'غير محدد'}</p>
                </div>
              </div>
              
              <h5 className="border-bottom pb-2 mb-3">معلومات إضافية</h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">المدينة:</p>
                  <p className="mb-0"><i className="fas fa-map-marker-alt text-muted me-2"></i> {selectedUser.city || 'غير محدد'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">البلد:</p>
                  <p className="mb-0"><i className="fas fa-globe text-muted me-2"></i> {selectedUser.country || 'غير محدد'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">المحكمة:</p>
                  <p className="mb-0"><i className="fas fa-gavel text-muted me-2"></i> {selectedUser.tribunal || 'غير محدد'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="fw-bold mb-1">شركة القروض:</p>
                  <p className="mb-0"><i className="fas fa-building text-muted me-2"></i> {selectedUser.creditCompany || 'غير محدد'}</p>
                </div>
              </div>
              
              <h5 className="border-bottom pb-2 mb-3">الإحصائيات</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="border rounded text-center p-3">
                    <div className="fs-4 fw-bold text-primary">0</div>
                    <div className="text-muted small">المزادات المنشأة</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="border rounded text-center p-3">
                    <div className="fs-4 fw-bold text-success">0</div>
                    <div className="text-muted small">المزادات الفائزة</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="border rounded text-center p-3">
                    <div className="fs-4 fw-bold text-info">0</div>
                    <div className="text-muted small">المزايدات المقدمة</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="border rounded text-center p-3">
                    <div className="fs-4 fw-bold text-warning">0</div>
                    <div className="text-muted small">المبلغ المنفق</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;