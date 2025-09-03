import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, title, content, imageUrl, published } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
      },
    })

    res.status(200).json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.status(500).json({ message: 'Failed to update post' })
  }
}