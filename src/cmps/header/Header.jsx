import { Logo } from '../../assets/imgs/Logo'
import { InputFilter } from './InputFilter'
import { Nav } from './Nav'

export function Header() {
  return (
    <header className="header bg-white border-b border-gray-200">
      <div className="container">
        <Logo />
        <InputFilter />
        <Nav />
      </div>
    </header>
  )
}
