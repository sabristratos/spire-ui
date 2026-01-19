# Dropdown

Action menu with trigger slot, teleported menu panel, and polymorphic menu items. Supports keyboard navigation, nested submenus, and full accessibility.

## Usage

```vue
<script setup>
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
  Button
} from 'spire-ui'
</script>

<template>
  <Dropdown>
    <template #trigger>
      <Button variant="secondary">Actions</Button>
    </template>
    <DropdownItem>Edit</DropdownItem>
    <DropdownItem>Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem danger>Delete</DropdownItem>
  </Dropdown>
</template>
```

## Props

### Dropdown

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `DropdownPlacement` | `'bottom-start'` | Menu placement |
| `offset` | `number` | `4` | Distance from trigger (px) |
| `disabled` | `boolean` | `false` | Disable opening |
| `menuWidth` | `'auto' \| 'trigger' \| number` | `'auto'` | Menu width behavior |

### Placement Values

```typescript
type DropdownPlacement =
  | 'bottom-start' | 'bottom-end'
  | 'top-start' | 'top-end'
  | 'right-start' | 'right-end'
  | 'left-start' | 'left-end'
```

### DropdownItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string \| object` | — | Renders as RouterLink |
| `href` | `string` | — | Renders as anchor |
| `disabled` | `boolean` | `false` | Disabled state |
| `danger` | `boolean` | `false` | Destructive styling |
| `icon` | `Component` | — | Leading icon |
| `shortcut` | `string` | — | Keyboard shortcut hint |
| `preventClose` | `boolean` | `false` | Keep menu open on click |

### DropdownSubTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `Component` | — | Leading icon |

## Events

### Dropdown

| Event | Payload | Description |
|-------|---------|-------------|
| `open` | — | Menu opened |
| `close` | — | Menu closed |

### DropdownItem

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent \| KeyboardEvent` | Item clicked |

## Slots

### Dropdown

| Slot | Scope | Description |
|------|-------|-------------|
| `trigger` | `{ open, toggle }` | Trigger element |
| `default` | — | Menu items |

## Polymorphic Items

DropdownItem renders different elements based on props:

```vue
<!-- Button (default) - for actions -->
<DropdownItem @click="handleEdit">Edit</DropdownItem>

<!-- RouterLink - for internal navigation -->
<DropdownItem to="/settings">Settings</DropdownItem>

<!-- Anchor - for external links -->
<DropdownItem href="https://docs.example.com">Documentation</DropdownItem>
```

## Menu Width

Control the menu width behavior:

```vue
<!-- Auto width (default) -->
<Dropdown menu-width="auto">...</Dropdown>

<!-- Match trigger width -->
<Dropdown menu-width="trigger">...</Dropdown>

<!-- Fixed pixel width -->
<Dropdown :menu-width="300">...</Dropdown>
```

## Placement

```vue
<!-- Vertical placements (default for top-level menus) -->
<Dropdown placement="bottom-start">...</Dropdown>  <!-- Default -->
<Dropdown placement="bottom-end">...</Dropdown>
<Dropdown placement="top-start">...</Dropdown>
<Dropdown placement="top-end">...</Dropdown>

<!-- Horizontal placements (used internally for submenus) -->
<Dropdown placement="right-start">...</Dropdown>
<Dropdown placement="right-end">...</Dropdown>
<Dropdown placement="left-start">...</Dropdown>
<Dropdown placement="left-end">...</Dropdown>
```

The menu flips automatically when there's not enough space in the preferred direction.

## Icons and Shortcuts

```vue
<script setup>
import { EditIcon, CopyIcon, TrashIcon } from 'some-icon-library'
</script>

<template>
  <Dropdown>
    <template #trigger>
      <Button variant="secondary">Actions</Button>
    </template>
    <DropdownItem :icon="EditIcon" shortcut="⌘E">Edit</DropdownItem>
    <DropdownItem :icon="CopyIcon" shortcut="⌘D">Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem :icon="TrashIcon" shortcut="⌫" danger>Delete</DropdownItem>
  </Dropdown>
</template>
```

## Danger Items

Use `danger` for destructive actions:

```vue
<DropdownItem danger @click="handleDelete">Delete permanently</DropdownItem>
```

## Disabled Items

```vue
<DropdownItem disabled>Unavailable action</DropdownItem>
```

Disabled items:
- Cannot be clicked
- Have `tabindex="-1"`
- Are skipped in keyboard navigation
- Show muted styling

## Prevent Close

Keep the menu open after clicking an item (useful for toggles):

```vue
<DropdownItem prevent-close @click="toggleSetting">
  Toggle Setting
</DropdownItem>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` / `↓` | Open menu |
| `↑` | Open menu, focus last item |
| `↓` | Focus next item |
| `↑` | Focus previous item |
| `Home` | Focus first item |
| `End` | Focus last item |
| `Escape` | Close menu |
| `Tab` | Close menu |
| `Enter` / `Space` | Activate focused item |

## Accessibility

- Trigger has `aria-haspopup="true"` and `aria-expanded`
- Menu has `role="menu"` and `aria-labelledby`
- Items have `role="menuitem"`
- Disabled items have `aria-disabled="true"`
- Focus is managed: first item on open, trigger on close
- External links open in new tab with `rel="noopener noreferrer"`

## Teleportation

The menu is teleported to `document.body` to avoid:
- Overflow clipping from parent containers
- Stacking context issues
- Z-index conflicts

## Z-Index

The dropdown uses `--z-dropdown: 50`, positioned between:
- Tables/content: ~10
- Dropdowns: 50
- Modals: 100

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--z-dropdown` | Menu z-index |
| `--dropdown-bg` | Menu background |
| `--dropdown-border` | Menu border |
| `--dropdown-item-text` | Item text color |
| `--dropdown-item-hover` | Item hover background |
| `--dropdown-item-disabled` | Disabled text color |
| `--dropdown-item-danger` | Danger text color |
| `--dropdown-item-danger-hover` | Danger hover background |
| `--dropdown-item-shortcut` | Shortcut text color |
| `--dropdown-separator` | Separator color |

