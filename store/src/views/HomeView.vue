<script setup>
import { computed } from 'vue';
import { useFeedStore } from '@/stores/feed';
import Notices from '@/components/sections/Notices.vue';
import Navbar from '@/components/sections/Navbar.vue';
import CategoriesBar from '@/components/sections/CategoriesBar.vue';
import ImageSlider from '@/components/sections/ImageSlider.vue';
import Products from '@/components/sections/Products.vue';
import Category from '@/components/sections/Category.vue';
import CategorySlider from '@/components/sections/CategorySlider.vue';
import Footer from '@/components/sections/Footer.vue';

const feedStore = useFeedStore()

const sections = computed(() =>
  feedStore.feed.filter(
    (section) =>
      section.type !== 'notice' &&
      section.type !== 'navbar' &&
      section.type !== 'categories_bar'
  )
)
</script>

<template>
  <!-- You can use the filtered sections here -->
  <div v-for="section in sections" :key="section.id">
    <Notices :id="section.id" v-if="section.type === 'notice'" />
    <Navbar :id="section.id" v-if="section.type === 'navbar'" />
    <CategoriesBar :id="section.id" v-if="section.type === 'categories_bar'" />
    <ImageSlider :id="section.id" v-if="section.type === 'image_slider'" />
    <Products :id="section.id" v-if="section.type === 'products'" />
    <Category :id="section.id" v-if="section.type === 'category'" />
    <CategorySlider :id="section.id" v-if="section.type === 'categories_slider'" />
    <Footer :id="section.id" v-if="section.type === 'footer'" />
  </div>
</template>