import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signUp, signInWithGoogle } from "./Auth.jsx";

// --- Inline SVG Icons ---
const FcGoogle = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.45H18.02C17.73 15.99 16.96 17.34 15.81 18.22V21.09H19.83C21.66 19.43 22.56 16.97 22.56 12.25Z" fill="#4285F4"/><path d="M12 23C14.97 23 17.45 22.04 19.28 20.39L15.81 18.22C14.75 18.93 13.45 19.33 12 19.33C9.12 19.33 6.66 17.44 5.79 14.9H1.77V17.78C3.6 21.14 7.48 23 12 23Z" fill="#34A853"/><path d="M5.79 14.9C5.54 14.17 5.4 13.38 5.4 12.5C5.4 11.62 5.54 10.83 5.79 10.1H1.77C0.94 11.64 0.5 13.45 0.5 15.3C0.5 17.15 0.94 18.96 1.77 20.5L5.79 17.72V14.9Z" fill="#FBBC05"/><path d="M12 5.67C13.55 5.67 14.9 6.18 15.99 7.2L19.36 3.82C17.45 1.93 14.97 1 12 1C7.48 1 3.6 3.86 1.77 7.22L5.79 10.1C6.66 7.56 9.12 5.67 12 5.67Z" fill="#EA4335"/></svg>;
const FiMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const FiLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const FiUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FiLoader = () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;
const FiAlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const FiCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// --- Reusable UI Components ---
const FormInput = ({ id, type, placeholder, icon: Icon, value, onChange }) => (
  <div className="relative flex flex-col">
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Icon /></div>
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-4 text-slate-200 ring-2 ring-transparent transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
  </div>
);
const ActionButton = ({ isLoading, children, type = "submit" }) => (
  <button type={type} disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-600 hover:shadow-xl hover:shadow-cyan-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-cyan-700/60">{isLoading ? <FiLoader /> : children}</button>
);
const SocialButton = ({ children, onClick, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 py-3.5 font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-60"><FcGoogle />{children}</button>
);
const AlertMessage = ({ message, isError }) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`flex items-center gap-3 rounded-lg p-3 text-sm ${isError ? "bg-red-900/40 text-red-300 border border-red-500/30" : "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"}`}>{isError ? <FiAlertTriangle /> : <FiCheckCircle />}<span>{message}</span></motion.div>
);
const PasswordStrengthMeter = ({ strength }) => {
    const levels = [{ label: "Weak", color: "bg-red-500", width: "w-1/3" }, { label: "Medium", color: "bg-amber-500", width: "w-2/3" }, { label: "Strong", color: "bg-emerald-500", width: "w-full" }];
    if (!strength) return null;
    const current = levels[strength - 1];
    return (<div className="flex items-center gap-3"><div className="h-2 flex-grow rounded-full bg-slate-700"><motion.div initial={{ width: 0 }} animate={{ width: current.width }} transition={{ duration: 0.3 }} className={`h-full rounded-full ${current.color}`}></motion.div></div><span className="w-16 text-right text-xs font-medium text-slate-400">{current.label}</span></div>);
};


export default function SignUp({ onSwitchToSignIn }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ state: "idle", message: "" });

    const passwordStrength = useMemo(() => {
        if (!password) return 0;
        if (password.length < 6) return 1;
        if (password.length >= 6 && (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password))) return 2;
        if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) return 3;
        return 2;
    }, [password]);

    const handleAction = async (action) => {
        setStatus({ state: "loading", message: "" });
        const { error } = await action();
        if (error) setStatus({ state: "error", message: error });
    };

    const handleSubmit = (e) => { e.preventDefault(); handleAction(() => signUp(email, password, { displayName: name })); };
    const handleGoogleSignUp = () => handleAction(signInWithGoogle);

    return (<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 font-sans"><div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div><motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 md:p-12"><header className="text-center"><h1 className="mb-2 text-3xl font-bold tracking-tighter text-slate-100 md:text-4xl">Create an Account</h1><p className="text-sm text-slate-400">Join us and start your journey.</p></header><div className="mt-8 space-y-6"><AnimatePresence>{status.state === "error" && (<AlertMessage message={status.message} isError={true} />)}</AnimatePresence><form onSubmit={handleSubmit} className="space-y-6"><FormInput id="name" type="text" placeholder="Full Name" icon={FiUser} value={name} onChange={(e) => setName(e.target.value)} /><FormInput id="email" type="email" placeholder="Email" icon={FiMail} value={email} onChange={(e) => setEmail(e.target.value)} /><FormInput id="password" type="password" placeholder="Password" icon={FiLock} value={password} onChange={(e) => setPassword(e.target.value)} /><PasswordStrengthMeter strength={passwordStrength} /><ActionButton isLoading={status.state === 'loading'}>Create Account</ActionButton></form><div className="my-4 flex items-center gap-3"><hr className="w-full border-slate-700" /><span className="text-xs font-medium text-slate-500">OR</span><hr className="w-full border-slate-700" /></div><SocialButton onClick={handleGoogleSignUp} disabled={status.state === 'loading'}>Sign Up with Google</SocialButton><p className="text-center text-sm text-slate-400">Already have an account?{' '}<button onClick={onSwitchToSignIn} className="font-medium text-cyan-400 hover:underline">Sign In</button></p></div></motion.div></div>);
};
