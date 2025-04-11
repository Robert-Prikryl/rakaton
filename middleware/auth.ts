export default defineNuxtRouteMiddleware((to) => {
  const role = localStorage.getItem('role')
  console.log(role)
  const auth = useAuth()
  
  // Allow access to login page
  if (to.path === '/login') {
    return
  }

  // Redirect to login if not authenticated
  if (!auth.value.isAuthenticated) {
    return navigateTo('/login')
  }
}) 