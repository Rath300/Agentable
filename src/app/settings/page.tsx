import { MainLayout } from "@/components/layout/main-layout";
import { User } from "@/types/workflow";

const user: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  apiKeys: {
    openai: "sk-***********************************",
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-03-15"),
};

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account settings and API integrations.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Profile</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    value={user.apiKeys.openai}
                    readOnly
                    className="block w-full rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  <button className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100">
                    Update
                  </button>
                </div>
              </div>
              <div>
                <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 