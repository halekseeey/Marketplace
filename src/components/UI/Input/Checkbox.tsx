import {ChangeEvent, forwardRef, InputHTMLAttributes} from 'react'
import styles from './Checkbox.module.css'
import classNames from 'classnames/bind'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const cx = classNames.bind(styles)

/**
 * Компонент checkbox
 * param {CheckboxProps} - варианты анимации
 */

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {label, onChange, defaultValue, ...props},
    ref,
) {
    return (
        <label className={styles.container}>
            <input
                type="checkbox"
                ref={ref}
                onChange={onChange}
                {...props}
            />
            {
                <div
                    className={styles.checkbox}
                >
                    <svg
                        width={12}
                        height={12}
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="none"
                            strokeWidth="3"
                            stroke="#DEE9E6"
                            d="M 2 8 l 5 5 L 16 3"
                            strokeLinecap="round"
                        ></path>
                    </svg>
                </div>
            }
            <div>
                {label && <p>{label}</p>}
            </div>
        </label>
    )
})

export default Checkbox
