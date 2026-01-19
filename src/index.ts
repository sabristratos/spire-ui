// Styles - Must be imported by consumer
import './styles/main.css'

// Components
export {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from './components/Accordion'
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps
} from './components/Accordion'

export { Avatar } from './components/Avatar'
export type { AvatarProps } from './components/Avatar'

export { Badge } from './components/Badge'
export type { BadgeProps } from './components/Badge'

export { BadgeContainer } from './components/BadgeContainer'
export type { BadgeContainerProps } from './components/BadgeContainer'

export {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from './components/Breadcrumb'
export type {
  BreadcrumbRootProps,
  BreadcrumbLinkProps,
  BreadcrumbEllipsisProps,
  BreadcrumbEllipsisItem,
  BreadcrumbContext
} from './components/Breadcrumb'

export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'

export { Callout } from './components/Callout'
export type { CalloutProps, CalloutVariant } from './components/Callout'

export { Card, CardHeader, CardContent, CardFooter, CardImage } from './components/Card'
export type {
  CardProps,
  CardVariant,
  CardPadding,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardImageProps,
  CardImagePosition,
  CardImageAspectRatio,
  CardImageFit
} from './components/Card'

export { Checkbox } from './components/Checkbox'
export type { CheckboxProps } from './components/Checkbox'

export {
  BaseChart,
  LineChart,
  BarChart,
  DonutChart,
  useChartTheme
} from './components/Chart'
export type {
  BaseChartProps,
  ChartDataset,
  TooltipData,
  LegendItem,
  LineChartProps,
  LineChartSeries,
  BarChartProps,
  BarChartSeries,
  DonutChartProps,
  DonutChartSegment,
  ChartTheme,
  ChartThemeColors
} from './components/Chart'

export { DataTable } from './components/DataTable'
export type {
  DataTableProps,
  DataTableColumn,
  SortState,
  SortDirection,
  ColumnAlign
} from './components/DataTable'

export { DatePicker } from './components/DatePicker'
export type { DatePickerProps, ViewMode as DatePickerViewMode } from './components/DatePicker'

export { Drawer } from './components/Drawer'
export type {
  DrawerProps,
  DrawerPlacement,
  DrawerVariant,
  DrawerSize
} from './components/Drawer'

export {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent
} from './components/Dropdown'
export type {
  DropdownProps,
  DropdownPlacement,
  DropdownContext,
  DropdownItemProps,
  DropdownSubContext,
  DropdownSubTriggerProps
} from './components/Dropdown'

export { EmptyState } from './components/EmptyState'
export type { EmptyStateProps, EmptyStateVariant } from './components/EmptyState'

export { Combobox } from './components/Combobox'
export type { ComboboxProps, ComboboxOption } from './components/Combobox'

export { ChoiceChip } from './components/ChoiceChip'
export type { ChoiceChipProps } from './components/ChoiceChip'

export { ChoiceChipGroup } from './components/ChoiceChipGroup'
export type { ChoiceChipGroupProps } from './components/ChoiceChipGroup'

export { FileUpload } from './components/FileUpload'
export type { FileUploadProps, UploadFile } from './components/FileUpload'

export { Heading } from './components/Heading'
export type { HeadingProps } from './components/Heading'

export { Icon } from './components/Icon'
export type { IconProps, IconInput } from './components/Icon'

export { Input } from './components/Input'
export type { InputProps } from './components/Input'

export { Modal } from './components/Modal'
export type { ModalProps, ModalSize } from './components/Modal'

export { Popover } from './components/Popover'
export type { PopoverProps, PopoverPlacement } from './components/Popover'

export { Progress } from './components/Progress'
export type {
  ProgressProps,
  ProgressVariant,
  ProgressSize,
  ProgressColor
} from './components/Progress'

export { Radio } from './components/Radio'
export type { RadioProps } from './components/Radio'

export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlProps, SegmentedOption } from './components/SegmentedControl'

export { Select } from './components/Select'
export type { SelectProps, SelectOption } from './components/Select'

export {
  SidebarLayout,
  SidebarRoot,
  SidebarItem,
  SidebarGroup
} from './components/Sidebar'
export type {
  SidebarLayoutProps,
  SidebarRootProps,
  SidebarItemProps,
  SidebarGroupProps,
  SidebarContext,
  SidebarGroupContext
} from './components/Sidebar'
export { SidebarKey, SidebarGroupKey } from './components/Sidebar'

export { Skeleton } from './components/Skeleton'
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton'

export { SpireProvider, spireConfigKey } from './components/SpireProvider'
export type {
  Theme,
  Mood,
  Depth,
  Motion,
  Texture,
  SpireConfig,
  SpireProviderProps
} from './components/SpireProvider'

export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'

export { Switch } from './components/Switch'
export type { SwitchProps } from './components/Switch'

export { Tabs } from './components/Tabs'
export type { TabsProps, TabItem } from './components/Tabs'

export { Textarea } from './components/Textarea'
export type { TextareaProps } from './components/Textarea'

export { Text } from './components/Text'
export type { TextProps } from './components/Text'

export { TimePicker } from './components/TimePicker'
export type { TimePickerProps } from './components/TimePicker'

export { ToggleButton } from './components/ToggleButton'
export type { ToggleButtonProps } from './components/ToggleButton'

export { ToggleGroup } from './components/ToggleGroup'
export type { ToggleGroupProps } from './components/ToggleGroup'

export { ToastProvider, ToastItem, useToast } from './components/Toast'
export type { ToastProviderProps, ToastItemProps, Toast, ToastOptions, ToastVariant, ToastAction } from './components/Toast'

export { Tooltip } from './components/Tooltip'
export type { TooltipProps } from './components/Tooltip'

// Composables
export { useClickOutside } from './composables'
export { useClipboard } from './composables'
export { useEventListener } from './composables'
export { useFocusTrap } from './composables'
export { useHoverReveal, type UseHoverRevealOptions } from './composables'
export { useId } from './composables'
export { useMagnetic, type UseMagneticOptions, type UseMagneticReturn } from './composables'
export { useRelativePosition, type Placement } from './composables'
export { useRipple, type UseRippleOptions } from './composables'
export { useScrollLock } from './composables'
export { useStagger, getStaggerStyle, type UseStaggerOptions, type UseStaggerReturn } from './composables'

// Utilities
export { getInitials, getNestedValue } from './utils'
export {
  generateCalendarGrid,
  getDaysInMonth,
  formatDate,
  parseDate,
  isSameDate,
  isDateBefore,
  isDateAfter,
  getMonthName,
  getMonthNamesShort,
  getWeekdayNames,
  isDateInRange,
  isDateBetween,
  getRangeClass,
  normalizeRange,
  generateYearGrid,
  getPresetRange
} from './utils'
export type { CalendarDay, RangeState, RangeClass } from './utils'
export {
  parseTime,
  formatTime,
  generateRange,
  to12Hour,
  to24Hour,
  isValidTimeString
} from './utils/time'
export type { ParsedTime, TimeFormat } from './utils/time'

// Configuration
export { configureIcons, resetIcons, type IconMap } from './config/icons'
