import { Header, Footer } from "@/components/layout"
import { getSiteSettings } from "@/lib/data/site-settings"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getSiteSettings()

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer
        instagram={siteSettings?.instagram ?? null}
        email={siteSettings?.email ?? null}
      />
    </>
  )
}
