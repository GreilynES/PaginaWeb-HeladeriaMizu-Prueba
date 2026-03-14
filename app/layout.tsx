import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Mizu - Japanese Artisan Ice Cream',
  description: 'Handcrafted Japanese-inspired ice cream. Unique flavors, natural ingredients, made fresh daily with a retro Tokyo aesthetic.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2D6A6A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/mizu.css" />
      </head>

      <body>
        {children}
        <Analytics />

        {/* VOICEFLOW CHAT WIDGET */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: "69b575fc5e591cc328d3f818" },
                  url: "https://general-runtime.voiceflow.com",
                  versionID: "production",
                  voice: {
                    url: "https://runtime-api.voiceflow.com"
                  }
                });
              }
              v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
              v.type = "text/javascript";
              s.parentNode.insertBefore(v, s);
            })(document, 'script');
          `,
          }}
        />

      </body>
    </html>
  )
}