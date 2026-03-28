export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} SpaceHack 2026. Todos los derechos reservados.
        </p>
        <p className="island-kicker m-0">Net-Zero Supply Chain</p>
      </div>
    </footer>
  )
}
