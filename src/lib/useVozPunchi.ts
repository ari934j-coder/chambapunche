"use client";
import { useState } from "react";

export function useVozPunchi() {
  const [reproduciendo, setReproduciendo] = useState(false);

  async function reproducirVoz(texto: string) {
    setReproduciendo(true);
    try {
      const res = await fetch("/api/voz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) {
        console.error("Error de voz:", await res.text());
        return;
      }
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      await audio.play().catch((e) => console.error("Bloqueo de autoplay:", e));
    } catch (e) {
      console.error("Error de voz:", e);
    } finally {
      setReproduciendo(false);
    }
  }

  return { reproducirVoz, reproduciendo };
}
