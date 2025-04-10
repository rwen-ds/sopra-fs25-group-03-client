// components/CatCardLayout.tsx
import React from "react";

type CatCardLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const CatCardLayout: React.FC<CatCardLayoutProps> = ({ title, children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url("/cat_background.jpg")`,//public folder 1400*880
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        {title && <h2 className="text-2xl font-bold text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default CatCardLayout;
