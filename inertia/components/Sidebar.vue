<script setup></script>

<template>
  <aside class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <div
      class="menu bg-base-100 border-r-2 border-r-bg-base-200 text-base-content min-h-full w-80 p-0"
    >
      <!-- Contenu de la sidebar ici -->
      <header class="navbar bg-base-100 border-b-2 border-b-base-200 pb-[2px] px-4 md:px-6 lg:px-8">
        <a class="btn btn-ghost text-xl">daisyUI</a>
      </header>
      <ul>
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </aside>
</template>
