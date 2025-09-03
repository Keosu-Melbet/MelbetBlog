import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/post/list')
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <>
      <Head>
        <title>BlogCMS - Modern Blog Platform</title>
        <meta name="description" content="Modern blog platform with Melbet-inspired design for content creators and developers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-brand-black text-white">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-brand-yellow">BlogCMS</h1>
                <span className="text-gray-400 text-sm">Melbet Inspired</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="/" className="text-brand-yellow transition-colors">
                  🏠 Trang chủ
                </a>
                <Link href="/admin" className="text-white hover:text-brand-yellow transition-colors">
                  ⚙️ Admin
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-black via-gray-900 to-brand-black py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-brand-yellow">Modern</span> Blog Platform
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Khám phá những bài viết mới nhất, kiến thức và câu chuyện từ cộng đồng tác giả của chúng tôi
            </p>
            <Link 
              href="/admin"
              className="inline-block bg-brand-yellow text-brand-black font-semibold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
            >
              ✍️ Viết bài mới
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-brand-yellow mb-2">{posts.length}</div>
                <div className="text-gray-400">Bài viết đã xuất bản</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-brand-green mb-2">48K</div>
                <div className="text-gray-400">Lượt đọc hàng tháng</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-white mb-2">12</div>
                <div className="text-gray-400">Tác giả đóng góp</div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-brand-yellow">📰 Bài viết mới nhất</h2>
              <p className="text-gray-400 text-lg">Cập nhật nội dung mới nhất từ chúng tôi</p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
                <p className="mt-4 text-gray-400">Đang tải bài viết...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2 text-red-500">Không thể tải bài viết</h3>
                <p className="text-gray-400">{error}</p>
                <button 
                  onClick={fetchPosts}
                  className="mt-4 bg-brand-yellow text-brand-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  🔄 Thử lại
                </button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">Chưa có bài viết nào</h3>
                <p className="text-gray-400 mb-6">
                  Chưa có bài viết nào được xuất bản. Hãy quay lại sau!
                </p>
                <Link 
                  href="/admin"
                  className="inline-block bg-brand-yellow text-brand-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  ✍️ Viết bài đầu tiên
                </Link>
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className={`bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-brand-yellow transition-all transform hover:scale-105 hover:shadow-xl ${
                      index === 0 ? 'lg:col-span-2' : ''
                    }`}
                  >
                    {post.imageUrl && (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className={`w-full object-cover ${
                          index === 0 ? 'h-64' : 'h-48'
                        }`}
                      />
                    )}
                    
                    <div className="p-6">
                      {index === 0 && (
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="bg-brand-yellow text-brand-black px-3 py-1 rounded-full text-sm font-bold">
                            ⭐ Nổi bật
                          </span>
                          <span className="text-gray-400 text-sm">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      )}
                      
                      {index !== 0 && (
                        <span className="text-gray-400 text-sm block mb-2">
                          {formatDate(post.createdAt)}
                        </span>
                      )}
                      
                      <h3 className={`font-bold mb-3 text-white hover:text-brand-yellow transition-colors ${
                        index === 0 ? 'text-2xl' : 'text-lg'
                      }`}>
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4">
                        {truncateContent(post.content, index === 0 ? 200 : 120)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-brand-yellow">👤</span>
                          <span className="text-sm text-gray-400">Admin</span>
                        </div>
                        <button className="text-brand-yellow hover:text-yellow-400 font-medium text-sm">
                          Đọc thêm →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-brand-yellow/10 to-brand-green/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-brand-yellow">📬 Theo dõi cập nhật</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Đăng ký newsletter và không bỏ lỡ những bài viết và kiến thức mới nhất
            </p>
            <div className="max-w-md mx-auto flex space-x-4">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow"
              />
              <button className="bg-brand-yellow text-brand-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-700 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-brand-yellow">BlogCMS</h3>
                <p className="text-gray-400">
                  Nền tảng blog hiện đại với thiết kế lấy cảm hứng từ Melbet dành cho các nhà sáng tạo nội dung và lập trình viên.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Liên kết nhanh</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/" className="hover:text-brand-yellow transition-colors">Trang chủ</a></li>
                  <li><Link href="/admin" className="hover:text-brand-yellow transition-colors">Admin</Link></li>
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Chính sách</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Danh mục</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Phát triển Web</a></li>
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Công nghệ</a></li>
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Thiết kế</a></li>
                  <li><a href="#" className="hover:text-brand-yellow transition-colors">Lập trình</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Theo dõi</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors text-xl">📘</a>
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors text-xl">🐦</a>
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors text-xl">💼</a>
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors text-xl">💬</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BlogCMS. Tất cả quyền được bảo lưu. Được xây dựng với Next.js, TailwindCSS, Prisma & Supabase.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}