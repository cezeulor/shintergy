import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("Shintergyadmin");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      toast.error("Ingresa el código de 6 dígitos");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), code.trim());
      toast.success("Sesión iniciada");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1f18] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#c9a961]/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#1a5336]/50 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-br from-[#c9a961] to-[#1a5336] rounded-3xl blur opacity-40"></div>
        <form
          onSubmit={handleSubmit}
          data-testid="admin-login-form"
          className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-5"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1a5336] text-white mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a5336]">Panel de administración</h1>
            <p className="text-sm text-gray-500 mt-1">
              Shíntergy · Ingresa con tu app de autenticación
            </p>
          </div>

          <div>
            <Label className="text-sm">Usuario</Label>
            <Input
              data-testid="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div>
            <Label className="text-sm flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              Código de 6 dígitos (Google Authenticator)
            </Label>
            <Input
              data-testid="admin-totp"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="123456"
              required
              className="h-14 text-2xl tracking-[0.4em] text-center font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1 text-center">
              El código rota cada 30 segundos
            </p>
          </div>

          <Button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            className="w-full bg-[#1a5336] hover:bg-[#143f28] text-white h-11"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Entrando…" : "Entrar"}
          </Button>

          <p className="text-[11px] text-gray-400 text-center pt-2">
            Necesitas haber escaneado el QR de configuración inicial con Google Authenticator o Authy.
          </p>
        </form>
      </div>
    </div>
  );
};
