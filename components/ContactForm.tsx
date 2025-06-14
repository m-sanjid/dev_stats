"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle,
  User,
  AtSign,
  FileText,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import BorderDiv from "./BorderDiv";

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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSuccess(true);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
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
    <form onSubmit={handleSubmit}>
      <div className="px-4">
        <BorderDiv>
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <div className="border-b px-4 py-1">
              <h3 className="text-base font-semibold">Send Message</h3>
              <p className="text-sm text-muted-foreground">
                We'll get back to you soon
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
          <div className="px-4 pt-6">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-200 active:scale-95 ${
                success
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : loading
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:bg-primary/80"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {success ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Message Sent</span>
                  </>
                ) : loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </BorderDiv>
      </div>
    </form>
  );
};

export default ContactForm;
