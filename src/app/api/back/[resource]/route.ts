import { routesBackend } from '@/config/routes';
import { decryptToken } from '@/server/actions/session.actions';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logError } from 'src/server/logger';
import HttpStatus from '@/lib/constants/http-status-codes';

// Schemas separados por recurso (idealmente em arquivos próprios)
const UserSchema = z.object({ id: z.string(), name: z.string() });
const Schemas: Record<string, z.ZodTypeAny> = { users: UserSchema };

const getRouteConfig = (resource: string) => {
  switch (resource) {
    case 'users':
      return { url: routesBackend.users.getAll, schema: Schemas.users };
    default:
      return null;
  }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const token = req.headers.get('authorization') || req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { error: HttpStatus.UNAUTHORIZED.messages.UNAUTHORIZED },
      { status: HttpStatus.UNAUTHORIZED.code },
    );
  }

  let decryptedToken: string;
  try {
    decryptedToken = await decryptToken(token);
  } catch (err) {
    logError('api/[resource]', 'Erro ao descriptografar token', { err, resource });
    return NextResponse.json(
      { error: HttpStatus.UNAUTHORIZED.messages.UNAUTHORIZED },
      { status: HttpStatus.UNAUTHORIZED.code },
    );
  }

  const route = getRouteConfig(resource);
  if (!route) {
    return NextResponse.json(
      { error: HttpStatus.NOT_FOUND.messages.NOT_FOUND },
      { status: HttpStatus.NOT_FOUND.code },
    );
  }

  try {
    const backendResponse = await fetch(route.url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${decryptedToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();
    const result = route.schema.safeParse(data);

    if (!result.success) {
      logError(route.url, 'Erro de validação Zod', {
        issues: result.error.issues,
        resource,
        data: Array.isArray(data) ? data.slice(0, 10) : data,
      });
      return NextResponse.json(
        { error: HttpStatus.INTERNAL_SERVER_ERROR.messages.INTERNAL_SERVER_ERROR },
        { status: HttpStatus.INTERNAL_SERVER_ERROR.code },
      );
    }

    return NextResponse.json(result.data, { status: backendResponse.status });
  } catch (error) {
    logError('api/[resource]', error, { resource });
    return NextResponse.json(
      { error: HttpStatus.INTERNAL_SERVER_ERROR.messages.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR.code },
    );
  }
}
