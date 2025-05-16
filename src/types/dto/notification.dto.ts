export interface CreateNotificationDto {
  title: string;
  message: string;
  image?: string;

  users: string[];
  send_to_all?: boolean;
}
