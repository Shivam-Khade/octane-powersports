"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, X, Phone, Eye, EyeOff } from "lucide-react";
import { useLoginModal } from "./login-context";
import toast from "react-hot-toast";

type ViewState = 'login' | 'signup' | 'forgot-password';

export function LoginModal() {
  const { isOpen, closeModal } = useLoginModal();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [view, setView] = useState<ViewState>('login');
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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!isOpen) return null;

  const resetState = (newView: ViewState) => {
    setView(newView);
    setError("");
    setOtpSent(false);
    setOtp("");
    setPassword("");
  };

  const handleClose = () => {
    closeModal();
    // Reset after animation
    setTimeout(() => {
      resetState('login');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (view === 'login') {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        sessionStorage.setItem("octane_session_active", "true");
        
        // Check if the user is an admin while keeping the modal open and loading
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const isAdmin = sessionData?.user?.role === 'admin';

        if (isAdmin) {
          // Redirect directly to admin dashboard
          window.location.href = "/admin";
        } else {
          handleClose();
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          toast.success("Logged in successfully", { 
            position: isMobile ? 'bottom-center' : 'top-right',
            style: { background: 'rgba(20, 83, 45, 0.95)', backdropFilter: 'blur(10px)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.2)', fontWeight: '600', padding: '14px 24px', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)' }, 
            iconTheme: { primary: '#4ade80', secondary: 'transparent' } 
          });
          router.refresh();
        }
      }
    } else if (view === 'signup') {
      if (!name) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      
      if (!otpSent) {
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
            sessionStorage.setItem("octane_session_active", "true");
            handleClose();
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            toast.success("Logged in successfully", { 
              position: isMobile ? 'bottom-center' : 'top-right',
              style: { background: 'rgba(20, 83, 45, 0.95)', backdropFilter: 'blur(10px)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.2)', fontWeight: '600', padding: '14px 24px', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)' }, 
              iconTheme: { primary: '#4ade80', secondary: 'transparent' } 
            });
            router.refresh();
          }
        }
      }
    } else if (view === 'forgot-password') {
      if (!otpSent) {
        const res = await fetch("/api/auth/forgot-password/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to send reset code");
        } else {
          setOtpSent(true);
          toast.success("Reset code sent to your email");
        }
      } else {
        if (!otp || !password) {
          setError("Verification code and new password are required");
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/forgot-password/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword: password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to reset password");
        } else {
          toast.success("Password reset successfully! Please log in.");
          resetState('login');
        }
      }
    }
    
    setLoading(false);
  };

  const getTitle = () => {
    if (view === 'login') return "Welcome Back";
    if (view === 'signup') return "Join the Crew";
    return "Reset Password";
  };

  const getSubtitle = () => {
    if (view === 'login') return "";
    if (view === 'signup') return "Create an account to track orders and save preferences.";
    return "Enter your email to receive a password reset code.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
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
                  {getTitle()}
                </h2>
                {getSubtitle() && (
                  <p className="mt-3 text-[15px] text-gray-500">
                    {getSubtitle()}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {view === 'signup' && !otpSent && (
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
                          required={view === 'signup'}
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
                          required={view === 'signup'}
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

                    {view !== 'forgot-password' && (
                      <div className="relative flex flex-col items-end">
                        <div className="relative flex items-center w-full">
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
                        {view === 'login' && (
                          <button 
                            type="button" 
                            onClick={() => resetState('forgot-password')}
                            className="text-[12px] font-semibold text-gray-500 hover:text-[#ff6b00] transition-colors mt-2 self-end"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative flex flex-col gap-4 items-center"
                  >
                    <p className="text-sm text-gray-500 text-center">
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
                    {view === 'forgot-password' && (
                      <div className="relative flex items-center w-full">
                        <Lock size={20} className="absolute left-4 text-gray-400" />
                        <input
                          placeholder="New Password (min. 6 chars)"
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
                    )}
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
                      {view === 'login' ? "Login" : (view === 'signup' ? (!otpSent ? "Send OTP" : "Verify & Sign Up") : (!otpSent ? "Send Reset Code" : "Reset Password"))} <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-[15px] text-gray-500">
                {view === 'login' ? (
                  <p>
                    Don't have an account?
                    <button type="button" className="ml-2 font-semibold text-[#ff6b00] hover:underline" onClick={() => resetState('signup')}>Sign up</button>
                  </p>
                ) : (
                  <p>
                    Already a member?
                    <button type="button" className="ml-2 font-semibold text-[#ff6b00] hover:underline" onClick={() => resetState('login')}>Log in</button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
