import React from 'react';
import '@/page-loader.css';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="page-loader-spinner black">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  );
};
