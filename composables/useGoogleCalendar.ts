import { ref } from 'vue'
import type { GoogleCalendarEvent } from '~/types/google-calendar'

export const useGoogleCalendar = () => {
  const isAuthenticated = ref(false)
  const gapi = ref<any>(null)

  const initializeGoogleCalendar = async () => {
    try {
      const config = useRuntimeConfig()
      
      // Load the Google API client library
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })

      // Initialize the Google API client
      await new Promise((resolve) => {
        gapi.value = window.gapi
        gapi.value.load('client:auth2', resolve)
      })

      // Initialize the client with your credentials
      await gapi.value.client.init({
        apiKey: config.public.googleApiKey,
        clientId: config.public.googleClientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
      })

      // Wait for auth2 to be initialized
      await new Promise((resolve) => {
        gapi.value.auth2.init({
          client_id: config.public.googleClientId,
          scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
        }).then(() => {
          resolve(true)
        })
      })

      // Check if user is already signed in
      const authInstance = gapi.value.auth2.getAuthInstance()
      if (authInstance.isSignedIn.get()) {
        isAuthenticated.value = true
      } else {
        // Sign in the user
        await authInstance.signIn()
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Error initializing Google Calendar:', error)
      throw error
    }
  }

  const createEvent = async (eventData: {
    summary: string
    description?: string
    location?: string
    startTime: string
    attendees: Array<{ email: string }>
  }) => {
    try {
      if (!gapi.value) throw new Error('Google API not initialized')
      if (!isAuthenticated.value) throw new Error('Not authenticated')

      // Calculate end time (1 hour after start time)
      const startDate = new Date(eventData.startTime)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Add 1 hour

      const event: GoogleCalendarEvent = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Europe/Prague'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Europe/Prague'
        },
        attendees: eventData.attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 } // 30 minutes before
          ]
        }
      }

      const response = await gapi.value.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all'
      })

      return response.result
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  return {
    isAuthenticated,
    initializeGoogleCalendar,
    createEvent
  }
} 