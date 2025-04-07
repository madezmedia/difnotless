import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  name: string
  hex: string
  usage: string
  className?: string
  textColor?: string
}

function ColorSwatch({ name, hex, usage, className, textColor = "text-black" }: ColorSwatchProps) {
  return (
    <div className="flex flex-col">
      <div className={cn("h-24 rounded-md mb-2", className)} style={{ backgroundColor: hex }} />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{name}</span>
          <span className="text-sm font-mono">{hex}</span>
        </div>
        <p className="text-sm text-gray-600">{usage}</p>
      </div>
    </div>
  )
}

export function ColorPalette() {
  return (
    <section className="mb-16" id="colors">
      <h2 className="text-3xl font-bold mb-8">Color System</h2>

      <div className="space-y-12">
        <div>
          <h3 className="text-xl font-semibold mb-4">Primary Palette</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ColorSwatch name="Gold" hex="#F4D03F" usage="Primary brand color, call-to-action elements" />
            <ColorSwatch name="Teal" hex="#2CCEC0" usage="Secondary brand color, accents, highlights" />
            <ColorSwatch
              name="Gradient"
              hex="Gold → Teal"
              usage="Brand elements, illustrations, special features"
              className="bg-gradient-to-r from-gold to-teal"
              textColor="text-white"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Neurodiversity Palette</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <ColorSwatch
              name="Purple"
              hex="#8E44AD"
              usage="Neurodiversity representation, accent color"
              textColor="text-white"
            />
            <ColorSwatch name="Coral" hex="#FF7F50" usage="Warm, approachable elements, highlights" />
            <ColorSwatch name="Yellow" hex="#F1C40F" usage="Energy, optimism, accent elements" />
            <ColorSwatch name="Blue" hex="#3498DB" usage="Calming elements, AAC representation" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Neutrals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <ColorSwatch
              name="White"
              hex="#FFFFFF"
              usage="Backgrounds, text containers"
              className="border border-gray-200"
            />
            <ColorSwatch name="Light Mint" hex="#E9F7F6" usage="Alternative background, card backgrounds" />
            <ColorSwatch name="Light Gray" hex="#F5F7FA" usage="Subtle backgrounds, dividers" />
            <ColorSwatch name="Medium Gray" hex="#95A5A6" usage="Secondary text, icons, borders" />
            <ColorSwatch name="Dark Gray" hex="#34495E" usage="Primary text, headings" textColor="text-white" />
            <ColorSwatch name="Black" hex="#2C3E50" usage="Emphasis text, headings" textColor="text-white" />
          </div>
        </div>
      </div>
    </section>
  )
}

