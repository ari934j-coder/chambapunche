"use client";

export function BotonVoz({ onPress }: { onPress?: () => void }) {
  return (
    <button
      onClick={onPress}
      aria-label="Hablar con Punchi para registrar una venta o gasto"
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
      style={{ backgroundColor: "var(--color-marca)" }}
    >
      🎤
    </button>
  );
}
