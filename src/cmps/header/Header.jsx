import { Logo } from '../../assets/imgs/Logo'
import { InputFilter } from './InputFilter'
import { Nav } from './Nav'

export function Header() {
  return (
    <header className="header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container">
        <Logo />
        <InputFilter />
        <Nav />
      </div>
    </header>
  )
}
