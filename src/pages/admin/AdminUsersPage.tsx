import AdminLayout from "./_components/AdminLayout";
import ScreenPlaceholder from "@/pages/_shared/components/ui/ScreenPlaceholder";

const AdminUsersPage = () => {
  return (
    <AdminLayout>
      <ScreenPlaceholder
        id="A-07"
        title="Admin User Management"
        scope="admin"
        description="Comprehensive user directory with role management and status controls."
      />
    </AdminLayout>
  );
};

export default AdminUsersPage;
