import { redirect } from 'next/navigation'
export default function AdminPage() {
  // Redirect to workshop admin by default
  redirect('/admin/workshop')
}