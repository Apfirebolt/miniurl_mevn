<template>
  <section class="bg-white shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-3xl my-5 text-center text-red-800">DASHBOARD</h2>
      <div class="flex flex-col items-center bg-gray-100 p-4 rounded-md">
        <p>
          Welcome to the dashboard,
          <span v-if="authData" class="text-lg font-semibold text-gray-700">
            {{ authData.username }}
          </span>
          Here you can add, view, and delete urls.
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

      <div
        v-if="allUrls && allUrls.data && allUrls.data.length"
        class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div
          v-for="urlItem in allUrls.data"
          :key="urlItem._id"
          class="bg-white shadow-md rounded-lg p-4"
        >
          <p class="text-lg text-gray-800 my-2">
            Original Url : {{ urlItem.originalUrl }}
          </p>
          <p class="text-lg text-gray-800 my-2">
            Tiny Url : {{ getTinyUrl(urlItem.urlCode) }}
          </p>
          <p class="text-md text-gray-800 my-2">Clicks : {{ urlItem.count }}</p>
          <div class="mt-4 flex justify-end">
            <button
              @click="() => openUrlInNewTab(urlItem)"
              class="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
            >
              View
            </button>
            <button
              @click="() => openConfirmModal(urlItem)"
              class="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="mt-8 text-center text-gray-600">No urls found</div>
    </div>
    <!-- Pagination -->
    <Pagination
      @goToPreviousPage="goToPreviousPage"
      @goToNextPage="goToNextPage"
      :allUrls="allUrls"
      :currentPage="currentPage"
      :numberOfItemsPerPage="numberOfItemsPerPage"
    />
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
import Pagination from "../components/Pagination.vue";

const auth = useAuth();
const url = useUrlStore();
const isUrlModalOpened = ref(false);
const isConfirmModalOpened = ref(false);
const deleteMessage = ref("");
const selectedUrl = ref(null);
const currentPage = ref(1);
const numberOfItemsPerPage = 5;

const allUrls = computed(() => url.getUrls);
const authData = computed(() => auth.getAuthData);

const getTinyUrl = (urlCode) => {
  return `https://tinyurl/${urlCode}`;
};

const closeUrlModal = () => {
  isUrlModalOpened.value = false;
};

const openUrlModal = () => {
  isUrlModalOpened.value = true;
};

const openConfirmModal = (url) => {
  selectedUrl.value = url;
  deleteMessage.value = `Are you sure you want to delete ${url.originalUrl}?`;
  isConfirmModalOpened.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpened.value = false;
};

const confirmDelete = async () => {
  await url.deleteUrl(selectedUrl.value._id);
  await url.getUrlsAction();
  closeConfirmModal();
};

const addUrlActionUtil = async (urlData) => {
  await url.addUrl(urlData);
  await url.getUrlsAction();
  closeUrlModal();
};

const openUrlInNewTab = async (urlItem) => {
  window.open(urlItem.originalUrl, "_blank");
  await url.incrementUrlCount(urlItem);
  // after 2 seconds refresh the urls
  setTimeout(async () => {
    await url.getUrlsAction();
  }, 2000);
};

const goToNextPage = async () => {
  if (currentPage.value < allUrls.value.lastPage) {
    currentPage.value += 1;
    await url.getUrlsAction(currentPage.value);
  }
};

const goToPreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    await url.getUrlsAction(currentPage.value);
  }
};

onMounted(async () => {
  AOS.init();
  await url.getUrlsAction();
});
</script>
