// ************************ Ui Imports *************************
// => My Custom Components
import CallsList from "../ui/CallsList";
import { ErrorBoundary } from "../error_boundary/ErrorBoundary";

function CallsModule() {
  return (
    <div className="calls-page max-sm:pb-20 p-4">
      <h1 className="text-heading3 font-semibold text-light-text dark:text-dark-text mb-5">
        Calls
      </h1>

      <div className="content">
        <ErrorBoundary>
          <CallsList />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default CallsModule;
