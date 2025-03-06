import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '../services/api.config';

function UserProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // État pour les données du profil
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    role: ''
  });
  
  // Formulaire pour l'édition
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: ''
  });

  // Charger les données du profil au chargement du composant
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      
      // Récupérer le token et userId du stockage
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      if (!token || !userId) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(getApiUrl(`/users/users`), {
          /*headers: { 
            Authorization: `Bearer ${token}`
          }*/
        });
        // Adapter selon votre API réelle
        const userData = response.data;
        setProfile({
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone_number: userData.phone_number || '',
          address: userData.address || '',
          city: userData.city || '',
          role: userData.role || ''
        });
        
        // Initialiser le formulaire avec les mêmes données
        setFormData({
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone_number: userData.phone_number || '',
          address: userData.address || '',
          //city: userData.city || ''
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setMessage({
          type: 'danger',
          text: 'فشل في تحميل بيانات الملف الشخصي. يرجى المحاولة مرة أخرى.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  // Gestionnaire de changement pour le formulaire principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestionnaire de changement pour le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumettre les modifications du profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    try {
      await axios.put(getApiUrl(`/users/${userId}`), formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      
      // Mettre à jour le profil local avec les nouvelles données
      setProfile({
        ...profile,
        ...formData
      });
      
      setMessage({
        type: 'success',
        text: 'تم تحديث الملف الشخصي بنجاح'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({
        type: 'danger',
        text: 'فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Soumettre le changement de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'danger',
        text: 'كلمات المرور الجديدة غير متطابقة'
      });
      return;
    }
    
    setIsLoading(true);
    
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    try {
      await axios.put(getApiUrl(`/users/${userId}/password`), {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        new_password_confirm: passwordForm.confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage({
        type: 'success',
        text: 'تم تغيير كلمة المرور بنجاح'
      });
      
      // Réinitialiser le formulaire
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setMessage({
        type: 'danger',
        text: 'فشل في تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtenir le nom complet pour l'affichage
  const getFullName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile.first_name) {
      return profile.first_name;
    } else if (profile.last_name) {
      return profile.last_name;
    } else {
      return profile.email.split('@')[0];
    }
  };

  if (isLoading && !profile.email) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جار التحميل...</span>
        </div>
        <p className="mt-2">جار تحميل بيانات الملف الشخصي...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 direction_rtl">
      <div className="row">
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-user-circle fa-6x text-secondary"></i>
              </div>
              <h5 className="card-title">{getFullName()}</h5>
              <p className="card-text text-muted">
                <span className="badge bg-primary">{profile.role}</span>
              </p>
              <div className="d-grid gap-2">
                {!isEditing ? (
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    <i className="fas fa-edit me-2"></i>
                    تعديل الملف الشخصي
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => {
                      setIsEditing(false);
                      // Restaurer les données originales
                      setFormData({
                        email: profile.email,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        phone_number: profile.phone_number,
                        address: profile.address,
                        city: profile.city
                      });
                    }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-times me-2"></i>
                    إلغاء التعديل
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">معلومات الاتصال</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <i className="fas fa-envelope me-2 text-muted"></i>
                {profile.email}
              </div>
              {profile.phone_number && (
                <div className="mb-3">
                  <i className="fas fa-phone me-2 text-muted"></i>
                  {profile.phone_number}
                </div>
              )}
              {profile.address && (
                <div className="mb-3">
                  <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                  {profile.address}
                  {profile.city && `, ${profile.city}`}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setMessage({ type: '', text: '' })}
              ></button>
            </div>
          )}
          
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                {isEditing ? 'تعديل المعلومات الشخصية' : 'المعلومات الشخصية'}
              </h5>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="first_name" className="form-label">الاسم الأول</label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="last_name" className="form-label">اسم العائلة</label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <small className="form-text text-muted">لا يمكن تغيير البريد الإلكتروني</small>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label">رقم الهاتف</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">المدينة</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">العنوان</label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جار الحفظ...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          حفظ التغييرات
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">الاسم الأول</h6>
                    <p>{profile.first_name || 'غير محدد'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">اسم العائلة</h6>
                    <p>{profile.last_name || 'غير محدد'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">البريد الإلكتروني</h6>
                    <p>{profile.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">رقم الهاتف</h6>
                    <p>{profile.phone_number || 'غير محدد'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">المدينة</h6>
                    <p>{profile.city || 'غير محدد'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">العنوان</h6>
                    <p>{profile.address || 'غير محدد'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">تغيير كلمة المرور</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="newPassword" className="form-label">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <small className="form-text text-muted">
                      يجب أن تحتوي على 8 أحرف على الأقل
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جار المعالجة...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key me-2"></i>
                        تغيير كلمة المرور
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;