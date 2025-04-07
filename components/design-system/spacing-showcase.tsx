interface SpacingItemProps {
  name: string
  size: string
  usage: string
}

function SpacingItem({ name, size, usage }: SpacingItemProps) {
  const getSpacingClass = (name: string) => {
    switch (name) {
      case "2xs":
        return "w-1"
      case "xs":
        return "w-2"
      case "sm":
        return "w-3"
      case "md":
        return "w-4"
      case "lg":
        return "w-6"
      case "xl":
        return "w-8"
      case "2xl":
        return "w-12"
      case "3xl":
        return "w-16"
      default:
        return "w-4"
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center h-16 bg-light-mint rounded-md">
        <div className={`h-full bg-teal ${getSpacingClass(name)}`}></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{name}</span>
          <span className="text-sm">{size}</span>
        </div>
        <p className="text-sm text-gray-600">{usage}</p>
      </div>
    </div>
  )
}

export function SpacingShowcase() {
  const spacingItems = [
    { name: "2xs", size: "0.25rem (4px)", usage: "Minimal separation" },
    { name: "xs", size: "0.5rem (8px)", usage: "Tight spacing, icons" },
    { name: "sm", size: "0.75rem (12px)", usage: "Buttons, form elements" },
    { name: "md", size: "1rem (16px)", usage: "Default spacing" },
    { name: "lg", size: "1.5rem (24px)", usage: "Section spacing" },
    { name: "xl", size: "2rem (32px)", usage: "Large component spacing" },
    { name: "2xl", size: "3rem (48px)", usage: "Section margins" },
    { name: "3xl", size: "4rem (64px)", usage: "Layout spacing" },
  ]

  return (
    <section className="mb-16" id="spacing">
      <h2 className="text-3xl font-bold mb-8">Spacing System</h2>
      <p className="text-lg mb-6">We use a consistent 4px base unit for all spacing:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spacingItems.map((item) => (
          <SpacingItem key={item.name} name={item.name} size={item.size} usage={item.usage} />
        ))}
      </div>
    </section>
  )
}

