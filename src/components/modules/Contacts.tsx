// ************************ Ui Imports *************************
// => My Custom Components
import UserContacts from "../ui/contacts/UserContacts";
import { ErrorBoundary } from "../error_boundary/ErrorBoundary";

async function ContactsModule() {
  return (
    <div className="contacts-page max-sm:pb-20 p-4">
      <h1 className="text-heading3 font-semibold text-light-text dark:text-dark-text mb-5">
        Contacts
      </h1>

      <div className="contacts-content">
        <ErrorBoundary>
          <UserContacts />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default ContactsModule;
