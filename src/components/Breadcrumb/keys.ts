import type { InjectionKey, Component, VNode } from 'vue'

export interface BreadcrumbContext {
  separator: Component | string | (() => VNode)
}

export const BreadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('breadcrumb')
