interface BorderRadiusItemProps {
  name: string
  size: string
  usage: string
}

function BorderRadiusItem({ name, size, usage }: BorderRadiusItemProps) {
  const getBorderRadiusClass = (name: string) => {
    switch (name) {
      case "sm":
        return "rounded-sm"
      case "md":
        return "rounded-md"
      case "lg":
        return "rounded-lg"
      case "xl":
        return "rounded-xl"
      case "pill":
        return "rounded-full"
      default:
        return "rounded-md"
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`h-16 w-16 bg-teal ${getBorderRadiusClass(name)}`}></div>
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

export function BorderRadiusShowcase() {
  const borderRadiusItems = [
    { name: "sm", size: "0.25rem (4px)", usage: "Subtle rounding" },
    { name: "md", size: "0.5rem (8px)", usage: "Default buttons, cards" },
    { name: "lg", size: "0.75rem (12px)", usage: "Featured cards, modals" },
    { name: "xl", size: "1rem (16px)", usage: "Hero elements, large features" },
    { name: "pill", size: "9999px", usage: "Badges, tags, special elements" },
  ]

  return (
    <section className="mb-16" id="border-radius">
      <h2 className="text-3xl font-bold mb-8">Border Radius</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {borderRadiusItems.map((item) => (
          <BorderRadiusItem key={item.name} name={item.name} size={item.size} usage={item.usage} />
        ))}
      </div>
    </section>
  )
}

