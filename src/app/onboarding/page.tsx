"use client";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Paso = "telefono" | "codigo";

export default function PantallaOnboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>("telefono");
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState("");
  const [confirmacion, setConfirmacion] = useState<ConfirmationResult | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function enviarCodigo() {
    setError("");
    setCargando(true);
    try {
      const numeroCompleto = `+51${telefono.replace(/\D/g, "")}`;
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const resultado = await signInWithPhoneNumber(auth, numeroCompleto, verifier);
      setConfirmacion(resultado);
      setPaso("codigo");
    } catch {
      setError("No pudimos enviar el código. Revisa tu número e intenta otra vez.");
    } finally {
      setCargando(false);
    }
  }

  async function confirmarCodigo() {
    if (!confirmacion) return;
    setError("");
    setCargando(true);
    try {
      await confirmacion.confirm(codigo);
      router.push("/");
    } catch {
      setError("Ese código no es correcto. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">ChambaPunche</h1>
        <p className="text-center mb-8" style={{ opacity: 0.7 }}>
          Tu compañero para administrar tu negocio
        </p>

        {paso === "telefono" && (
          <>
            <label className="block text-sm font-medium mb-2">
              Ingresa tu número de teléfono
            </label>
            <div
              className="flex items-center rounded-xl px-3 py-3 mb-3"
              style={{ border: "1px solid var(--color-borde)", backgroundColor: "var(--color-tarjeta)" }}
            >
              <span className="mr-2" style={{ opacity: 0.7 }}>+51</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="987 654 321"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="flex-1 outline-none bg-transparent text-lg"
              />
            </div>
            {error && <p className="text-sm mb-3" style={{ color: "var(--color-gasto)" }}>{error}</p>}
            <button
              onClick={enviarCodigo}
              disabled={cargando || telefono.length < 9}
              className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--color-marca)", minHeight: 48 }}
            >
              {cargando ? "Enviando..." : "Enviar código"}
            </button>
          </>
        )}

        {paso === "codigo" && (
          <>
            <label className="block text-sm font-medium mb-2">
              Escribe el código que te llegó por SMS
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full rounded-xl px-3 py-3 mb-3 text-lg text-center tracking-widest outline-none"
              style={{ border: "1px solid var(--color-borde)", backgroundColor: "var(--color-tarjeta)" }}
            />
            {error && <p className="text-sm mb-3" style={{ color: "var(--color-gasto)" }}>{error}</p>}
            <button
              onClick={confirmarCodigo}
              disabled={cargando || codigo.length < 4}
              className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--color-marca)", minHeight: 48 }}
            >
              {cargando ? "Verificando..." : "Confirmar"}
            </button>
          </>
        )}

        <div id="recaptcha-container" />
      </div>
    </main>
  );
}
