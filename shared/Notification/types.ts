export type NotificationType = "success" | "error";

export interface INotificationState {
  type: NotificationType | null;
  message: string;
}
