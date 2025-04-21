import React from "react";
import { useRouter } from "next/navigation";

type CatCardLayoutProps = {
  title?: string;
  children: React.ReactNode;
  showHomeButton?: boolean;
};

const CatCardLayout: React.FC<CatCardLayoutProps> = ({
  title,
  children,
  showHomeButton = false,
}) => {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
      style={{
        backgroundImage: `url("/cat_background.jpg")`,
      }}
    >
      {showHomeButton && (
        <button
          onClick={() => router.push("/unlogged")}
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "1.5rem",
            backgroundColor: "#60dbc5",
            color: "white",
            borderRadius: "24px",
            padding: "0.5rem 1rem",
            border: "none",
            fontWeight: "bold",
          }}
        >
          HOME
        </button>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 z-10">
        {title && <h2 className="text-2xl font-bold text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default CatCardLayout;
