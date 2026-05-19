import { AdminSidebar } from "@/components/admin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary/30 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {children}
      </div>
    </div>
  )
}
