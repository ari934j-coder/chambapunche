import { NextRequest, NextResponse } from "next/server";

// Esta clave nunca se expone al navegador: vive solo aqui, en el servidor.
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Voz de Martina, elegida por el equipo para Punchi.
const VOICE_ID = "jw1XYij1FCiI9FENSxIf";

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "Falta configurar ELEVENLABS_API_KEY" }, { status: 500 });
  }

  const { texto } = await req.json();
  if (!texto || typeof texto !== "string") {
    return NextResponse.json({ error: "Texto vacío" }, { status: 400 });
  }

  const respuesta = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: texto,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return NextResponse.json({ error: "ElevenLabs falló", detalle }, { status: 502 });
  }

  const audioBuffer = await respuesta.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
