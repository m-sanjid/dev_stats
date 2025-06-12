"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <PageHeader
          title="Contact Us"
          description="Get in touch with the DevStats team"
        />
      </motion.div>

      <motion.div
        className="container mx-auto max-w-7xl px-4 py-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div variants={item}>
            <Card className="border-2 border-transparent transition-all duration-300 hover:border-purple-500/20 dark:hover:border-purple-500/10">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      className="min-h-[150px] transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transform bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-700"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div className="space-y-6" variants={container}>
            <motion.div variants={item}>
              <Card className="group cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 hover:shadow-lg dark:hover:border-purple-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/10 p-3 text-purple-500 transition-transform duration-300 group-hover:scale-110">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-purple-500">
                        Email
                      </h3>
                      <p className="text-muted-foreground transition-colors group-hover:text-foreground/80">
                        support@devstats.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="group cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 hover:shadow-lg dark:hover:border-purple-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/10 p-3 text-purple-500 transition-transform duration-300 group-hover:scale-110">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-purple-500">
                        Live Chat
                      </h3>
                      <p className="text-muted-foreground transition-colors group-hover:text-foreground/80">
                        Available 24/7
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="group cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 hover:shadow-lg dark:hover:border-purple-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/10 p-3 text-purple-500 transition-transform duration-300 group-hover:scale-110">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-purple-500">
                        Phone
                      </h3>
                      <p className="text-muted-foreground transition-colors group-hover:text-foreground/80">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="group cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 hover:shadow-lg dark:hover:border-purple-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/10 p-3 text-purple-500 transition-transform duration-300 group-hover:scale-110">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-purple-500">
                        Office
                      </h3>
                      <p className="text-muted-foreground transition-colors group-hover:text-foreground/80">
                        123 Developer Street
                        <br />
                        Tech City, TC 12345
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
