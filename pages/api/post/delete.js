import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    await prisma.post.delete({
      where: { id },
    })

    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.status(500).json({ message: 'Failed to delete post' })
  }
}