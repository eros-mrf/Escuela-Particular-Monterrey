import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { readMediaFile } from "@/lib/media";

export const dynamic = "force-dynamic";

/**
 * Sirve los archivos subidos desde el panel.
 * - Imágenes y archivos "públicos": cualquiera.
 * - Archivos "privados" (documentos no publicados): solo personal con sesión iniciada.
 * El tipo de contenido proviene del registro, nunca del nombre ni del navegador.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new NextResponse("No encontrado", { status: 404 });

  const rec = await db.media.find(id);
  if (!rec) return new NextResponse("No encontrado", { status: 404 });

  if (rec.visibility === "private" && !(await getSessionUser())) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readMediaFile(rec);
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }

  const download = req.nextUrl.searchParams.get("descargar") === "1";
  const safeName = rec.originalName.replace(/[^A-Za-z0-9._-]+/g, "_") || `archivo.${rec.ext}`;
  const filename = safeName.toLowerCase().endsWith(`.${rec.ext}`) ? safeName : `${safeName}.${rec.ext}`;

  const headers: Record<string, string> = {
    "Content-Type": rec.mime,
    "Content-Length": String(data.length),
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
    "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    "Cache-Control": rec.visibility === "public" ? "public, max-age=3600, stale-while-revalidate=86400" : "private, no-store",
  };
  if (rec.visibility === "private") headers["X-Robots-Tag"] = "noindex";

  return new NextResponse(new Uint8Array(data), { status: 200, headers });
}
