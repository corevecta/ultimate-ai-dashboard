# @ultimate-ai/shared-ui

Unified component library for Ultimate AI Dashboard, consolidating common UI components from both classic and React dashboards.

## Overview

This package provides a comprehensive set of reusable React components designed with:
- **Glassmorphism effects** - Modern glass-like aesthetics
- **Dark theme optimized** - Built for dark mode dashboards
- **Consistent design language** - Purple accent color scheme
- **Smooth animations** - Framer Motion powered transitions
- **Full TypeScript support** - Type-safe development
- **Accessibility** - ARIA compliant with Radix UI

## Installation

```bash
pnpm add @ultimate-ai/shared-ui
```

## Components

### Core Components

#### Button
Versatile button component with multiple variants and states.

```tsx
import { Button } from '@ultimate-ai/shared-ui'

<Button variant="primary" size="md" icon={<Plus />}>
  Add Item
</Button>
```

Variants: `primary`, `secondary`, `danger`, `warning`, `success`, `info`, `ghost`, `outline`

#### Card
Container component with glassmorphism effects.

```tsx
import { Card } from '@ultimate-ai/shared-ui'

<Card variant="glass" padding="lg" glow>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

#### MetricCard
Display metrics with trends and sparklines.

```tsx
import { MetricCard } from '@ultimate-ai/shared-ui'

<MetricCard 
  metric={{
    label: 'Total Users',
    value: '12,847',
    change: '+12.5%',
    changeType: 'increase',
    icon: <Users />,
    trend: [30, 40, 35, 50, 49, 60, 70, 91]
  }}
/>
```

#### StatusChip
Status indicators with animated states.

```tsx
import { StatusChip } from '@ultimate-ai/shared-ui'

<StatusChip status="active" label="Running" />
```

Statuses: `success`, `error`, `warning`, `info`, `pending`, `active`, `inactive`

### Form Components

#### Input
Glass-styled input field.

```tsx
import { Input } from '@ultimate-ai/shared-ui'

<Input 
  type="text" 
  placeholder="Enter value..." 
/>
```

#### Select
Dropdown select component.

```tsx
import { Select } from '@ultimate-ai/shared-ui'

<Select 
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
  placeholder="Choose option"
/>
```

#### Checkbox & RadioGroup
Form controls with Radix UI.

```tsx
import { Checkbox, RadioGroup, RadioGroupItem } from '@ultimate-ai/shared-ui'

<Checkbox checked={isChecked} onCheckedChange={setIsChecked} />

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>
```

### Layout Components

#### Grid
Responsive grid layout.

```tsx
import { Grid } from '@ultimate-ai/shared-ui'

<Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>
```

#### Tabs
Tab navigation component.

```tsx
import { Tabs } from '@ultimate-ai/shared-ui'

<Tabs 
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
  ]}
  variant="pills"
/>
```

#### Modal
Animated modal dialog.

```tsx
import { Modal } from '@ultimate-ai/shared-ui'

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>
```

### Feedback Components

#### Alert
Dismissible alert messages.

```tsx
import { Alert } from '@ultimate-ai/shared-ui'

<Alert 
  type="success"
  title="Success!"
  description="Operation completed successfully."
  dismissible
/>
```

#### LoadingState
Various loading indicators.

```tsx
import { LoadingState } from '@ultimate-ai/shared-ui'

<LoadingState 
  variant="spinner" 
  size="lg" 
  text="Loading data..."
/>
```

Variants: `spinner`, `dots`, `pulse`, `skeleton`

#### ProgressBar
Progress indicators with animations.

```tsx
import { ProgressBar } from '@ultimate-ai/shared-ui'

<ProgressBar 
  value={75} 
  max={100}
  variant="gradient"
  showLabel
  label="Upload Progress"
/>
```

### Navigation Components

#### Breadcrumb
Breadcrumb navigation.

```tsx
import { Breadcrumb } from '@ultimate-ai/shared-ui'

<Breadcrumb 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects' },
    { label: 'Current Project' }
  ]}
/>
```

### Data Display

#### DataTable
Table component for data display.

```tsx
import { DataTable } from '@ultimate-ai/shared-ui'

<DataTable 
  data={users}
  columns={[
    { key: 'name', header: 'Name', accessor: 'name' },
    { key: 'email', header: 'Email', accessor: 'email' },
    { key: 'status', header: 'Status', accessor: 'status' }
  ]}
/>
```

## Utilities

### Theme
Consistent design tokens.

```tsx
import { theme } from '@ultimate-ai/shared-ui'

// Access colors, spacing, shadows, etc.
const primaryColor = theme.colors.primary[500]
```

### Formatters
Data formatting utilities.

```tsx
import { formatNumber, formatPercent, formatDuration } from '@ultimate-ai/shared-ui'

formatNumber(12847) // "12,847"
formatPercent(98.2) // "98.2%"
formatDuration(245) // "4m 5s"
```

## Demo

View the live component showcase at `/shared-ui-demo` in your Ultimate AI Dashboard.

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Watch mode
pnpm dev
```

## License

Part of Ultimate AI Dashboard