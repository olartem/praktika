import { NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3Utils";

export const runtime = "edge";

export async function POST(request: Request) {
    const { fileName, fileType } = await request.json();
    if (!fileName || !fileType) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const { uploadUrl, key } = await getPresignedUploadUrl(fileName, fileType);
        return NextResponse.json({ uploadUrl, key });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
