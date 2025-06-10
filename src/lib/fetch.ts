import { toast } from '@/components/ui/use-toast'

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API Error:', error)
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Request failed',
      variant: 'destructive',
    })
    throw error
  }
}