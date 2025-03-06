import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideAdmin from '../../components/SlideAdmin';
import axios from 'axios';
import { getApiUrl } from '../../services/api.config';

function UsersPage() {
  const navigate = useNavigate();
  
  // État pour afficher le formulaire d'ajout/édition/visualisation d'utilisateur
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showViewUser, setShowViewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // État pour la liste des utilisateurs et la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
   
  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(true); // Nom corrigé pour être cohérent
  const [error, setError] = useState(null);
  
  // États pour les toasts de notification
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // États pour les actions utilisateur
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // État pour le formulaire d'ajout/édition d'utilisateur
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: 'active',
    avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
  });
  
  // Statistiques des utilisateurs
  const userStats = {
    total: users.length || 0,
    sellers: users.filter(user => user.role?.text === "بائع").length || 0,
    buyers: users.filter(user => user.role?.text === "متزايد").length || 0,
    admins: users.filter(user => user.role?.text === "مدير").length || 0
  };

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      console.warn("Aucun token trouvé, requête annulée.");
      setIsLoading(false);
      navigate('/login');
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      try {
        const response = await axios.get(getApiUrl("public/users"), {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal,
        });
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          console.error("Les données reçues ne sont pas un tableau", response.data);
          setError(new Error("Format de données incorrect"));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Requête annulée");
        } else {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
          setError(error);
          showError('فشل في تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [navigate]);

  // Afficher un toast de succès
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    
    // Masquer après 3 secondes
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  
  // Afficher un toast d'erreur
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorToast(true);
    
    // Masquer après 3 secondes
    setTimeout(() => {
      setShowErrorToast(false);
    }, 3000);
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
  
  // Afficher/masquer le formulaire d'ajout d'utilisateur
  const toggleAddUserForm = () => {
    // Réinitialiser les états
    setShowEditUser(false);
    setShowViewUser(false);
    setSelectedUser(null);
    
    // Inverser l'état d'affichage du formulaire d'ajout
    setShowAddUser(!showAddUser);
    
    // Réinitialiser le formulaire si on le ferme
    if (showAddUser) {
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        status: 'active',
        avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
        permissions: {
          view_auctions: false,
          create_auctions: false,
          bid: false,
          view_reports: false,
          manage_users: false,
          manage_settings: false
        }
      });
    }
  };
  

  
  // Retour à la liste des utilisateurs
  const backToUsersList = () => {
    setShowAddUser(false);
    setShowEditUser(false);
    setShowViewUser(false);
    setSelectedUser(null);
    
    // Réinitialiser le formulaire
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'active',
      avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
      permissions: {
        view_auctions: false,
        create_auctions: false,
        bid: false,
        view_reports: false,
        manage_users: false,
        manage_settings: false
      }
    });
  };
  
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
  
  // Confirmer l'annulation et retour à la liste
  const confirmCancelOperation = () => {
    // Fermer le modal
    closeModal('cancelOperationModal');
    
    // Retourner à la liste des utilisateurs
    backToUsersList();
  };
  
  // Fermer un modal
  const closeModal = (modalId) => {
    document.getElementById(modalId).classList.remove('show');
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
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
      setUserForm(prev => ({
        ...prev,
        [id]: value
      }));
    }
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
  
  // Afficher le formulaire de visualisation d'un utilisateur
  const handleViewUser = async (user) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Récupérer les données complètes de l'utilisateur depuis l'API
      const response = await axios.get(getApiUrl(`/users/${user.id}/details`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour l'utilisateur sélectionné avec les données complètes de l'API
      setSelectedUser(response.data);
      
      // Afficher la vue de détail
      setShowViewUser(true);
      setShowAddUser(false);
      setShowEditUser(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'utilisateur:", error);
      showError('فشل في تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى.');
      
      // En cas d'erreur, utiliser les données partielles que nous avons déjà
      setSelectedUser(user);
      setShowViewUser(true);
      setShowAddUser(false);
      setShowEditUser(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Afficher le formulaire d'édition d'un utilisateur
  const handleEditUser = async (user) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Récupérer les données complètes de l'utilisateur depuis l'API
      const response = await axios.get(getApiUrl(`/users/${user.id}/details`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour l'utilisateur sélectionné avec les données complètes de l'API
      const userData = response.data;
      setSelectedUser(userData);
      console.log(userData)
      // Remplir le formulaire avec les données de l'utilisateur
      setUserForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '', // On ne récupère pas le mot de passe existant
        confirmPassword: '',
        role: userData.role ,
        avatar: userData.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120",
        status: userData.status,
      });
      
      // Afficher le formulaire d'édition
      setShowEditUser(true);
      setShowAddUser(false);
      setShowViewUser(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'utilisateur pour édition:", error);
      showError('فشل في تحميل بيانات المستخدم للتعديل. يرجى المحاولة مرة أخرى.');
      
      // En cas d'erreur, utiliser les données partielles que nous avons déjà
      setSelectedUser(user);
      
      // Remplir le formulaire avec les données partielles disponibles
      setUserForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        role: user.role ,
        status: user.status,
        avatar: user.avatar || "https://www.claudeusercontent.com/api/placeholder/120/120",
        permissions: user.permissions || {
          view_auctions: false,
          create_auctions: false,
          bid: false,
          view_reports: false,
          manage_users: false,
          manage_settings: false
        }
      });
      
      setShowEditUser(true);
      setShowAddUser(false);
      setShowViewUser(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Soumettre le formulaire d'ajout d'utilisateur
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (userForm.password !== userForm.confirmPassword) {
      showError('كلمات المرور غير متطابقة');
      return;
    }
    
    // Valider le formulaire
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.phone || !userForm.password || !userForm.role) {
      showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Créer un objet utilisateur pour l'API
      const userData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        password: userForm.password,
        role: userForm.role,
        status: userForm.status,
        permissions: userForm.permissions
      };
      
      // Faire l'appel API pour ajouter l'utilisateur
      // const response = await axios.post(getApiUrl("/users"), userData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulation: Créer un nouvel utilisateur pour la liste locale
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        avatar: userForm.avatar,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        role: getRoleDetails(userForm.role),
        regDate: new Date().toLocaleDateString('ar-MA'),
        status: getStatusDetails(userForm.status)
      };
      
      // Ajouter le nouvel utilisateur à la liste
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Réinitialiser le formulaire
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        status: 'active',
        avatar: "https://www.claudeusercontent.com/api/placeholder/120/120",
        permissions: {
          view_auctions: false,
          create_auctions: false,
          bid: false,
          view_reports: false,
          manage_users: false,
          manage_settings: false
        }
      });
      
      // Fermer le formulaire
      backToUsersList();
      
      // Afficher un message de succès
      showSuccess('تمت إضافة المستخدم بنجاح');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      showError('حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
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
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Créer un objet utilisateur pour l'API
      const userData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        status: userForm.status,
      };
      
      // Ajouter le mot de passe uniquement s'il est fourni
      if (userForm.password) {
        userData.password = userForm.password;
      }
      
      // Faire l'appel API pour mettre à jour l'utilisateur
      // await axios.put(getApiUrl(`/users/${selectedUser.id}`), userData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulation: Mettre à jour l'utilisateur dans la liste locale
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              firstName: userForm.firstName,
              lastName: userForm.lastName,
              email: userForm.email,
              phone: userForm.phone,
              role: getRoleDetails(userForm.role),
              status: getStatusDetails(userForm.status),
              avatar: userForm.avatar
            }
          : user
      ));
      
      // Fermer le formulaire
      backToUsersList();
      
      // Afficher un message de succès
      showSuccess('تم تحديث بيانات المستخدم بنجاح');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      showError('حدث خطأ أثناء تحديث بيانات المستخدم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour obtenir les détails du rôle à partir de la valeur
  const getRoleDetails = (roleValue) => {
    switch(roleValue) {
      case 'admin':
        return { text: "مدير", class: "bg-danger" };
      case 'seller':
        return { text: "بائع", class: "bg-success" };
      case 'buyer':
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

  // Add these functions to your component
  const getBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'banned':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
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
  

  
  // Rendu principal
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <SlideAdmin />

          
          {/* Main Content */}
          <div className="col-lg-10 py-4">
            <div className="container">
              {/* Liste des utilisateurs */}
              {!showAddUser && !showEditUser && !showViewUser && (
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
                      <button className="btn btn-primary" onClick={toggleAddUserForm}>
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
                                      onClick={() => handleEditUser(user)}
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
                                      onClick={() => handleViewUser(user)}
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
                </>
              )}

              {/* Formulaire d'ajout d'utilisateur */}
              {showAddUser && (
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
                            <div className="col-md-6">
                              <label htmlFor="password" className="form-label required">كلمة المرور</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                id="password"
                                value={userForm.password}
                                onChange={handleUserFormChange}
                                required 
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="confirmPassword" className="form-label required">تأكيد كلمة المرور</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                id="confirmPassword"
                                value={userForm.confirmPassword}
                                onChange={handleUserFormChange}
                                required 
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
                                <option value="seller">بائع</option>
                                <option value="buyer">متزايد</option>
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
                              </select>
                            </div>
                          </div>
                      
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
                </div>
              )}

              {/* Formulaire d'édition d'utilisateur */}
              {showEditUser && selectedUser && (
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
                                <option value="">جميع الأدوار</option>
                                <option value="مدير عام">مدير عام</option>
                                <option value="مدير">مدير</option>
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
                                <option value="pending">معلق</option>
                                <option value="banned">محظور</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Nouveaux champs ajoutés */}
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor="city" className="form-label required">المدينة</label>
                              <select 
                                className="form-select" 
                                id="city"
                                value={userForm.city || ''}
                                onChange={handleUserFormChange}
                                required
                              >
                                <option value="">اختر المدينة</option>
                                <option value="casablanca">الدار البيضاء</option>
                                <option value="rabat">الرباط</option>
                                <option value="marrakech">مراكش</option>
                                <option value="fes">فاس</option>
                                <option value="tanger">طنجة</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="country" className="form-label required">البلد</label>
                              <select 
                                className="form-select" 
                                id="country"
                                value={userForm.country || ''}
                                onChange={handleUserFormChange}
                                required
                              >
                                <option value="">اختر البلد</option>
                                <option value="morocco">المغرب</option>
                                <option value="algeria">الجزائر</option>
                                <option value="tunisia">تونس</option>
                                <option value="egypt">مصر</option>
                                <option value="uae">الإمارات</option>
                              </select>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor="tribunal" className="form-label required">المحكمة</label>
                              <select 
                                className="form-select" 
                                id="tribunal"
                                value={userForm.tribunal || ''}
                                onChange={handleUserFormChange}
                                required
                              >
                                <option value="">اختر المحكمة</option>
                                <option value="tribunal1">المحكمة الابتدائية</option>
                                <option value="tribunal2">المحكمة التجارية</option>
                                <option value="tribunal3">محكمة الاستئناف</option>
                                <option value="tribunal4">المحكمة الإدارية</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="creditCompany" className="form-label required">شركة القروض</label>
                              <select 
                                className="form-select" 
                                id="creditCompany"
                                value={userForm.creditCompany || ''}
                                onChange={handleUserFormChange}
                                required
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
                </div>
              )}

              {/* Affichage des détails d'un utilisateur */}
              {showViewUser && selectedUser && (
                <div className="content-wrapper">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="page-title mb-0">بيانات المستخدم</h2>
                    <div>
                      <button 
                        className="btn btn-outline-primary me-2" 
                        onClick={() => handleEditUser(selectedUser)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        تعديل
                      </button>
                      <button className="btn btn-outline-secondary" onClick={backToUsersList}>
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
                            <span className={`badge ${selectedUser.role.class} role-badge`}>
                              {selectedUser.role.text}
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
                                {selectedUser.status && (
                                  <span className={`badge ${getBadgeClass(selectedUser.status)}`}>
                                    {getStatusText(selectedUser.status)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="col-md-6 mb-3">
                              <p className="fw-bold mb-1">معرف المستخدم:</p>
                              <p className="mb-0"><i className="fas fa-id-card text-muted me-2"></i> {selectedUser.id || 'غير محدد'}</p>
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
              )}
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Toast de succès */}
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
      
      {/* Toast d'erreur */}
      {showErrorToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-danger text-white">
              <i className="fas fa-exclamation-circle me-2"></i>
              <strong className="me-auto">خطأ</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowErrorToast(false)}></button>
            </div>
            <div className="toast-body d-flex align-items-center">
              <i className="fas fa-exclamation-circle text-danger me-2 fs-5"></i>
              {errorMessage}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersPage;