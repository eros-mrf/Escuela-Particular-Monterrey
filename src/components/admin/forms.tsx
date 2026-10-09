"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import type { ActionState } from "@/app/admin/_lib/forms";
import { previewMarkdown } from "@/app/admin/actions/preview";

const ErrorsCtx = createContext<Record<string, string>>({});
const PendingCtx = createContext(false);

export function SubmitButton({ children, className = "btn btn-primary", pendingLabel = "Guardando…", name, value }: { children: ReactNode; className?: string; pendingLabel?: string; name?: string; value?: string }) {
  const status = useFormStatus();
  const formPending = useContext(PendingCtx);
  const pending = status.pending || formPending;
  return (
    <button type="submit" disabled={pending} className={className} name={name} value={value}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Formulario con mensajes claros de resultado y errores por campo (accesibles). */
export function AdminForm({
  action,
  children,
  submitLabel = "Guardar cambios",
  intents,
  extraButtons,
  className = "space-y-6",
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  /** Varios botones de envío; el elegido llega en el campo `intent`. */
  intents?: { value: string; label: string; className?: string }[];
  extraButtons?: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.message) {
      msgRef.current?.focus();
      msgRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [state]);

  // Se envía con onSubmit (no con action=) para que React NO borre los campos cuando hay errores de validación.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const data = new FormData(e.currentTarget, submitter);
    startTransition(() => formAction(data));
  }

  const errors = state.errors ?? {};
  return (
    <ErrorsCtx.Provider value={errors}>
     <PendingCtx.Provider value={pending}>
      <form onSubmit={onSubmit} className={className} noValidate>
        <div ref={msgRef} tabIndex={-1} role={state.ok === false || Object.keys(errors).length ? "alert" : "status"} className="outline-none">
          {state.message && (
            <p className={`rounded-2xl border p-4 font-semibold ${state.ok ? "border-[#b7e0c4] bg-[#e8f6ed] text-[#14532d]" : "border-[#f1b5b5] bg-[#fde8e8] text-[#7f1717]"}`}>
              {state.ok ? "✓ " : "⚠ "}
              {state.message}
            </p>
          )}
          {state.notice && <p className="mt-3 rounded-2xl border border-[#f0d982] bg-sun-tint p-4 font-semibold text-[#4a3600]">{state.notice}</p>}
        </div>
        {children}
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {intents ? (
            intents.map((i) => (
              <SubmitButton key={i.value} name="intent" value={i.value} className={i.className ?? "btn btn-primary"}>
                {i.label}
              </SubmitButton>
            ))
          ) : (
            <SubmitButton>{submitLabel}</SubmitButton>
          )}
          {extraButtons}
        </div>
      </form>
     </PendingCtx.Provider>
    </ErrorsCtx.Provider>
  );
}

function FieldShell({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span aria-hidden="true" className="text-[#9b1c1c]">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="error-text">{error}</p>
      ) : (
        hint && <p id={`${id}-hint`} className="hint">{hint}</p>
      )}
    </div>
  );
}

interface BaseProps {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
}

export function Field({ name, label, required, hint, type = "text", defaultValue, placeholder, maxLength, autoComplete, min, max }: BaseProps & { type?: string; defaultValue?: string | number; placeholder?: string; maxLength?: number; autoComplete?: string; min?: string; max?: string }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="field"
      />
    </FieldShell>
  );
}

export function TextArea({ name, label, required, hint, defaultValue, rows = 4, maxLength }: BaseProps & { defaultValue?: string; rows?: number; maxLength?: number }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea id={id} name={name} rows={rows} required={required} maxLength={maxLength} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} className="field" />
    </FieldShell>
  );
}

export function Select({ name, label, required, hint, options, defaultValue }: BaseProps & { options: readonly (string | { value: string; label: string })[]; defaultValue?: string }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <select id={id} name={name} required={required} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} className="field">
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return (
            <option key={v} value={v}>{l}</option>
          );
        })}
      </select>
    </FieldShell>
  );
}

