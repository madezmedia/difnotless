export function TypographyShowcase() {
  return (
    <section className="mb-16" id="typography">
      <h2 className="text-3xl font-bold mb-8">Typography</h2>

      <div className="space-y-12">
        <div>
          <h3 className="text-xl font-semibold mb-4">Headings</h3>
          <div className="space-y-6 bg-light-mint p-6 rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H1</span>
                <span className="text-sm text-gray-500">3rem (48px)</span>
              </div>
              <h1 className="text-5xl font-bold font-outfit">The quick brown fox jumps over the lazy dog</h1>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H2</span>
                <span className="text-sm text-gray-500">2.25rem (36px)</span>
              </div>
              <h2 className="text-4xl font-bold font-outfit">The quick brown fox jumps over the lazy dog</h2>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H3</span>
                <span className="text-sm text-gray-500">1.75rem (28px)</span>
              </div>
              <h3 className="text-3xl font-semibold font-outfit">The quick brown fox jumps over the lazy dog</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H4</span>
                <span className="text-sm text-gray-500">1.5rem (24px)</span>
              </div>
              <h4 className="text-2xl font-semibold font-outfit">The quick brown fox jumps over the lazy dog</h4>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H5</span>
                <span className="text-sm text-gray-500">1.25rem (20px)</span>
              </div>
              <h5 className="text-xl font-semibold font-outfit">The quick brown fox jumps over the lazy dog</h5>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">H6</span>
                <span className="text-sm text-gray-500">1rem (16px)</span>
              </div>
              <h6 className="text-base font-semibold font-outfit">The quick brown fox jumps over the lazy dog</h6>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Body Text</h3>
          <div className="space-y-6 bg-light-mint p-6 rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Body Large</span>
                <span className="text-sm text-gray-500">1.125rem (18px)</span>
              </div>
              <p className="text-lg font-inter">
                The quick brown fox jumps over the lazy dog. This is a sample paragraph demonstrating the body large
                text style used for important paragraphs or introductory text.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Body Default</span>
                <span className="text-sm text-gray-500">1rem (16px)</span>
              </div>
              <p className="text-base font-inter">
                The quick brown fox jumps over the lazy dog. This is a sample paragraph demonstrating the default body
                text style used for most content throughout the site. It should be easy to read at various screen sizes.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Body Small</span>
                <span className="text-sm text-gray-500">0.875rem (14px)</span>
              </div>
              <p className="text-sm font-inter">
                The quick brown fox jumps over the lazy dog. This is a sample paragraph demonstrating the body small
                text style used for less important information, notes, or secondary content.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Caption</span>
                <span className="text-sm text-gray-500">0.75rem (12px)</span>
              </div>
              <p className="text-xs font-inter">
                The quick brown fox jumps over the lazy dog. This is a sample paragraph demonstrating the caption text
                style used for image captions, footnotes, or other auxiliary content.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Special Text</h3>
          <div className="space-y-6 bg-light-mint p-6 rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Product Title</span>
                <span className="text-sm text-gray-500">Outfit Medium (500)</span>
              </div>
              <p className="text-xl font-medium font-outfit">Your Words Matter AAC T-Shirt</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Promotional Text</span>
                <span className="text-sm text-gray-500">Outfit Semibold (600)</span>
              </div>
              <p className="text-2xl font-semibold font-outfit">
                Sensory-Friendly Apparel That Celebrates Communication
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Emphasis</span>
                <span className="text-sm text-gray-500">Outfit Semibold (600)</span>
              </div>
              <p className="text-lg font-semibold font-outfit">Different Not Less</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

