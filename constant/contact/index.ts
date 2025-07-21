import { IconBrandDiscord } from "@tabler/icons-react";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    subtitle: "support@devstats.com",
    badge: "24h response",
    color: "#007AFF",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    subtitle: "Live chat support",
    badge: "Online",
    color: "#00C851",
  },
  {
    icon: Phone,
    title: "Phone",
    subtitle: "+1 (555) 123-4567",
    badge: "Mon-Fri 9-6",
    color: "#FF3B30",
  },
  {
    icon: MapPin,
    title: "Location",
    subtitle: "Tech City",
    badge: "Visit us",
    color: "#FF9500",
  },
  {
    icon: IconBrandDiscord,
    title: "Discord",
    subtitle: "DevStats Discord",
    badge: "Join us",
    color: "#5865F2",
  },
];
