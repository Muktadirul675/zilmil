<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-center text-gray-200 px-4">
    <!-- Logo -->
    <a href="/" class="mb-6">
      <img
        src="/logo.png"
        alt="Logo"
        class="h-16 w-auto mx-auto opacity-90 hover:opacity-100 transition"
      />
    </a>

    <!-- 404 Content -->
    <h1 class="text-7xl font-extrabold text-white mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-3">Page Not Found</h2>
    <p class="text-gray-400 mb-8 max-w-md">
      The page you're looking for doesn't exit or has been removed<br />
      If this was unexpected, please <a href="/contact" class="text-blue-400 hover:underline">contact us</a>.
    </p>

    <!-- Action buttons -->
    <div class="flex gap-4">
      <a
        href="/"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all"
      >
        Go Home
      </a>
      <a
        href="/contact"
        class="border border-gray-500 hover:border-blue-500 text-gray-300 hover:text-blue-400 px-6 py-3 rounded-xl transition-all"
      >
        Contact Support
      </a>
    </div>
  </div>
</template>

<script setup>
// No script needed â purely presentational
</script>

<style scoped>
/* Optional subtle glow for the 404 number */
h1 {
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}
</style>