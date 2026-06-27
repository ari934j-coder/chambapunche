import { Timestamp } from "firebase/firestore";

const ETIQUETAS_DIA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function aFecha(valor: Timestamp | null | undefined): Date {
  // Mientras un registro está guardado offline (sin internet todavía),
  // el timestamp del servidor llega como null hasta que sincroniza.
  // En ese caso asumimos que es de ahora mismo, que es la realidad.
  if (!valor) return new Date();
  return valor.toDate();
}

export function esMismoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ultimosSieteDias(): { etiqueta: string; fecha: Date }[] {
  const hoy = new Date();
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    dias.push({ etiqueta: ETIQUETAS_DIA[fecha.getDay()], fecha });
  }
  return dias;
}
