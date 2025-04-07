import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Different Not Less Apparel and our mission to create sensory-friendly apparel celebrating AAC and autism acceptance.",
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-lg md:text-xl">
              Creating sensory-friendly apparel that celebrates all forms of communication
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                To create inclusive, high-quality apparel that celebrates all forms of communication while promoting
                autism acceptance, AAC awareness, and the inherent value of diverse communication methods.
              </p>
              <p className="text-lg">
                We believe that everyone deserves to be heard and understood, regardless of how they communicate. Our
                apparel is designed to spark conversations, promote understanding, and celebrate the diversity of human
                communication.
              </p>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Our mission"
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-light-mint">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Inclusivity</h3>
              <p>
                We design with all communication styles in mind, ensuring our products are accessible and meaningful to
                everyone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Authenticity</h3>
              <p>
                We create with input from the communities we serve, ensuring accurate representation and meaningful
                designs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Quality</h3>
              <p>
                We use premium materials with a focus on sensory considerations, ensuring comfort for all sensory needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Education</h3>
              <p>
                Our products serve as tools for awareness and understanding, sparking conversations about communication
                diversity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Empowerment</h3>
              <p>
                We highlight the strengths and capabilities of all communicators, promoting a positive and affirming
                message.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p>
                We prioritize ethical production methods and sustainable materials to minimize our environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-muted-foreground mb-2">Founder & CEO</p>
              <p className="text-sm">
                Speech-Language Pathologist with over 10 years of experience working with AAC users.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-muted-foreground mb-2">Creative Director</p>
              <p className="text-sm">
                Designer with a passion for creating inclusive and meaningful visual communication.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Jamie Rivera</h3>
              <p className="text-muted-foreground mb-2">Production Manager</p>
              <p className="text-sm">Expert in sensory-friendly textiles and ethical manufacturing processes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Board Section */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Advisory Board</h2>
          <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
            Our products and educational content are guided by experts in speech therapy, autism acceptance, and sensory
            processing.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Dr. Emily Rodriguez</h3>
              <p className="text-muted-foreground mb-2">AAC Specialist</p>
              <p className="text-sm">Leading researcher in augmentative and alternative communication methods.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Alex Thompson</h3>
              <p className="text-muted-foreground mb-2">Autism Self-Advocate</p>
              <p className="text-sm">Speaker and writer on neurodiversity and autism acceptance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Dr. Samira Patel</h3>
              <p className="text-muted-foreground mb-2">Sensory Processing Expert</p>
              <p className="text-sm">Occupational therapist specializing in sensory integration therapy.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Marcus Williams</h3>
              <p className="text-muted-foreground mb-2">Special Education Teacher</p>
              <p className="text-sm">Award-winning educator with expertise in inclusive classroom practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-teal-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Have questions about our products or mission? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-gold to-teal text-black px-6 py-3 font-medium hover:from-gold/90 hover:to-teal/90"
            >
              Contact Us
            </a>
            <a
              href="mailto:info@differentnotless.com"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

