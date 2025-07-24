<script setup>
import 'primeicons/primeicons.css'
import { computed, onMounted } from 'vue';
import { useFeedStore } from './stores/feed';
import Notices from './components/sections/Notices.vue';
import Navbar from './components/sections/Navbar.vue';
import CategoriesBar from './components/sections/CategoriesBar.vue';

const feed = useFeedStore()

onMounted(()=>feed.fetchFeed())

const noticeSection = computed(() =>
  feed.feed.find((section) => section.type === 'notice')
)

const navbarSection = computed(() =>
  feed.feed.find((section) => section.type === 'navbar')
)

const categoriesBarSection = computed(() =>
  feed.feed.find((section) => section.type === 'categories_bar')
)
</script>

<template>
  <template v-if="noticeSection">
    <Notices :id="noticeSection.id"/>
  </template>
  <template v-if="navbarSection">
    <Navbar :id="navbarSection.id"/>
  </template>
  <template v-if="categoriesBarSection">
    <CategoriesBar :id="categoriesBarSection.id"/>
  </template>
  <RouterView />
</template>

