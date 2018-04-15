import { test } from '@/test'
import VAutocomplete from '@/components/VAutocomplete'

test('VAutocomplete.js', ({ shallow }) => {
  const app = document.createElement('div')
  app.setAttribute('data-app', true)
  document.body.appendChild(app)

  it('should allow changing of browser autocomplete', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        browserAutocomplete: 'on'
      }
    })

    const input = wrapper.first('input')

    expect(input.element.getAttribute('autocomplete')).toBe('on')

    wrapper.setProps({ browserAutocomplete: 'off' })

    await wrapper.vm.$nextTick()

    expect(input.element.getAttribute('autocomplete')).toBe('off')
  })

  it('should have explicit tabindex passed through when autocomplete', () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        tabindex: 10
      }
    })

    expect(wrapper.vm.$refs.input.tabIndex).toBe(10)
    expect(wrapper.vm.$el.tabIndex).toBe(-1)
  })

  it('should emit search input changes', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
      }
    })

    const input = wrapper.first('input')

    const update = jest.fn()
    wrapper.vm.$on('update:searchInput', update)

    input.element.value = 'test'
    input.trigger('input')

    await wrapper.vm.$nextTick()

    expect(update).toBeCalledWith('test')
  })

  it('should filter autocomplete search results', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: { items: ['foo', 'bar'] }
    })

    wrapper.setData({ internalSearch: 'foo' })

    expect(wrapper.vm.filteredItems).toHaveLength(1)
    expect(wrapper.vm.filteredItems[0]).toBe('foo')
  })

  it('should filter numeric primitives', () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        items: [1, 2]
      }
    })

    wrapper.setData({ internalSearch: 1 })

    expect(wrapper.vm.filteredItems).toHaveLength(1)
    expect(wrapper.vm.filteredItems[0]).toBe(1)
  })

  it('should activate when search changes and not active', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        items: [1, 2, 3, 4],
        multiple: true
      }
    })

    wrapper.vm.isMenuActive = true
    await wrapper.vm.$nextTick()
    wrapper.setData({ internalSearch: 2 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should set searchValue to null when deactivated', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        items: [1, 2, 3, 4],
        multiple: true
      }
    })

    wrapper.setData({
      isMenuActive: true,
      internalSearch: 2
    })
    await wrapper.vm.$nextTick()
    wrapper.setData({ isMenuActive: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalSearch).toBe(null)
  })

  it('should render role=combobox correctly when autocomplete', async () => {
    const wrapper = shallow(VAutocomplete)

    expect(wrapper.vm.$el.getAttribute('role')).toBeFalsy()

    const input = wrapper.first('input')
    expect(input.element.getAttribute('role')).toBe('combobox')
  })

  it('should not duplicate items after items update when caching is turned on', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        cacheItems: true,
        returnObject: true,
        itemText: 'text',
        itemValue: 'id',
        items: [],
      }
    })

    wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
    wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
  })

  it('should not display list with no items and autocomplete', async () => {
    const wrapper = shallow(VAutocomplete)

    const input = wrapper.first('input')

    input.trigger('click')

    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should cache items', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: { cacheItems: true }
    })

    wrapper.setProps({ items: ['bar', 'baz'] })
    expect(wrapper.vm.computedItems).toHaveLength(2)

    wrapper.setProps({ items: ['foo'] })
    expect(wrapper.vm.computedItems).toHaveLength(3)

    wrapper.setProps({ items: ['bar'] })
    expect(wrapper.vm.computedItems).toHaveLength(3)
  })

  it('should cache items passed via prop', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        cacheItems: true,
        items: [1, 2, 3, 4]
      }
    })

    expect(wrapper.vm.computedItems).toHaveLength(4)

    wrapper.setProps({ items: [5] })

    expect(wrapper.vm.computedItems).toHaveLength(5)
  })

  it('should show input when focused and autocomplete', async () => {
    const wrapper = shallow(VAutocomplete)

    const input = wrapper.first('input')

    expect(input.hasStyle('display', 'none'))

    wrapper.trigger('focus')

    expect(input.hasStyle('display', 'block'))
  })

  it('should not filter text with no items', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        items: ['foo', 'bar']
      }
    })

    wrapper.setProps({ searchInput: 'asdf' })

    // Wait for watcher
    await wrapper.vm.$nextTick()

    const tile = wrapper.first('.v-list__tile__title')

    expect(tile.text()).toBe('No data available')
  })

  it('should not display menu when tab focused', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: {
        items: [1 ,2],
        value: 1
      }
    })

    const input = wrapper.first('input')
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    wrapper.setProps({
      items: [
        { text: 'Foo', value: 1 },
        { text: 'Bar', value: 2 }
      ]
    })

    input.trigger('blur')
    await wrapper.vm.$nextTick()

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should emit custom value on blur', async () => {
    const wrapper = shallow(VAutocomplete, {
      propsData: { combobox: true }
    })

    const input = wrapper.first('input')

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    input.element.value = 'foo'
    input.trigger('input')

    await wrapper.vm.$nextTick()

    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledWith('foo')
  })
})
