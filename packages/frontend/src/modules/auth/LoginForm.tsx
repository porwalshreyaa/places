import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Mail, Key, User, Loader2 } from "lucide-react";
import { Input } from "../../atoms/Input";
import { Button } from "../../atoms/Button";
import { useAuth, User as UserType } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLogin || username.length < 3) {
      setUsernameAvailable(null);
      setIsCheckingUsername(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setIsCheckingUsername(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get<{ available: boolean }>(`/api/auth/check-availability?username=${encodeURIComponent(username)}`);
        setUsernameAvailable(data.available);
      } catch (err) {
        console.error("Failed to check username", err);
        setUsernameAvailable(true);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!isLogin && password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      if (!isLogin && usernameAvailable === false) {
        setError("Username is already taken");
        setIsLoading(false);
        return;
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { username, password } : { username, email, password };

      const data = await api.post<{ token: string; user: UserType }>(endpoint, body);

      login(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-stone-200/85 rounded-xl shadow-xs p-8"
    >
      <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-lg border border-stone-200/40">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError("");
          }}
          className={`py-2 text-xs font-semibold tracking-wide rounded-md transition-all duration-150 ${
            isLogin
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setError("");
          }}
          className={`py-2 text-xs font-semibold tracking-wide rounded-md transition-all duration-150 ${
            !isLogin
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="p-3 bg-stone-50 border border-stone-200 text-rose-600 text-xs rounded-lg font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <Input
            label="Username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            icon={<User className="w-4 h-4 text-stone-400" />}
            rightElement={
              !isLogin && username.length >= 3 ? (
                <div className="flex items-center">
                  {isCheckingUsername ? (
                    <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
                  ) : usernameAvailable ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500" />
                  )}
                </div>
              ) : undefined
            }
          />

          <AnimatePresence initial={false}>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4 text-stone-400" />}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={<Key className="w-4 h-4 text-stone-400" />}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full py-3 px-4 !font-semibold !text-sm flex items-center justify-center cursor-pointer rounded-lg !bg-stone-900 hover:!bg-stone-800"
        >
          {isLogin ? "Sign In" : "Register"}
        </Button>
      </form>
    </motion.div>
  );
}
