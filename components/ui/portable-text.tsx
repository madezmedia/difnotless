import { PortableText as PortableTextComponent } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import Image from "next/image"
import { urlForImage } from "@/lib/sanity"

interface PortableTextProps {
  value: PortableTextBlock[]
}

export function PortableText({ value }: PortableTextProps) {
  if (!value) {
    return null
  }

  return (
    <PortableTextComponent
      value={value}
      components={{
        types: {
          image: ({ value }) => {
            if (!value?.asset?._ref) {
              return null
            }
            return (
              <div className="my-6 space-y-2">
                <Image
                  src={urlForImage(value).width(800).height(450).fit("max").auto("format").url() || "/placeholder.svg"}
                  alt={value.alt || " "}
                  width={800}
                  height={450}
                  className="mx-auto rounded-lg"
                />
                {value.caption && <div className="text-center text-sm text-gray-500">{value.caption}</div>}
              </div>
            )
          },
          downloadableFile: ({ value }) => {
            if (!value?.asset?._ref) {
              return null
            }
            return (
              <div className="my-6 p-4 border rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{value.description || "Downloadable File"}</h4>
                  <p className="text-sm text-muted-foreground">Click to download</p>
                </div>
                <a
                  href={urlForImage(value.asset).url()}
                  download
                  className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
                >
                  Download
                </a>
              </div>
            )
          },
        },
        marks: {
          link: ({ children, value }) => {
            const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined
            return (
              <a href={value.href} rel={rel} className="text-teal hover:underline">
                {children}
              </a>
            )
          },
        },
      }}
    />
  )
}

