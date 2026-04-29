import React, { useState } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { PromotionsSection } from "../components/PromotionsSection";
import { MaquinariaSection } from "../components/MaquinariaSection";
import { AdvantagesSection } from "../components/AdvantagesSection";
import { ProcessSection } from "../components/ProcessSection";
import { GallerySection } from "../components/GallerySection";
import { PresenceSection } from "../components/PresenceSection";
import { ChatWidget } from "../components/ChatWidget";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Footer } from "../components/Footer";

export const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleOpenChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenChat={handleOpenChat} />
      <HeroSection onOpenChat={handleOpenChat} />
      <PromotionsSection />
      <MaquinariaSection onOpenChat={handleOpenChat} />
      <AdvantagesSection />
      <ProcessSection />
      <GallerySection />
      <PresenceSection />
      <div id="contacto">
        <Footer />
      </div>
      <WhatsAppButton />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
