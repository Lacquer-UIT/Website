# Badge Management System

This document describes the Badge Management functionality implemented in the application.

## Features

The Badge Management system provides a comprehensive interface for managing badges with the following functionalities:

### Core Operations

1. **View All Badges** - Display all badges in a responsive grid layout
2. **Create Badge** - Create new badges with name and icon URL (requires authentication)
3. **Update Badge** - Edit existing badge information (requires authentication)
4. **Delete Badge** - Remove badges from the system (requires authentication)
5. **Award Badge** - Award badges to users (requires authentication)
6. **View Badge Details** - View detailed information about each badge

### API Endpoints

The system integrates with the following server endpoints:

- `GET /badge` - Retrieve all badges
- `POST /badge` - Create a new badge (authenticated)
- `GET /badge/:badgeId` - Get specific badge by ID
- `PUT /badge/:badgeId` - Update badge (authenticated)
- `DELETE /badge/:badgeId` - Delete badge (authenticated)
- `POST /badge/:badgeId/award` - Award badge to user (authenticated)

### Data Structure

Badges follow this schema:
```typescript
interface Badge {
  _id: string
  name: string
  iconUrl: string
  createdAt: string
  updatedAt: string
  __v?: number
}
```

### Authentication

- Viewing badges: No authentication required
- Creating, updating, deleting badges: Authentication required
- Awarding badges: Authentication required

## Components

### Main Components

1. **BadgeManagement** - Main container component
2. **BadgeForm** - Form for creating/editing badges
3. **BadgeCard** - Individual badge display component
4. **BadgeViewModal** - Modal for viewing badge details

### Hooks

- **useBadges** - Custom hook for badge operations and state management

## Usage

### Basic Implementation

```tsx
import BadgeManagement from '@/components/badge-management'

export default function BadgesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BadgeManagement />
    </div>
  )
}
```

### Using the Badge Hook

```tsx
import { useBadges } from '@/hooks/use-badges'

function MyComponent() {
  const { 
    badges, 
    isLoading, 
    error, 
    createBadge, 
    updateBadge, 
    deleteBadge,
    awardBadge 
  } = useBadges()

  // Use the hook methods and state
}
```

## UI Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Loading States** - Skeleton loaders during API calls
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/error feedback
- **Confirmation Dialogs** - Safe deletion with confirmation
- **Image Preview** - Preview badge icons in forms
- **Search and Filter** - Tabs for "All" and "Recent" badges
- **Scrollable Areas** - Efficient display of large badge lists

## Error Handling

The system includes comprehensive error handling:

- Network errors
- Authentication errors (401)
- Validation errors
- Not found errors (404)
- Server errors (500)

All errors are displayed to users with appropriate messaging and dismissible alerts.

## Security

- Authentication tokens are automatically included in API calls
- Session expiration is handled gracefully
- Input validation on forms
- Confirmation dialogs for destructive actions

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management in modals 