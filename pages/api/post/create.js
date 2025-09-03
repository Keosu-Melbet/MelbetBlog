import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, content, imageUrl, published } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        published: published || false,
      },
    })

    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ message: 'Failed to create post' })
  }
}