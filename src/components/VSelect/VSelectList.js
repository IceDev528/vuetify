// Components
import VCard from '../VCard'
import VCheckbox from '../VCheckbox'
import VDivider from '../VDivider'
import VSubheader from '../VSubheader'
import {
  VList,
  VListTile,
  VListTileAction,
  VListTileContent,
  VListTileTitle
} from '../VList'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Helpers
import {
  escapeHTML,
  getObjectValueByPath
} from '../../util/helpers'

export default {
  name: 'v-select-list',

  mixins: [
    Colorable,
    Themeable
  ],

  props: {
    action: Boolean,
    dense: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    itemAvatar: {
      type: String,
      default: 'avatar'
    },
    itemDisabled: {
      type: String,
      default: 'disabled'
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    noDataText: String,
    searchInput: String,
    selectedItems: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    tileActiveClass () {
      return Object.keys(this.addTextColorClassChecks()).join(' ')
    }
  },

  methods: {
    genAction (item, inputValue) {
      const data = {
        on: {
          click: e => {
            e.stopPropagation()
            this.$emit('select', item)
          }
        }
      }

      return this.$createElement(VListTileAction, data, [
        this.$createElement(VCheckbox, {
          props: {
            color: this.computedColor,
            inputValue
          }
        })
      ])
    },
    genDivider (props) {
      return this.$createElement(VDivider, { props })
    },
    genFilteredText (text) {
      text = (text || '').toString()

      if (!this.searchInput) return escapeHTML(text)

      const { start, middle, end } = this.getMaskedCharacters(text)

      return `${escapeHTML(start)}${this.genHighlight(middle)}${escapeHTML(end)}`
    },
    genHeader (props) {
      return this.$createElement(VSubheader, { props }, props.header)
    },
    genHighlight (text) {
      if (this.isNotFiltering) return escapeHTML(text)

      return `<span class="v-list__tile__mask">${escapeHTML(text)}</span>`
    },
    getMaskedCharacters (text) {
      const searchInput = (this.searchInput || '').toString().toLowerCase()
      const index = text.toLowerCase().indexOf(searchInput)

      if (index < 0) return { start: '', middle: text, end: '' }

      const start = text.slice(0, index)
      const middle = text.slice(index, index + searchInput.length)
      const end = text.slice(index + searchInput.length)
      return { start, middle, end }
    },
    genTile (
      item,
      disabled,
      avatar = false,
      value = this.selectedItems.indexOf(item) !== -1
    ) {
      if (item === Object(item)) {
        avatar = !!this.getAvatar(item)
        disabled = disabled != null
          ? disabled
          : this.getDisabled(item)
      }

      const tile = {
        on: {
          click: () => disabled || this.$emit('select', item)
        },
        props: {
          activeClass: this.tileActiveClass,
          avatar,
          disabled,
          ripple: true,
          value
        }
      }

      if (!this.$scopedSlots.item) {
        return this.$createElement(VListTile, tile, [
          this.action ? this.genAction(item, value) : null,
          this.genTileContent(item)
        ])
      }

      const parent = this
      const scopedSlot = this.$scopedSlots.item({ parent, item, tile })

      return this.needsTile(scopedSlot)
        ? this.$createElement(VListTile, tile, [scopedSlot])
        : scopedSlot
    },
    genTileContent (item) {
      const innerHTML = this.genFilteredText(this.getText(item))

      return this.$createElement(VListTileContent,
        [this.$createElement(VListTileTitle, {
          domProps: { innerHTML }
        })]
      )
    },
    needsTile (tile) {
      return tile.componentOptions == null ||
        tile.componentOptions.Ctor.options.name !== 'v-list-tile'
    },
    getAvatar (item) {
      return getObjectValueByPath(item, this.itemAvatar)
    },
    getDisabled (item) {
      return getObjectValueByPath(item, this.itemDisabled)
    },
    getText (item) {
      return this.getPropertyFromItem(item, this.itemText)
    },
    getValue (item) {
      return this.getPropertyFromItem(item, this.itemValue)
    },
    getPropertyFromItem (item, field) {
      if (item !== Object(item)) return item

      const value = getObjectValueByPath(item, field)

      return typeof value === 'undefined' ? item : value
    }
  },

  render () {
    const children = this.items.map(o => {
      if (o.header) return this.genHeader(o)
      if (o.divider) return this.genDivider(o)
      else return this.genTile(o)
    })

    if (!children.length) {
      const noData = this.$slots['no-data']
      if (noData) {
        children.push(noData)
      } else {
        children.push(this.genTile(this.noDataText, true))
      }
    }

    return this.$createElement(VCard, {
      staticClass: 'v-select-list',
      props: {
        dark: this.dark,
        light: this.light
      }
    }, [
      this.$createElement(VList, {
        props: {
          dense: this.dense
        }
      }, children)
    ])
  }
}
