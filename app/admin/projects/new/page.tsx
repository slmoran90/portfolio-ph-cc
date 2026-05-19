"use client"

import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AdminHeader, AdminCard } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { categories } from "@/lib/projects-data"
import {
  ArrowLeft,
  Upload,
  X,
  GripVertical,
  Save,
} from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // In production, this would handle actual file uploads
    // For demo, we'll add placeholder images
    setImages((prev) => [
      ...prev,
      `/images/gallery/gallery-${(prev.length % 6) + 1}.jpg`,
    ])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const addDemoImage = () => {
    setImages((prev) => [
      ...prev,
      `/images/gallery/gallery-${(prev.length % 6) + 1}.jpg`,
    ])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/admin/projects")
  }

  return (
    <>
      <AdminHeader
        title="New Project"
        description="Create a new photography project"
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Back Button */}
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <AdminCard title="Project Details">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Project Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      placeholder="e.g., Emma's Garden Baby Shower"
                      className="h-12 bg-background border-border/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <select
                        id="category"
                        name="category"
                        required
                        className="w-full h-12 px-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-dusty-rose focus:outline-none focus:ring-1 focus:ring-dusty-rose"
                      >
                        <option value="">Select a category</option>
                        {categories.slice(1).map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Event Date *
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="month"
                        required
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Botanical Gardens, City Center"
                      className="h-12 bg-background border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Describe the event and the story behind the photos..."
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-muted-foreground focus:border-dusty-rose focus:outline-none focus:ring-1 focus:ring-dusty-rose resize-none"
                    />
                  </div>
                </div>
              </AdminCard>

              {/* Image Upload */}
              <AdminCard
                title="Project Images"
                description="Upload and arrange your project photos"
              >
                {/* Drop Zone */}
                <motion.div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragOver
                      ? "border-dusty-rose bg-champagne/10"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-dusty-rose" />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    Drag and drop images here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse from your computer
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDemoImage}
                  >
                    Add Demo Image
                  </Button>
                </motion.div>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag to reorder. First image will be the cover.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-lg overflow-hidden group"
                        >
                          <Image
                            src={image}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center cursor-grab">
                              <GripVertical className="w-4 h-4 text-foreground" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-destructive rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-background rounded text-xs font-medium">
                              Cover
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </AdminCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AdminCard title="Publish">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <select className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-foreground text-sm">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push("/admin/projects")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AdminCard>

              {/* Preview Card */}
              <AdminCard title="Preview">
                <div className="space-y-3">
                  <div className="aspect-[4/5] rounded-lg bg-secondary/50 flex items-center justify-center">
                    {images.length > 0 ? (
                      <Image
                        src={images[0]}
                        alt="Cover preview"
                        width={200}
                        height={250}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No cover image
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {images.length} image{images.length !== 1 ? "s" : ""} added
                  </p>
                </div>
              </AdminCard>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
