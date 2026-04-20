<template>
  <div
    class="file-upload"
    :class="{ 'file-upload--dragover': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="!file" class="file-upload__dropzone" @click="triggerFileInput">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p class="file-upload__hint">Drag & drop or click to select</p>
      <p class="file-upload__subhint">Max {{ formatSize(maxSize) }}</p>
    </div>

    <!-- Preview / Progress -->
    <div v-else class="file-upload__preview">
      <div class="file-upload__file-info">
        <span class="file-upload__file-name">{{ file.name }}</span>
        <span class="file-upload__file-size">{{ formatSize(file.size) }}</span>
      </div>

      <div v-if="uploading" class="file-upload__progress">
        <div class="file-upload__progress-bar" :style="{ width: `${progress}%` }"></div>
        <span class="file-upload__progress-text">{{ progress }}%</span>
      </div>

      <div v-if="error" class="file-upload__error">{{ error }}</div>

      <div class="file-upload__actions">
        <button v-if="!uploading" class="file-upload__upload-btn" @click="startUpload">
          Upload
        </button>
        <button class="file-upload__remove-btn" @click="removeFile" :disabled="uploading">
          Remove
        </button>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="file-upload__input"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadFile } from '@/api/upload'

const props = withDefaults(defineProps<{
  /** Accepted file types (MIME) */
  accept?: string
  /** Max file size in bytes (default: 10MB) */
  maxSize?: number
}>(), {
  accept: '*',
  maxSize: 10 * 1024 * 1024,
})

const emit = defineEmits<{
  /** Emitted when upload completes successfully */
  uploaded: [result: { url: string; fileKey: string }]
  /** Emitted on upload error */
  error: [message: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const uploading = ref(false)
const progress = ref(0)
const error = ref('')
const isDragOver = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const selected = target.files?.[0]
  if (selected) validateAndSet(selected)
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  const dropped = event.dataTransfer?.files[0]
  if (dropped) validateAndSet(dropped)
}

function validateAndSet(f: File) {
  error.value = ''
  if (f.size > props.maxSize) {
    error.value = `File exceeds max size of ${formatSize(props.maxSize)}`
    return
  }
  file.value = f
}

function removeFile() {
  file.value = null
  error.value = ''
  progress.value = 0
  if (fileInput.value) fileInput.value.value = ''
}

async function startUpload() {
  if (!file.value) return

  uploading.value = true
  error.value = ''
  progress.value = 10

  try {
    // Simulate progress — real progress requires XMLHttpRequest or streaming
    const progressInterval = setInterval(() => {
      if (progress.value < 90) progress.value += 5
    }, 200)

    const result = await uploadFile(file.value)

    clearInterval(progressInterval)
    progress.value = 100

    emit('uploaded', result)
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message || 'Upload failed'
    error.value = msg
    emit('error', msg)
  } finally {
    uploading.value = false
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped>
.file-upload {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  transition: border-color 0.2s;
}

.file-upload--dragover {
  border-color: var(--color-primary);
  background: rgba(79, 70, 229, 0.04);
}

.file-upload__dropzone {
  cursor: pointer;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.file-upload__hint {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.file-upload__subhint {
  font-size: var(--font-size-xs);
  color: var(--color-text-placeholder);
  margin-top: var(--spacing-xs);
}

.file-upload__input {
  display: none;
}

.file-upload__preview {
  text-align: left;
}

.file-upload__file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.file-upload__file-name {
  font-weight: 500;
}

.file-upload__file-size {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.file-upload__progress {
  position: relative;
  height: 24px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.file-upload__progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s;
}

.file-upload__progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text);
}

.file-upload__error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.file-upload__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.file-upload__upload-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.file-upload__upload-btn:hover {
  background: var(--color-primary-dark);
}

.file-upload__remove-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.file-upload__remove-btn:hover:not(:disabled) {
  color: var(--color-error);
  border-color: var(--color-error);
}
</style>
