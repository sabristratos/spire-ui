<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Button from '../Button/Button.vue'
import { useId } from '../../composables'

export interface UploadFile {
  /** Unique identifier */
  id: string
  /** Original File object */
  file: File
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** Preview URL (for images) */
  preview?: string
  /** Upload progress (0-100) */
  progress: number
  /** Upload status */
  status: 'pending' | 'uploading' | 'success' | 'error'
  /** Error message if status is error */
  error?: string
}

export interface FileUploadProps {
  /** Currently selected files (v-model) */
  modelValue?: UploadFile[]
  /** Accepted file types (MIME types or extensions) */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Disabled state */
  disabled?: boolean
  /** Label text */
  label?: string
  /** Hint text */
  hint?: string
  /** Error message */
  error?: string
  /** Show image previews */
  showPreviews?: boolean
  /** Compact mode (smaller dropzone) */
  compact?: boolean
  /** Enable paste-to-upload (Ctrl+V) */
  allowPaste?: boolean
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  modelValue: () => [],
  multiple: false,
  disabled: false,
  showPreviews: true,
  compact: false,
  allowPaste: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', files: UploadFile[]): void
  (e: 'files-added', files: UploadFile[]): void
  (e: 'file-removed', file: UploadFile): void
  (e: 'file-rejected', file: File, reason: string): void
  (e: 'files-pasted', files: UploadFile[]): void
  (e: 'file-replaced', oldFile: UploadFile, newFile: UploadFile): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dropzoneRef = ref<HTMLElement | null>(null)
const replacingFileId = ref<string | null>(null)

const isDragging = ref(false)
const dragCounter = ref(0)
const showPasteIndicator = ref(false)
const isHovered = ref(false)
const isFocused = ref(false)

const uid = useId('file-upload')
const inputId = computed(() => uid)
const hintId = computed(() => `${uid}-hint`)
const errorId = computed(() => `${uid}-error`)

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const previewUrls = ref<Map<string, string>>(new Map())

function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function isAcceptedType(file: File): boolean {
  if (!props.accept) return true

  const acceptedTypes = props.accept.split(',').map(t => t.trim().toLowerCase())

  for (const accepted of acceptedTypes) {
    if (accepted === file.type.toLowerCase()) return true

    if (accepted.endsWith('/*')) {
      const category = accepted.slice(0, -2)
      if (file.type.toLowerCase().startsWith(category + '/')) return true
    }

    if (accepted.startsWith('.')) {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      if (ext === accepted) return true
    }
  }

  return false
}

function validateFile(file: File): string | null {
  if (!isAcceptedType(file)) {
    return `File type "${file.type || 'unknown'}" is not accepted`
  }

  if (props.maxSize && file.size > props.maxSize) {
    return `File exceeds maximum size of ${formatSize(props.maxSize)}`
  }

  return null
}

function createPreview(file: File): string | undefined {
  if (!props.showPreviews) return undefined
  if (!file.type.startsWith('image/')) return undefined

  const url = URL.createObjectURL(file)
  return url
}

/**
 * Process and add files
 * @returns The array of successfully added files
 */
function processFiles(fileList: FileList | File[]): UploadFile[] {
  const files = Array.from(fileList)
  const currentCount = props.modelValue.length
  const validFiles: UploadFile[] = []

  for (const file of files) {
    if (props.maxFiles && currentCount + validFiles.length >= props.maxFiles) {
      emit('file-rejected', file, `Maximum ${props.maxFiles} files allowed`)
      continue
    }

    const error = validateFile(file)
    if (error) {
      emit('file-rejected', file, error)
      continue
    }

    const id = generateFileId()
    const preview = createPreview(file)

    if (preview) {
      previewUrls.value.set(id, preview)
    }

    validFiles.push({
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
      progress: 0,
      status: 'pending'
    })
  }

  if (validFiles.length > 0) {
    const newFiles = props.multiple
      ? [...props.modelValue, ...validFiles]
      : validFiles.slice(0, 1)

    emit('update:modelValue', newFiles)
    emit('files-added', validFiles)
  }

  return validFiles
}

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    if (replacingFileId.value) {
      handleReplaceFile(input.files[0])
    } else {
      processFiles(input.files)
    }
  }
  input.value = ''
  replacingFileId.value = null
}

