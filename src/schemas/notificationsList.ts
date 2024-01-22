import { z } from "zod";

export const notificationsList = z.array(
  z.object({
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    screen_title: z.string(),
    title: z.string(),
    message: z.string(),
    message_preview: z.string(),
    top_image_url: z.string(),
    push_top_image_url: z.string(),
    main_image_url: z.string(),
    thumbnail_url: z.string(),
    on_click_action: z.string(),
    on_click_data: z.string(),
    campaign_id: z.string(),
    notification_type: z.string(),
    household_data: z.unknown(),
  })
);
