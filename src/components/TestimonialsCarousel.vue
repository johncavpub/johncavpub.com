<template>
  <div class="relative">
    <button
      @click="prev"
      type="button"
      class="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 sm:inline-flex"
      aria-label="Previous testimonial"
    >
      <span aria-hidden="true" class="text-lg leading-none">‹</span>
    </button>
    <button
      @click="next"
      type="button"
      class="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 sm:inline-flex"
      aria-label="Next testimonial"
    >
      <span aria-hidden="true" class="text-lg leading-none">›</span>
    </button>

    <div
      ref="trackRef"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      class="relative flex justify-center overflow-hidden py-4"
      style="min-height: 180px"
    >
      <article
        v-for="(testimonial, index) in testimonials"
        :key="index"
        :style="getSlideStyle(index)"
        class="absolute w-full max-w-[340px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out"
      >
        <p class="text-sm font-semibold text-slate-900">
          {{ testimonial.author }}
        </p>
        <p class="mt-3 text-base leading-relaxed text-slate-700">
          "{{ testimonial.quote }}"
        </p>
      </article>
    </div>

    <div class="mt-6 flex items-center justify-center gap-2">
      <button
        v-for="(_, index) in testimonials"
        :key="`dot-${index}`"
        @click="goTo(index)"
        type="button"
        :class="
          active === index
            ? 'w-6 bg-slate-900'
            : 'w-2 bg-slate-300 hover:bg-slate-400'
        "
        class="h-2 rounded-full transition-all"
        :aria-label="`Go to testimonial ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  testimonials: {
    type: Array,
    required: true,
  },
});

const active = ref(0);
const windowWidth = ref(1024);
const trackRef = ref(null);
const touchStartX = ref(0);
const touchEndX = ref(0);

const visibleCount = computed(() => {
  if (windowWidth.value >= 1024) return 3;
  if (windowWidth.value >= 640) return 3;
  return 1;
});

function getSlideStyle(index) {
  const total = props.testimonials.length;
  let pos = index - active.value;

  // Wrap around for infinite wheel
  if (pos > total / 2) pos -= total;
  if (pos < -total / 2) pos += total;

  const isCenter = pos === 0;
  const isVisible = Math.abs(pos) <= Math.floor(visibleCount.value / 2);

  const offset = pos * 110;
  const scale = isCenter ? 1 : 0.85;
  const opacity = isCenter ? 1 : isVisible ? 0.6 : 0;
  const zIndex = isCenter ? 10 : 10 - Math.abs(pos);

  return {
    transform: `translateX(calc(${offset}% - 50%)) scale(${scale})`,
    opacity,
    zIndex,
    left: "50%",
    pointerEvents: isCenter ? "auto" : "none",
  };
}

function goTo(index) {
  const total = props.testimonials.length;
  active.value = ((index % total) + total) % total;
}

function next() {
  goTo(active.value + 1);
}

function prev() {
  goTo(active.value - 1);
}

function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
}

function handleTouchMove(e) {
  touchEndX.value = e.touches[0].clientX;
}

function handleTouchEnd() {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }

  touchStartX.value = 0;
  touchEndX.value = 0;
}

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
