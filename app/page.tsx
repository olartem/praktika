import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera, ImageIcon, Share2, Upload } from "lucide-react"

export default function Home() {
  return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="container mx-auto py-6 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8"/>
            <span className="text-xl font-bold">PhotoVault</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#gallery" className="text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </Link>
            <Link href="#reviews" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild
                className="bg-transparent text-primary/90 hover:text-white hover:bg-transparent transition-colors">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/sign-in">Sign Up</Link>
            </Button>
          </div>
        </header>
        <main>
          <section className="container mx-auto py-20 px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">Store your memories in one secure
                  place</h1>
                <p className="text-xl text-muted-foreground">
                  PhotoVault helps you organize, protect, and share your precious moments with the people who matter
                  most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                    <Link href="/album">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <Image
                      src="https://placehold.co/500x500.png"
                      alt="Photo album preview"
                      width={500}
                      height={500}
                      className="rounded-2xl shadow-2xl"
                      priority={true}
                  />
                  <div className="absolute -bottom-4 -right-4 bg-secondary p-3 rounded-xl shadow-lg">
                    <ImageIcon className="size-8 text-foreground"/>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="bg-card py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything you need for your photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-background p-8 rounded-xl">
                  <div className="bg-accent size-12 rounded-lg flex items-center justify-center mb-6">
                    <Upload className="size-6"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Easy Upload</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your photos or import them directly from your devices.
                  </p>
                </div>
                <div className="bg-background p-8 rounded-xl">
                  <div className="bg-accent size-12 rounded-lg flex items-center justify-center mb-6">
                    <ImageIcon className="size-6"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Smart Organization</h3>
                  <p className="text-muted-foreground">
                    Automatically organize your photos by date, location, and even faces.
                  </p>
                </div>
                <div className="bg-background p-8 rounded-xl">
                  <div className="bg-accent size-12 rounded-lg flex items-center justify-center mb-6">
                    <Share2 className="size-6"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Secure Sharing</h3>
                  <p className="text-muted-foreground">
                    Share albums with friends and family while maintaining control over your privacy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Your photos, beautifully displayed</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
                View your memories in stunning layouts that adapt to any device.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="aspect-square relative group overflow-hidden rounded-lg">
                      <Image
                          src="https://placehold.co/300x300.png"
                          alt={`Gallery image ${item}`}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/*Reviews Section*/}
          <section id="reviews" className="bg-card py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Loved by photographers everywhere</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-background p-8 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-full bg-muted overflow-hidden">
                      <Image src="https://placehold.co/48x48.png" alt="User avatar" width={48} height={48}/>
                    </div>
                    <div>
                      <h4 className="font-bold">Sarah Johnson</h4>
                      <p className="text-muted-foreground text-sm">Professional Photographer</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;PhotoVault has completely transformed how I manage my client portfolios. The organization features
                    are incredible.&ldquo;
                  </p>
                </div>
                <div className="bg-background p-8 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-full bg-muted overflow-hidden">
                      <Image src="https://placehold.co/48x48.png" alt="User avatar" width={48} height={48}/>
                    </div>
                    <div>
                      <h4 className="font-bold">Michael Chen</h4>
                      <p className="text-muted-foreground text-sm">Travel Enthusiast</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;I love how easy it is to share my travel albums with family while keeping everything private from
                    the
                    public.&ldquo;
                  </p>
                </div>
                <div className="bg-background p-8 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-full bg-muted overflow-hidden">
                      <Image src="https://placehold.co/48x48.png" alt="User avatar" width={48} height={48}/>
                    </div>
                    <div>
                      <h4 className="font-bold">Emma Rodriguez</h4>
                      <p className="text-muted-foreground text-sm">Family Historian</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;Our family photos spanning decades are now organized and accessible to everyone in the family. It&apos;s
                    priceless.&ldquo;
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start preserving your memories today</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of photographers who trust PhotoVault with their precious memories. Get started for free,
                no credit card required.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                <Link href="/sign-in"></Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="bg-background py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div className="flex items-center gap-2 mb-6 md:mb-0">
                <Camera className="size-8"/>
                <span className="text-xl font-bold">PhotoVault</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </div>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} PhotoVault. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
  )
}

