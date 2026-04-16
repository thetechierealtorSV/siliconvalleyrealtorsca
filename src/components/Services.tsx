'use client'

import { Search, Video, Brain, Globe, Shield, Cpu, Heart, Scale, MapPin, Medal, FileCheck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Services() {
  const coreServices = [
    {
      icon: Brain,
      title: 'Consultative Approach',
      description: 'Decision science and behavioral insights applied to every stage of your home search — helping you buy with clarity and confidence.',
    },
    {
      icon: Cpu,
      title: 'Intelligent Property Matching',
      description: 'Our platform learns your preferences and surfaces properties that align with your lifestyle, not just your checklist.',
    },
    {
      icon: Video,
      title: 'Cinematic Tours',
      description: 'Professionally produced video walkthroughs that capture the light, flow, and soul of each property — experience homes remotely in stunning detail.',
    },
    {
      icon: Search,
      title: 'Off-Market Access',
      description: 'Deep Silicon Valley network unlocking properties before they hit the market — pocket listings, pre-market deals, and exclusive opportunities.',
    },
    {
      icon: Globe,
      title: 'Global Buyer Network',
      description: 'Connected to international buyers and investors seeking Silicon Valley luxury — maximizing exposure for sellers and opportunity for buyers.',
    },
    {
      icon: Shield,
      title: 'End-to-End Transaction',
      description: 'Full-service support from discovery to close — inspections, negotiations, escrow coordination, and post-purchase concierge.',
    },
  ]

  const specializedServices = [
    {
      icon: Heart,
      title: 'Senior Assisted Living Concierge',
      description: 'Compassionate, comprehensive guidance for families navigating senior transitions. We coordinate downsizing, home sales, and connect you with trusted assisted living communities — handling every detail with care and sensitivity.',
    },
    {
      icon: Scale,
      title: 'Probate, Foreclosure & Short Sale Specialist',
      description: 'Expert navigation through complex distressed property transactions. Certified in probate sales, foreclosure proceedings, and short sale negotiations — protecting your interests during challenging circumstances.',
    },
    {
      icon: MapPin,
      title: 'Nationwide Relocation Services',
      description: 'Seamless moves across state lines with our vetted network of relocation partners. From Silicon Valley to anywhere in the U.S. — we coordinate your departure or arrival with white-glove precision.',
    },
    {
      icon: Medal,
      title: 'Veteran Partner & VA Loan Expert',
      description: 'Dedicated support for military families leveraging VA benefits. We understand the unique requirements of VA loans and are committed to serving those who served our country.',
    },
    {
      icon: FileCheck,
      title: 'Assumable Loan Agent',
      description: 'Unlock rare financing opportunities by assuming existing low-rate mortgages. We identify assumable loan properties and guide you through the qualification process — potentially saving you thousands monthly.',
    },
  ]

  const ServiceCard = ({ service }: { service: typeof coreServices[0] }) => (
    <div className="group bg-card clean-border rounded-2xl p-8 gentle-animation hover:elevated-shadow hover:-translate-y-1 h-full">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-primary-foreground gentle-animation">
        <service.icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3">
        {service.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {service.description}
      </p>
    </div>
  )

  return (
    <section id="services" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Technology + Expertise
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            The Modern Advantage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where cutting-edge tools meet deep local expertise — a new standard for luxury real estate in Silicon Valley.
          </p>
        </div>

        <Tabs defaultValue="core" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto mb-12 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="core" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Core Services
            </TabsTrigger>
            <TabsTrigger value="specialized" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Specialized Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreServices.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialized" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specializedServices.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
