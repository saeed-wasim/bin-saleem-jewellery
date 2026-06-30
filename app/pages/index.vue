<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Not Logged In -->
      <div v-if="!user" class="rounded-2xl bg-white p-8 shadow-2xl">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-800">Bin Saleem</h1>
          <p class="mt-2 text-gray-600">Jewellery Collection</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p class="text-sm text-red-700"><strong>{{ error }}</strong></p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin">
            <div class="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
          <p class="mt-4 text-gray-600">Signing you in...</p>
        </div>

        <!-- Google Sign In Button -->
        <div v-show="!loading" id="g_signin2" class="flex justify-center"></div>

        <!-- Debug Info -->
        <div v-if="!loading && !googleLoaded" class="mt-4 text-center">
          <p class="text-red-600 text-sm">⚠️ Google Sign-In not loaded</p>
          <p class="text-xs text-gray-500 mt-2">{{ clientIdStatus }}</p>
        </div>
      </div>

      <!-- Logged In Profile -->
      <div v-else class="rounded-2xl bg-white p-8 shadow-2xl">
        <div class="mb-6 text-center">
          <img v-if="user.picture" :src="user.picture" :alt="user.name" class="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-indigo-200 shadow-lg object-cover" />
          <h2 class="text-2xl font-bold text-gray-800">{{ user.name }}</h2>
          <p class="mt-1 text-sm text-gray-600">{{ user.email }}</p>
        </div>

        <div class="space-y-3 rounded-lg bg-indigo-50 p-4 mb-6">
          <div>
            <p class="text-xs font-semibold text-gray-500">User ID</p>
            <p class="mt-1 font-mono text-xs text-gray-700 break-all">{{ user.id }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500">Email</p>
            <p class="mt-1 text-sm text-gray-700">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500">Status</p>
            <p class="mt-1 text-sm text-green-600">✅ Logged In to Database</p>
          </div>
        </div>

        <button @click="logout" class="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600">
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const runtimeConfig = useRuntimeConfig();
const user = ref<any>(null);
const error = ref('');
const loading = ref(false);
const googleLoaded = ref(false);

const clientIdStatus = computed(() => {
  const id = runtimeConfig.public.googleClientId;
  if (!id) return '❌ Client ID not set';
  if (id.includes('REPLACE')) return '❌ Client ID still placeholder - Run: npm run setup-oauth';
  return `✅ Client ID: ${id.slice(0, 15)}...`;
});

declare global {
  interface Window {
    google: any;
  }
}

const handleCredentialResponse = async (response: any) => {
  loading.value = true;
  error.value = '';

  try {
    console.log('📤 Sending token to backend...');
    const res = await $fetch('/api/auth/google', {
      method: 'POST',
      baseURL: runtimeConfig.public.apiBaseUrl,
      body: {
        idToken: response.credential,
      },
    });

    console.log('✅ Login successful!', res.user);
    user.value = res.user;
    
    const buttonDiv = document.getElementById('g_signin2');
    if (buttonDiv) {
      buttonDiv.style.display = 'none';
    }
  } catch (err: any) {
    console.error('❌ Login failed:', err);
    error.value = err.data?.message || err.message || 'Login failed. Check browser console.';
    loading.value = false;
  }
};

const logout = () => {
  user.value = null;
  error.value = '';
  if (window.google?.accounts?.id) {
    window.google.accounts.id.renderButton(document.getElementById('g_signin2') || document.body, {
      theme: 'outline',
      size: 'large',
      width: '100%',
    });
    const buttonDiv = document.getElementById('g_signin2');
    if (buttonDiv) {
      buttonDiv.style.display = 'flex';
    }
  }
};

const loadGoogleSignIn = () => {
  if (googleLoaded.value) return;

  const clientId = runtimeConfig.public.googleClientId;

  if (!clientId || clientId.includes('REPLACE')) {
    error.value = '❌ Google Client ID not configured. Run: npm run setup-oauth';
    return;
  }

  if (document.getElementById('google-signin-script')) {
    initializeGoogleSignIn(clientId);
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-signin-script';
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;

  script.onload = () => {
    console.log('✅ Google Sign-In library loaded');
    initializeGoogleSignIn(clientId);
  };

  script.onerror = () => {
    console.error('❌ Failed to load Google Sign-In');
    error.value = 'Failed to load Google Sign-In. Check internet connection.';
  };

  document.head.appendChild(script);
};

const initializeGoogleSignIn = (clientId: string) => {
  if (!window.google?.accounts?.id) {
    console.error('❌ Google not available');
    error.value = 'Google Sign-In not available. Refresh page.';
    return;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    const buttonContainer = document.getElementById('g_signin2');
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
      googleLoaded.value = true;
      console.log('✅ Google button rendered');
    }
  } catch (err) {
    console.error('❌ Google init error:', err);
    error.value = 'Google initialization failed. Check Client ID.';
  }
};

onMounted(() => {
  console.log('🚀 Page loaded');
  console.log('📍 API:', runtimeConfig.public.apiBaseUrl);
  console.log('📍 Client ID:', clientIdStatus.value);
  loadGoogleSignIn();
});
</script>