function handleReplaceFile(newFile: File) {
  if (!replacingFileId.value) return

  const oldFileIndex = props.modelValue.findIndex(f => f.id === replacingFileId.value)
  if (oldFileIndex === -1) return

  const oldFile = props.modelValue[oldFileIndex]

  const error = validateFile(newFile)
  if (error) {
    emit('file-rejected', newFile, error)
    return
  }

  const oldPreview = previewUrls.value.get(oldFile.id)
  if (oldPreview) {
    URL.revokeObjectURL(oldPreview)
    previewUrls.value.delete(oldFile.id)
  }

  const id = generateFileId()
  const preview = createPreview(newFile)

  if (preview) {
    previewUrls.value.set(id, preview)
  }

  const newUploadFile: UploadFile = {
    id,
    file: newFile,
    name: newFile.name,
    size: newFile.size,
    type: newFile.type,
    preview,
    progress: 0,
    status: 'pending'
  }

  const newFiles = [...props.modelValue]
  newFiles[oldFileIndex] = newUploadFile

  emit('update:modelValue', newFiles)
  emit('file-replaced', oldFile, newUploadFile)
}

function removeFile(fileToRemove: UploadFile) {
  const previewUrl = previewUrls.value.get(fileToRemove.id)
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl)
    previewUrls.value.delete(fileToRemove.id)
  }

  const newFiles = props.modelValue.filter(f => f.id !== fileToRemove.id)
  emit('update:modelValue', newFiles)
  emit('file-removed', fileToRemove)
}

function replaceFile(file: UploadFile) {
  if (props.disabled) return
  replacingFileId.value = file.id
  inputRef.value?.click()
}

function triggerInput() {
  if (props.disabled) return
  inputRef.value?.click()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    triggerInput()
  }
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault()
  if (props.disabled) return

  dragCounter.value++
  isDragging.value = true
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  if (props.disabled) return

  dragCounter.value--
  if (dragCounter.value === 0) {
    isDragging.value = false
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  if (props.disabled) return

  dragCounter.value = 0
  isDragging.value = false

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFiles(event.dataTransfer.files)
  }
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

function handlePaste(event: ClipboardEvent) {
  if (!props.allowPaste || props.disabled) return
  if (!isHovered.value && !isFocused.value) return

  const items = event.clipboardData?.items
  if (!items) return

  const files: File[] = []
  for (const item of Array.from(items)) {
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file) {
        files.push(file)
      }
    }
  }

  if (files.length > 0) {
    const addedFiles = processFiles(files)

    if (addedFiles.length > 0) {
      showPasteIndicator.value = true
      setTimeout(() => {
        showPasteIndicator.value = false
      }, 1500)

      emit('files-pasted', addedFiles)
    }
  }
}

/**
 * Update file progress (call from parent during upload)
 */
function updateProgress(fileId: string, progress: number) {
  const file = props.modelValue.find(f => f.id === fileId)
  if (file) {
    file.progress = Math.min(100, Math.max(0, progress))
    if (file.status === 'pending') {
      file.status = 'uploading'
    }
  }
}

/**
 * Mark file as successfully uploaded
 */
function markSuccess(fileId: string) {
  const file = props.modelValue.find(f => f.id === fileId)
  if (file) {
    file.progress = 100
    file.status = 'success'
  }
}

/**
 * Mark file as failed
 */
function markError(fileId: string, error: string) {
  const file = props.modelValue.find(f => f.id === fileId)
  if (file) {
    file.status = 'error'
    file.error = error
  }
}

/**
 * Clear all files
 */
function clearAll() {
  for (const url of previewUrls.value.values()) {
    URL.revokeObjectURL(url)
  }
  previewUrls.value.clear()

  emit('update:modelValue', [])
}

defineExpose({
  updateProgress,
  markSuccess,
  markError,
  clearAll,
  triggerInput,
  replaceFile
})

onMounted(() => {
  if (props.allowPaste) {
    document.addEventListener('paste', handlePaste)
  }
})

watch(() => props.allowPaste, (enabled) => {
  if (enabled) {
    document.addEventListener('paste', handlePaste)
  } else {
    document.removeEventListener('paste', handlePaste)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('paste', handlePaste)

  for (const url of previewUrls.value.values()) {
    URL.revokeObjectURL(url)
  }
  previewUrls.value.clear()
})

watch(() => props.modelValue, (newFiles, oldFiles) => {
  if (!oldFiles) return

  const newIds = new Set(newFiles.map(f => f.id))

  for (const oldFile of oldFiles) {
    if (!newIds.has(oldFile.id)) {
      const url = previewUrls.value.get(oldFile.id)
      if (url) {
        URL.revokeObjectURL(url)
        previewUrls.value.delete(oldFile.id)
      }
    }
  }
}, { deep: true })

const hasFiles = computed(() => props.modelValue.length > 0)
const isUploading = computed(() => props.modelValue.some(f => f.status === 'uploading'))

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type === 'application/pdf') return 'pdf'
  if (type.includes('spreadsheet') || type.includes('excel')) return 'spreadsheet'
  if (type.includes('document') || type.includes('word')) return 'document'
  if (type.includes('zip') || type.includes('compressed')) return 'archive'
  return 'file'
}
</script>

