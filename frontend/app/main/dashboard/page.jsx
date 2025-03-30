// frontend/app/(main)/dashboard/page.jsx
import DashboardContent from '../../../components/DashboardContent';

// Optional: Add metadata specific to this page
// export const metadata = {
//   title: 'Dashboard - FinStudent',
// };

export default function DashboardPage() {
  // The layout app/(main)/layout.jsx automatically wraps this.
  return <DashboardContent />;
}