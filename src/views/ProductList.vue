<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

fetchProducts();

const openProductDetails = (product) => {
  window.location.href = `/products/${product.id}`;
}

const isAddModalOpen = ref(false);
const newProduct = ref({
  name: '',
  price: 0
});

const addProduct = async () => {
  try {
    const response = await axios.post('http://localhost:3000/products', newProduct.value);
    
    products.value.push(response.data);
    
    newProduct.value = { name: '', description: '', price: 0 };
    isAddModalOpen.value = false;
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

const editingProduct = ref(null);
const isEditModalOpen = ref(false);

const openEditModal = (product) => {
  editingProduct.value = product
  isEditModalOpen.value = true;
};

const saveProduct = async () => {
  try {
    await axios.patch(
      `http://localhost:3000/products/${editingProduct.value.id}`,
      editingProduct.value
    );
    const index = products.value.findIndex(p => p.id === editingProduct.value.id);
    if (index !== -1) {
      products.value[index] = { ...editingProduct.value };
    }
    isEditModalOpen.value = false;
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

const removeProduct = async (product) => {
  if(confirm(`Tem certeza que deseja deletar ${product.name}?`)){
    try {
      await axios.delete(`http://localhost:3000/products/${product.id}`);
      products.value = products.value.filter(p => p.id !== product.id);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert("Erro ao deletar o produto");
    }
  }
};
</script>

<template>  
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Product List</h1>
    <button 
      @click="isAddModalOpen = true"
      class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
    >
      Add Product
    </button>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="product in products" 
          :key="product.id" 
          class="p-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="flex items-center justify-between">
            <RouterLink :to="`/products/${product.id}`" class="flex-1 min-w-0 cursor-pointer">
              <h3 class="text-lg font-medium text-gray-900 truncate">{{ product.name }}</h3>
              <p class="text-gray-500 mt-1">R${{ product.price.toFixed(2) }}</p>
            </RouterLink>
            
            <div class="ml-4 flex-shrink-0 flex space-x-2">
              <button 
                @click="openEditModal(product)"
                class="px-3 py-1 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              >
                Edit
              </button>
              <button 
                @click="removeProduct(product)"
                class="px-3 py-1 border border-red-500 rounded-md text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Add Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">Add New Product</h2>
        
        <form @submit.prevent="addProduct">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Name</label>
            <input 
              v-model="newProduct.name" 
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Product name"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="newProduct.description" 
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Product description"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Price</label>
            <input 
              v-model.number="newProduct.price" 
              type="number" 
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
              required
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">Edit Product</h2>
        
        <form @submit.prevent="saveProduct">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Name</label>
            <input 
              v-model="editingProduct.name" 
              class="w-full px-3 py-2 border rounded-md"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="editingProduct.description"
              class="w-full px-3 py-2 border rounded-md"
              required
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Price</label>
            <input 
              v-model="editingProduct.price" 
              type="number" 
              step="0.01"
              class="w-full px-3 py-2 border rounded-md"
              required
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="isEditModalOpen = false"
              class="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>