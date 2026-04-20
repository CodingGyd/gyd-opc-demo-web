import request from './request'

export interface SignResponse {
  uploadUrl: string
  fileKey: string
}

export interface ConfirmParams {
  fileKey: string
  fileName: string
  fileSize: number
  mimeType: string
}

export interface UploadResult {
  url: string
  fileKey: string
}

/**
 * Upload a file using the 3-step signed upload flow:
 * 1. POST /api/v1/storage/signature — get a signed upload URL
 * 2. PUT to the signed URL — upload the raw file bytes
 * 3. POST /api/v1/storage/confirm — confirm and get the public URL
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  // Step 1: Get signed URL
  const { data: signData } = await request.post<SignResponse>('/v1/storage/signature', {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  })

  // Step 2: Upload to signed URL
  await fetch(signData.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  // Step 3: Confirm upload
  const { data: confirmData } = await request.post<{ url: string; fileKey: string }>(
    '/v1/storage/confirm',
    {
      fileKey: signData.fileKey,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    } satisfies ConfirmParams,
  )

  return {
    url: confirmData.url,
    fileKey: confirmData.fileKey,
  }
}
