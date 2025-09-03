import { supabase } from '../../lib/supabase'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ name, originalFilename, mimetype }) {
        // only keep files that are images
        return name === 'image' && mimetype && mimetype.includes('image')
      },
    })

    const [fields, files] = await form.parse(req)
    const file = files.image?.[0]

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' })
    }

    // Read file content
    const fileContent = fs.readFileSync(file.filepath)
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.round(Math.random() * 1E9)
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg'
    const fileName = `image-${timestamp}-${randomSuffix}.${fileExtension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, fileContent, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return res.status(500).json({ message: 'Failed to upload image to storage' })
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    // Clean up temp file
    fs.unlinkSync(file.filepath)

    res.status(200).json({ 
      imageUrl: publicData.publicUrl,
      message: 'Image uploaded successfully' 
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Failed to upload image' })
  }
}