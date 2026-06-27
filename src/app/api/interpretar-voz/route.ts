import { NextRequest, NextResponse } from "next/server";

// Interpreta una frase dictada por el usuario y la convierte en una accion
// estructurada (venta o gasto). Version simple basada en palabras clave,
// pensada para frases cortas y naturales como las que usaria nuestro usuario.
// Fase 2: reemplazar por una llamada a un modelo de lenguaje para mayor
// precision con frases mas variadas o con errores de transcripcion.

const PALABRAS_GASTO = ["gasté", "gaste", "compré", "compre", "pagué", "pague", "gasto"];
const PALABRAS_PERSONAL = ["personal", "para mi", "para mí", "mío", "mio"];

export async function POST(req: NextRequest) {
  const { texto } = await req.json();

  if (!texto || typeof texto !== "string") {
    return NextResponse.json({ error: "Texto vacío" }, { status: 400 });
  }

  const textoLimpio = texto.toLowerCase().trim();

  // Extrae el primer numero (con decimales opcionales) que aparezca
  const coincidenciaMonto = textoLimpio.match(/(\d+(?:[.,]\d+)?)/);
  if (!coincidenciaMonto) {
    return NextResponse.json(
      { entendido: false, mensaje: "No escuché ningún monto. ¿Puedes repetirlo con un número?" },
      { status: 200 }
    );
  }
  const monto = parseFloat(coincidenciaMonto[1].replace(",", "."));

  const esGasto = PALABRAS_GASTO.some((p) => textoLimpio.includes(p));
  const tipo: "venta" | "gasto" = esGasto ? "gasto" : "venta";

  const categoria: "personal" | "negocio" = PALABRAS_PERSONAL.some((p) => textoLimpio.includes(p))
    ? "personal"
    : "negocio";

  // La descripcion es el texto sin el monto ni las palabras de accion,
  // recortado a algo legible.
  let descripcion = textoLimpio
    .replace(coincidenciaMonto[1], "")
    .replace(/soles|sol|s\/\.?/g, "")
    .replace(/vendí|vendi|gasté|gaste|compré|compre|pagué|pague|en|de|por|a|el|la|los|las/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!descripcion) descripcion = tipo === "venta" ? "una venta" : "un gasto";

  return NextResponse.json({
    entendido: true,
    tipo,
    monto,
    descripcion,
    categoria,
  });
}
