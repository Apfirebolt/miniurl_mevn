<template>
  <section class="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8" id="about">
    <div class="max-w-7xl mx-auto space-y-10">

      <!-- Header Banner & Action -->
      <header class="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            URL Shortener Workspace
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, 
            <span v-if="authData" class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              {{ authData.username }}
            </span>
            <span v-else>User</span>!
          </h1>
          <p class="text-slate-400 text-sm sm:text-base max-w-xl">
            Manage your shortened links, track engagement analytics, and create new links in seconds.
          </p>
        </div>

        <button
          @click="openUrlModal"
          class="shrink-0 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Create Short URL</span>
        </button>
      </header>

      <!-- URL Grid Section -->
      <div v-if="allUrls && allUrls.data && allUrls.data.length" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>Your Links</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              {{ allUrls.data.length }} Active
            </span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="urlItem in allUrls.data"
            :key="urlItem._id"
            class="group bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between"
          >
            <!-- Card Header -->
            <div class="p-5 space-y-4">
              <!-- Clicks Badge & Code -->
              <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  /{{ urlItem.urlCode }}
                </span>
                <div class="flex items-center gap-1.5 text-slate-300 text-xs font-medium bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/50">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>{{ urlItem.count }} Clicks</span>
                </div>
              </div>

              <!-- Original URL -->
              <div class="space-y-1">
                <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Destination</span>
                <p class="text-slate-200 text-sm font-medium line-clamp-2 break-all bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 select-all">
                  {{ urlItem.originalUrl }}
                </p>
              </div>
            </div>

            <!-- Card Actions Footer -->
            <div class="px-5 py-3.5 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-between gap-2">
              <button
                @click="copyToClipboard(urlItem.urlCode)"
                class="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                title="Copy Short Code"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span>{{ copiedCode === urlItem.urlCode ? 'Copied!' : 'Copy Code' }}</span>
              </button>

              <div class="flex items-center gap-2">
                <button
                  @click="openUrlInNewTab(urlItem)"
                  class="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                >
                  <span>Visit</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </button>

                <button
                  @click="openConfirmModal(urlItem)"
                  class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete URL"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Empty Links State -->
      <div v-else class="text-center py-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl max-w-md mx-auto">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/50 text-slate-400 mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-200">No URLs created yet</h3>
        <p class="text-sm text-slate-400 mt-1">Add your first URL above to start tracking link analytics.</p>
      </div>

      <!-- Analytics Dashboard Section -->
      <div v-if="allUrls && allUrls.data && allUrls.data.length" class="space-y-6 pt-6 border-t border-slate-800">
        <div class="text-center space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analytics Overview
          </h2>
          <p class="text-sm text-slate-400 max-w-lg mx-auto">
            Visual breakdown of click counts, trends, and distributions across all shortenings.
          </p>
        </div>

        <!-- Chart Grid -->
        <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          <!-- Primary Chart -->
          <div class="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
            <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              Click Statistics
            </h3>
            <div class="h-64 sm:h-80 relative">
              <Bar id="count-charts" :options="chartOptions" :data="chartData" />
            </div>
          </div>

          <!-- Secondary Grid Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
              <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                Trend Analysis
              </h3>
              <div class="h-60 relative">
                <Line id="count-charts-line" :options="chartOptions" :data="chartData" />
              </div>
            </div>

            <div class="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
              <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                Distribution
              </h3>
              <div class="h-60 relative flex justify-center">
                <Doughnut id="count-charts-doughnut" :options="pieChartOptions" :data="chartData" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Pagination -->
    <div class="mt-8 max-w-7xl mx-auto">
      <Pagination
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        :allUrls="allUrls"
        :currentPage="currentPage"
        :numberOfItemsPerPage="numberOfItemsPerPage"
      />
    </div>
  </section>

  <!-- URL Form Modal -->
  <TransitionRoot appear :show="isUrlModalOpened" as="template">
    <Dialog as="div" @close="closeUrlModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-xl bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
              <UrlForm
                @add-url-action="addUrlActionUtil"
                @close-modal="closeUrlModal"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Confirm Delete Modal -->
  <TransitionRoot appear :show="isConfirmModalOpened" as="template">
    <Dialog as="div" @close="closeConfirmModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
              <ConfirmModal
                @confirm-action="confirmDelete"
                :message="deleteMessage"
                @close-modal="closeConfirmModal"
              />
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
import { Bar, Line, Doughnut } from "vue-chartjs";
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
const copiedCode = ref(null);

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
          "#fbbf24", // Amber 400
          "#f59e0b", // Amber 500
          "#38bdf8", // Sky 400
          "#818cf8", // Indigo 400
          "#34d399", // Emerald 400
        ],
        borderColor: "#1e293b",
        borderWidth: 2,
        label: "Clicks",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#f8fafc",
      bodyColor: "#fbbf24",
      borderColor: "#334155",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(51, 65, 85, 0.4)" },
      ticks: { color: "#94a3b8" },
    },
    y: {
      grid: { color: "rgba(51, 65, 85, 0.4)" },
      ticks: { color: "#94a3b8" },
    },
  },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#94a3b8" },
    },
  },
};

const copyToClipboard = (code) => {
  navigator.clipboard.writeText(code);
  copiedCode.value = code;
  setTimeout(() => {
    copiedCode.value = null;
  }, 2000);
};

const closeUrlModal = () => {
  isUrlModalOpened.value = false;
};

const openUrlModal = () => {
  isUrlModalOpened.value = true;
};

const openConfirmModal = (urlItem) => {
  selectedUrl.value = urlItem;
  deleteMessage.value = `Are you sure you want to delete ${urlItem.originalUrl}?`;
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>