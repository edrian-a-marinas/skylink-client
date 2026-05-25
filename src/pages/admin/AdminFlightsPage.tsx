import AdminLayout from "./_components/AdminLayout";
import ScreenPlaceholder from "@/pages/_shared/components/ui/ScreenPlaceholder";

const AdminFlightsPage = () => {
  return (
    <AdminLayout>
      <ScreenPlaceholder
        id="A-03"
        title="Admin Flight List"
        scope="admin"
        description="Flight inventory management list with edit/deactivate workflows."
      />
    </AdminLayout>
  );
};

export default AdminFlightsPage;
