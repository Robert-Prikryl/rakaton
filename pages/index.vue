<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center text-white p-8">
    <div class="text-center mb-12">
      <h1 class="text-8xl font-bold mb-4 text-center animate-fade-in">
        <span class="mr-4">🧬</span>
        <span class="text-white">Rakaton</span>
      </h1>
    </div>
    <h2 class="text-2xl font-medium text-pink-300 animate-fade-in mb-12" style="animation-delay: 0.3s">Dream Team</h2>
    <div class="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 text-center">
      <div class="group">
        <p class="text-3xl font-medium transition-all duration-300 name-text">
          Peter Hubina
        </p>
      </div>
      <div class="group">
        <p class="text-3xl font-medium transition-all duration-300 name-text">
          Robert Prikryl
        </p>
      </div>
      <div class="group">
        <p class="text-3xl font-medium transition-all duration-300 name-text">
          Patrik Kozlik
        </p>
      </div>
      <div class="group">
        <p class="text-3xl font-medium transition-all duration-300 name-text">
          Tomas Majernik
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Component logic can be added here if needed
definePageMeta({
  colorMode: "light",
});
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes highlightName {
  0%, 100% {
    color: white;
    transform: scale(1);
  }
  25% {
    color: #ec4899;
    transform: scale(1.3);
  }
  50% {
    color: white;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.name-text {
  animation: highlightName 12s infinite;
}

.group:nth-child(1) .name-text { animation-delay: 0s; }
.group:nth-child(2) .name-text { animation-delay: 3s; }
.group:nth-child(3) .name-text { animation-delay: 6s; }
.group:nth-child(4) .name-text { animation-delay: 9s; }

.group {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.group:nth-child(1) { animation-delay: 0.2s; }
.group:nth-child(2) { animation-delay: 0.4s; }
.group:nth-child(3) { animation-delay: 0.6s; }
.group:nth-child(4) { animation-delay: 0.8s; }
</style>