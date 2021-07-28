<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    @register="register"
    :helpMessage="['提示1', '提示2']"
  >
    Modal Info.
  </BasicModal>
</template>

<script lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const [register, { closeModal, setModalProps }] = useModalInner();
      return {
        register,
        closeModal,
        setModalProps: () => {
          setModalProps({ title: 'Modal New Title' });
        },
      };
    },
  });
</script>
