import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ComponentShowcase() {
  return (
    <section className="mb-16" id="components">
      <h2 className="text-3xl font-bold mb-8">Core Components</h2>

      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-6">Buttons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium">Primary</h4>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gold hover:bg-gold/90 text-black">Primary Button</Button>
                <Button className="bg-gold hover:bg-gold/90 text-black" size="sm">
                  Small Button
                </Button>
                <Button className="bg-gold hover:bg-gold/90 text-black" size="lg">
                  Large Button
                </Button>
                <Button className="bg-gold hover:bg-gold/90 text-black" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Secondary</h4>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-teal hover:bg-teal/90 text-white">Secondary Button</Button>
                <Button className="bg-teal hover:bg-teal/90 text-white" size="sm">
                  Small Button
                </Button>
                <Button className="bg-teal hover:bg-teal/90 text-white" size="lg">
                  Large Button
                </Button>
                <Button className="bg-teal hover:bg-teal/90 text-white" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Tertiary</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Tertiary Button</Button>
                <Button variant="outline" size="sm">
                  Small Button
                </Button>
                <Button variant="outline" size="lg">
                  Large Button
                </Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Gradient</h4>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-gold to-teal hover:from-gold/90 hover:to-teal/90 text-white">
                  Gradient Button
                </Button>
                <Button
                  className="bg-gradient-to-r from-gold to-teal hover:from-gold/90 hover:to-teal/90 text-white"
                  size="sm"
                >
                  Small Button
                </Button>
                <Button
                  className="bg-gradient-to-r from-gold to-teal hover:from-gold/90 hover:to-teal/90 text-white"
                  size="lg"
                >
                  Large Button
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Forms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium">Input Fields</h4>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" placeholder="Enter your name" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="disabled">Disabled</Label>
                  <Input type="text" id="disabled" placeholder="Disabled input" disabled />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Form Example</h4>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Enter your details below to get in touch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="form-name">Name</Label>
                    <Input type="text" id="form-name" placeholder="Enter your name" />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="form-email">Email</Label>
                    <Input type="email" id="form-email" placeholder="Enter your email" />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="form-message">Message</Label>
                    <Input type="text" id="form-message" placeholder="Enter your message" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gold hover:bg-gold/90 text-black">Submit</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Card</CardTitle>
                <CardDescription>Example of a product card</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-light-mint rounded-md mb-4"></div>
                <h4 className="font-medium mb-2">Your Words Matter T-Shirt</h4>
                <p className="text-sm text-gray-600 mb-2">Sensory-friendly t-shirt with AAC design</p>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-teal-50">
                    Tagless
                  </Badge>
                  <Badge variant="outline" className="bg-teal-50">
                    Organic
                  </Badge>
                </div>
                <p className="font-bold">$29.99</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">Add to Cart</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Card</CardTitle>
                <CardDescription>Example of an information card</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This card contains structured information with clear headings and organized content. It's designed to
                  present information in a clear, accessible format.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Material:</span>
                    <span>100% Organic Cotton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>5.3 oz/yd²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tag Type:</span>
                    <span>Heat Transfer (Tagless)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-teal-50">
              <CardHeader>
                <Badge className="w-fit bg-purple text-white">Featured</Badge>
                <CardTitle className="mt-2">Feature Card</CardTitle>
                <CardDescription>Example of a feature card</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This card is designed to highlight important information or features. The visual emphasis helps draw
                  attention to key content.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal"></div>
                    <span>Sensory-friendly design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal"></div>
                    <span>Ethically produced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal"></div>
                    <span>Supports AAC awareness</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple hover:bg-purple/90 text-white">Explore Features</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Badges</h3>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge className="bg-gold hover:bg-gold/90 text-black">Gold</Badge>
            <Badge className="bg-teal hover:bg-teal/90 text-white">Teal</Badge>
            <Badge className="bg-purple hover:bg-purple/90 text-white">Purple</Badge>
            <Badge className="bg-coral hover:bg-coral/90 text-white">Coral</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="outline" className="border-teal text-teal">
              Teal Outline
            </Badge>
            <Badge className="rounded-full bg-gold hover:bg-gold/90 text-black">Pill Badge</Badge>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Tabs</h3>
          <Tabs defaultValue="aac" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aac">AAC</TabsTrigger>
              <TabsTrigger value="autism">Autism Acceptance</TabsTrigger>
              <TabsTrigger value="sensory">Sensory Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="aac" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">AAC Resources</h4>
              <p className="text-sm text-gray-600">Resources related to Augmentative and Alternative Communication.</p>
            </TabsContent>
            <TabsContent value="autism" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">Autism Acceptance</h4>
              <p className="text-sm text-gray-600">Resources promoting autism acceptance and neurodiversity.</p>
            </TabsContent>
            <TabsContent value="sensory" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">Sensory Resources</h4>
              <p className="text-sm text-gray-600">
                Resources about sensory processing and sensory-friendly approaches.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

