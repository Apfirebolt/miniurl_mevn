<template>
  <header-component />
  <section class="bg-white shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-3xl my-5 text-center text-red-800">DASHBOARD</h2>
      <p>
        Futura is an expense tracker app that helps you keep track of your
        expenses. It is a simple and easy to use app that helps you manage your
        expenses and keep track of your spending. You can add, edit and delete
        expenses, view your expenses by category, and view your expenses by
        month.
      </p>
      <p class="mt-4">
        The app is built using Vue.js, Tailwind CSS, and Express. It is a single
        page application that uses Express back-end for authentication and
        MongoDB for data storage. The app is responsive and works on desktop,
        tablet, and mobile devices.
      </p>

      <div class="mt-8">
        <button
          @click="openUrlModal"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Url
        </button>
      </div>
    </div>
  </section>
  <TransitionRoot appear :show="isUrlModalOpened" as="template">
    <Dialog as="div" @close="closeUrlModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="mt-2">
                <UrlForm
                  @add-url-action="addUrlActionUtil"
                  @close-modal="closeUrlModal"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot appear :show="isConfirmModalOpened" as="template">
    <Dialog as="div" @close="closeConfirmModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="mt-2">
                <ConfirmModal
                  @confirm-action="confirmDelete"
                  :message="deleteMessage"
                  @close-modal="closeConfirmModal"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import AOS from "aos";
import {
  Dialog,
  TransitionChild,
  TransitionRoot,
  DialogPanel,
} from "@headlessui/vue";
import { useAuth } from "../store/auth";
import { useUrlStore } from "../store/url";
import UrlForm from "../components/UrlForm.vue";
import ConfirmModal from "../components/Confirm.vue";

const auth = useAuth();
const url = useUrlStore();
const isUrlModalOpened = ref(false);
const isConfirmModalOpened = ref(false);
const deleteMessage = ref("");
const selectedUrl = ref(null);

const allUrls = computed(() => url.getUrls);
const authData = computed(() => auth.getAuthData);

const closeUrlModal = () => {
  isUrlModalOpened.value = false;
};

const openUrlModal = () => {
  isUrlModalOpened.value = true;
};

const openConfirmModal = () => {
  isConfirmModalOpened.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpened.value = false;
};

const confirmDelete = async () => {
  await url.deleteUrl(selectedUrl.value._id);
  closeConfirmModal();
};

const addUrlActionUtil = async (urlData) => {
  await url.addUrl(urlData);
  closeUrlModal();
};

onMounted(async () => {
  AOS.init();
  await url.getUrlsAction();
});
</script>
