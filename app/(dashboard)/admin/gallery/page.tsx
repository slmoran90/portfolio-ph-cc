"use client"

import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import Image from "next/image"
import { AdminHeader, AdminCard, EmptyState } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Search,
  Trash2,
  Download,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react"

const initialImages = [
  { id: 1, src: "/images/hero-baby-shower.jpg", name: "hero-baby-shower.jpg", size: "2.4 MB" },
  { id: 2, src: "/images/featured-birthday.jpg", name: "featured-birthday.jpg", size: "1.8 MB" },
  { id: 3, src: "/images/featured-baptism.jpg", name: "featured-baptism.jpg", size: "2.1 MB" },
  { id: 4, src: "/images/gallery/gallery-1.jpg", name: "gallery-1.jpg", size: "1.5 MB" },
  { id: 5, src: "/images/gallery/gallery-2.jpg", name: "gallery-2.jpg", size: "1.7 MB" },
  { id: 6, src: "/images/gallery/gallery-3.jpg", name: "gallery-3.jpg", size: "1.9 MB" },
  { id: 7, src: "/images/gallery/gallery-4.jpg", name: "gallery-4.jpg", size: "1.4 MB" },
  { id: 8, src: "/images/gallery/gallery-5.jpg", name: "gallery-5.jpg", size: "1.6 MB" },
  { id: 9, src: "/images/gallery/gallery-6.jpg", name: "gallery-6.jpg", size: "2.0 MB" },
  { id: 10, src: "/images/photographer-portrait.jpg", name: "photographer-portrait.jpg", size: "2.2 MB" },
  { id: 11, src: "/images/about-studio.jpg", name: "about-studio.jpg", size: "1.8 MB" },
]

export default function AdminGalleryPage() {
  const [images, setImages] = useState(initialImages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [dragOver, setDragOver] = useState(false)

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelect = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map((img) => img.id))
    }
  }

  const deleteSelected = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)))
    setSelectedImages([])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Simulate adding new image
    const newId = Math.max(...images.map((i) => i.id)) + 1
    setImages((prev) => [
      ...prev,
      {
        id: newId,
        src: `/images/gallery/gallery-${(prev.length % 6) + 1}.jpg`,
        name: `new-image-${newId}.jpg`,
        size: "1.5 MB",
      },
    ])
  }, [images])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  return (
    <>
      <AdminHeader
        title="Gallery"
        description="Manage your media library"
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all ${
            dragOver
              ? "border-dusty-rose bg-champagne/10"
              : "border-border/50 hover:border-border bg-card"
          }`}
        >
          <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-dusty-rose" />
          </div>
          <p className="text-foreground font-medium mb-2">
            Drag and drop images to upload
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports JPG, PNG, WebP up to 10MB each
          </p>
          <Button variant="outline">Browse Files</Button>
        </motion.div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll}>
              {selectedImages.length === filteredImages.length && filteredImages.length > 0 ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Deselect All
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Select All
                </>
              )}
            </Button>
            {selectedImages.length > 0 && (
              <>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download ({selectedImages.length})
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={deleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedImages.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Grid */}
        <AdminCard title={`${filteredImages.length} Images`}>
          {filteredImages.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No images found"
              description="Upload some images to get started or try a different search."
              action={<Button>Upload Images</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  onClick={() => toggleSelect(image.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                    selectedImages.includes(image.id)
                      ? "ring-2 ring-dusty-rose ring-offset-2"
                      : ""
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      selectedImages.includes(image.id)
                        ? "bg-dusty-rose/20"
                        : "bg-foreground/0 group-hover:bg-foreground/20"
                    }`}
                  />
                  {/* Selection Indicator */}
                  <div
                    className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedImages.includes(image.id)
                        ? "bg-dusty-rose border-dusty-rose"
                        : "bg-background/80 border-background/80 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {selectedImages.includes(image.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{image.name}</p>
                    <p className="text-xs text-white/70">{image.size}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </main>
    </>
  )
}
