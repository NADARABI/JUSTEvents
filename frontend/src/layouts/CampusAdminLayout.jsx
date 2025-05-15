import React from 'react';
import CampusAdminSidebar from '../components/common/CampusAdminSidebar';
import CampusAdminHeader from '../components/common/CampusAdminHeader';

const CampusAdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <CampusAdminSidebar />
      <div className="flex-1 flex flex-col">
        <CampusAdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default CampusAdminLayout;