## Composition with Button

```vue
<Dropdown>
  <template #trigger="{ open }">
    <Button variant="secondary">
      Options
      <Icon :name="open ? ChevronUpIcon : ChevronDownIcon" size="sm" />
    </Button>
  </template>
  <DropdownItem>Option 1</DropdownItem>
  <DropdownItem>Option 2</DropdownItem>
</Dropdown>
```

## Click Outside

The menu closes automatically when clicking outside both the trigger and menu.

## Submenus

Create nested menus using `DropdownSub`, `DropdownSubTrigger`, and `DropdownSubContent`:

```vue
<Dropdown>
  <template #trigger>
    <Button variant="secondary">File</Button>
  </template>
  <DropdownItem>New File</DropdownItem>
  <DropdownItem>Open...</DropdownItem>
  <DropdownSub>
    <DropdownSubTrigger>Open Recent</DropdownSubTrigger>
    <DropdownSubContent>
      <DropdownItem>project.json</DropdownItem>
      <DropdownItem>config.yaml</DropdownItem>
      <DropdownSeparator />
      <DropdownItem>Clear Recent</DropdownItem>
    </DropdownSubContent>
  </DropdownSub>
  <DropdownSeparator />
  <DropdownItem>Save</DropdownItem>
  <DropdownSub>
    <DropdownSubTrigger>Export As</DropdownSubTrigger>
    <DropdownSubContent>
      <DropdownItem>PDF Document</DropdownItem>
      <DropdownItem>PNG Image</DropdownItem>
      <DropdownItem>SVG Vector</DropdownItem>
    </DropdownSubContent>
  </DropdownSub>
</Dropdown>
```

### Submenu Structure

- `DropdownSub` - Wrapper that provides context for the submenu
- `DropdownSubTrigger` - Button that opens the submenu (shows chevron icon)
- `DropdownSubContent` - Container for submenu items (teleported to body)

### Submenu Behavior

**Mouse interaction:**
- Hover on trigger opens submenu after brief delay
- Moving to submenu content keeps it open
- Moving away from both closes after 150ms delay
- **Safe Triangle Algorithm**: When moving diagonally from trigger to submenu, the system calculates an invisible triangle from the cursor to the submenu corners, preventing accidental closes when crossing over other menu items

**Keyboard navigation:**
- `→` or `Enter` on trigger opens submenu and focuses first item
- `←` or `Escape` closes submenu and returns focus to trigger
- Standard `↑`/`↓` navigation within submenu

### Safe Triangle Algorithm

The dropdown implements a "safe triangle" algorithm for smooth submenu navigation:

```
    Cursor ───────────────────┐
       │ \                    │
       │  \   Safe Zone       │
       │   \                  │
       │    \─────────────────┤ Submenu
       │     \_______________ │
       │                      │
    ───┴──────────────────────┘
```

When moving from a submenu trigger toward the submenu content, the algorithm:
1. Calculates a triangle from the cursor position to the submenu's corners
2. While the cursor is inside this triangle, other menu items won't steal focus
3. This allows diagonal mouse movement without accidentally closing the submenu

### Mobile Experience

On mobile devices (viewport < 768px or touch device), the dropdown automatically transforms into a **drill-down pattern**:

- Menus appear as bottom sheets (sliding up from the bottom)
- Full-width for easy touch targets
- Back button navigation for submenus instead of hover
- Stacked navigation with breadcrumb-style headers
- Swipe or tap outside to close

```
┌─────────────────────────────┐
│  ← Open Recent              │  ← Back button
├─────────────────────────────┤
│  project.json               │
│  config.yaml                │
│  ─────────────              │
│  Clear Recent               │
└─────────────────────────────┘
```

The mobile behavior is automatic based on viewport size and touch capability.

### Disabled Submenu Trigger

```vue
<DropdownSub>
  <DropdownSubTrigger disabled>Premium Features</DropdownSubTrigger>
  <DropdownSubContent>
    <DropdownItem>Feature A</DropdownItem>
    <DropdownItem>Feature B</DropdownItem>
  </DropdownSubContent>
</DropdownSub>
```

### Submenu Keyboard Reference

| Key | Action |
|-----|--------|
| `→` / `Enter` | Open submenu, focus first item |
| `←` / `Escape` | Close submenu, return to trigger |
| `↓` | Focus next item in submenu |
| `↑` | Focus previous item in submenu |

### UX Considerations

Submenus can harm usability, especially on mobile. Consider alternatives:
- Flat menus with sections (using separators)
- Modal dialogs for complex selections
- Separate pages for deep hierarchies

Use submenus sparingly for truly hierarchical content like:
- File > Open Recent
- Edit > Transform
- View > Zoom
