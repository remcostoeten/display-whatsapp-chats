CREATE TABLE IF NOT EXISTS "chat_settings" (
	"chat_id" varchar(36) PRIMARY KEY NOT NULL,
	"pin_code" varchar(64),
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"last_failed_attempt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"message_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"chat_id" varchar(36) NOT NULL,
	"name" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"attachment" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "failed_attempts_idx" ON "chat_settings" ("failed_attempts","last_failed_attempt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "favorites" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_favorite_idx" ON "favorites" ("message_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_id_idx" ON "messages" ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "timestamp_chat_idx" ON "messages" ("chat_id","timestamp");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
