<template>
  <section class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black">DASHBOARD</h2>
      <div class="flex flex-col items-center bg-gray-100 p-4 rounded-md">
        <p>
          Welcome to the dashboard,
          <span v-if="authData" class="text-lg font-semibold text-gray-700">
            {{ authData.username }}
          </span>
          Here you can add, view, and delete urls.
        </p>
        <div class="mt-2">
          <button
            @click="openUrlModal"
            class="py-2 text-sm px-4 border border-transparent rounded-md shadow-sm font-medium bg-cadet-grey hover:cursor-pointer text-white"
          >
            Add Url
          </button>
        </div>
      </div>

      <div
        v-if="allUrls && allUrls.data && allUrls.data.length"
        class="mt-8 container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div
          v-for="urlItem in allUrls.data"
          :key="urlItem._id"
          class="bg-dark-slate-grey text-white shadow-md rounded-lg"
        >
          <div class="text-lg my-2 flex justify-between px-4 py-2">
            <p>
              Original Url
            </p>
             <p>
              {{ urlItem.originalUrl }}
             </p>
          </div>
          <div class="text-lg my-2 flex justify-between px-4 py-2">
            <p>
              Tiny Url
            </p>
             <p>
              {{ urlItem.urlCode }}
             </p>
          </div>
          <div class="text-lg my-2 flex justify-between px-4 py-2">
            <p>
              Clicks
            </p>
             <p>
              {{ urlItem.count }}
             </p>
          </div>
          
            <div class="mt-2 flex px-4 py-2 justify-center">
            <button
              @click="() => openUrlInNewTab(urlItem)"
              class="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cadet-grey hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
            >
              View
            </button>
            <button
              @click="() => openConfirmModal(urlItem)"
              class="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jet-black hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            </div>
        </div>
      </div>

      <div v-else class="mt-8 text-center text-gray-600">No urls found</div>

      <div v-if="allUrls && allUrls.data && allUrls.data.length" class="mt-4 mx-auto container">
        <h3 class="text-2xl text-center text-gray-800 mb-4 bg-neutral-100 py-2">
          Analytics
        </h3>
        <div class="bg-white shadow-md rounded-lg p-4">
          <Bar id="count-charts" :options="chartOptions" :data="chartData" />
            <div class="flex justify-between">
              <div class="w-1/2">
                <Line
                id="count-charts-line"
                :options="chartOptions"
                :data="chartData"
                />
              </div>
              <div class="w-1/2">
                <Pie
                id="count-charts-pie"
                :options="chartOptions"
                :data="chartData"
                />
              </div>
            </div>
            <div class="flex justify-between">
              <div class="w-1/2">
                <Doughnut
                id="count-charts-doughnut"
                :options="chartOptions"
                :data="chartData"
                />
              </div>
              <div class="w-1/2">
                <Bubble
                id="count-charts-bubble"
                :options="chartOptions"
                :data="chartData"
                />
              </div>
            </div>
        </div>
      </div>
      <div v-else class="mt-8 text-center text-gray-600">No urls found, please add urls to view analytical charts.</div>

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
              class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-light-blue text-left align-middle shadow-xl transition-all"
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-light-blue text-left align-middle shadow-xl transition-all"
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
// import vue-chart-3 chart.js
import { Bar, Pie, Line, Doughnut, Bubble } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement
);

const chartData = computed(() => {
  return {
    labels:
      allUrls.value && allUrls.value.data
        ? allUrls.value.data.map((urlItem) => {
        const match = urlItem.originalUrl.match(/https?:\/\/(www\.)?([^\/.]+)\./);
        return match ? match[2] : urlItem.urlCode;
          })
        : [],
    datasets: [
      {
        data:
          allUrls.value && allUrls.value.data
            ? allUrls.value.data.map((urlItem) => urlItem.count)
            : [],
        backgroundColor: [
          "#B8DBD9", // Light Blue
          "#F4F4F9", // Ghost Grey
          "#586F7C", // Cadet Grey
          "#2F4550", // Dark Slate Grey
          "#333333", // Jet Black
        ], // Array of colors
        borderColor: "#f9f9f9",
        label: "Clicks",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "Tiny Url",
      },
    },
    y: {
      title: {
        display: true,
        text: "Clicks",
      },
    },
  },
  Legend: {
    display: false,
  },

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
  await url.getUrlsAction(currentPage.value);
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
    await url.getUrlsAction(currentPage.value);
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
