// Styles
import './VList.sass'

// Components
import { VListChildren } from './VListChildren'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeItemsProps, useItems } from '@/composables/items'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeNestedProps, useNested } from '@/composables/nested/nested'
import { makeVariantProps } from '@/composables/variant'
import { createList } from './list'
import { provideDefaults } from '@/composables/defaults'

// Utilities
import { computed, toRef } from 'vue'
import { genericComponent, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import type { MakeSlots } from '@/util'
import type { ListGroupActivatorSlot } from './VListGroup'

export type ListItem = {
  [key: string]: any
  $type?: 'item' | 'subheader' | 'divider'
}

export type InternalListItem = {
  type?: 'item' | 'subheader' | 'divider'
  props?: Record<string, any>
  children?: InternalListItem[]
}

const parseItems = (items?: (string | ListItem)[]): InternalListItem[] | undefined => {
  if (!items) return undefined

  return items.map(item => {
    if (typeof item === 'string') return { type: 'item', value: item, title: item }

    const { $type, children, ...props } = item

    props.title = props.text ?? props.title

    if ($type === 'subheader') return { type: 'subheader', props }
    if ($type === 'divider') return { type: 'divider', props }

    return { type: 'item', props, children: parseItems(children) }
  })
}

export const VList = genericComponent<new <T>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    subheader: []
    header: [ListGroupActivatorSlot]
    item: [T]
  }>
}>()({
  name: 'VList',

  props: {
    activeColor: String,
    activeClass: String,
    bgColor: String,
    disabled: Boolean,
    lines: {
      type: [Boolean, String] as PropType<'one' | 'two' | 'three' | false>,
      default: 'one',
    },
    nav: Boolean,

    ...makeNestedProps({
      selectStrategy: 'single-leaf' as const,
      openStrategy: 'list' as const,
    }),
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeItemsProps(),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'text' } as const),
  },

  emits: {
    'update:selected': (val: string[]) => true,
    'update:opened': (val: string[]) => true,
    'click:open': (value: { id: string, value: boolean, path: string[] }) => true,
    'click:select': (value: { id: string, value: boolean, path: string[] }) => true,
  },

  setup (props, { slots }) {
    const { items } = useItems(props)
    const parsedItems = computed(() => parseItems(items.value))
    const { themeClasses } = provideTheme(props)
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
    const { borderClasses } = useBorder(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props)
    const { open, select } = useNested(props)
    const lineClasses = computed(() => props.lines ? `v-list--${props.lines}-line` : undefined)
    const activeColor = toRef(props, 'activeColor')
    const color = toRef(props, 'color')

    createList()

    provideDefaults({
      VListGroup: {
        activeColor,
        color,
      },
      VListItem: {
        activeClass: toRef(props, 'activeClass'),
        activeColor,
        color,
        density: toRef(props, 'density'),
        disabled: toRef(props, 'disabled'),
        lines: toRef(props, 'lines'),
        nav: toRef(props, 'nav'),
        variant: toRef(props, 'variant'),
      },
    })

    useRender(() => {
      return (
        <props.tag
          class={[
            'v-list',
            {
              'v-list--disabled': props.disabled,
              'v-list--nav': props.nav,
            },
            themeClasses.value,
            backgroundColorClasses.value,
            borderClasses.value,
            densityClasses.value,
            elevationClasses.value,
            lineClasses.value,
            roundedClasses.value,
          ]}
          style={[
            backgroundColorStyles.value,
            dimensionStyles.value,
          ]}
        >
          <VListChildren items={ parsedItems.value } v-slots={ slots }></VListChildren>
        </props.tag>
      )
    })

    return {
      open,
      select,
    }
  },
})

export type VList = InstanceType<typeof VList>
