import React from 'react';
import AdminLayout from "@/Layouts/AdminLayout";

const MunicipalityBill = ({ response }) => {
  return (
    <AdminLayout>
      <div>
        <h1>Municipality Bill</h1>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </AdminLayout>
  );
}

export default MunicipalityBill;
