import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideAdmin from '../../components/SlideAdmin';
import axios from 'axios';
import { getApiUrl } from '../../services/api.config';

// Import des composants
import ListUsers from './ListUsers';
import AddUser from './AddUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';

function UsersPageBackend() {
  const navigate = useNavigate();
  
  // État pour afficher le formulaire d'ajout/édition/visualisation d'utilisateur
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showViewUser, setShowViewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // État pour la liste des utilisateurs et le chargement
  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les toasts de notification
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        const response = await axios.get(getApiUrl("/users/detail"), {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal,
        });
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
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

  // Afficher le formulaire d'ajout d'utilisateur
  const handleShowAddUser = () => {
    setShowAddUser(true);
    setShowEditUser(false);
    setShowViewUser(false);
    setSelectedUser(null);
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
      // Dans un environnement réel, décommentez la partie suivante
      /*
      const response = await axios.get(getApiUrl(`/users/${user.id}/details`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour l'utilisateur sélectionné avec les données complètes de l'API
      const userData = response.data;
      setSelectedUser(userData);
      */
      
      // Pour la démonstration, nous utilisons directement les données de l'utilisateur
      setSelectedUser(user);
      
      // Afficher le formulaire d'édition
      setShowEditUser(true);
      setShowAddUser(false);
      setShowViewUser(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'utilisateur pour édition:", error);
      showError('فشل في تحميل بيانات المستخدم للتعديل. يرجى المحاولة مرة أخرى.');
      
      // En cas d'erreur, utiliser les données partielles que nous avons déjà
      setSelectedUser(user);
      
      setShowEditUser(true);
      setShowAddUser(false);
      setShowViewUser(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher les détails d'un utilisateur
  const handleViewUser = async (user) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        showError('جلسة المستخدم منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      
      // Récupérer les données complètes de l'utilisateur depuis l'API
      // Dans un environnement réel, décommentez la partie suivante
      /*
      const response = await axios.get(getApiUrl(`/users/${user.id}/details`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour l'utilisateur sélectionné avec les données complètes de l'API
      setSelectedUser(response.data);
      */
      
      // Pour la démonstration, nous utilisons directement les données de l'utilisateur
      setSelectedUser(user);
      
      // Afficher la vue détaillée
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

  // Retour à la liste des utilisateurs
  const handleCancel = () => {
    setShowAddUser(false);
    setShowEditUser(false);
    setShowViewUser(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <SlideAdmin />

          {/* Main Content */}
          <div className="col-lg-10 py-4">
            <div className="container">
              {/* Afficher le composant approprié en fonction de l'état */}
              {!showAddUser && !showEditUser && !showViewUser && (
                <ListUsers 
                  onAddUser={handleShowAddUser}
                  onEditUser={handleEditUser}
                  onViewUser={handleViewUser}
                  users={users}
                  setUsers={setUsers}
                  loading={loading}
                  error={error}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              )}

              {showAddUser && (
                <AddUser 
                  onCancel={handleCancel}
                  setUsers={setUsers}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              )}

              {showEditUser && selectedUser && (
                <EditUser 
                  selectedUser={selectedUser}
                  onCancel={handleCancel}
                  setUsers={setUsers}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              )}

              {showViewUser && selectedUser && (
                <ViewUser 
                  selectedUser={selectedUser}
                  onCancel={handleCancel}
                  onEditUser={handleEditUser}
                />
              )}
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

export default UsersPageBackend;