<template>
  <div
    class="ui-file-upload"
    :class="{
      'ui-file-upload--disabled': disabled,
      'ui-file-upload--error': error,
      'ui-file-upload--compact': compact
    }"
  >
    <label
      v-if="label"
      :for="inputId"
      class="ui-file-upload__label"
    >
      {{ label }}
    </label>

    <div
      ref="dropzoneRef"
      class="ui-file-upload__dropzone"
      :class="{
        'ui-file-upload__dropzone--active': isDragging,
        'ui-file-upload__dropzone--disabled': disabled,
        'ui-file-upload__dropzone--error': error,
        'ui-file-upload__dropzone--has-files': hasFiles && !compact
      }"
      role="button"
      tabindex="0"
      :aria-disabled="disabled"
      :aria-describedby="describedBy"
      @click="triggerInput"
      @keydown="handleKeydown"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <input
        :id="inputId"
        ref="inputRef"
        type="file"
        class="ui-file-upload__input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        tabindex="-1"
        @change="handleInputChange"
      />

      <div class="ui-file-upload__content">
        <div class="ui-file-upload__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <div class="ui-file-upload__text">
          <span v-if="isDragging" class="ui-file-upload__drop-text">
            Drop files here
          </span>
          <template v-else>
            <span class="ui-file-upload__primary-text">
              <span class="ui-file-upload__link">Click to upload</span>
              or drag and drop
            </span>
            <span v-if="accept || maxSize || allowPaste" class="ui-file-upload__secondary-text">
              <template v-if="accept">{{ accept }}</template>
              <template v-if="accept && (maxSize || allowPaste)"> · </template>
              <template v-if="maxSize">Max {{ formatSize(maxSize) }}</template>
              <template v-if="maxSize && allowPaste"> · </template>
              <template v-if="allowPaste">Paste (Ctrl+V)</template>
            </span>
          </template>
        </div>
      </div>

      <Transition name="ui-file-upload-fade">
        <div v-if="showPasteIndicator" class="ui-file-upload__paste-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <span>Files pasted</span>
        </div>
      </Transition>
    </div>

    <ul v-if="hasFiles" class="ui-file-upload__list" role="list">
      <li
        v-for="file in modelValue"
        :key="file.id"
        class="ui-file-upload__file"
        :class="{
          'ui-file-upload__file--uploading': file.status === 'uploading',
          'ui-file-upload__file--success': file.status === 'success',
          'ui-file-upload__file--error': file.status === 'error'
        }"
      >
        <div class="ui-file-upload__file-preview">
          <img
            v-if="file.preview"
            :src="file.preview"
            :alt="file.name"
            class="ui-file-upload__file-image"
          />
          <div v-else class="ui-file-upload__file-icon" :data-type="getFileIcon(file.type)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>

        <div class="ui-file-upload__file-info">
          <span class="ui-file-upload__file-name">{{ file.name }}</span>
          <span class="ui-file-upload__file-meta">
            {{ formatSize(file.size) }}
            <template v-if="file.status === 'error' && file.error">
              · <span class="ui-file-upload__file-error">{{ file.error }}</span>
            </template>
            <template v-else-if="file.status === 'success'">
              · <span class="ui-file-upload__file-success">Uploaded</span>
            </template>
          </span>

          <div
            v-if="file.status === 'uploading'"
            class="ui-file-upload__progress"
          >
            <div
              class="ui-file-upload__progress-bar"
              :style="{ width: `${file.progress}%` }"
            />
          </div>
        </div>

        <div class="ui-file-upload__file-status">
          <svg
            v-if="file.status === 'success'"
            class="ui-file-upload__status-icon ui-file-upload__status-icon--success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>

          <svg
            v-else-if="file.status === 'error'"
            class="ui-file-upload__status-icon ui-file-upload__status-icon--error"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          <div
            v-else-if="file.status === 'uploading'"
            class="ui-file-upload__spinner"
          />
        </div>

        <div v-if="file.status !== 'uploading'" class="ui-file-upload__actions">
          <Button
            variant="ghost"
            size="xs"
            :aria-label="`Replace ${file.name}`"
            @click.stop="replaceFile(file)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <path d="M4 12v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="xs"
            class="ui-file-upload__remove-btn"
            :aria-label="`Remove ${file.name}`"
            @click.stop="removeFile(file)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Button>
        </div>
      </li>
    </ul>

    <p
      v-if="error"
      :id="errorId"
      class="ui-file-upload__message ui-file-upload__message--error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="ui-file-upload__message ui-file-upload__message--hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.ui-file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-sans);
}

