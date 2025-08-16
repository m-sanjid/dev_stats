"use client";

import { useState } from "react";
import { User, AtSign, FileText, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import BorderDiv from "./BorderDiv";
import { useMutation } from "@tanstack/react-query";

const ContactForm = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const formFields = [
    { name: "name", placeholder: "Full Name", icon: User, type: "text" },
    {
      name: "email",
      placeholder: "Email Address",
      icon: AtSign,
      type: "email",
    },
    { name: "subject", placeholder: "Subject", icon: FileText, type: "text" },
    {
      name: "message",
      placeholder: "Message",
      icon: MessageCircle,
      type: "textarea",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-6">
      <div className="px-4">
        <BorderDiv>
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <div className="border-b px-4 py-1">
              <h3 className="text-base font-semibold">Send Message</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll get back to you soon
              </p>
            </div>

            <div className="space-y-4 bg-primary/5 p-2 backdrop-blur-sm">
              {formFields.map((field) => {
                const Icon = field.icon;
                const isTextarea = field.type === "textarea";

                return (
                  <div key={field.name} className="relative">
                    <div
                      className={`relative flex items-start gap-3 rounded-xl bg-white p-3 transition-all duration-200 dark:bg-black ${
                        focusedField === field.name
                          ? "bg-muted ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <div className="pt-1">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            focusedField === field.name
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      {isTextarea ? (
                        <textarea
                          placeholder={field.placeholder}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.name]: e.target.value,
                            })
                          }
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField("")}
                          required
                          rows={4}
                          className="flex-1 resize-none border-none bg-transparent text-base placeholder-muted-foreground outline-none focus:outline-none"
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.name]: e.target.value,
                            })
                          }
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField("")}
                          required
                          className="flex-1 border-none bg-transparent text-base placeholder-muted-foreground outline-none focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <BorderDiv className="mt-2 rounded-2xl">
            <button
              type="submit"
              className="w-full rounded-[8px] bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Sending..."
                : mutation.isSuccess
                  ? "Sent!"
                  : "Send Message"}
            </button>
          </BorderDiv>
        </BorderDiv>
      </div>
    </form>
  );
};

export default ContactForm;
