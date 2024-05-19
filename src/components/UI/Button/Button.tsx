import {
    ButtonHTMLAttributes,
    forwardRef,
    ReactNode,
} from 'react'
import cn from 'classnames'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children?: ReactNode
  variant?: 'outlined' | 'contained' | 'error' | 'transparent' | 'default'
  animation?: 'color' | 'scale'
  size?: 'small' | 'medium' | 'large'
}

/**
 * Полиформный конпонент кнопки
 * param as - тип компонента
 * param variant - стиль кнопки
 * param animation - анимации при взаимодействии
 * param size - размер
 * param className - класс(ы) для добавления дополнительных стилей
 */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'transparent',
    animation,
    size,
    ...rest
  }: ButtonProps,
  ref,
) {

  const classes = cn(styles.base, {
    [styles[animation ? animation : '']]: !!animation,
    [styles[variant ? variant : '']]: !!variant,
    [styles[size ? size : 'small']]: true,
  })

  return (
    <button
      className={[classes, className].join(' ')}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
