// Components
import VCombobox from '../VCombobox'

// Utilities
import {
  mount,
  Wrapper
} from '@vue/test-utils'
import { rafPolyfill } from '../../../../test'
import { keyCodes } from '../../../util/helpers'

describe('VCombobox.ts', () => {
  type Instance = InstanceType<typeof VCombobox>
  let mountFunction: (options?: object) => Wrapper<Instance>

  rafPolyfill(window)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VCombobox, {
        ...options,
        mocks: {
          $vuetify: {
            lang: {
              t: (val: string) => val
            },
            theme: {
              dark: false
            }
          }
        }
      })
    }
  })

  function createMultipleCombobox (propsData) {
    const change = jest.fn()
    const wrapper = mountFunction({
      attachToDocument: true,
      propsData: Object.assign({
        multiple: true,
        value: []
      }, propsData)
    })

    wrapper.vm.$on('input', change)
    return { wrapper, change }
  }

  it('should create new values when tagging', async () => {
    const { wrapper, change } = createMultipleCombobox({})

    const input = wrapper.find('input')

    input.trigger('focus')
    input.element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.enter')

    expect(change).toHaveBeenCalledWith(['foo'])
  })

  it('should change selectedIndex with keyboard', async () => {
    const { wrapper } = createMultipleCombobox({
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    for (const index of [1, 0, -1]) {
      input.trigger('keydown.left')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedIndex).toBe(index)
    }
  })

  it('should delete a tagged item when selected and backspace/delete is pressed', async () => {
    const { wrapper, change } = createMultipleCombobox({
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)

    input.trigger('keydown.delete')
    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledWith(['foo'])
    expect(wrapper.vm.selectedIndex).toBe(0)

    const backspace = new Event('keydown')
    backspace.keyCode = keyCodes.delete

    input.element.dispatchEvent(backspace) // Avoriaz doesn't wrap keydown.backspace
    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledWith([])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should add a tag on tab using the first suggestion', async () => {
    const { wrapper, change } = createMultipleCombobox({
      items: ['bar']
    })

    const input = wrapper.find('input')
    const menu = wrapper.find('.v-menu')

    input.trigger('focus')
    input.element.value = 'b'
    input.trigger('input')
    menu.trigger('keydown.down')

    // Give DOM time to update
    // list tile classes
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(true)

    input.trigger('keydown.tab')

    expect(change).toHaveBeenCalledWith(['bar'])
    expect(wrapper.vm.getMenuIndex()).toBe(0)
  })

  it('should add a tag on tab using the current searchValue', async () => {
    const { wrapper, change } = createMultipleCombobox({
      items: ['bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')

    wrapper.setProps({ searchInput: 'ba' })
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledWith(['ba'])

    wrapper.setProps({ searchInput: 'it' })
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledWith(['ba', 'it'])
  })

  it('should add a tag on enter using the current searchValue', async () => {
    const { wrapper, change } = createMultipleCombobox({
      items: ['bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    input.element.value = 'ba'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledWith(['ba'])
  })

  it('should add a tag on left arrow and select the previous tag', async () => {
    const { wrapper, change } = createMultipleCombobox({
      value: ['foo'],
      items: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.element.value = 'b'
    input.trigger('input')
    input.trigger('keydown.left')

    expect(change).toHaveBeenCalledWith(['foo', 'b'])
    expect(wrapper.vm.selectedIndex).toBe(0)
  })

  it('should remove a duplicate tag and add it to the end', async () => {
    const { wrapper, change } = createMultipleCombobox({
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    input.element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledWith(['bar', 'foo'])
  })

  it('should add tag with valid search value on blur', async () => {
    const { wrapper, change } = createMultipleCombobox({})

    const input = wrapper.find('input')

    input.trigger('focus')
    input.element.value = 'bar'
    input.trigger('input')
    input.trigger('keydown.tab')

    expect(change).toHaveBeenCalledWith(['bar'])
  })

  it('should be able to add a tag from user input after deleting a tag with delete', async () => {
    const { wrapper, change } = createMultipleCombobox({
      multiple: true,
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)
    input.trigger('keydown.delete')
    expect(change).toHaveBeenCalledWith(['foo'])
    expect(wrapper.vm.selectedIndex).toBe(0)

    // Must be reset for input to update
    wrapper.vm.selectedIndex = -1
    await wrapper.vm.$nextTick()

    input.element.value = 'baz'
    input.trigger('input')
    input.trigger('keydown.enter')

    expect(change).toHaveBeenCalledWith(['foo', 'baz'])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should be able to add a tag from user input after clicking a deletable chip', async () => {
    const { wrapper, change } = createMultipleCombobox({
      chips: true,
      clearable: true,
      deletableChips: true,
      multiple: true,
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')
    const chip = wrapper.findAll('.v-chip').at(1)
    const close = chip.find('.v-chip__close')

    input.trigger('focus')
    chip.trigger('click')
    close.trigger('click')
    expect(change).toHaveBeenCalledWith(['foo'])
    expect(wrapper.vm.selectedIndex).toBe(-1)

    input.element.value = 'baz'
    input.trigger('input')
    expect(wrapper.vm.internalSearch).toBe('baz')
    input.trigger('keydown.enter')

    expect(change).toHaveBeenCalledWith(['foo', 'baz'])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  // This test is actually almost useless
  it('should not change search when selecting an index', () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      value: ['foo', 'bar']
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    expect(wrapper.vm.selectedIndex).toBe(-1)

    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)

    expect(wrapper.vm.internalSearch).toBeUndefined()
    input.trigger('keydown.right')
    input.element.value = 'fizz'
    input.trigger('input')

    expect(wrapper.vm.internalSearch).toBe('fizz')
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should create new items when a delimiter is entered', async () => {
    const { wrapper, change } = createMultipleCombobox({
      delimiters: [', ', 'baz']
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    input.trigger('focus')

    input.element.value = 'foo,'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledTimes(0)

    input.element.value += ' '
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledTimes(1)
    expect(change).toHaveBeenCalledWith(['foo'])
    expect(input.element.value).toBe('')

    input.element.value = 'foo,barba'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledTimes(1)

    input.element.value += 'z'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(change).toHaveBeenCalledTimes(2)
    expect(change).toHaveBeenCalledWith(['foo', 'foo,bar'])
    expect(input.element.value).toBe('')
  })

  it('should allow the editing of an existing value', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      value: ['foo']
    })

    const change = jest.fn()
    const internal = jest.fn()
    const chip = wrapper.find('.v-chip')
    const input = wrapper.find('input')

    wrapper.vm.$on('change', change)
    wrapper.vm.$watch('internalValue', internal)

    expect(wrapper.vm.editingIndex).toBe(-1)
    expect(wrapper.vm.internalSearch).toBeUndefined()

    chip.trigger('dblclick')

    expect(wrapper.vm.editingIndex).toBe(0)
    expect(wrapper.vm.internalSearch).toBe('foo')

    input.element.value = 'foobar'
    input.trigger('input')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledWith(['foobar'])
    expect(internal).toHaveBeenCalledWith(['foobar'], ['foo'])
  })

  it('should react to tabs', async () => {
    const updateTags = jest.fn()
    const wrapper = mountFunction({
      propsData: {
        items: ['fizz', 'buzz'],
        multiple: true
      },
      methods: {
        updateTags
      }
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.tab')

    expect(wrapper.vm.getMenuIndex()).toBe(-1)
    expect(updateTags).toHaveBeenCalledTimes(1)

    input.trigger('focus')
    input.element.value = 'fizz'
    input.trigger('input')
    input.trigger('keydown.down')

    // Allow dom to update class for
    // selected tile
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(true)
    expect(wrapper.vm.getMenuIndex()).toBe(0)

    input.trigger('keydown.tab')

    // We overwrite update tags so above
    // is does not persist
    expect(wrapper.vm.internalValue).toEqual(['fizz'])
    expect(updateTags).toHaveBeenCalledTimes(2)
  })
})
