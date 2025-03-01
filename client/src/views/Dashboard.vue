<template>
    <header-component />
    <section class="bg-white shadow sm:rounded-lg" id="about">
        <div class="px-4 py-5 sm:p-6">
            <h2 class="text-3xl my-5 text-center text-red-800">DASHBOARD</h2>
            <p>
                Futura is an expense tracker app that helps you keep track of your expenses. It is a simple and easy to use
                app that helps you manage your expenses and keep track of your spending. You can add, edit and delete
                expenses, view your expenses by category, and view your expenses by month.
            </p>
            <p class="mt-4">
                The app is built using Vue.js, Tailwind CSS, and Express. It is a single page application that uses
                Express back-end for authentication and MongoDB for data storage. The app is responsive and works on desktop,
                tablet, and mobile devices.
            </p>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '../store/auth';
const auth = useAuth();

onMounted(async () => {
    await auth.getProfileData();
});
</script>