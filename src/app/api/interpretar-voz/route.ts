import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODELO = "gemini-2.0-flash";

const INSTRUCCIONES = `Eres Punchi, el asistente de ChambaPunche: una app que ayuda a pequenos
vendedores informales en Peru a registrar sus ventas y gastos hablando de forma natural.

Tu trabajo es leer lo que el usuario dijo (transcrito de audio, puede tener errores) y
devolver SOLO un JSON con esta forma exacta, sin texto adicional, sin markdown:

{
  "tipo": "venta" | "gasto" | "pregunta" | "no_entendido",
  "completo": boolean,
  "monto": number o null,
  "descripcion": string o null,
  "categoria": "personal" | "negocio" o null,
  "mensaje": string
}

Reglas:
- "tipo" es "venta" si vendio algo, "gasto" si compro o pago algo, "pregunta" si esta
  preguntando algo (ej. cuanto gane ayer), "no_entendido" si la frase no tiene sentido.
- "completo" es true solo si ya tienes monto Y descripcion claros para venta o gasto.
- Si falta el monto o la descripcion, "completo" es false, y "mensaje" debe ser una
  pregunta corta y amable para pedir ese dato faltante (ej. Cuanto vendiste?).
- NUNCA inventes un monto que el usuario no dijo. Si no dijo numero, monto es null.
- Para gasto, "categoria" es "personal" si menciona que es para el/ella o su casa,
  "negocio" en cualquier otro caso (por defecto).
- Si "completo" es true, "mensaje" es una confirmacion corta y natural en espanol
  peruano, ej: Vendiste 3 panes por 6 soles. Esta bien? o Gastaste 4 soles en harina. Esta bien?
- Para "pregunta", responde brevemente en "mensaje" que todavia no puedes consultar el
  historial, pero que pronto vas a poder.
- Usa frases cortas, calidas, nunca tecnicas. Nunca regañes al usuario.`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ entendido: false, mensaje: "Falta configurar la IA." }, { status: 500 });
  }

  const { texto } = await req.json();
  if (!texto || typeof texto !== "string") {
    return NextResponse.json({ entendido: false, mensaje: "No escuché nada." }, { status: 400 });
  }

  try {
    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${INSTRUCCIONES}\n\nLo que dijo el usuario: "${texto}"` }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("Gemini falló:", detalle);
      return NextResponse.json(
        { entendido: false, mensaje: `No pude pensarlo bien. (${respuesta.status}) ${detalle.slice(0, 200)}` },
        { status: 200 }
      );
    }

    const datos = await respuesta.json();
    const textoJson = datos.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textoJson) {
      return NextResponse.json(
        { entendido: false, mensaje: "No te entendí bien. ¿Puedes repetirlo?" },
        { status: 200 }
      );
    }

    const resultado = JSON.parse(textoJson);

    if (resultado.tipo === "no_entendido" || !resultado.tipo) {
      return NextResponse.json(
        { entendido: false, mensaje: resultado.mensaje || "No te entendí bien, ¿puedes repetirlo?" },
        { status: 200 }
      );
    }

    return NextResponse.json({ entendido: true, ...resultado });
  } catch (error) {
    console.error("Error interpretando con Gemini:", error);
    return NextResponse.json(
      { entendido: false, mensaje: "Tuve un problema pensando. Intenta otra vez." },
      { status: 200 }
    );
  }
}
