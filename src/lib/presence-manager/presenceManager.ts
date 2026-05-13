// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { redirect } from "next/navigation";

// => Libraries
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type UserStatus = "online" | "offline";

class PresenceManager {
  private userId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isOnline: boolean = false;
  private lastStatus: UserStatus | null = null;
  private isActive: boolean = false;

  // Run Manager
  public initialize(userId: string): void {
    if (!userId) return;

    this.userId = userId;
    this.lastStatus = null;
    this.isActive = true;
    this.setupListeners();
    this.goOnline();
  }

  // Server Status Update
  private async updateStatus(status: UserStatus): Promise<void> {
    if (!this.userId || this.lastStatus === status) return;

    const values = {
      userId: this.userId,
      status: status,
    };

    try {
      const response = await axios.post(`/api/user/status`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.success) {
        this.lastStatus = status;
      }
    } catch (error: unknown) {
      console.error("Status update failed:", error);
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // If No Valid Session Found
          if (error.response.status === 401) {
            redirect("/login");
          }
        }
      }
    }
  }

  // The User Remained Online
  private goOnline(): void {
    if (!this.isOnline && this.userId && this.isActive) {
      this.isOnline = true;
      this.updateStatus("online");

      // Heartbeats Every 30 Seconds To Make Sure He's Still There
      this.heartbeatInterval = setInterval(() => {
        this.updateStatus("online");
      }, 30000);
    }
  }

  // The User Remained Offline
  private goOffline(): void {
    if (this.isOnline && this.userId && this.isActive) {
      this.isOnline = false;

      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }

      this.updateStatus("offline");
    }
  }

  // This Is For Beforeunload Event
  private goOfflineWithBeacon(): void {
    if (!this.userId) return;

    // Using SendBeacon Instead Of Axios
    const blob = new Blob(
      [
        JSON.stringify({
          userId: this.userId,
          status: "offline",
        }),
      ],
      { type: "application/json" },
    );

    navigator.sendBeacon(`/api/user/status`, blob);
  }

  //Site Monitoring
  private setupListeners(): void {
    // When The Site Closes
    window.addEventListener("beforeunload", () => {
      this.goOfflineWithBeacon();
    });

    // Pagehide Alternative To Beforeunload Event
    window.addEventListener("pagehide", () => {
      this.goOfflineWithBeacon();
    });

    // Internet Connection Loss Detected
    window.addEventListener("offline", () => {
      this.goOffline();
    });

    // Detect Internet Connection
    window.addEventListener("online", () => {
      this.goOnline();
    });
  }

  // Cleaning
  public cleanup(): void {
    this.goOffline();
    this.isActive = false;
  }
}

// We Only Make One Copy (Singleton)
export const presenceManager = new PresenceManager();
