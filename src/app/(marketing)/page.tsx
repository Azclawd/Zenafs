import { Hero } from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { WhatWeHelpWith } from "@/components/sections/WhatWeHelpWith";
import { Testimonials } from "@/components/sections/Testimonials";
import { EmailMarketing } from "@/components/sections/EmailMarketing";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <AboutUs />
      <div className="bg-gradient-to-b from-white via-zen-50 to-white">
        <WhatWeHelpWith />
      </div>
      <div className="bg-gradient-to-b from-white via-zen-50 to-zen-100">
        <Testimonials />
      </div>
      <EmailMarketing />
    </main>
  );
}
