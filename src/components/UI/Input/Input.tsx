import styles from './Input.module.css'
import { forwardRef, InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconUrl?: string
  sizeByContent?: boolean
  rightImage?: boolean
}

/**
 * Компонент ввода
 * @param {string} iconUrl - добавление иконки в поле
 * @param {boolean} sizeByContent - ширина по содержимому
 * @param {boolean} rightImage - расположение картинки справа (иначе слева)
 */

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { iconUrl, className, style, sizeByContent = false, value, rightImage = false, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={[styles.input, className].join(' ')}
      value={value}
      autoComplete='off'
      size={
        sizeByContent && value !== undefined
          ? value.toString().length
          : undefined
      }
      style={{
        ...(iconUrl
          ? { backgroundImage: `url(${iconUrl})`, paddingLeft: `${rightImage ? 10 : 50}px`, backgroundPosition: `${rightImage ? 'calc(100% - 20px)' : '20px'}` }
          : {}),
        ...style,
      }}
      {...rest}
    />
  )
})
