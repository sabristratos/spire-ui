# FileUpload

Drag-and-drop file uploader with image previews, progress tracking, paste support, and validation.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { FileUpload } from 'spire-ui'
import type { UploadFile } from 'spire-ui'

const files = ref<UploadFile[]>([])
</script>

<template>
  <FileUpload
    v-model="files"
    multiple
    accept="image/*"
    label="Upload images"
    hint="PNG, JPG, GIF up to 10MB"
    :max-size="10 * 1024 * 1024"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `UploadFile[]` | `[]` | Selected files (v-model) |
| `accept` | `string` | — | Accepted file types (MIME or extensions) |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | — | Maximum file size in bytes |
| `maxFiles` | `number` | — | Maximum number of files |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Label text above dropzone |
| `hint` | `string` | — | Hint text below dropzone |
| `error` | `string` | — | Error message |
| `showPreviews` | `boolean` | `true` | Show image previews |
| `compact` | `boolean` | `false` | Compact dropzone mode |
| `allowPaste` | `boolean` | `true` | Enable paste-to-upload (Ctrl+V) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `UploadFile[]` | Files changed |
| `files-added` | `UploadFile[]` | New files added |
| `file-removed` | `UploadFile` | File removed |
| `file-rejected` | `File, string` | File rejected with reason |
| `files-pasted` | `UploadFile[]` | Files added via paste |
| `file-replaced` | `UploadFile, UploadFile` | File replaced (old, new) |

## UploadFile Interface

```typescript
interface UploadFile {
  id: string              // Unique identifier
  file: File              // Original File object
  name: string            // File name
  size: number            // File size in bytes
  type: string            // MIME type
  preview?: string        // Preview URL (for images)
  progress: number        // Upload progress (0-100)
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string          // Error message
}
```

## Exposed Methods

Access via template ref to control upload state from parent:

```vue
<script setup>
import { ref } from 'vue'
import { FileUpload } from 'spire-ui'

const uploadRef = ref<InstanceType<typeof FileUpload> | null>(null)

function handleUpload() {
  // Update progress
  uploadRef.value?.updateProgress('file-id', 50)

  // Mark as complete
  uploadRef.value?.markSuccess('file-id')

  // Mark as failed
  uploadRef.value?.markError('file-id', 'Network error')

  // Clear all files
  uploadRef.value?.clearAll()

  // Programmatically open file picker
  uploadRef.value?.triggerInput()
}
</script>

<template>
  <FileUpload ref="uploadRef" v-model="files" />
</template>
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `updateProgress` | `(fileId: string, progress: number)` | Update file progress (0-100) |
| `markSuccess` | `(fileId: string)` | Mark file as uploaded |
| `markError` | `(fileId: string, error: string)` | Mark file as failed |
| `clearAll` | `()` | Remove all files |
| `triggerInput` | `()` | Open file picker |
| `replaceFile` | `(file: UploadFile)` | Replace a specific file |

## File Validation

Validate by type and size:

```vue
<!-- Only images under 5MB -->
<FileUpload
  accept="image/*"
  :max-size="5 * 1024 * 1024"
  @file-rejected="handleRejected"
/>

<!-- Specific extensions -->
<FileUpload
  accept=".pdf,.doc,.docx"
  @file-rejected="handleRejected"
/>
```

Accept format supports:
- MIME types: `image/png`, `application/pdf`
- Wildcards: `image/*`, `video/*`
- Extensions: `.pdf`, `.jpg`, `.docx`
- Comma-separated: `image/*,.pdf,application/zip`

## Upload Progress Simulation

```vue
<script setup>
import { ref } from 'vue'

const uploadRef = ref(null)
const files = ref([])

async function uploadFiles() {
  for (const file of files.value) {
    if (file.status !== 'pending') continue

    // Simulate upload
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(r => setTimeout(r, 100))
      uploadRef.value?.updateProgress(file.id, progress)
    }

    uploadRef.value?.markSuccess(file.id)
  }
}
</script>
```

## Paste to Upload

Press Ctrl+V (Cmd+V on Mac) while hovering over the dropzone to paste images from clipboard:

```vue
<!-- Enabled by default -->
<FileUpload v-model="files" />

<!-- Disable paste -->
<FileUpload v-model="files" :allow-paste="false" />
```

**Multi-instance support:** When multiple uploaders exist on the same page, paste targets only the hovered or focused component.

## File Actions

Each file in the list has two action buttons:
- **Replace** - Opens file picker to replace this specific file (keeps position)
- **Remove** - Removes the file from the list

Action buttons are hidden during upload (when `status === 'uploading'`).

```vue
<script setup>
function handleReplaced(oldFile: UploadFile, newFile: UploadFile) {
  console.log(`Replaced ${oldFile.name} with ${newFile.name}`)
}
</script>

<template>
  <FileUpload
    v-model="files"
    @file-replaced="handleReplaced"
  />
</template>
```

## Compact Mode

Smaller dropzone for tight layouts:

```vue
<FileUpload compact label="Avatar" accept="image/*" />
```

## States

```vue
<!-- Error state -->
<FileUpload error="Upload failed. Please try again." />

<!-- Disabled state -->
<FileUpload disabled />
```

## Accessibility

- Dropzone has `role="button"` with `tabindex="0"`
- Keyboard support: Enter/Space opens file picker
- Label uses `for` linked to hidden input
- Error messages use `role="alert"`
- `aria-describedby` links to hint/error

## Architecture

The component uses several key patterns:

### Drag Counter Strategy
Prevents flicker during drag over child elements:
```typescript
// Increment on dragenter, decrement on dragleave
// Only set isDragging=false when counter reaches 0
```

### Object URL Previews
Uses `URL.createObjectURL()` for instant, non-blocking previews:
- No Base64 encoding overhead
- URLs are revoked on file removal and unmount

### Hidden Input Pattern
The "Trojan Horse" approach:
- Visible dropzone acts as button
- Hidden `<input type="file">` provides browser file picker
- Input resets after selection to allow re-selecting same file

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--file-upload-bg` | Dropzone background |
| `--file-upload-bg-hover` | Hover background |
| `--file-upload-border` | Border color |
| `--file-upload-border-hover` | Hover border color |
| `--file-upload-icon` | Icon color |
| `--file-upload-icon-bg` | Icon background |
| `--file-upload-active-bg` | Drag active background |
| `--file-upload-active-border` | Drag active border |
| `--file-upload-error-bg` | Error file background |
| `--file-upload-error-border` | Error border |
| `--file-upload-success-border` | Success border |
| `--file-upload-file-bg` | File item background |
| `--file-upload-file-border` | File item border |
| `--file-upload-progress-bg` | Progress track background |
| `--file-upload-progress` | Progress bar color |
| `--file-upload-paste-bg` | Paste indicator background |
| `--file-upload-paste-text` | Paste indicator text |
