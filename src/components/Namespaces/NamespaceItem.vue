<template>
  <b-card
    no-body
    class="namespace-item h-100 shadow-sm mb-4"
    :class="{ 'shadow': hovered }"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <b-card-img
      v-if="namespace.meta.logoEnabled"
      :src="logo"
      :alt="namespace.name"
      class="p-2"
    />

    <b-card-body
      class="mw-100"
      :class="{ 'pb-0': showFooter }"
    >
      <div
        class="d-flex align-items-center"
        :class="{ 'h-100': !namespace.meta.description }"
      >
        <div
          class="d-flex flex-column justify-content-center w-100"
        >
          <h5
            class="mb-0 mw-100"
          >
            {{ namespace.name }}
          </h5>
          <p
            v-if="namespace.meta.subtitle"
            class="d-inline-block mb-0 mt-1"
          >
            {{ namespace.meta.subtitle }}
          </p>
        </div>
      </div>

      <p
        v-if="namespace.meta.description"
        class="overflow-auto mb-0 mt-2"
      >
        <small>{{ namespace.meta.description }}</small>
      </p>
    </b-card-body>

    <b-card-footer
      v-if="showFooter"
      footer-bg-variant="white"
    >
      <b-button-group
        class="d-flex mt-2"
      >
        <b-button
          v-if="isEnabled"
          :to="{ name: 'pages', params: { slug: (namespace.slug || namespace.namespaceID) } }"
          :aria-label="$t('visit') + ' ' + namespace.name"
          variant="light"
        >
          {{ $t('visit') }}
        </b-button>
        <b-button
          v-if="canEdit"
          :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }"
          :aria-label="$t('edit') + ' ' + namespace.name"
          variant="light"
          class="d-flex align-items-center justify-content-center ml-2"
        >
          {{ $t('general:label.edit') }}
        </b-button>
      </b-button-group>
    </b-card-footer>
  </b-card>
</template>
<script>
import logo from 'corteza-webapp-compose/src/themes/corteza-base/img/logo.png'

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  props: {
    namespace: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      processing: false,
      hovered: undefined,
      logoAttachment: undefined,
    }
  },

  computed: {
    isEnabled () {
      return !!this.namespace.enabled
    },

    canEdit () {
      return !!this.namespace.canUpdateNamespace
    },

    showFooter () {
      return this.isEnabled || this.canEdit
    },

    logo () {
      return this.namespace.meta.logo || this.$Settings.attachment('ui.mainLogo', logo)
    },
  },
}
</script>

<style lang="scss" scoped>
.namespace-item {
  top: 0;

  &:hover {
    transition: all 0.2s ease;
    top: -1px;
  }
}
</style>
