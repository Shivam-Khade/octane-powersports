"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, X, Phone, Eye, EyeOff } from "lucide-react";
import { useLoginModal } from "./login-context";
import toast from "react-hot-toast";

export function LoginModal() {
  const { isOpen, closeModal } = useLoginModal();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        closeModal();
        
        // Check if the user is an admin
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const isAdmin = sessionData?.user?.role === 'admin';

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        toast.success(isAdmin ? "Welcome back, Admin" : "Logged in successfully", { 
          position: isMobile ? 'bottom-center' : 'top-right',
          style: { background: '#16a34a', color: '#fff', fontWeight: '600', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)' }, 
          iconTheme: { primary: '#fff', secondary: '#16a34a' } 
        });
        
        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } else {
      if (!name) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      
      if (!otpSent) {
        // Step 1: Request OTP
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to send OTP");
        } else {
          setOtpSent(true);
          toast.success("Verification code sent to your email");
        }
      } else {
        // Step 2: Verify OTP and Register
        if (!otp) {
          setError("Verification code is required");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password, otp }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Registration failed");
        } else {
          const loginRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (loginRes?.error) {
            setError("Registered successfully, but failed to log in automatically");
          } else {
            closeModal();
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            toast.success("Logged in successfully", { 
              position: isMobile ? 'bottom-center' : 'top-right',
              style: { background: '#16a34a', color: '#fff', fontWeight: '600', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)' }, 
              iconTheme: { primary: '#fff', secondary: '#16a34a' } 
            });
            router.push("/");
            router.refresh();
          }
        }
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setOtpSent(false);
    setOtp("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl"
            style={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset" 
            }}
          >
            <button
              onClick={closeModal}
              className="absolute right-6 top-6 z-10 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <div className="px-8 pb-8 pt-12">
              <div className="mb-8 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff6b00] mb-2 font-inter">
                  Rider Gateway
                </p>
                <h2 className="text-4xl m-0 leading-none" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                  {isLogin ? "Welcome Back" : "Join the Crew"}
                </h2>
                <p className="mt-3 text-[15px] text-gray-500">
                  {isLogin 
                    ? "Enter your credentials to access your garage." 
                    : "Create an account to track orders and save preferences."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && !otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative flex items-center">
                        <User size={20} className="absolute left-4 text-gray-400" />
                        <input
                          placeholder="Full Name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                          className="h-14 w-full rounded-xl border-1.5 border-gray-200 bg-gray-50 pl-[50px] pr-5 text-[15px] outline-none transition-all focus:border-[#ff6b00] focus:bg-white focus:ring-4 focus:ring-[#ff6b00]/10"
                        />
                      </div>
                      <div className="relative flex items-center mt-4">
                        <Phone size={20} className="absolute left-4 text-gray-400" />
                        <input
                          placeholder="Phone Number"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required={!isLogin}
                          className="h-14 w-full rounded-xl border-1.5 border-gray-200 bg-gray-50 pl-[50px] pr-5 text-[15px] outline-none transition-all focus:border-[#ff6b00] focus:bg-white focus:ring-4 focus:ring-[#ff6b00]/10"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!otpSent && (
                  <>
                    <div className="relative flex items-center">
                      <Mail size={20} className="absolute left-4 text-gray-400" />
                      <input
                        placeholder="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 w-full rounded-xl border-1.5 border-gray-200 bg-gray-50 pl-[50px] pr-5 text-[15px] outline-none transition-all focus:border-[#ff6b00] focus:bg-white focus:ring-4 focus:ring-[#ff6b00]/10"
                      />
                    </div>

                    <div className="relative flex items-center">
                      <Lock size={20} className="absolute left-4 text-gray-400" />
                      <input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 w-full rounded-xl border-1.5 border-gray-200 bg-gray-50 pl-[50px] pr-[50px] text-[15px] outline-none transition-all focus:border-[#ff6b00] focus:bg-white focus:ring-4 focus:ring-[#ff6b00]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </>
                )}

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative flex flex-col items-center"
                  >
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      We've sent a 6-digit code to <strong>{email}</strong>
                    </p>
                    <div className="relative flex items-center w-full">
                      <Lock size={20} className="absolute left-4 text-gray-400" />
                      <input
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        className="h-14 w-full text-center tracking-[0.5em] font-bold rounded-xl border-1.5 border-gray-200 bg-gray-50 pl-[50px] pr-5 text-[18px] outline-none transition-all focus:border-[#ff6b00] focus:bg-white focus:ring-4 focus:ring-[#ff6b00]/10"
                      />
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="m-0 rounded-lg bg-red-50 p-3 text-center text-[14px] text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] text-[16px] font-semibold text-white transition-colors hover:bg-[#ff6b00]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {isLogin ? "Login" : (!otpSent ? "Send OTP" : "Verify & Sign Up")} <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-[15px] text-gray-500">
                <p>
                  {isLogin ? "Don't have an account?" : "Already a member?"}
                  <button
                    type="button"
                    className="ml-2 font-semibold text-[#ff6b00] hover:underline"
                    onClick={resetForm}
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
