import { httpService } from './httpService'
import { API_CONFIG } from '../config/constants'

const ENDPOINTS = API_CONFIG.ENDPOINTS

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const uploadImg = async (ev) => {
  try {
    const file = ev.target.files[0]

    if (!file) {
      throw new Error('No file selected')
    }

    const base64File = await toBase64(file)

    const response = await httpService.post(ENDPOINTS.UPLOAD_IMAGE, {
      imageData: base64File,
      fileName: file.name,
    })

    return response
  } catch (err) {
    console.error('Error uploading image:', err?.message)
    throw err
  }
}

export const uploadVid = async () => {
  throw new Error('Video upload is not supported by the backend')
}
