"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import gsap from "gsap";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
};

const inputClass =
  "peer w-full bg-transparent py-3 text-lg leading-7 text-amber-50 caret-amber-200 outline-none resize-none";

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  multiline = false,
}: FieldProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const floatLabel = (up: boolean) => {
    gsap.to(labelRef.current, {
      y: up ? -24 : 0,
      scale: up ? 0.72 : 1,
      color: up ? "#e8d7b0" : "rgba(245,236,215,0.5)",
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleFocus = () => {
    floatLabel(true);
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.7, ease: "expo.out" });
  };

  const handleBlur = () => {
    if (!value) floatLabel(false);
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.5, ease: "power3.in" });
  };

  const sharedProps = {
    name,
    value,
    onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    required: true,
    className: inputClass,
  };

  return (
    <label className="contact-field relative block pt-6">
      <span
        ref={labelRef}
        className="pointer-events-none absolute left-0 top-9.5 origin-left text-lg text-amber-50/50"
      >
        {label}
      </span>

      {multiline ? (
        <textarea {...sharedProps} rows={5} />
      ) : (
        <input {...sharedProps} type={type} />
      )}

      {/* Resting hairline */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-amber-50/15" />
      {/* Accent line that draws in on focus */}
      <span
        ref={lineRef}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-center scale-x-0 bg-amber-50"
      />
    </label>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  // Entrance: fields rise in with a stagger, once.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-field", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  // Magnetic send button: it leans slightly toward the cursor.
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const xTo = gsap.quickTo(button, "x", {
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
    const yTo = gsap.quickTo(button, "y", {
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });

    const onMove = (e: MouseEvent) => {
      const r = button.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener("mousemove", onMove);
    button.addEventListener("mouseleave", onLeave);
    return () => {
      button.removeEventListener("mousemove", onMove);
      button.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Success message eases in when the send completes.
  useEffect(() => {
    if (status === "sent" && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    }
  }, [status]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Replace this with your real endpoint, e.g.:
      // await fetch("/api/contact", { method: "POST", headers: {...}, body: JSON.stringify(form) })
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="rounded-[28px] border border-amber-50/10 bg-white/2 p-8 backdrop-blur-sm md:p-12">
      <h3 className="mb-10 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
        Tell us about your project
      </h3>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
      >
        <Field
          label="Your name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Field
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Field
          label="Your message"
          name="message"
          value={form.message}
          onChange={handleChange}
          multiline
        />

        <button
          ref={buttonRef}
          type="submit"
          disabled={status === "sending"}
          className="group relative mt-4 inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-amber-50 px-9 py-4 text-sm font-medium text-olive-950 transition-opacity disabled:opacity-70"
        >
          {/* Light sweep on hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">
            {status === "sending" ? "Sending" : "Send message"}
          </span>
          {status === "sending" && (
            <span className="relative flex gap-1" aria-hidden="true">
              <span className="h-1 w-1 animate-bounce rounded-full bg-olive-950 [animation-delay:-0.3s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-olive-950 [animation-delay:-0.15s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-olive-950" />
            </span>
          )}
        </button>

        {status === "sent" && (
          <p
            ref={successRef}
            role="status"
            className="text-base text-amber-50/75"
          >
            Your message has been sent. We will get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}