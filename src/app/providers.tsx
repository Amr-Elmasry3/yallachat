"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import { RealtimeMessageStatus } from "@/components/ui/userChat/RealtimeMessageStatus";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useInitialNotification } from "@/hooks/notifications/useInitialNotification";

// => Providers
import ThemeProvider from "@/contexts/ThemeContext";
import AlertDialogProvider from "@/contexts/AlertDialogContext";
import UpdateInfoProvider from "@/contexts/UpdateInfoContext";
import UserStatusProvider from "@/contexts/UserStatusContext";
import AddFriendsProvider from "@/contexts/AddFriendsContext";
import SearchBoxProvider from "@/contexts/SearchBoxContext";
import ReplyInfoProvider from "@/contexts/ReplyInfoContext";
import MediaCarouselProvider from "@/contexts/MediaCarouselContext";
import VoiceCallProvider from "@/contexts/VoiceCallContext";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  // Device Token For Notifications
  useInitialNotification();

  return (
    <ThemeProvider>
      <UserStatusProvider>
        <AlertDialogProvider>
          <UpdateInfoProvider>
            <AddFriendsProvider>
              <SearchBoxProvider>
                <RealtimeMessageStatus />
                <ReplyInfoProvider>
                  <MediaCarouselProvider>
                    <VoiceCallProvider>{children}</VoiceCallProvider>
                  </MediaCarouselProvider>
                </ReplyInfoProvider>
              </SearchBoxProvider>
            </AddFriendsProvider>
          </UpdateInfoProvider>
        </AlertDialogProvider>
      </UserStatusProvider>
    </ThemeProvider>
  );
}

export default Providers;
