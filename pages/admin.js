import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Admin() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    published: false
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }))
      alert('Upload ảnh thành công!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload ảnh thất bại!')
      setImagePreview('')
      setImageFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, imageUrl: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung!')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Create post failed')
      }

      const result = await response.json()
      alert('Đăng bài thành công!')
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        published: false
      })
      setImageFile(null)
      setImagePreview('')
      
      // Redirect to homepage
      router.push('/')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Đăng bài thất bại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin - BlogCMS</title>
        <meta name="description" content="Admin dashboard for managing blog posts" />
      </Head>

      <div className="min-h-screen bg-brand-black text-white">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-brand-yellow">BlogCMS</h1>
                <span className="text-gray-400 text-sm">Admin Panel</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="/" className="text-white hover:text-brand-yellow transition-colors">
                  🏠 Trang chủ
                </a>
                <a href="/admin" className="text-brand-yellow">
                  ⚙️ Admin
                </a>
              </div>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-brand-yellow">
                📝 Đăng bài viết mới
              </h1>
              <p className="text-gray-400">
                Tạo và xuất bản bài viết của bạn với giao diện Melbet-inspired
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg border border-gray-700">
              {/* Title Field */}
              <div className="mb-6">
                <label className="block text-brand-yellow font-semibold mb-2">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20"
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-brand-yellow font-semibold mb-2">
                  Ảnh minh họa
                </label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-brand-yellow transition-colors">
                    <div className="space-y-4">
                      <div className="text-brand-yellow text-4xl">📷</div>
                      <div>
                        <p className="text-gray-400 mb-2">Kéo thả ảnh vào đây hoặc</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('file-input')?.click()}
                          className="bg-brand-yellow text-brand-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Đang upload...' : 'Chọn ảnh'}
                        </button>
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-64 object-cover mx-auto rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ❌ Xóa ảnh
                    </button>
                  </div>
                )}
              </div>

              {/* Content Field */}
              <div className="mb-6">
                <label className="block text-brand-yellow font-semibold mb-2">
                  Nội dung bài viết *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 resize-vertical"
                  placeholder="Viết nội dung bài viết của bạn..."
                  required
                />
              </div>

              {/* Published Checkbox */}
              <div className="mb-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="w-5 h-5 text-brand-yellow bg-gray-800 border-gray-600 rounded focus:ring-brand-yellow focus:ring-2"
                  />
                  <span className="text-white">
                    ✅ Xuất bản ngay lập tức
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-brand-yellow text-brand-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang đăng...' : formData.published ? '🚀 Xuất bản bài viết' : '💾 Lưu nháp'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, published: false }))
                    handleSubmit(new Event('submit'))
                  }}
                  disabled={isSubmitting || isUploading}
                  className="bg-brand-green text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Lưu nháp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}