import AdminLayout from "./_components/AdminLayout";
import ScreenPlaceholder from "@/pages/_shared/components/ui/ScreenPlaceholder";

const AdminReportsPage = () => {
  return (
    <AdminLayout>
      <ScreenPlaceholder
        id="A-13"
        title="Admin Reports & Analytics"
        scope="admin"
        description="Custom report builder for revenue, occupancy, and operational metrics."
      />
    </AdminLayout>
  );
};

export default AdminReportsPage;