export function Check({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input id={id} type="checkbox" name={name} defaultChecked={defaultChecked} aria-invalid={!!error} className="mt-1 size-5 shrink-0 accent-[#14509f]" />
        <span>
          <span className="font-semibold text-ink">{label}</span>
          {hint && <span className="hint mt-0 block">{hint}</span>}
        </span>
      </label>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function FileField({ name, label, accept, hint, required, multiple }: BaseProps & { accept: string; multiple?: boolean }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input id={id} name={name} type="file" accept={accept} multiple={multiple} required={required} className="field !py-2.5 file:mr-4 file:rounded-lg file:border-0 file:bg-sky file:px-4 file:py-2 file:font-bold file:text-brand" />
    </FieldShell>
  );
}

/** Imagen única con vista previa de la actual y opción de quitarla. */
export function ImageField({ name, label, currentId, hint, altName, altValue }: { name: string; label: string; currentId?: string; hint?: string; altName?: string; altValue?: string }) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-line bg-white p-4">
      <legend className="px-2 font-semibold text-ink">{label}</legend>
      {currentId && (
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/${currentId}`} alt="Imagen actual" className="h-24 w-36 rounded-xl border border-line object-cover" />
          <label className="flex cursor-pointer items-center gap-2 font-semibold text-[#9b1c1c]">
            <input type="checkbox" name={`${name}_remove`} className="size-5 accent-[#9b1c1c]" /> Quitar esta imagen
          </label>
        </div>
      )}
      <FileField name={name} label={currentId ? "Reemplazar por otra imagen" : "Subir imagen"} accept="image/jpeg,image/png,image/webp" hint={hint ?? "JPG, PNG o WebP, hasta 8 MB. Recomendado: 1600 px de ancho."} />
      {altName && <Field name={altName} label="Descripción de la imagen (texto alternativo)" defaultValue={altValue} hint="Describe brevemente qué se ve, para personas que usan lector de pantalla." maxLength={200} />}
    </fieldset>
  );
}

export function GalleryField({ prefix, label, images, hint }: { prefix: string; label: string; images: { mediaId: string; alt: string; caption?: string }[]; hint?: string }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-line bg-white p-4">
      <legend className="px-2 font-semibold text-ink">{label}</legend>
      <input type="hidden" name={`${prefix}_count`} value={images.length} />
      {images.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {images.map((img, i) => (
            <li key={img.mediaId} className="space-y-2 rounded-xl border border-line p-3">
              <input type="hidden" name={`${prefix}_id_${i}`} value={img.mediaId} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${img.mediaId}`} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
              <Field name={`${prefix}_alt_${i}`} label="Texto alternativo" defaultValue={img.alt} maxLength={200} />
              <Field name={`${prefix}_cap_${i}`} label="Leyenda (opcional)" defaultValue={img.caption} maxLength={300} />
              <label className="flex cursor-pointer items-center gap-2 font-semibold text-[#9b1c1c]">
                <input type="checkbox" name={`${prefix}_del_${i}`} className="size-5 accent-[#9b1c1c]" /> Eliminar esta fotografía
              </label>
            </li>
          ))}
        </ul>
      )}
      <FileField name={`${prefix}_new`} label="Agregar fotografías" accept="image/jpeg,image/png,image/webp" multiple hint={hint ?? "Puedes elegir varias a la vez. JPG, PNG o WebP, hasta 8 MB cada una. Podrás editar sus descripciones después de guardar."} />
    </fieldset>
  );
}

export function AttachmentsField({ prefix, items }: { prefix: string; items: { mediaId: string; title: string }[] }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-line bg-white p-4">
      <legend className="px-2 font-semibold text-ink">Documentos adjuntos (PDF)</legend>
      <input type="hidden" name={`${prefix}_count`} value={items.length} />
      {items.map((a, i) => (
        <div key={a.mediaId} className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <input type="hidden" name={`${prefix}_id_${i}`} value={a.mediaId} />
          <Field name={`${prefix}_title_${i}`} label="Título del documento" defaultValue={a.title} maxLength={160} />
          <label className="flex min-h-12 cursor-pointer items-center gap-2 font-semibold text-[#9b1c1c]">
            <input type="checkbox" name={`${prefix}_del_${i}`} className="size-5 accent-[#9b1c1c]" /> Eliminar
          </label>
        </div>
      ))}
      <div className="grid gap-3 sm:grid-cols-2">
        <FileField name={`${prefix}_new`} label="Agregar un PDF" accept="application/pdf" hint="Hasta 25 MB." />
        <Field name={`${prefix}_new_title`} label="Título del nuevo documento" maxLength={160} />
      </div>
    </fieldset>
  );
}

