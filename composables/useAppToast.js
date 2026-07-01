export function useAppToast() {
  const toasts = useState('app-toasts', () => [])

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const addToast = (message, type = 'success', duration = 3000) => {
    const toast = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      message,
      type,
    }

    toasts.value = [...toasts.value, toast]

    if (duration > 0) {
      setTimeout(() => removeToast(toast.id), duration)
    }

    return toast.id
  }

  return {
    toasts,
    addToast,
    removeToast,
  }
}
