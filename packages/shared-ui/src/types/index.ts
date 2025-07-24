export type Status = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'active' | 'inactive'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Variant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'ghost' | 'outline'

export interface BaseComponentProps {
  className?: string
  id?: string
  style?: React.CSSProperties
}

export interface MetricData {
  label: string
  value: string | number
  change?: string | number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  trend?: number[]
  unit?: string
  color?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
  }[]
}

export interface TableColumn<T = any> {
  key: string
  header: string
  accessor: keyof T | ((row: T) => any)
  sortable?: boolean
  width?: string | number
  render?: (value: any, row: T) => React.ReactNode
}

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}