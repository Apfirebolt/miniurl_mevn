<template>
  <section class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5">
      <h2
        class="text-4xl font-bold my-4 py-3 text-center text-jet-black"
      >
        DASHBOARD
      </h2>
      <div
        class="flex flex-col items-center bg-gradient-to-br text-dark from-primary to-secondary p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <p class="text-center leading-relaxed">
          Welcome to the dashboard,
          <span
            v-if="authData"
            class="text-lg font-bold bg-dark bg-clip-text"
          >
            {{ authData.username }}
          </span>
          Here you can add, view, and delete urls.
        </p>
        <div class="mt-4">
          <button
            @click="openUrlModal"
            class="py-3 px-6 text-sm font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cadet-grey focus:ring-offset-2"
          >
            Add Url
          </button>
        </div>
      </div>

      <div
        v-if="allUrls && allUrls.data && allUrls.data.length"
        class="mt-8 container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="urlItem in allUrls.data"
          :key="urlItem._id"
          class="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        >
          <div
            class="bg-gradient-to-r from-cadet-grey to-dark-slate-grey px-6 py-4"
          >
            <h3 class="font-semibold text-lg">URL Details</h3>
          </div>

          <div class="px-6 py-4 space-y-4">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500 mb-1"
                >Original URL</span
              >
              <p
                class="text-gray-800 text-sm break-all bg-gray-50 px-3 py-2 rounded-md"
              >
                {{ urlItem.originalUrl }}
              </p>
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500 mb-1"
                >Short Code</span
              >
              <p
                class="text-gray-800 font-mono text-sm bg-gray-50 px-3 py-2 rounded-md"
              >
                {{ urlItem.urlCode }}
              </p>
            </div>

            <div
              class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md"
            >
              <span class="text-sm font-medium text-gray-500"
                >Total Clicks</span
              >
              <span class="text-2xl font-bold text-cadet-grey">
                {{ urlItem.count }}
              </span>
            </div>
          </div>

          <div
            class="px-6 py-4 bg-gray-50 flex gap-3 justify-end border-t border-gray-200"
          >
            <button
              @click="() => openUrlInNewTab(urlItem)"
              class="px-4 py-2 bg-cadet-grey hover:bg-opacity-90 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cadet-grey focus:ring-offset-2"
            >
              Open URL
            </button>
            <button
              @click="() => openConfirmModal(urlItem)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="mt-8 text-center text-gray-600">No urls found</div>

      <div
        v-if="allUrls && allUrls.data && allUrls.data.length"
        class="mt-8 mx-auto container"
      >
        <h3 class="text-3xl font-bold text-center text-jet-black mb-6 py-3">
          Analytics Dashboard
        </h3>
        <div class="bg-white shadow-lg rounded-xl p-6 space-y-8">
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">
              Click Statistics
            </h4>
            <Bar id="count-charts" :options="chartOptions" :data="chartData" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-700 mb-4">
                Trend Analysis
              </h4>
              <Line
                id="count-charts-line"
                :options="chartOptions"
                :data="chartData"
              />
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-700 mb-4">
                Distribution
              </h4>
              <Pie
                id="count-charts-pie"
                :options="chartOptions"
                :data="chartData"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-700 mb-4">
                Click Proportion
              </h4>
              <Doughnut
                id="count-charts-doughnut"
                :options="chartOptions"
                :data="chartData"
              />
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-700 mb-4">
                Data Visualization
              </h4>
              <Bubble
                id="count-charts-bubble"
                :options="chartOptions"
                :data="chartData"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-8 text-center text-gray-600">
        No urls found, please add urls to view analytical charts.
      </div>
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
            const match = urlItem.originalUrl.match(
              /https?:\/\/(www\.)?([^\/.]+)\./
            );
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
