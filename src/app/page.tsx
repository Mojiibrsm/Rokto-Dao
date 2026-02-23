import Link from 'next/link';
import Image from 'next/image';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-blood-donation');

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-accent/20">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Droplet className="mr-2 h-4 w-4" />
              Every drop counts
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-headline">
              Be the Hero Someone is Waiting For.
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Lifeline Hub makes it easier than ever to donate blood, track your impact, and find local drives. Start your journey of saving lives today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-lg h-14 px-8">
                <Link href="/register">Become a Donor</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-secondary text-secondary hover:bg-accent text-lg h-14 px-8">
                <Link href="/drives">Find Nearby Drives</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={heroImage?.imageUrl || 'https://picsum.photos/seed/lifeline1/1200/600'}
              alt="Blood donation hero image"
              fill
              className="object-cover"
              priority
              data-ai-hint="blood donation"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 font-headline">How It Works</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Our streamlined process ensures your donation experience is smooth, safe, and impactful.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle>Register</CardTitle>
              <CardDescription>Quick sign-up with your basic health details.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2 text-secondary">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle>Find a Drive</CardTitle>
              <CardDescription>Locate nearby mobile drives or donation centers.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <CardTitle>Donate</CardTitle>
              <CardDescription>Schedule a slot and complete your donation.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2 text-secondary">
                <History className="h-6 w-6" />
              </div>
              <CardTitle>Track Impact</CardTitle>
              <CardDescription>View your history and see the lives you've helped.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* AI Eligibility Teaser */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold font-headline">Can I donate today?</h2>
              <p className="text-lg text-muted-foreground">
                Unsure about your eligibility? Our AI-powered preliminary checker can help you understand common guidelines before you even head to the center.
              </p>
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/eligibility">
                  Check Eligibility Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-secondary/20">
              <div className="flex items-center gap-4 mb-4 text-primary">
                <ShieldCheck className="h-8 w-8" />
                <span className="font-bold">Instant Feedback</span>
              </div>
              <p className="text-muted-foreground italic mb-4">
                "Based on the information provided, you appear to meet the basic requirements..."
              </p>
              <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
