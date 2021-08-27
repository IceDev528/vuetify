// Styles
import './VTextField.sass'

// Components
import { makeVFieldProps } from '@/components/VField/VField'
import { VCounter } from '@/components/VCounter'
import { VField } from '@/components/VField'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import VIntersect from '@/directives/intersect'

// Utilities
import { computed, ref } from 'vue'
import { defineComponent, pick, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import type { VFieldSlot } from '@/components/VField/VField'

const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month']

export const VTextField = defineComponent({
  name: 'VTextField',

  directives: { VIntersect },

  inheritAttrs: false,

  props: {
    autofocus: Boolean,
    counter: [Boolean, Number, String] as PropType<true | number | string>,
    counterValue: Function as PropType<(value: any) => number>,
    prefix: String,
    placeholder: String,
    persistentPlaceholder: Boolean,
    suffix: String,
    type: {
      type: String,
      default: 'text',
    },
    modelValue: String,

    ...makeVFieldProps(),
  },

  emits: {
    'update:modelValue': (val: string) => true as any,
  },

  setup (props, { attrs, emit, slots }) {
    const model = useProxiedModel(props, 'modelValue')

    const internalDirty = ref(false)
    const isDirty = computed(() => {
      return internalDirty.value || !!model.value || dirtyTypes.includes(props.type)
    })

    const counterValue = computed(() => {
      return typeof props.counterValue === 'function'
        ? props.counterValue(model.value)
        : model.value?.toString().length
    })

    function onIntersect (
      isIntersecting: boolean,
      entries: IntersectionObserverEntry[]
    ) {
      if (!props.autofocus || !isIntersecting) return

      (entries[0].target as HTMLInputElement)?.focus?.()
    }

    const fieldRef = ref<VField>()
    function focus () {
      fieldRef.value?.inputRef?.focus()
    }
    function blur () {
      fieldRef.value?.inputRef?.blur()
    }

    useRender(() => {
      const hasCounter = (slots.counter || props.counter || props.counterValue)
      const [_, restAttrs] = pick(attrs, ['class'])

      return (
        <VField
          ref={ fieldRef }
          class={[
            'v-text-field',
            {
              'v-text-field--prefixed': props.prefix,
              'v-text-field--suffixed': props.suffix,
            },
            attrs.class,
          ]}
          active={ isDirty.value }
          onUpdate:active={ val => internalDirty.value = val }
          onClick:control={ focus }
          onClick:clear={ e => {
            e.stopPropagation()

            model.value = ''
          }}
          role="textbox"
          { ...attrs }
          { ...props }
          v-slots={{
            ...slots,
            default: ({
              isActive,
              inputRef,
              props: { class: fieldClass, ...slotProps },
            }: VFieldSlot) => {
              const showPlaceholder = isActive || props.persistentPlaceholder
              return (
                <>
                  { props.prefix && (
                    <span class="v-text-field__prefix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                      { props.prefix }
                    </span>
                  ) }

                  <input
                    class={ fieldClass }
                    style={{ opacity: showPlaceholder ? undefined : '0' }} // can't this just be a class?
                    v-model={ model.value }
                    v-intersect={[{
                      handler: onIntersect,
                    }, null, ['once']]}
                    ref={ inputRef }
                    autofocus={ props.autofocus }
                    disabled={ props.disabled }
                    placeholder={ props.placeholder }
                    size={ 1 }
                    type={ props.type }
                    { ...slotProps }
                    { ...restAttrs }
                  />

                  { props.suffix && (
                    <span class="v-text-field__suffix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                      { props.suffix }
                    </span>
                  ) }
                </>
              )
            },
            details: hasCounter ? () => (
              <>
                <span />

                <VCounter
                  value={ counterValue.value }
                  max={ attrs.maxlength as undefined }
                  v-slots={ slots.counter }
                />
              </>
            ) : undefined,
          }}
        />
      )
    })

    return {
      fieldRef,
      focus,
      blur,
    }
  },
})
