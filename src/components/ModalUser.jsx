import React from 'react';

const ModalUser = ({ title, message }) => {
  return (
    <div className="fixed z-10 inset-0 flex justify-center modal-wrapper">
      <div className="bg-orange-500 rounded-lg text-center pt-4 w-3/4 md:w-1/2 lg:w-1/3 h-1/6 mt-8">
        <h1 className="font-bold mb-4 text-white">{title}</h1>
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
};

export default ModalUser;