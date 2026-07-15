'use client'

import { Search, Video, Brain, Globe, Shield, Cpu, Heart, Scale, MapPin, Medal, FileCheck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import imgConsultative from '@/assets/service-consultative.jpg'
import imgMatching from '@/assets/service-matching.jpg'
import imgCinematic from '@/assets/service-cinematic.jpg'
import imgOffmarket from '@/assets/service-offmarket.jpg'
import imgGlobal from '@/assets/service-global.jpg'
import imgTransaction from '@/assets/service-transaction.jpg'
import imgSenior from '@/assets/service-senior.jpg'
import imgProbate from '@/assets/service-probate.jpg'
import imgRelocation from '@/assets/service-relocation.jpg'
import imgVeteran from '@/assets/service-veteran.jpg'
import imgAssumable from '@/assets/service-assumable.jpg'

export function Services() {
  const coreServices = [
    { icon: Brain, image: imgConsultative, title: 'Consultative Approach', description: 'Decision science and behavioral insights applied to every stage of your home search, helping you buy with clarity and confidence.' },
    { icon: Cpu, image: imgMatching, title: 'Intelligent Property Matching', description: 'Our platform learns your preferences and surfaces properties that align with your lifestyle, not just your checklist.' },
    { icon: Video, image: imgCinematic, title: 'Cinematic Tours', description: 'Professionally produced video walkthroughs that capture the light, flow, and soul of each property, experience homes remotely in stunning detail.' },
    { icon: Search, image: imgOffmarket, title: 'Off-Market Access', description: 'Deep Silicon Valley network unlocking properties before they hit the market, pocket listings, pre-market deals, and exclusive opportunities.' },
    { icon: Globe, image: imgGlobal, title: 'Global Buyer Network', description: 'Connected to international buyers and investors seeking Silicon Valley luxury, maximizing exposure for sellers and opportunity for buyers.' },
    { icon: Shield, image: imgTransaction, title: 'End-to-End Transaction', description: 'Full-service support from discovery to close, inspections, negotiations, escrow coordination, and post-purchase concierge.' },
  ]

  const specializedServices = [
    { icon: Heart, image: imgSenior, title: 'Senior Assisted Living Concierge', description: 'Compassionate, comprehensive guidance for families navigating senior transitions. We coordinate downsizing, home sales, and connect you with trusted assisted living communities, handling every detail with care and sensitivity.' },
    { icon: Scale, image: imgProbate, title: 'Probate, Foreclosure & Short Sale Specialist', description: 'Expert navigation through complex distressed property transactions. Certified in probate sales, foreclosure proceedings, and short sale negotiations, protecting your interests during challenging circumstances.' },
    { icon: MapPin, image: imgRelocation, title: 'Nationwide Relocation Services', description: 'Seamless moves across state lines with our vetted network of relocation partners. From Silicon Valley to anywhere in the U.S., we coordinate your departure or arrival with white-glove precision.' },
    { icon: Medal, image: imgVeteran, title: 'Veteran Partner & VA Loan Expert', description: 'Dedicated support for military families leveraging VA benefits. We understand the unique requirements of VA loans and are committed to serving those who served our country.' },
    { icon: FileCheck, image: imgAssumable, title: 'Assumable Loan Agent', description: 'Unlock rare financing opportunities by assuming existing low-rate mortgages. We identify assumable loan properties and guide you through the qualification process, potentially saving you thousands monthly.' },
  ]

  const CoreCard = ({ service }: { service: typeof coreServices[0] }) => (
    <div className="group bg-card clean-border rounded-2xl overflow-hidden gentle-animation hover:elevated-shadow hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy" decoding="async"
          width={1024}
          height={640}
          className="w-full h-full object-cover group-hover:scale-105 gentle-animation"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-background/85 backdrop-blur-sm flex items-center justify-center text-foreground">
          <service.icon className="w-5 h-5" />
        </div>
      </div>
      <div className="p-7 flex-1">
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">{service.title}</h3>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{service.description}</p>
      </div>
    </div>
  )

  const SpecializedCard = ({ service }: { service: typeof specializedServices[0] }) => (
    <div className="group bg-card clean-border rounded-2xl overflow-hidden gentle-animation hover:elevated-shadow hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy" decoding="async"
          width={1024}
          height={640}
          className="w-full h-full object-cover group-hover:scale-105 gentle-animation"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-background/85 backdrop-blur-sm flex items-center justify-center text-foreground">
          <service.icon className="w-5 h-5" />
        </div>
      </div>
      <div className="p-7 flex-1">
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">{service.title}</h3>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{service.description}</p>
      </div>
    </div>
  )

  return (
    <section id="services" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">Technology + Expertise</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">The Modern Advantage</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where cutting-edge tools meet deep local expertise, a new standard for luxury real estate in Silicon Valley.
          </p>
        </div>

        <Tabs defaultValue="core" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-2xl mx-auto mb-12 bg-muted/50 p-1.5 rounded-xl h-auto">
            <TabsTrigger value="core" className="rounded-lg text-base sm:text-lg font-semibold py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">Core Services</TabsTrigger>
            <TabsTrigger value="specialized" className="rounded-lg text-base sm:text-lg font-semibold py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">Specialized Services</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreServices.map((s) => <CoreCard key={s.title} service={s} />)}
            </div>
          </TabsContent>

          <TabsContent value="specialized" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specializedServices.map((s) => <SpecializedCard key={s.title} service={s} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
