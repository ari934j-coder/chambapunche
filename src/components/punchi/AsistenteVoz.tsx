"use client";
import { useState, useRef } from "react";
import { guardarVenta, guardarGasto } from "@/lib/registros";

type Estado = "inactivo" | "escuchando" | "procesando" | "confirmando" | "guardando" | "error";

interface ResultadoInterpretado {
  tipo: "venta" | "gasto";
  monto: number;
  descripcion: string;
  categoria: "personal" | "negocio";
}

export function AsistenteVoz() {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [resultado, setResultado] = useState<ResultadoInterpretado | null>(null);
  const [mensajeError, setMensajeError] = useState("");
  const reconocimientoRef = useRef<any>(null);

  async function reproducirVoz(texto: string) {
    try {
      const res = await fetch("/api/voz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch {
      // Si la voz falla, seguimos igual con la confirmación visual.
    }
  }

  function iniciarEscucha() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setEstado("error");
      setMensajeError("Tu navegador no permite usar el micrófono. Usa los botones normales.");
      return;
    }

    const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = "es-PE";
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = async (event: any) => {
      const texto = event.results[0][0].transcript;
      setEstado("procesando");
      const res = await fetch("/api/interpretar-voz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const datos = await res.json();

      if (!datos.entendido) {
        setEstado("error");
        setMensajeError(datos.mensaje || "No te entendí bien. Intenta otra vez.");
        reproducirVoz(datos.mensaje || "No te entendí bien, ¿puedes repetirlo?");
        return;
      }

      setResultado(datos);
      setEstado("confirmando");
      const frase =
        datos.tipo === "venta"
          ? `Vendiste ${datos.descripcion} por ${datos.monto} soles. ¿Está bien?`
          : `Gastaste ${datos.monto} soles en ${datos.descripcion}. ¿Está bien?`;
      reproducirVoz(frase);
    };

    reconocimiento.onerror = () => {
      setEstado("error");
      setMensajeError("No pude escucharte bien. Intenta otra vez en un lugar con menos ruido.");
    };

    reconocimiento.onend = () => {
      if (estado === "escuchando") setEstado("inactivo");
    };

    reconocimientoRef.current = reconocimiento;
    setEstado("escuchando");
    reconocimiento.start();
  }

  async function confirmar() {
    if (!resultado) return;
    setEstado("guardando");
    try {
      if (resultado.tipo === "venta") {
        await guardarVenta({
          monto: resultado.monto,
          descripcion: resultado.descripcion,
          origen: "voz",
        });
      } else {
        await guardarGasto({
          monto: resultado.monto,
          descripcion: resultado.descripcion,
          categoria: resultado.categoria,
          origen: "voz",
        });
      }
      reproducirVoz("¡Listo! Ya quedó anotado.");
      setEstado("inactivo");
      setResultado(null);
      window.location.reload();
    } catch {
      setEstado("error");
      setMensajeError("No se pudo guardar. Si no tienes internet, lo intento de nuevo cuando vuelva la señal.");
    }
  }

  function cancelar() {
    setEstado("inactivo");
    setResultado(null);
  }

  return (
    <>
      <button
        onClick={iniciarEscucha}
        disabled={estado !== "inactivo" && estado !== "error"}
        aria-label="Hablar con Punchi para registrar una venta o gasto"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
        style={{
          backgroundColor: estado === "escuchando" ? "var(--color-ingreso)" : "var(--color-marca)",
        }}
      >
        {estado === "escuchando" ? "●" : "🎤"}
      </button>

      {(estado === "escuchando" || estado === "procesando") && (
        <div
          className="fixed bottom-28 right-6 max-w-xs rounded-xl p-3 shadow-md text-sm"
          style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
        >
          {estado === "escuchando" ? "Te escucho..." : "Un momento..."}
        </div>
      )}

      {estado === "confirmando" && resultado && (
        <div className="fixed inset-0 flex items-end justify-center p-4 z-50" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div
            className="w-full max-w-sm rounded-2xl p-5"
            style={{ backgroundColor: "var(--color-tarjeta)" }}
          >
            <p className="text-center mb-1" style={{ opacity: 0.7 }}>
              {resultado.tipo === "venta" ? "Vendiste" : "Gastaste"}
            </p>
            <p className="text-center text-lg font-medium mb-1">{resultado.descripcion}</p>
            <p
              className="text-center text-3xl font-bold mb-4"
              style={{ color: resultado.tipo === "venta" ? "var(--color-ingreso)" : "var(--color-gasto)" }}
            >
              S/ {resultado.monto.toFixed(2)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelar}
                className="flex-1 rounded-xl py-3 font-semibold"
                style={{ border: "1px solid var(--color-borde)", minHeight: 48 }}
              >
                Corregir
              </button>
              <button
                onClick={confirmar}
                className="flex-1 rounded-xl py-3 font-semibold text-white"
                style={{ backgroundColor: "var(--color-marca)", minHeight: 48 }}
              >
                Sí, guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {estado === "error" && (
        <div
          className="fixed bottom-28 right-6 max-w-xs rounded-xl p-3 shadow-md text-sm"
          style={{ backgroundColor: "var(--color-gasto-bg)", color: "var(--color-gasto)" }}
        >
          {mensajeError}
        </div>
      )}
    </>
  );
}
