import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../services/api.config';

function EditUser({ selectedUser, onCancel, setUsers, showSuccess, showError }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [tribunals, setTribunals] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingTribunals, setLoadingTribunals] = useState(false);
  const [isForeignCountry, setIsForeignCountry] = useState(false);
  
  // ID du Maroc dans la base de données (à ajuster selon votre système)
  const MOROCCO_ID = 1; // À remplacer par l'ID réel du Maroc dans votre base de données



  // État pour le formulaire d'édition d'utilisateur
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cin: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: 'active',
    avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
    pays_id: '',
    ville_id: '',
    ville_etranger: '', // Nouvelle propriété pour la ville étrangère
    tribunal_id: '', // Changé pour tribunal_id
    creditCompany: '',
    companyName: '',
    rcNumber: '',
    permissions: {
      view_auctions: false,
      create_auctions: false,
      bid: false,
      view_reports: false,
      manage_users: false,
      manage_settings: false
    }
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

  // Récupérer les détails de l'utilisateur
  useEffect(() => {
    if (selectedUser) {
      // Déterminer si l'utilisateur est d'un pays étranger
      const userpays_id = selectedUser.pays_id || '';
      const isMorocco = userpays_id === MOROCCO_ID;
      setIsForeignCountry(!isMorocco);
      // Remplir le formulaire avec les données de l'utilisateur
      setUserForm({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        cin: selectedUser.cin || '',
        password: '',
        confirmPassword: '',
        role: selectedUser.role?.text || '',
        status: selectedUser.status?.text === 'نشط' ? 'active' : 
                selectedUser.status?.text === 'محظور' ? 'banned' : 
                selectedUser.status?.text === 'معلق' ? 'pending' : 'inactive',
        avatar: selectedUser.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120",
        pays_id: selectedUser.pays_id || '',
        ville_id: isMorocco ? (selectedUser.ville_id || '') : '',
        ville_etranger: !isMorocco ? (selectedUser.ville_etranger || selectedUser.ville_id || '') : '',
        tribunal_id: selectedUser.tribunal_id || '',
        creditCompany: selectedUser.creditCompany || '',
        companyName: selectedUser.companyName || '',
        rcNumber: selectedUser.rcNumber || '',
        permissions: selectedUser.permissions || {
          view_auctions: false,
          create_auctions: false,
          bid: false,
          view_reports: false,
          manage_users: false,
          manage_settings: false
        }
      });
      setIsLoading(false);
    }
  }, [selectedUser, MOROCCO_ID]);

  // Confirmer l'annulation et retour à la liste
  const handleCancelOperation = () => {
    // Ouvrir le modal de confirmation
    document.getElementById('cancelEditOperationModal').classList.add('show');
    document.getElementById('cancelEditOperationModal').style.display = 'block';
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
    closeModal('cancelEditOperationModal');
    
    // Retourner à la liste des utilisateurs
    onCancel();
  };
  
  // Gestionnaire de changement pour les champs du formulaire d'utilisateur
  const handleUserFormChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (id.startsWith('perm_')) {
        const permName = id.replace('perm_', '');
        setUserForm(prev => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            [permName]: checked
          }
        }));
      }
    } else {
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
  
  // Fonction pour obtenir les détails du rôle à partir de la valeur
  const getRoleDetails = (roleValue) => {
    switch(roleValue) {
      case 'مدير':
      case 'admin':
        return { text: "مدير", class: "bg-danger" };
      case 'بائع':
      case 'seller':
        return { text: "بائع", class: "bg-success" };
      case 'متزايد':
      case 'buyer':
        return { text: "متزايد", class: "bg-info" };
      case 'مدير عام':
        return { text: "مدير عام", class: "bg-dark" };
      case 'شركة القروض':
        return { text: "شركة القروض", class: "bg-warning" };
      case 'المحكمة':
        return { text: "المحكمة", class: "bg-secondary" };
      case 'الوزارة':
        return { text: "الوزارة", class: "bg-primary" };
      default:
        return { text: roleValue, class: "bg-info" };
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

  // Soumettre le formulaire d'édition d'utilisateur
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    
    // Si un mot de passe est fourni, vérifier qu'il correspond à la confirmation
    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      showError('كلمات المرور غير متطابقة');
      return;
    }
    
    // Valider le formulaire
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.phone || !userForm.role) {
      showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Validation pour le nom de la société si un numéro RC est fourni
    if (userForm.rcNumber && !userForm.companyName) {
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
      
      // Déterminer si c'est une société basé sur la présence d'un numéro RC
      const isCompany = !!userForm.rcNumber;
      
      // Créer un objet utilisateur pour l'API
      const userData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        cin: userForm.cin,
        role: userForm.role,
        status: userForm.status,
        country_id: userForm.pays_id,
        is_company: isCompany,
        company_name: isCompany ? userForm.companyName : "",
        rc_number: userForm.rcNumber,
        tribunal_id: userForm.tribunal_id,
        credit_company: userForm.creditCompany
      };
      
      // Ajouter city_id ou foreign_city selon le pays
      if (userForm.pays_id === MOROCCO_ID) {
        userData.city_id = userForm.ville_id;
        userData.foreign_city = "";
      } else {
        userData.city_id = null;
        userData.foreign_city = userForm.ville_etranger;
      }
      
      // Ajouter le mot de passe uniquement s'il est fourni
      if (userForm.password) {
        userData.password = userForm.password;
      }
      
      // Faire l'appel API pour mettre à jour l'utilisateur
      await axios.put(getApiUrl(`/users/${selectedUser.id}`), userData, {
         headers: { Authorization: `Bearer ${token}` }
       });
      
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
      
      // Simulation: Mettre à jour l'utilisateur dans la liste locale
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              firstName: userForm.firstName,
              lastName: userForm.lastName,
              email: userForm.email,
              phone: userForm.phone,
              cin: userForm.cin,
              role: getRoleDetails(userForm.role),
              status: getStatusDetails(userForm.status),
              avatar: userForm.avatar,
              pays_id: userForm.pays_id,
              country: countryName,
              ville_id: userForm.pays_id === MOROCCO_ID ? userForm.ville_id : null,
              city: cityName,
              ville_etranger: userForm.pays_id !== MOROCCO_ID ? userForm.ville_etranger : "",
              tribunal_id: userForm.tribunal_id,
              tribunal: tribunalName,
              creditCompany: userForm.creditCompany,
              isCompany: !!userForm.rcNumber,
              companyName: userForm.companyName,
              rcNumber: userForm.rcNumber
            }
          : user
      ));
      
      // Fermer le formulaire
      onCancel();
      
      // Afficher un message de succès
      showSuccess('تم تحديث بيانات المستخدم بنجاح');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      showError('حدث خطأ أثناء تحديث بيانات المستخدم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher le chargement
  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
  
  const isTribunalRole = userForm.role === "المحكمة";
  const isAdminRole = userForm.role === "مدير";
  const isEcnherisseurRole = userForm.role === "متزايد";

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">تعديل بيانات المستخدم</h2>
        <button className="btn btn-outline-secondary" onClick={handleCancelOperation}>
          <i className="fas fa-arrow-right me-1"></i>
          عودة إلى قائمة المستخدمين
        </button>
      </div>

      {/* User Form Content */}
      <form id="userEditForm" onSubmit={handleEditUserSubmit}>
        <div className="row">
          <div className="col-md-3 text-center mb-4">
            <div className="upload-avatar mb-3 position-relative">
              <img 
                src={userForm.avatar} 
                className="avatar-preview" 
                alt="صورة المستخدم" 
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div className="overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" 
                   style={{ backgroundColor: "rgba(0,0,0,0.5)", opacity: 0, transition: "opacity 0.3s", borderRadius: "50%" }}>
                <i className="fas fa-camera fa-2x text-white"></i>
              </div>
              <input 
                type="file" 
                id="avatar-edit" 
                className="d-none" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <label htmlFor="avatar-edit" className="btn btn-sm btn-outline-primary">
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
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">كلمة المرور الجديدة (اختياري)</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                  />
                  <small className="form-text text-muted">
                    اتركه فارغًا إذا كنت لا ترغب في تغيير كلمة المرور
                  </small>
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">تأكيد كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="confirmPassword"
                    value={userForm.confirmPassword}
                    onChange={handleUserFormChange}
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
                    <option value="مدير">مدير</option>
                    <option value="مدير عام">مدير عام</option>
                    <option value="شركة القروض">شركة القروض</option>
                    <option value="متزايد">متزايد</option>
                    <option value="المحكمة">المحكمة</option>
                    <option value="الوزارة">الوزارة</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="status" className="form-label required">الحالة</label>
                  <select 
                    className="form-select" 
                    id="status"
                    value={userForm.status}
                    onChange={handleUserFormChange}
                    required
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="pending">معلق</option>
                    <option value="banned">محظور</option>
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
              {isTribunalRole ? (
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
                  <label htmlFor="creditCompany" className="form-label">شركة القروض</label>
                  <select 
                    className="form-select" 
                    id="creditCompany"
                    value={userForm.creditCompany}
                    onChange={handleUserFormChange}
                  >
                    <option value="">اختر شركة القروض</option>
                    <option value="company1">شركة القروض 1</option>
                    <option value="company2">شركة القروض 2</option>
                    <option value="company3">شركة القروض 3</option>
                    <option value="company4">شركة القروض 4</option>
                    <option value="company5">شركة القروض 5</option>
                  </select>
                </div>
              </div>
               ): null}
            </div>

            {/* Section pour les informations de l'entreprise */}
            <div className="mb-4">
              <h5 className="mb-3">معلومات الشركة (اختياري)</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="rcNumber" className="form-label">رقم السجل التجاري (RC)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="rcNumber"
                    value={userForm.rcNumber}
                    onChange={handleUserFormChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="companyName" className="form-label">
                    اسم الشركة
                    {!!userForm.rcNumber && <span className="text-danger">*</span>}
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="companyName"
                    value={userForm.companyName}
                    onChange={handleUserFormChange}
                    required={!!userForm.rcNumber}
                  />
                </div>
              </div>
              {!!userForm.rcNumber && !userForm.companyName && (
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
                    جار الحفظ...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-1"></i>
                    حفظ التغييرات
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Modal de confirmation d'annulation d'opération */}
      <div className="modal fade" id="cancelEditOperationModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">تأكيد الإلغاء</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => closeModal('cancelEditOperationModal')}
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
                onClick={() => closeModal('cancelEditOperationModal')}
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

export default EditUser;