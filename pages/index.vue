<template>
  <div class="min-h-screen bg-seagull-300 flex flex-col items-center justify-center p-8">
    <div class="max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold mb-4">
          <span class="mr-4"></span>
          <span class="text-white">Rakaton</span>
        </h1>
        <p class="text-xl">Multidisciplinární onkologický systém</p>
      </div>

      <!-- Enhanced Role-specific content -->
      <div v-if="userRole === 'doctor'" class="space-y-8">
        <h2 class="text-2xl font-semibold mb-4">Vítejte, doktore</h2>
        
        <!-- Main Features -->
        <div class="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon="i-heroicons-user-group"
            title="Správa pacientů"
            description="Přístup k záznamům pacientů, jejich epikrízám a modalitám vyšetření"
          />
          <FeatureCard
            icon="i-heroicons-calendar"
            title="Schůzky"
            description="Plánování a účast na multidisciplinárních týmových setkáních"
          />
        </div>

        <!-- Detailed System Guide -->
        <div class="mt-8 space-y-6">
          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Práce s pacienty</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Přehled pacientů najdete v sekci "Pacienti"</li>
              <li>Pro každého pacienta můžete:
                <ul class="ml-6 mt-2 space-y-2 list-circle">
                  <li>Prohlížet a upravovat epikrízu</li>
                  <li>Přidávat výsledky vyšetření a modality</li>
                  <li>Sledovat historii léčby</li>
                </ul>
              </li>
            </ul>
          </section>

          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Správa schůzek</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>V sekci "Schůzky" můžete:
                <ul class="ml-6 mt-2 space-y-2 list-circle">
                  <li>Vytvářet nové schůzky multidisciplinárního týmu</li>
                  <li>Přidávat účastníky ze seznamu doktorů</li>
                  <li>Nahrávat dokumentaci k případům</li>
                  <li>Nastavit notifikace před začátkem schůzky</li>
                </ul>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div v-else-if="userRole === 'manager'" class="space-y-8">
        <h2 class="text-2xl font-semibold mb-4">Manažerský přehled</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon="i-heroicons-presentation-chart-line"
            title="Statistiky"
            description="Přehled výkonnosti a analytické nástroje"
          />
          <FeatureCard
            icon="i-heroicons-calendar"
            title="Organizace schůzek"
            description="Správa a koordinace multidisciplinárních týmových setkání"
          />
        </div>

        <div class="mt-8 space-y-6">
          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Analytické nástroje</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Sledování vytíženosti doktorů</li>
              <li>Statistiky počtu případů</li>
              <li>Přehled úspěšnosti léčby</li>
              <li>Monitoring délky léčebných procesů</li>
            </ul>
          </section>

          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Koordinace týmů</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Plánování multidisciplinárních setkání</li>
              <li>Správa dostupnosti doktorů</li>
              <li>Optimalizace rozvrhu schůzek</li>
            </ul>
          </section>
        </div>
      </div>

      <div v-else-if="userRole === 'admin'" class="space-y-8">
        <h2 class="text-2xl font-semibold mb-4">Administrátorský panel</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon="i-heroicons-user-plus"
            title="Správa uživatelů"
            description="Přidávání a správa doktorů a ostatních uživatelů systému"
          />
          <FeatureCard
            icon="i-heroicons-cog"
            title="Systémová nastavení"
            description="Konfigurace a údržba systému"
          />
        </div>

        <div class="mt-8 space-y-6">
          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Správa uživatelů</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Vytváření nových účtů pro doktory</li>
              <li>Správa rolí a oprávnění</li>
              <li>Reset hesel</li>
              <li>Deaktivace účtů</li>
            </ul>
          </section>

          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Systémová údržba</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Konfigurace systémových parametrů</li>
              <li>Správa přístupových práv</li>
              <li>Monitoring systému</li>
            </ul>
          </section>
        </div>
      </div>

      <div v-else-if="userRole === 'student'" class="space-y-8">
        <h2 class="text-2xl font-semibold mb-4">Vzdělávací portál</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon="i-heroicons-academic-cap"
            title="Případové studie"
            description="Přístup k anonymizovaným případům pro studijní účely"
          />
          <FeatureCard
            icon="i-heroicons-book-open"
            title="Vzdělávací materiály"
            description="Odborné postupy a guidelines"
          />
        </div>

        <div class="mt-8 space-y-6">
          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Studium případů</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Prohlížení anonymizovaných případů</li>
              <li>Analýza diagnostických postupů</li>
              <li>Sledování průběhu léčby</li>
              <li>Přístup k výsledkům vyšetření</li>
            </ul>
          </section>

          <section class="bg-white/15 text-black rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Vzdělávací materiály</h3>
            <ul class="space-y-3 list-disc list-inside">
              <li>Přístup k odborným postupům</li>
              <li>Studium guidelines</li>
              <li>Prohlížení výukových materiálů</li>
            </ul>
          </section>
        </div>
      </div>

      <!-- Enhanced Quick Start Guide -->
      <div class="mt-8 pt-8 border-t border-white/20">
        <h3 class="text-xl text-black font-semibold mb-4">Rychlý průvodce systémem</h3>
        <ul class="space-y-2">
          <li v-for="guide in quickGuides" :key="guide.title" class="flex items-center">
            <UIcon :name="guide.icon" class="mr-2" />
            <span>{{ guide.title }}</span>
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div class="mt-8 pt-8 border-t border-white/20">
        <h3 class="text-xl text-black font-semibold mb-4">Potřebujete pomoc?</h3>
        <p class="text-black">
          V případě technických problémů kontaktujte správce systému na:
          <a href="mailto:support@motol.cz" class="text-pink-300 hover:text-pink-400">support@motol.cz</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userRole = ref('')

// Component for feature cards
const FeatureCard = defineComponent({
  props: {
    icon: String,
    title: String,
    description: String
  },
  template: `
    <div class="p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <UIcon :name="icon" class="w-8 h-8 mb-4" />
      <h3 class="text-xl font-medium mb-2">{{ title }}</h3>
      <p class="text-gray-300">{{ description }}</p>
    </div>
  `
})

// Role-specific quick guides
const quickGuides = computed(() => {
  switch (userRole.value) {
    case 'doctor':
      return [
        { icon: 'i-heroicons-user', title: 'Přístup k záznamům pacientů v sekci "Pacienti"' },
        { icon: 'i-heroicons-calendar', title: 'Plánování schůzek v sekci "Schůzky"' }
      ]
    case 'manager':
      return [
        { icon: 'i-heroicons-chart-bar', title: 'Přístup ke statistikám v dashboardu' },
        { icon: 'i-heroicons-users', title: 'Správa týmů v sekci "Týmy"' }
      ]
    case 'admin':
      return [
        { icon: 'i-heroicons-user-plus', title: 'Správa doktorů v sekci "Doctors"' },
        { icon: 'i-heroicons-cog', title: 'Systémová nastavení v administraci' }
      ]
    case 'student':
      return [
        { icon: 'i-heroicons-academic-cap', title: 'Prohlížení případů v sekci "Cases Preview"' },
        { icon: 'i-heroicons-book-open', title: 'Přístup k výukovým materiálům' }
      ]
    default:
      return []
  }
})

onMounted(() => {
  userRole.value = localStorage.getItem('role') || ''
})

definePageMeta({
  colorMode: "light",
})
</script>

<style scoped>
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.list-circle {
  list-style-type: circle;
}
</style>