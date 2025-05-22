<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="product" class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <button 
          @click="$router.back()"
          class="mb-4 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Back to Products
        </button>
        
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
        <p class="text-xl text-gray-600 mb-4">R${{ product.price.toFixed(2) }}</p>
        
        <div class="mt-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p class="text-gray-600">{{ product.description || 'No description available' }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading product details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/products/${route.params.id}`)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    // You might want to redirect to a 404 page here
  }
})
</script>