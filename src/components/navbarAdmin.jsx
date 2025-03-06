import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function NavBarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFullName, setuserFullName] = useState('');
    const [userRole, setUserRole] = useState('');


    // Formater l'email pour l'affichage (prendre uniquement la partie avant @)
    const getDisplayName = () => {
      if (!userFullName) return '';
      return userFullName;
    };

    const handleLogin = () => {
      navigate("/login");
    };
    const handleRegister = () => {
      navigate("/register");
    };
    // Vérifier si l'utilisateur est connecté au chargement du composant
    useEffect(() => {
      const checkAuthStatus = () => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const FullName = localStorage.getItem('FullName') || sessionStorage.getItem('FullName');
        const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
        
        if (token) {
          setIsLoggedIn(true);
          setuserFullName(FullName || '');
          setUserRole(role || '');
        } else {
          setIsLoggedIn(false);
          setuserFullName('');
          setUserRole('');
        }
      };
  
      checkAuthStatus();
      // Vérifier à nouveau si l'utilisateur change de page
      window.addEventListener('storage', checkAuthStatus);
      
      return () => {
        window.removeEventListener('storage', checkAuthStatus);
      };
    }, [location.pathname]);

    const handleLogout = () => {
      // Ajoute ici la logique de déconnexion
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('FullName');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('FullName');
      
      // Mettre à jour l'état
      setIsLoggedIn(false);
      setuserFullName('');
      setUserRole('');
      
      // Rediriger vers la page d'accueil
      navigate("/");
      };

  

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/Backend">
            <i className="fas fa-gavel me-2" />
            مزادات المغرب | لوحة التحكم
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/" target="_blank" rel="noopener noreferrer">
                  عرض الموقع
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center">
                        {isLoggedIn ? (
                          <div className="dropdown">
                            <a
                              className="text-white dropdown-toggle text-decoration-none"
                              href="#"
                              role="button"
                              id="userDropdown"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-user-circle me-1" />
                              {getDisplayName()}
                             
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                              <li>
                                <Link className="dropdown-item" to="/user/profile">
                                  <i className="fas fa-user-cog me-2"></i>الملف الشخصي
                                </Link>
                              </li>
                              {userRole === 'encherisseur' && (
                                <li>
                                  <Link className="dropdown-item" to="/my-bids">
                                    <i className="fas fa-gavel me-2"></i>مزاداتي
                                  </Link>
                                </li>
                              )}
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                  <i className="fas fa-sign-out-alt me-2"></i>تسجيل الخروج
                                </button>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <>
                            <button className="btn btn-outline-light" style={{ marginLeft: 10 }} onClick={handleLogin}>تسجيل الدخول</button>
                            <button className="btn btn-success me-2" onClick={handleRegister}>التسجيل</button>
                          </>
                        )}
                      </div>
          </div>
        </div>
        
      </nav>
      
      
    </>
  );
}

export default NavBarAdmin;
