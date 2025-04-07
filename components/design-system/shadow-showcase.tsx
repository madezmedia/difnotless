interface ShadowItemProps {
  name: string
  value: string
  usage: string
}

function ShadowItem({ name, value, usage }: ShadowItemProps) {
  const getShadowClass = (name: string) => {
    switch (name) {
      case "sm":
        return "shadow-sm"
      case "md":
        return "shadow-md"
      case "lg":
        return "shadow-lg"
      case "xl":
        return "shadow-xl"
      default:
        return "shadow-md"
    }
  }

  return (
    <div className="flex flex-col">
      <div className={`h-24 w-full bg-white rounded-lg ${getShadowClass(name)} mb-4`}></div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{name}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{usage}</p>
        <p className="text-xs font-mono bg-gray-100 p-2 rounded">{value}</p>
      </div>
    </div>
  )
}

export function ShadowShowcase() {
  const shadowItems = [
    {
      name: "sm",
      value: "0 1px 2px rgba(0, 0, 0, 0.05)",
      usage: "Subtle elevation",
    },
    {
      name: "md",
      value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      usage: "Cards, dropdowns",
    },
    {
      name: "lg",
      value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      usage: "Modals, popovers",
    },
    {
      name: "xl",
      value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      usage: "Featured elements",
    },
  ]

  return (
    <section className="mb-16" id="shadows">
      <h2 className="text-3xl font-bold mb-8">Shadows</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {shadowItems.map((item) => (
          <ShadowItem key={item.name} name={item.name} value={item.value} usage={item.usage} />
        ))}
      </div>
    </section>
  )
}

