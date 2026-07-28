<script setup>
import PasswordInput from "~/components/common/PasswordInput.vue";

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await login(email.value.trim(), password.value)
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  } catch (err) {
    error.value = err?.data?.error || err?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm bg-white rounded-lg shadow p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--theme-color)]"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Password
          </label>
          <PasswordInput v-model="password" required autocomplete="current-password" />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[var(--theme-color)] text-white rounded-md py-3 uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
