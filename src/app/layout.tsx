import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Maths Logger',
  description: 'Log and review IGCSE Maths questions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <Link href="/">
              <h1>Maths Logger</h1>
            </Link>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/weaknesses" className="btn btn-secondary">
                Weaknesses
              </Link>
              <Link href="/log" className="btn">
                + New Log Entry
              </Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
