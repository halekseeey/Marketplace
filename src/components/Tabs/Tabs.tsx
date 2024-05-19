import { ReactNode, FC, useState } from 'react'
import Button from '../UI/Button/Button'
import styles from './Tabs.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface TabProps {
  label: string
  component: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  options: TabProps[]
  defaultTab?: string
  wrapped?: boolean
}

const Tabs: FC<TabsProps> = ({ options, defaultTab, wrapped = false }) => {
  const [selected, setSelected] = useState<string>(defaultTab || options[0].label)

  const classes = cx({
    [styles.container]: true,
    [styles.wrapped]: wrapped
  })

  return (
    <div className={classes}>
      <div className={styles.panel}>
        {options.map((item: TabProps) => (
          <Button
            key={item.label}
            disabled={item.disabled || selected === item.label}
            data-selected={selected === item.label}
            onClick={() => setSelected(item.label)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className={styles.content}>
        {options.find(item => item.label === selected)?.component}
      </div>
    </div>
  )
}

export default Tabs