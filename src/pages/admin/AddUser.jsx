import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../services/api.config';

function AddUser({ onCancel, setUsers, showSuccess, showError }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [tribunals, setTribunals] = useState([]);
  const [creditOrganisms, setCreditOrganisms] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingTribunals, setLoadingTribunals] = useState(false);
  const [loadingCreditOrganisms, setLoadingCreditOrganisms] = useState(false);
  const [isForeignCountry, setIsForeignCountry] = useState(false);
  
  // ID du Maroc dans la base de données (à ajuster selon votre système)
  const MOROCCO_ID = 1; // À remplacer par l'ID réel du Maroc dans votre base de données
  
  // État pour le formulaire d'ajout d'utilisateur
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cin: '',
    password: '',
    password_confirm: '',
    role: '',
    status: 'active',
    avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
    pays_id: '',
    ville_id: '',
    ville_etranger: '',
    tribunal_id: '',
    organism_credit_id: '',
    address: '',
    registre_commerce: '',
    denomination_societe: ''
  });

  // Récupérer la liste des pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await axios.get(getApiUrl("/utilities/pays"));
        setCountries(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des pays:", err);
        showError('فشل في تحميل قائمة البلدان');
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Récupérer la liste des villes basée sur le pays sélectionné
  useEffect(() => {
    const fetchCities = async () => {
      // Réinitialiser les villes si pas de pays sélectionné
      if (!userForm.pays_id) {
        setCities([]);
        setIsForeignCountry(false);
        return;
      }

      // Vérifier si le pays sélectionné est le Maroc
      const isMorocco = userForm.pays_id === MOROCCO_ID;
      setIsForeignCountry(!isMorocco);
      
      // Si ce n'est pas le Maroc, pas besoin de récupérer les villes de l'API
      if (!isMorocco) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const response = await axios.get(getApiUrl(`/utilities/villes?pays_id=${userForm.pays_id}`));
        setCities(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des villes:", err);
        showError('فشل في تحميل قائمة المدن');
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [userForm.pays_id]);

  // Récupérer la liste des tribunaux
  useEffect(() => {
    const fetchTribunals = async () => {
      try {
        setLoadingTribunals(true);
        const response = await axios.get(getApiUrl("/utilities/tribunaux"));
        setTribunals(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des tribunaux:", err);
        showError('فشل في تحميل قائمة المحاكم');
      } finally {
        setLoadingTribunals(false);
      }
    };

    fetchTribunals();
  }, []);

  // Récupérer la liste des organismes de crédit
  useEffect(() => {
    const fetchCreditOrganisms = async () => {
      try {
        setLoadingCreditOrganisms(true);
        const response = await axios.get(getApiUrl("/utilities/organism-credit"));
        setCreditOrganisms(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des organismes de crédit:", err);
        showError('فشل في تحميل قائمة شركات القروض');
      } finally {
        setLoadingCreditOrganisms(false);
      }
    };

    fetchCreditOrganisms();
  }, []);

  // Confirmer l'annulation et retour à la liste
  const handleCancelOperation = () => {
    // Ouvrir le modal de confirmation
    document.getElementById('cancelOperationModal').classList.add('show');
    document.getElementById('cancelOperationModal').style.display = 'block';
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
  
  // Confirmer l'annulation et retour à la liste
  const confirmCancelOperation = () => {
    // Fermer le modal
    closeModal('cancelOperationModal');
    
    // Retourner à la liste des utilisateurs
    onCancel();
  };
  
  // Gestionnaire de changement pour les champs du formulaire d'utilisateur
  const handleUserFormChange = (e) => {
    const { id, value } = e.target;
      
    if (id === 'countrySelect') {
      // Déterminer si le nouveau pays est le Maroc
      const isMorocco = value === MOROCCO_ID;
      
      // Réinitialiser la ville lors du changement de pays
      setUserForm(prev => ({
        ...prev,
        pays_id: value,
        ville_id: '',
        ville_etranger: ''
      }));
      
      setIsForeignCountry(!isMorocco);
      return;
    }
    
    setUserForm(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Fonction pour obtenir les détails du rôle à partir de la valeur
  const getRoleDetails = (roleValue) => {
    switch(roleValue) {
      case 'admin':
        return { text: "مدير", class: "bg-danger" };
      case 'vendeur':
        return { text: "بائع", class: "bg-success" };
      case 'encherisseur':
        return { text: "متزايد", class: "bg-info" };
      default:
        return { text: "متزايد", class: "bg-info" };
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
  
  // Fonction pour gérer le changement d'avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille et le type du fichier
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        showError('حجم الصورة كبير جدًا. الحد الأقصى هو 2 ميجابايت');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showError('نوع الملف غير مدعوم. يرجى استخدام JPEG أو PNG أو GIF');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserForm(prev => ({
          ...prev,
          avatar: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumettre le formulaire d'ajout d'utilisateur
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (userForm.password !== userForm.password_confirm) {
      showError('كلمات المرور غير متطابقة');
      return;
    }
    
    // Valider le formulaire
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.phone || !userForm.password || !userForm.role) {
      showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Validation pour le nom de la société si un numéro RC est fourni
    if (userForm.registre_commerce && !userForm.denomination_societe) {
      showError('يجب إدخال اسم الشركة عند إدخال رقم السجل التجاري');
      return;
    }
    
    // Validation pour la ville
    if (userForm.pays_id) {
      if (userForm.pays_id === MOROCCO_ID && !userForm.ville_id) {
        showError('يرجى اختيار المدينة');
        return;
      }
      if (userForm.pays_id !== MOROCCO_ID && !userForm.ville_etranger) {
        showError('يرجى إدخال المدينة');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Créer un objet utilisateur pour l'API selon le format requis
      const userData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        cin: userForm.cin,
        password: userForm.password,
        password_confirm: userForm.password_confirm,
        role: userForm.role,
        address: userForm.address,
        tribunal_id: userForm.tribunal_id ? parseInt(userForm.tribunal_id) : null,
        pays_id: userForm.pays_id ? parseInt(userForm.pays_id) : null,
        organism_credit_id: userForm.organism_credit_id ? parseInt(userForm.organism_credit_id) : null,
        registre_commerce: userForm.registre_commerce || "",
        denomination_societe: userForm.denomination_societe || ""
      };
      
      // Ajouter ville_id ou ville_etranger selon le pays
      if (userForm.pays_id === MOROCCO_ID) {
        userData.ville_id = userForm.ville_id ? parseInt(userForm.ville_id) : null;
        userData.ville_etranger = "";
      } else {
        userData.ville_id = null;
        userData.ville_etranger = userForm.ville_etranger;
      }
      console.log("Mounir")
      console.log(userData)
      // Faire l'appel API pour ajouter l'utilisateur
      const response = await axios.post(getApiUrl("auth/register"), userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si l'appel API réussit, ajouter l'utilisateur à la liste locale
      if (response.data && response.data.id) {
        // Obtenir le nom de la ville (selon qu'il s'agit d'une ville marocaine ou étrangère)
        let cityName = "";
        if (userForm.pays_id === MOROCCO_ID && userForm.ville_id) {
          const selectedCity = cities.find(city => city.id.toString() === userForm.ville_id.toString());
          cityName = selectedCity ? selectedCity.nom_ar : "";
        } else {
          cityName = userForm.ville_etranger;
        }
        
        // Obtenir le nom du tribunal
        const selectedTribunal = tribunals.find(tribunal => tribunal.id.toString() === userForm.tribunal_id.toString());
        const tribunalName = selectedTribunal ? selectedTribunal.nom_ar : "";
        
        // Obtenir le nom du pays
        const selectedCountry = countries.find(country => country.id.toString() === userForm.pays_id.toString());
        const countryName = selectedCountry ? selectedCountry.nom_ar : "";
        
        // Obtenir le nom de l'organisme de crédit
        const selectedOrganism = creditOrganisms.find(org => org.id.toString() === userForm.organism_credit_id.toString());
        const organismName = selectedOrganism ? selectedOrganism.nom_ar : "";
        
        // Créer un nouvel utilisateur pour la liste locale
        const newUser = {
          id: response.data.id,
          avatar: userForm.avatar,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          phone: userForm.phone,
          cin: userForm.cin,
          role: getRoleDetails(userForm.role),
          regDate: new Date().toLocaleDateString('ar-MA'),
          status: getStatusDetails('active'), // Statut par défaut pour les nouveaux utilisateurs
          pays_id: userForm.pays_id,
          country: countryName,
          ville_id: userForm.pays_id === MOROCCO_ID ? userForm.ville_id : null,
          city: cityName,
          ville_etranger: userForm.pays_id !== MOROCCO_ID ? userForm.ville_etranger : "",
          tribunal_id: userForm.tribunal_id,
          tribunal: tribunalName,
          organism_credit_id: userForm.organism_credit_id,
          organism: organismName,
          isCompany: !!userForm.registre_commerce,
          companyName: userForm.denomination_societe,
          rcNumber: userForm.registre_commerce
        };
        
        // Ajouter le nouvel utilisateur à la liste
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        // Fermer le formulaire
        onCancel();
        
        // Afficher un message de succès
        showSuccess('تمت إضافة المستخدم بنجاح');
      } else {
        showError('حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      // Afficher le message d'erreur du serveur s'il existe
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">إضافة مستخدم جديد</h2>
        <button className="btn btn-outline-secondary" onClick={handleCancelOperation}>
          <i className="fas fa-arrow-right me-1"></i>
          عودة إلى قائمة المستخدمين
        </button>
      </div>

      {/* User Form Content */}
      <form id="userForm" onSubmit={handleAddUserSubmit}>
        <div className="row">
          <div className="col-md-3 text-center mb-4">
            <div className="upload-avatar mb-3 position-relative">
              <img 
                src={userForm.avatar} 
                className="avatar-preview" 
                id="avatar-preview" 
                alt="صورة المستخدم" 
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div className="overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" 
                   style={{ backgroundColor: "rgba(0,0,0,0.5)", opacity: 0, transition: "opacity 0.3s", borderRadius: "50%" }}>
                <i className="fas fa-camera fa-2x text-white"></i>
              </div>
              <input 
                type="file" 
                id="avatar-upload" 
                className="d-none" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary">
              تغيير الصورة
            </label>
          </div>
          <div className="col-md-9">
            <div className="mb-4">
              <h5 className="mb-3">المعلومات الأساسية</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label required">الاسم الأول</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="firstName"
                    value={userForm.firstName}
                    onChange={handleUserFormChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label required">الاسم الأخير</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="lastName"
                    value={userForm.lastName}
                    onChange={handleUserFormChange}
                    required 
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="cin" className="form-label required">رقم البطاقة الوطنية (CIN)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="cin"
                    value={userForm.cin}
                    onChange={handleUserFormChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label required">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="phone"
                    value={userForm.phone}
                    onChange={handleUserFormChange}
                    required 
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="email" className="form-label required">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    required 
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="address" className="form-label">العنوان</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="address"
                    value={userForm.address}
                    onChange={handleUserFormChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label required">كلمة المرور</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                    required 
                    minLength="8"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password_confirm" className="form-label required">تأكيد كلمة المرور</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password_confirm"
                    value={userForm.password_confirm}
                    onChange={handleUserFormChange}
                    required 
                    minLength="8"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="mb-3">معلومات الحساب</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="role" className="form-label required">دور المستخدم</label>
                  <select 
                    className="form-select" 
                    id="role"
                    value={userForm.role}
                    onChange={handleUserFormChange}
                    required
                  >
                    <option value="">اختر دور المستخدم</option>
                    <option value="admin">مدير</option>
                    <option value="superadmin">مدير عام</option>
                    <option value="encherisseur">متزايد</option>
                    <option value="tribunal">المحكمة</option>
                    <option value="tribunalmanager">الوزارة</option>
                    <option value="organisme_credit">شركة القروض</option>
                  </select>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="countrySelect" className="form-label required">البلد</label>
                  <select 
                    className="form-select" 
                    id="countrySelect"
                    value={userForm.pays_id}
                    onChange={handleUserFormChange}
                    required
                    disabled={loadingCountries}
                  >
                    <option value="">اختر البلد</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.nom_ar}
                      </option>
                    ))}
                  </select>
                  {loadingCountries && (
                    <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                         style={{ right: "40px", top: "40px" }} 
                         role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  {isForeignCountry ? (
                    // Champ de texte pour les villes étrangères
                    <div>
                      <label htmlFor="ville_etranger" className="form-label required">المدينة</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="ville_etranger"
                        value={userForm.ville_etranger}
                        onChange={handleUserFormChange}
                        required
                        placeholder="أدخل اسم المدينة"
                      />
                    </div>
                  ) : (
                    // Liste déroulante pour les villes marocaines
                    <div>
                      <label htmlFor="ville_id" className="form-label required">المدينة</label>
                      <select 
                        className="form-select" 
                        id="ville_id"
                        value={userForm.ville_id}
                        onChange={handleUserFormChange}
                        required
                        disabled={loadingCities || !userForm.pays_id}
                      >
                        <option value="">اختر المدينة</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.nom_ar}
                          </option>
                        ))}
                      </select>
                      {loadingCities && (
                        <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                             style={{ right: "40px", top: "40px" }} 
                             role="status">
                          <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="tribunal_id" className="form-label">المحكمة</label>
                  <select 
                    className="form-select" 
                    id="tribunal_id"
                    value={userForm.tribunal_id}
                    onChange={handleUserFormChange}
                    disabled={loadingTribunals}
                  >
                    <option value="">اختر المحكمة</option>
                    {tribunals.map((tribunal) => (
                      <option key={tribunal.id} value={tribunal.id}>
                        {tribunal.nom_ar}
                      </option>
                    ))}
                  </select>
                  {loadingTribunals && (
                    <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                         style={{ right: "40px", top: "40px" }} 
                         role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="organism_credit_id" className="form-label">شركة القروض</label>
                  <select 
                    className="form-select" 
                    id="organism_credit_id"
                    value={userForm.organism_credit_id}
                    onChange={handleUserFormChange}
                    disabled={loadingCreditOrganisms}
                  >
                    <option value="">اختر شركة القروض</option>
                    {creditOrganisms.map((organism) => (
                      <option key={organism.id} value={organism.id}>
                        {organism.nom_ar}
                      </option>
                    ))}
                  </select>
                  {loadingCreditOrganisms && (
                    <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                         style={{ right: "40px", top: "40px" }} 
                         role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section pour les informations de l'entreprise */}
            <div className="mb-4">
              <h5 className="mb-3">معلومات الشركة (اختياري)</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="registre_commerce" className="form-label">رقم السجل التجاري (RC)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="registre_commerce"
                    value={userForm.registre_commerce}
                    onChange={handleUserFormChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="denomination_societe" className="form-label">
                    اسم الشركة
                    {!!userForm.registre_commerce && <span className="text-danger">*</span>}
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="denomination_societe"
                    value={userForm.denomination_societe}
                    onChange={handleUserFormChange}
                    required={!!userForm.registre_commerce}
                  />
                </div>
              </div>
              {!!userForm.registre_commerce && !userForm.denomination_societe && (
                <div className="alert alert-warning" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  يجب إدخال اسم الشركة عند إدخال رقم السجل التجاري
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleCancelOperation}
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    جار الإضافة...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-1"></i>
                    إضافة المستخدم
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Modal de confirmation d'annulation d'opération */}
      <div className="modal fade" id="cancelOperationModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">تأكيد الإلغاء</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => closeModal('cancelOperationModal')}
              ></button>
            </div>
            <div className="modal-body text-center p-4">
              <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
              <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في إلغاء العملية الحالية؟</p>
              <p className="text-muted">سيتم فقدان جميع التغييرات التي قمت بإدخالها.</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button 
                type="button" 
                className="btn btn-secondary px-4" 
                onClick={() => closeModal('cancelOperationModal')}
              >
                لا، العودة للتحرير
              </button>
              <button 
                type="button" 
                className="btn btn-danger px-4" 
                onClick={confirmCancelOperation}
              >
                نعم، إلغاء العملية
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;