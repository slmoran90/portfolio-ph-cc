import type { Metadata } from 'next'
import { Poppins, Source_Sans_3, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-sans',
  display: 'swap'
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-logo',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-ph-cc-slmoran90s-projects.vercel.app'),
  title: {
    default: "Carla Cáceres Photography | Capturando momentos preciosos de la vida",
    template: "%s | Carla Cáceres Photography",
  },
  description:
    'Estudio de fotografía profesional especializado en baby showers, cumpleaños infantiles y bautismos. Fotografía elegante, emotiva y atemporal.',
  keywords: [
    'fotografía',
    'baby shower',
    'cumpleaños',
    'bautismo',
    'fotógrafa profesional',
    'fotografía familiar'
  ],
  openGraph: {
    siteName: 'Carla Cáceres Photography',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Carla Cáceres Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://portfolio-ph-cc-slmoran90s-projects.vercel.app',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='es'
      className={`${poppins.variable} ${sourceSans3.variable} ${cormorant.variable} bg-background`}
      data-scroll-behavior='smooth'
    >
      <body className='font-sans antialiased'>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
