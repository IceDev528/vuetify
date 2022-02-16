// Styles
import './VMessages.sass'

// Components
import { VSlideYTransition } from '@/components/transitions'

// Composables
import { makeTransitionProps, MaybeTransition } from '@/composables/transition'
import { useTextColor } from '@/composables/color'

// Utilities
import { defineComponent, wrapInArray } from '@/util'
import { computed } from 'vue'
import type { PropType } from 'vue'

export const VMessages = defineComponent({
  name: 'VMessages',

  props: {
    active: Boolean,
    color: String,
    messages: {
      type: [Array, String] as PropType<string | string[]>,
      default: () => ([]),
    },

    ...makeTransitionProps({
      transition: {
        component: VSlideYTransition,
        leaveAbsolute: true,
        group: true,
      },
    }),
  },

  setup (props, { slots }) {
    const messages = computed(() => wrapInArray(props.messages))
    const { textColorClasses, textColorStyles } = useTextColor(computed(() => props.color))

    return () => (
      <MaybeTransition
        transition={ props.transition }
        tag="div"
        class={[
          'v-messages',
          textColorClasses.value,
        ]}
        style={ textColorStyles.value }
      >
        { props.active && (
          messages.value.map((message, i) => (
            <div
              class="v-messages__item"
              key={ `${i}-${messages.value}` }
            >
              { slots.message ? slots.message({ message }) : message }
            </div>
          ))
        ) }
      </MaybeTransition>
    )
  },
})
