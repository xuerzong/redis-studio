import { cn } from '@client/utils/cn'
import './index.scss'
import { ChevronDownIcon } from 'lucide-react'
import { Box, type BoxProps, type PolymorphicComponentType } from '../Box'

type SelectOption = {
  label: React.ReactNode
  value: string
}
interface SelectProps extends Omit<BoxProps<'div'>, 'onChange'> {
  value?: string
  options: SelectOption[]
  onChange?: (value: string, option: SelectOption) => void
}

export const Select: React.FC<SelectProps> = ({
  value,
  options = [],
  onChange,
  className,
  ...restProps
}) => {
  return (
    <Box<PolymorphicComponentType<'div'>>
      className={cn('Select', className)}
      {...restProps}
    >
      <select
        value={value}
        className="SelectRoot"
        onChange={(e) => {
          const currentValue = e.target.value
          onChange?.(
            currentValue,
            options.find((opt) => opt.value === currentValue)!
          )
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="SelectIcon" />
    </Box>
  )
}
