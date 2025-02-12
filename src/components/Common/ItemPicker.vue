<template>
  <fieldset class="form-group">
    <div class="items d-flex">
      <div class="available">
        <slot name="label-available" />
        <b-button
          variant="link"
          class="float-right"
          @click.prevent="selectedItems = [...allItems]"
        >
          <slot name="label-selectAll" />
        </b-button>

        <draggable
          class="drag-area border"
          :list.sync="availableItems"
          :options="{ group: 'items', sort: false }"
        >
          <div
            v-for="item in availableItems"
            :key="item[keyProp]"
            class="item"
            @dblclick="selectedItems.push(item)"
          >
            <slot
              :item="item"
              name="item"
            />
          </div>
        </draggable>
      </div>

      <div class="selected">
        <slot name="label-selected" />
        <b-button
          variant="link"
          class="float-right"
          @click.prevent="selectedItems.splice(0)"
        >
          <slot name="label-unSelectAll" />
        </b-button>

        <draggable
          class="drag-area border"
          :list.sync="selectedItems"
          :options="{ group:'items' }"
        >
          <div
            v-for="(item, index) in selectedItems"
            :key="item.name"
            class="item"
            @dblclick="selectedItems.splice(index,1)"
          >
            <slot
              :item="item"
              name="item"
            />
          </div>
        </draggable>
      </div>
    </div>

    <slot name="footnote" />
  </fieldset>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    keyProp: {
      type: String,
      required: true,
    },

    items: {
      type: Array,
      required: true,
      default: () => [],
    },

    selected: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  computed: {
    /**
     * Determines available items based on all available items & selected items
     */
    availableItems () {
      return this.items.filter(a => !this.selectedItems.find(b => a[this.keyProp] === b[this.keyProp]))
    },

    selectedItems: {
      get () {
        return this.selected
      },

      set (f) {
        this.$emit('update:selected', f)
      },
    },
  },
}
</script>
<style lang="scss" scoped>
div.items {
  flex-flow: row nowrap;

  .selected .field {
    cursor: pointer;
  }

  .available .field {
    cursor: e-resize;
  }

  & > div {
    flex: 1;
    margin: 5px;
    clear: both;

    button.btn-link {
      font-size: 90%;
    }

    .drag-area {
      height: 150px;
      overflow-x: auto;
      padding: 2px;
      width: 100%;
    }

    span.system {
      font-size: 80%;
    }
  }
}
</style>
