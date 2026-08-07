<template>
  <div class="p-6 sm:p-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-white">Shorten New URL</h2>
          <p class="text-xs text-slate-400">Transform long links into compact shareable short links.</p>
        </div>
      </div>

      <!-- Close Icon Button -->
      <button 
        type="button" 
        @click="closeModalUtil"
        class="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 p-2 rounded-xl transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label for="originalUrl" class="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Original URL <span class="text-amber-400">*</span>
        </label>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
            </svg>
          </div>
          
          <input
            id="originalUrl"
            name="originalUrl"
            v-model="originalUrl"
            type="url"
            required
            placeholder="https://example.com/very/long/destination/url"
            class="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          @click="closeModalUtil"
          class="px-5 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl border border-slate-600/50 transition-all duration-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center gap-2"
        >
          <span>Shorten Link</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const originalUrl = ref("");
const emits = defineEmits(["addUrlAction", "closeModal"]);

const handleSubmit = () => {
  if (!originalUrl.value.trim()) return;
  const payload = {
    originalUrl: originalUrl.value.trim(),
  };
  emits("addUrlAction", payload);
};

const closeModalUtil = () => {
  originalUrl.value = "";
  emits("closeModal");
};
</script>