.ui-file-upload__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-file-upload__dropzone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  padding: var(--space-6);
  background-color: var(--file-upload-bg);
  border: 2px dashed var(--file-upload-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-default),
    background-color var(--duration-fast) var(--ease-default);
}

.ui-file-upload--compact .ui-file-upload__dropzone {
  min-height: 80px;
  padding: var(--space-4);
}

.ui-file-upload__dropzone:hover:not(.ui-file-upload__dropzone--disabled) {
  border-color: var(--file-upload-border-hover);
  background-color: var(--file-upload-bg-hover);
}

.ui-file-upload__dropzone:focus-visible {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
}

.ui-file-upload__dropzone--active {
  border-color: var(--file-upload-active-border);
  border-style: solid;
  background-color: var(--file-upload-active-bg);
}

.ui-file-upload__dropzone--error {
  border-color: var(--file-upload-error-border);
}

.ui-file-upload__dropzone--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--input-bg-disabled);
}

.ui-file-upload__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.ui-file-upload__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  pointer-events: none;
}

.ui-file-upload--compact .ui-file-upload__content {
  flex-direction: row;
  gap: var(--space-4);
}

.ui-file-upload__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--file-upload-icon);
  background-color: var(--file-upload-icon-bg);
  border-radius: var(--radius-full);
}

.ui-file-upload--compact .ui-file-upload__icon {
  width: 40px;
  height: 40px;
}

.ui-file-upload__icon svg {
  width: 24px;
  height: 24px;
}

.ui-file-upload--compact .ui-file-upload__icon svg {
  width: 20px;
  height: 20px;
}

.ui-file-upload__dropzone--active .ui-file-upload__icon {
  color: var(--file-upload-active-icon);
  background-color: var(--file-upload-active-icon-bg);
}

.ui-file-upload__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ui-file-upload--compact .ui-file-upload__text {
  text-align: left;
}

.ui-file-upload__primary-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.ui-file-upload__link {
  color: var(--action-primary);
  font-weight: var(--font-medium);
}

.ui-file-upload__secondary-text {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.ui-file-upload__drop-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--action-primary);
}

.ui-file-upload__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ui-file-upload__file {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--file-upload-file-bg);
  border: 1px solid var(--file-upload-file-border);
  border-radius: var(--radius-md);
}

.ui-file-upload__file--error {
  border-color: var(--file-upload-error-border);
  background-color: var(--file-upload-error-bg);
}

.ui-file-upload__file--success {
  border-color: var(--file-upload-success-border);
}

.ui-file-upload__file-preview {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ui-file-upload__file-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-file-upload__file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--file-upload-icon-bg);
  color: var(--file-upload-icon);
}

.ui-file-upload__file-icon svg {
  width: 20px;
  height: 20px;
}

.ui-file-upload__file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ui-file-upload__file-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-file-upload__file-meta {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.ui-file-upload__file-error {
  color: var(--status-error);
}

.ui-file-upload__file-success {
  color: var(--status-success);
}

.ui-file-upload__progress {
  width: 100%;
  height: 4px;
  background-color: var(--file-upload-progress-bg);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.ui-file-upload__progress-bar {
  height: 100%;
  background-color: var(--file-upload-progress);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.ui-file-upload__file-status {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.ui-file-upload__status-icon {
  width: 20px;
  height: 20px;
}

.ui-file-upload__status-icon--success {
  color: var(--status-success);
}

.ui-file-upload__status-icon--error {
  color: var(--status-error);
}

.ui-file-upload__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--file-upload-progress-bg);
  border-top-color: var(--action-primary);
  border-radius: var(--radius-full);
  animation: ui-file-upload-spin 0.8s linear infinite;
}

@keyframes ui-file-upload-spin {
  to {
    transform: rotate(360deg);
  }
}

.ui-file-upload__actions {
  display: flex;
  gap: var(--space-1);
  flex-shrink: 0;
}

.ui-file-upload__remove-btn:hover {
  color: var(--status-error);
  background-color: var(--file-upload-remove-hover-bg);
}

.ui-file-upload__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-file-upload__message--hint {
  color: var(--input-hint);
}

.ui-file-upload__message--error {
  color: var(--input-error);
}

.ui-file-upload__paste-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--file-upload-paste-bg);
  color: var(--file-upload-paste-text);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-md);
  pointer-events: none;
  z-index: 10;
}

.ui-file-upload__paste-indicator svg {
  width: 16px;
  height: 16px;
}

.ui-file-upload-fade-enter-active,
.ui-file-upload-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-default);
}

.ui-file-upload-fade-enter-from,
.ui-file-upload-fade-leave-to {
  opacity: 0;
}
</style>
