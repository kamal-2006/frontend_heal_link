import NurseTable from "./nurse";

export default function AdminNursePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Nurse Management</h1>
      <NurseTable />
    </div>
  );
}