/** Editor de texto con barra de formato (Markdown) y vista previa segura. */
export function RichText({ name, label, defaultValue = "", rows = 14, hint, required }: BaseProps & { defaultValue?: string; rows?: number }) {
  const id = useId();
  const error = useContext(ErrorsCtx)[name];
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  function wrap(before: string, after = before, placeholder = "texto") {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e) || placeholder;
    ta.setRangeText(`${before}${sel}${after}`, s, e, "select");
    ta.focus();
  }

  function linePrefix(prefix: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const start = value.lastIndexOf("\n", s - 1) + 1;
    const chunk = value.slice(start, e) || "texto";
    const next = chunk.split("\n").map((l, i) => `${prefix.replace("1.", `${i + 1}.`)}${l}`).join("\n");
    ta.setRangeText(next, start, e, "select");
    ta.focus();
  }

  async function showPreview() {
    setMode("preview");
    setLoading(true);
    try {
      setHtml(await previewMarkdown(ref.current?.value ?? ""));
    } finally {
      setLoading(false);
    }
  }

  const btn = "flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-line bg-white px-2.5 text-sm font-bold text-ink hover:border-ink";
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span aria-hidden="true" className="text-[#9b1c1c]">*</span>}
      </label>
      <div className="rounded-2xl border border-[#8d8870] bg-white">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line p-2">
          <div role="tablist" aria-label="Modo del editor" className="mr-2 inline-flex rounded-lg bg-paper p-0.5">
            <button type="button" role="tab" aria-selected={mode === "write"} onClick={() => setMode("write")} className={`min-h-9 rounded-md px-3 text-sm font-bold ${mode === "write" ? "bg-ink text-white" : ""}`}>Escribir</button>
            <button type="button" role="tab" aria-selected={mode === "preview"} onClick={showPreview} className={`min-h-9 rounded-md px-3 text-sm font-bold ${mode === "preview" ? "bg-ink text-white" : ""}`}>Vista previa</button>
          </div>
          {mode === "write" && (
            <div role="toolbar" aria-label="Formato de texto" className="flex flex-wrap gap-1.5">
              <button type="button" className={btn} onClick={() => wrap("**")} aria-label="Negrita"><strong>N</strong></button>
              <button type="button" className={btn} onClick={() => wrap("*")} aria-label="Cursiva"><em>C</em></button>
              <button type="button" className={btn} onClick={() => linePrefix("## ")} aria-label="Título de sección">Título</button>
              <button type="button" className={btn} onClick={() => linePrefix("- ")} aria-label="Lista con viñetas">• Lista</button>
              <button type="button" className={btn} onClick={() => linePrefix("1. ")} aria-label="Lista numerada">1. Lista</button>
              <button type="button" className={btn} onClick={() => linePrefix("> ")} aria-label="Cita destacada">“ Cita</button>
              <button type="button" className={btn} onClick={() => wrap("[", "](https://)", "texto del enlace")} aria-label="Insertar enlace"><Icon name="link" size={16} /> Enlace</button>
            </div>
          )}
        </div>
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          required={required}
          defaultValue={defaultValue}
          hidden={mode === "preview"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className="block w-full resize-y rounded-b-2xl bg-white p-4 font-[inherit] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-bright"
        />
        {mode === "preview" && (
          <div className="min-h-40 p-5" aria-live="polite">
            {loading ? <p className="text-muted">Generando vista previa…</p> : html ? <div className="prose-escuela" dangerouslySetInnerHTML={{ __html: html }} /> : <p className="text-muted">Aún no hay texto para mostrar.</p>}
          </div>
        )}
      </div>
      {error ? <p id={`${id}-err`} className="error-text">{error}</p> : hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
    </div>
  );
}

/** Botón de acción destructiva con confirmación en diálogo accesible. */
export function DeleteButton({ action, title, description, label = "Eliminar", className = "btn btn-danger btn-sm" }: { action: () => Promise<void>; title: string; description: string; label?: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        <Icon name="close" size={15} /> {label}
      </button>
      <dialog ref={ref} aria-labelledby="del-title" className="m-auto w-[min(32rem,92vw)] rounded-3xl border border-line p-0 shadow-card backdrop:bg-ink/60">
        <form action={action} className="space-y-4 p-7">
          <h2 id="del-title" className="font-display text-2xl font-extrabold">{title}</h2>
          <p className="text-[#35414f]">{description}</p>
          <p className="font-semibold text-[#9b1c1c]">Esta acción no se puede deshacer.</p>
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button type="button" className="btn btn-outline" onClick={() => ref.current?.close()} autoFocus>Cancelar</button>
            <SubmitButton className="btn btn-danger" pendingLabel="Eliminando…">Sí, eliminar</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Botón simple que ejecuta una acción de servidor (publicar/despublicar, etc.). */
export function ActionButton({ action, children, className = "btn btn-outline btn-sm" }: { action: () => Promise<void>; children: ReactNode; className?: string }) {
  return (
    <form action={action}>
      <SubmitButton className={className} pendingLabel="Procesando…">{children}</SubmitButton>
    </form>
  );
}
