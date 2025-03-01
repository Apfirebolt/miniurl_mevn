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
        this.loading = true;
        const response = await httpClient.post("urls", urlData, {
          headers,
        });
        if (response.status === 201) {
          toast.success("URL added!");
        }
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },

    async getUrlAction(urlId) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        const response = await httpClient.get("urls/" + urlId, {
          headers,
        });
        this.url = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getUrlsAction(page = 1) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        this.loading = true;
        const response = await httpClient.get("urls?page=" + page, {
          headers,
        });
        this.urls = response.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUrl(urlId) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        this.loading = true;
        const response = await httpClient.delete("urls/" + urlId, {
          headers,
        });
        if (response.status === 200) {
          toast.success("URL deleted!");
        }
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },

    async incrementUrlCount(urlItem) {
      try {
        const headers = {
          Authorization: `Bearer ${auth.authData.token}`,
        };
        const response = await httpClient.patch("urls/" + urlItem._id + "/count", null, {
          headers,
        });
        this.url = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    resetUrlData() {
      this.url = {};
      this.urls = [];
    },
  },
});
