<template>
  <div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold py-2">
        Add Url
      </h2>
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full text-jet-black">
      <div class="bg-white p-4 shadow sm:px-10">
        <form class="space-y-6" @submit="handleSubmit">
          <div>
            <label
              for="originalUrl"
              class="block text-sm font-medium text-gray-700"
            >
              Enter Url
            </label>
            <div class="mt-1">
              <input
                id="originalUrl"
                name="originalUrl"
                v-model="originalUrl"
                type="text"
                required=""
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex justify-center">
            <button
              type="submit"
              class="py-2 mr-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-dark-slate-grey text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Url
            </button>

            <button
              @click="closeModalUtil"
              class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-jet-black text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const originalUrl = ref("");
const emits = defineEmits(["addUrlAction", "closeModal"]);

const handleSubmit = async (e) => {
  e.preventDefault();
  let payload = {
    originalUrl: originalUrl.value,
  };
  emits("addUrlAction", payload);
};

const closeModalUtil = () => {
  originalUrl.value = "";

  emits("closeModal");
};
</script>