"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
      {pending ? "Enviando…" : "Enviar mensaje"}
    </button>
  );
}

export function ContactForm({ formToken }: { formToken: string }) {
  const [state, action] = useActionState(sendContact, initial);
  const e = state.errors ?? {};
  const v = state.values;

  if (state.status === "ok") {
    return (
      <div role="status" className="rounded-3xl border border-[#b7e0c4] bg-[#e8f6ed] p-8 text-[#14532d]">
        <p className="font-display text-2xl font-extrabold">Mensaje enviado</p>
        <p className="mt-2 text-lg">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="card space-y-5 p-6 sm:p-8" aria-describedby={state.message ? "contact-msg" : undefined}>
      {state.message && (
        <p id="contact-msg" role={state.status === "error" ? "alert" : "status"} className="rounded-2xl border border-[#f1b5b5] bg-[#fde8e8] p-4 font-semibold text-[#7f1717]">
          {state.message}
        </p>
      )}
      <input type="hidden" name="ft" value={formToken} />
      {/* Campo trampa: las personas no lo ven; los robots suelen completarlo. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>No completar este campo <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Nombre <span aria-hidden="true">*</span></label>
          <input id="name" name="name" required autoComplete="name" defaultValue={v?.name} aria-invalid={!!e.name} aria-describedby={e.name ? "err-name" : undefined} className="field" />
          {e.name && <p id="err-name" className="error-text">{e.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">Correo electrónico <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v?.email} aria-invalid={!!e.email} aria-describedby={e.email ? "err-email" : undefined} className="field" />
          {e.email && <p id="err-email" className="error-text">{e.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="label">Asunto <span aria-hidden="true">*</span></label>
        <input id="subject" name="subject" required defaultValue={v?.subject} aria-invalid={!!e.subject} aria-describedby={e.subject ? "err-subject" : undefined} className="field" />
        {e.subject && <p id="err-subject" className="error-text">{e.subject}</p>}
      </div>
      <div>
        <label htmlFor="message" className="label">Mensaje <span aria-hidden="true">*</span></label>
        <textarea id="message" name="message" required rows={6} maxLength={2000} defaultValue={v?.message} aria-invalid={!!e.message} aria-describedby={e.message ? "err-message" : "hint-message"} className="field" />
        {e.message ? <p id="err-message" className="error-text">{e.message}</p> : <p id="hint-message" className="hint">Máximo 2000 caracteres. No incluyas datos sensibles como claves o información de salud.</p>}
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-[#14509f]" aria-invalid={!!e.consent} aria-describedby={e.consent ? "err-consent" : undefined} />
          <span className="text-[0.97rem]">
            Acepto que la escuela use mis datos únicamente para responder esta consulta, según la{" "}
            <a href="/privacidad" className="font-bold text-brand underline underline-offset-4" target="_blank" rel="noopener noreferrer">política de privacidad</a>. <span aria-hidden="true">*</span>
          </span>
        </label>
        {e.consent && <p id="err-consent" className="error-text">{e.consent}</p>}
      </div>
      <Submit />
    </form>
  );
}
