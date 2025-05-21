import type { ApiResponse, TagsResponse } from "./types"

// Mock data based on the example response
const mockTagsResponse: ApiResponse<TagsResponse> = {
  success: true,
  message: "Tags retrieved successfully",
  data: {
    count: 2,
    data: [
      {
        _id: "6827065e1c85d7e7a4b3cb5e",
        name: "cities",
        createdAt: "2025-05-16T09:33:18.263Z",
        updatedAt: "2025-05-16T09:33:18.263Z",
        __v: 0,
      },
      {
        _id: "6823109a5abfad0f4d0baed0",
        name: "cuisine",
        description: "an ngon vl",
        createdAt: "2025-05-13T09:27:54.684Z",
        updatedAt: "2025-05-13T09:27:54.684Z",
        __v: 0,
      },
    ],
  },
}

// Add more mock tags for a better demo
const extendedMockTagsResponse: ApiResponse<TagsResponse> = {
  ...mockTagsResponse,
  data: {
    count: 6,
    data: [
      ...mockTagsResponse.data.data,
      {
        _id: "mock-id-3",
        name: "festivals",
        description: "Traditional Vietnamese celebrations and events",
        createdAt: "2025-05-10T14:22:31.684Z",
        updatedAt: "2025-05-10T14:22:31.684Z",
        __v: 0,
      },
      {
        _id: "mock-id-4",
        name: "history",
        description: "Vietnamese historical events and periods",
        createdAt: "2025-05-09T08:15:42.684Z",
        updatedAt: "2025-05-09T08:15:42.684Z",
        __v: 0,
      },
      {
        _id: "mock-id-5",
        name: "language",
        description: "Vietnamese language and dialects",
        createdAt: "2025-05-08T11:45:22.684Z",
        updatedAt: "2025-05-08T11:45:22.684Z",
        __v: 0,
      },
      {
        _id: "mock-id-6",
        name: "art",
        description: "Traditional and contemporary Vietnamese art forms",
        createdAt: "2025-05-07T16:33:10.684Z",
        updatedAt: "2025-05-07T16:33:10.684Z",
        __v: 0,
      },
    ],
  },
}

export async function mockFetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock data based on the endpoint
  if (endpoint === "/tag") {
    return extendedMockTagsResponse as unknown as ApiResponse<T>
  }

  // Default fallback
  throw new Error(`No mock data available for endpoint: ${endpoint}`)
}
