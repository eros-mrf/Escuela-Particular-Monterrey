import { Icon } from "@/components/ui/Icon";

/** Bloque de información editable: si el colegio aún no lo completa, muestra un marcador claramente identificado. */
export function InfoBlock({
  title,
  icon,
  text,
  list = false,
  placeholder = "Información por confirmar por el establecimiento.",
}: {
  title: string;
  icon: string;
  text: string;
  list?: boolean;
  placeholder?: string;
}) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const empty = lines.length === 0;
  return (
    <section className={`card h-full p-7 ${empty ? "border-dashed" : ""}`} aria-label={title}>
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name={icon} size={24} /></span>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {empty ? (
        <p className="mt-3 rounded-xl bg-sun-tint px-4 py-3 text-[0.95rem] font-semibold text-[#4a3600]">[{placeholder}]</p>
      ) : list ? (
        <ul className="mt-3 space-y-2">
          {lines.map((l) => (
            <li key={l} className="flex gap-2.5"><Icon name="check" size={18} className="mt-1 shrink-0 text-brand" />{l}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 space-y-3 text-[#35414f]">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      )}
    </section>
  );
}
