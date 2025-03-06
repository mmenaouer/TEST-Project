import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SlideAdmin() {
  const location = useLocation();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return ( 
    <div className="col-lg-2 p-0">
      <div className="sidebar py-3">
        
        <Link to="/Backend" className={isActive('/Backend')}>
          <i className="fas fa-gavel sidebar-icon" />
          المزادات
        </Link>
        
        <Link to="/Admin/Users" className={isActive('/Admin/Users')}>
          <i className="fas fa-users sidebar-icon" />
          المستخدمين
        </Link>
        
        
        <Link to="/settings" className={isActive('/settings')}>
          <i className="fas fa-cog sidebar-icon" />
          الإعدادات
        </Link>
      </div>
    </div>
  );
}

export default SlideAdmin;
