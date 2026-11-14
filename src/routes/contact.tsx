import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer, FadeIn } from "@/components/portfolio";
import { Mail, Phone, Linkedin, MessageCircle, PhoneCall, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Ashwin — Let's Collaborate" },
    { name: "description", content: "Get in touch with Ashwin about AI, robotics, computer vision and engineering collaborations." },
    { property: "og:title", content: "Contact Ashwin — Let's Collaborate" },
    { property: "og:description", content: "Get in touch with Ashwin about AI, robotics, computer vision and engineering collaborations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Contact,
});

function Contact() {
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const phoneNumber = "8884815436";
  const formattedPhone = "+91 8884815436";
  const email = "ashwintelang2@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const linkedinUrl = "https://www.linkedin.com/in/ashwin-kiran-telang";
  const whatsappUrl = `https://wa.me/91${phoneNumber}`;
  const callUrl = `tel:+91${phoneNumber}`;

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <Nav />
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center sm:px-8 md:px-10">
        <FadeIn>
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-foreground/60 sm:text-sm">
            Get in touch · Open for collaborations & projects
          </span>
          <h1 className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none text-white">
            Let's talk
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-foreground/80 sm:text-xl md:text-2xl">
            Have an idea involving AI, robotics, computer vision or engineering? I’d love to hear about it.
          </p>
        </FadeIn>

        <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Email -> Opens Gmail Compose */}
          <FadeIn delay={0.1}>
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col items-center justify-between rounded-[32px] border border-border bg-card/40 p-6 text-center transition-all duration-300 hover:border-foreground/50 hover:bg-card/70 sm:p-8"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-black/40 text-foreground transition-transform duration-300 group-hover:scale-110">
                <Mail className="size-6" />
              </div>
              <div className="my-5">
                <span className="block text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Email
                </span>
                <span className="mt-1 block break-all text-sm font-medium text-white group-hover:underline group-hover:underline-offset-4 sm:text-base">
                  {email}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-foreground/70 group-hover:text-white">
                Write email on Gmail <ExternalLink className="size-3.5" />
              </span>
            </a>
          </FadeIn>

          {/* Phone -> Triggers Call or WhatsApp Options */}
          <FadeIn delay={0.2}>
            <button
              type="button"
              onClick={() => setPhoneDialogOpen(true)}
              className="group flex h-full w-full flex-col items-center justify-between rounded-[32px] border border-border bg-card/40 p-6 text-center transition-all duration-300 hover:border-foreground/50 hover:bg-card/70 sm:p-8 cursor-pointer"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-black/40 text-foreground transition-transform duration-300 group-hover:scale-110">
                <Phone className="size-6" />
              </div>
              <div className="my-5">
                <span className="block text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Phone
                </span>
                <span className="mt-1 block text-sm font-medium text-white group-hover:underline group-hover:underline-offset-4 sm:text-base">
                  {phoneNumber}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-foreground/70 group-hover:text-white">
                Call or WhatsApp ↗
              </span>
            </button>
          </FadeIn>

          {/* LinkedIn -> Opens LinkedIn Profile */}
          <FadeIn delay={0.3}>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col items-center justify-between rounded-[32px] border border-border bg-card/40 p-6 text-center transition-all duration-300 hover:border-foreground/50 hover:bg-card/70 sm:p-8"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-black/40 text-foreground transition-transform duration-300 group-hover:scale-110">
                <Linkedin className="size-6" />
              </div>
              <div className="my-5">
                <span className="block text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  LinkedIn
                </span>
                <span className="mt-1 block text-sm font-medium text-white group-hover:underline group-hover:underline-offset-4 sm:text-base">
                  Connect via LinkedIn
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-foreground/70 group-hover:text-white">
                View profile <ExternalLink className="size-3.5" />
              </span>
            </a>
          </FadeIn>
        </div>

        {/* Modal for Phone click options: Call or WhatsApp */}
        <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
          <DialogContent className="border-border bg-background sm:max-w-md rounded-[32px] p-6 sm:p-8">
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold uppercase text-white">
                Contact via Phone
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-foreground/70">
                Choose how you'd like to reach out to Ashwin at{" "}
                <span className="font-semibold text-white">{formattedPhone}</span>:
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-col gap-4">
              <a
                href={callUrl}
                onClick={() => setPhoneDialogOpen(false)}
                className="flex items-center justify-center gap-3 rounded-full border border-border bg-card/80 px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <PhoneCall className="size-5" />
                <span>Call ({phoneNumber})</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPhoneDialogOpen(false)}
                className="flex items-center justify-center gap-3 rounded-full border border-emerald-500/50 bg-emerald-950/30 px-6 py-4 text-sm font-medium uppercase tracking-wider text-emerald-300 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black"
              >
                <MessageCircle className="size-5" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </section>
      <Footer />
    </main>
  );
}
