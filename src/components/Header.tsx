import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        {/* Logo */}
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <a
            href="#hero"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(180,83,9,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[linear-gradient(90deg,#f97316,#fbbf24)]" />
            SpaceHack 2026
          </a>
        </h2>

        {/* ThemeToggle */}
        <div className="ml-auto flex items-center sm:ml-0">
          <ThemeToggle />
        </div>

        {/* Nav links */}
        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <a href="#hero"      className="nav-link">Inicio</a>
          <a href="#solution"  className="nav-link">Solución</a>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#corridors" className="nav-link">Corredores</a>
          <a href="#team"      className="nav-link">Equipo</a>
        </div>
      </nav>
    </header>
  )
}
