<template>
  <div class="relative">
    <button
      @click="prev"
      type="button"
      class="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 text-ink-faint transition hover:text-ink sm:inline-flex"
      aria-label="Previous testimonial"
    >
      <span aria-hidden="true" class="text-2xl leading-none">‹</span>
    </button>
    <button
      @click="next"
      type="button"
      class="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 text-ink-faint transition hover:text-ink sm:inline-flex"
      aria-label="Next testimonial"
    >
      <span aria-hidden="true" class="text-2xl leading-none">›</span>
    </button>

    <div
      ref="trackRef"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      class="relative flex justify-center overflow-hidden py-6"
      style="min-height: 240px"
    >
      <article
        v-for="(testimonial, index) in testimonials"
        :key="index"
        :style="getSlideStyle(index)"
        class="absolute w-full max-w-[420px] px-6 transition-all duration-500 ease-out"
      >
        <div class="text-center">
          <span
            class="block text-5xl leading-none text-ink-faint/70 font-serif"
            aria-hidden="true"
            >“</span
          >
          <p class="mt-2 text-lg sm:text-xl italic leading-relaxed text-ink">
            {{ testimonial.quote }}
          </p>
          <p class="mt-6 text-xs uppercase tracking-[0.22em] text-ink-muted">
            — {{ testimonial.author
            }}<span v-if="testimonial.role" class="text-ink-faint">
              , {{ testimonial.role }}</span
            >
          </p>
        </div>
      </article>
    </div>

    <div class="mt-8 flex items-center justify-center gap-2">
      <button
        v-for="(_, index) in testimonials"
        :key="`dot-${index}`"
        @click="goTo(index)"
        type="button"
        :class="
          active === index
            ? 'w-6 bg-ink'
            : 'w-1.5 bg-ink-faint/50 hover:bg-ink-faint'
        "
        class="h-1.5 rounded-full transition-all"
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

  if (pos > total / 2) pos -= total;
  if (pos < -total / 2) pos += total;

  const isCenter = pos === 0;
  const isVisible = Math.abs(pos) <= Math.floor(visibleCount.value / 2);

  const offset = pos * 110;
  const scale = isCenter ? 1 : 0.92;
  const opacity = isCenter ? 1 : isVisible ? 0.35 : 0;
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
