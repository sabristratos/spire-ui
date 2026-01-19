import type { InjectionKey, Ref } from 'vue'

export type AccordionVariant = 'contained' | 'split'

export interface AccordionContext {
  openItems: Ref<Set<string>>
  toggle: (value: string) => void
  collapsible: Ref<boolean>
  multiple: Ref<boolean>
  variant: Ref<AccordionVariant>
}

export interface AccordionItemContext {
  value: string
  triggerId: string
  contentId: string
  isOpen: Ref<boolean>
  disabled: Ref<boolean>
  toggle: () => void
}

export const AccordionKey: InjectionKey<AccordionContext> = Symbol('accordion')
export const AccordionItemKey: InjectionKey<AccordionItemContext> = Symbol('accordion-item')
