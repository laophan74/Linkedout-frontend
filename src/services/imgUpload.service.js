import { httpService } from './httpService'
import { API_CONFIG } from '../config/constants'

const ENDPOINTS = API_CONFIG.ENDPOINTS

export const uploadImg = async (ev) => {
  try {
    const file = ev.target.files[0]

    if (!file) {
      throw new Error('No file selected')
    }

    const formData = new FormData()
    formData.append('image', file)

    const response = await httpService.post(ENDPOINTS.UPLOAD_IMAGE, {
      formData,
    })

    return { url: response.imageUrl, publicId: response.publicId }
  } catch (err) {
    console.error('Error uploading image:', err?.message)
    throw err
  }
}

export const uploadVid = async () => {
  throw new Error('Video upload is not supported by the backend')
}
