import { supabaseServer } from "@/app/utils/supabase/server-client";
import { prisma } from "@/app/utils/prisma/client";
import { NextRequest } from "next/server";

interface AuthenticatedUser {
  prismaUserId: string;
  supabaseId: string;
}

export async function getAuthenticatedUser(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    console.warn("Authentication failed: Token not found.");
    return null;
  }

  try {
    const { data: userData, error: authError } =
      await supabaseServer.auth.getUser(token);

    if (authError || !userData?.user) {
      console.error("Supabase token verification failed:", authError?.message);
      return null;
    }

    const supabaseId = userData.user.id;
    const email = userData.user.email;

    let user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true, email: true },
    });

    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        select: { id: true, email: true },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { supabaseId: supabaseId },
          select: { id: true, email: true },
        });
      } else {
        user = await prisma.user.create({
          data: {
            supabaseId: supabaseId,
            email: email,
          },
          select: { id: true, email: true },
        });
      }
    }

    if (!user) {
      console.warn(
        `Authentication failed: User with Supabase ID ${supabaseId} was not found in Prisma.`
      );
      return null;
    }

    return {
      prismaUserId: user.id,
      supabaseId: supabaseId,
    };
  } catch (error) {
    console.error("Unexpected error during token authorization:", error);
    return null;
  }
}
