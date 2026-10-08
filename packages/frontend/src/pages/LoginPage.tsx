import React from "react";
import { Compass } from "lucide-react";
import { LoginForm } from "../modules/auth/LoginForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-800 font-sans flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8">
        
        {/* Sleek modern identity branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 text-white shadow-sm cursor-pointer" onClick={() => navigate('/')}>
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Places
          </h1>
          <p className="text-xs text-stone-500 tracking-wide">
            Your clean, modern travel scrapbook
          </p>
        </div>

        {/* Modular LoginForm */}
        <LoginForm />

        {/* Minimal Footer */}
        <p className="text-center text-[11px] text-stone-400 tracking-wide">
          Secure, modern travel memories dashboard.
        </p>
      </div>
    </div>
  );
}
