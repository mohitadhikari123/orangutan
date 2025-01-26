import React from "react";
import FileUpload from './../components/FileUpload';

function page() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white p-6 rounded shadow">
        <FileUpload/>
      </div>
    </main>
  );
}

export default page;
