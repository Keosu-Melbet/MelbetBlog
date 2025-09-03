import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
}