/**
 * Geen auth-check hier: `/admin/login` moet bereikbaar zijn zonder sessie.
 * Beveiligde routes zitten onder `app/admin/(dashboard)/layout.tsx`.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
