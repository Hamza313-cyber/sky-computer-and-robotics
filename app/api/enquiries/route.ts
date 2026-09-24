import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(100, "Email too long"),
  phone: z.string().max(20, "Phone too long").optional().nullable(),
  subject: z.string().max(150, "Subject too long").optional().nullable(),
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  website: z.string().optional().nullable(),
  product_id: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues ? parsed.error.issues[0].message : "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, phone, subject, message, website, product_id } = parsed.data;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true, silent_reject: true });
    }

    // Insert to DB using server client
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert({
      name,
      email,
      phone,
      subject,
      message,
      product_id,
    });

    if (error) {
      console.error("Enquiry insert error:", error);
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
