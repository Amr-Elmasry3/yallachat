// ************************ Ui Imports *************************
// => My Custom Components
import UserSettings from "../ui/settings/UserSettings";
import UpdateInfo from "../modals/update-user-info/UpdateInfo";
import { ErrorBoundary } from "../error_boundary/ErrorBoundary";

async function SettingsModule() {
  return (
    <div className="settings-page max-sm:pb-20 p-4">
      <h1 className="text-heading3 font-semibold text-light-text dark:text-dark-text mb-5">
        Settings
      </h1>

      <div className="content">
        <ErrorBoundary>
          <UserSettings />
        </ErrorBoundary>
      </div>

      {/* This Is A Modal */}
      <UpdateInfo />
    </div>
  );
}

export default SettingsModule;
