import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './RangeInput.module.css'
import {Input} from './Input'

export type RangeInputProps = {
  min?: number
  max?: number
  value?: { min: number; max: number }
  step?: number
  onChange?:
    | Dispatch<SetStateAction<{ min: number; max: number }>>
    | ((value: { min: number; max: number }) => void)
}

/**
 * Компонент выбора значения в диапазоне
 * @param {number} min - левая граница диапазона
 * @param {number} max - правая граница диапазона
 * @param value - значение
 * @param {number} step - шаг изменения
 * @param {Dispatch<SetStateAction<{ min: number; max: number }>>
 *     | ((value: { min: number; max: number }) => void)} onChange - случщатель события изменения
 */

const RangeInput: FC<RangeInputProps> = ({
  min = 0,
  max = 10,
  value = { min: 0, max: 10 },
  step = 1,
  onChange,
}) => {
  const [val, setVal] = useState<{ min: number; max: number }>(value)

  if (!onChange) {
    onChange = setVal
    value = val
  }

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange &&
      onChange({ ...value, min: Math.min(+event.target.value, value.max) })
  }

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange &&
      onChange({ ...value, max: Math.max(+event.target.value, value.min) })
  }

  const handleMinInput = (event: ChangeEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value.replace(/\D/g, ''))
    if (minValue >= min && minValue <= value.max) {
      onChange && onChange({ ...value, min: Math.min(minValue, value.max) })
    }
  }

  const handleMaxInput = (event: ChangeEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value.replace(/\D/g, ''))
    if (maxValue >= value.min && maxValue <= max) {
      onChange && onChange({ ...value, max: Math.max(maxValue, value.min) })
    }
  }

  const minPos = ((value.min - min) / (max - min)) * 100
  const maxPos = ((max - value.max) / (max - min)) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          name="minValue"
          className={styles.input}
          type="range"
          value={value.min}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          name="maxValue"
          className={styles.input}
          type="range"
          value={value.max}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
      </div>
      <div className={styles.controlWrapper}>
        <div className={styles.control} style={{ left: `${minPos}%` }} />
        <div className={styles.rail}>
          <div
            className={styles.innerRail}
            style={{ left: `${minPos}%`, right: `${maxPos}%` }}
          />
        </div>
        <div className={styles.control} style={{ left: `${100 - maxPos}%` }} />
      </div>
      <div className={styles.inputs_field}>
        <Input
          value={`от ${value.min}`}
          onChange={handleMinInput}
          sizeByContent={true}
          className={styles.inp}
        />
        <Input
          value={`до ${value.max}`}
          onChange={handleMaxInput}
          sizeByContent={true}
          className={styles.inp}
        />
      </div>
    </div>
  )
}

export default RangeInput
