<script setup>
import PageHeading from "~/components/common/PageHeading.vue";
import PasswordInput from "~/components/common/PasswordInput.vue";

definePageMeta({
  layout: "admin",
});

const { user } = useAuth();

const toasts = useState("app-toasts", () => []);
const addToast = (message, type = "success", duration = 3000) => {
  const toast = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, type, duration };
  toasts.value = [...toasts.value, toast];
  if (duration > 0) {
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    }, duration);
  }
};

const initials = computed(() =>
  (user.value?.name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
);

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const saving = ref(false);
const formError = ref(null);

const passwordsMismatch = computed(
  () => confirmPassword.value.length > 0 && newPassword.value !== confirmPassword.value
);

async function handleSubmit() {
  formError.value = null;

  if (newPassword.value.length < 8) {
    formError.value = "New password must be at least 8 characters";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    formError.value = "New password and confirm password do not match";
    return;
  }

  saving.value = true;
  try {
    await apiFetch("/api/auth/password", {
      method: "PUT",
      body: { oldPassword: oldPassword.value, newPassword: newPassword.value },
    });
    addToast("Password updated successfully", "success");
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err) {
    formError.value = err?.data?.error || "Unable to update password";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="tw-px-5">
      <PageHeading heading="My Profile" description="Manage your admin account security" />

      <div class="max-w-xl">
        <div class="rounded-2xl bg-gradient-to-r from-theme to-purple-700 px-8 py-8 text-white shadow-lg flex items-center gap-5">
          <div class="w-16 h-16 shrink-0 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center text-2xl font-bold tracking-wide">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <h2 class="text-xl font-bold truncate">{{ user?.name }}</h2>
            <p class="text-white/80 text-sm truncate">{{ user?.email }}</p>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">Change Password</h3>
          <p class="text-sm text-gray-500 mb-6">Choose a strong password you don't use elsewhere.</p>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Old Password
              </label>
              <PasswordInput v-model="oldPassword" required autocomplete="current-password" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <PasswordInput v-model="newPassword" required minlength="8" autocomplete="new-password" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <PasswordInput v-model="confirmPassword" required autocomplete="new-password" :invalid="passwordsMismatch" />
              <p v-if="passwordsMismatch" class="mt-1.5 text-xs text-red-600">Passwords do not match</p>
            </div>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

            <button
              type="submit"
              :disabled="saving"
              class="w-full sm:w-auto px-8 bg-[var(--theme-color)] text-white rounded-lg py-3 uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition disabled:opacity-50"
            >
              {{ saving ? "Updating..." : "Update Password" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
