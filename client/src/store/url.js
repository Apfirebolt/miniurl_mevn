import { defineStore } from "pinia";
import { ref } from "vue";
import httpClient from "../plugins/interceptor";
import { useAuth } from "./auth";
import { useToast } from "vue-toastification";

const toast = useToast();
const auth = useAuth();

export const useUrlStore = defineStore("url", {
  state: () => ({
    url: ref({}),
    urls: ref([]),
    loading: ref(false),
  }),

  getters: {
    getUrl() {
      return this.url;
    },
    getUrls() {
      return this.urls;
    },
    isLoading() {
      return this.loading;
    },
  },

  actions: {
    async addUrl(urlData) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        const response = await httpClient.post("url", urlData, {
          headers,
        });
        if (response.status === 201) {
            toast.success("URL added!");
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    async getUrlAction(urlId) {
      try {
        const response = await httpClient.get("url/" + urlId);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },

    async getUrlsAction(page = 1) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        const response = await httpClient.get("url?page=" + page, {
          headers,
        });
        this.urls = response.data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    async deleteUrl(urlId) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        const response = await httpClient.delete("url/" + urlId, {
          headers,
        });
        if (response.status === 200) {
            toast.success("URL deleted!");
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    resetUrlData() {
      this.url = {};
      this.urls = [];
    },
  },
});
