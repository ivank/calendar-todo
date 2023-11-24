import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { EnvType } from '../env.js';

const AuthenticatorTransportFuture = Type.Union([
  Type.Literal('ble'),
  Type.Literal('cable'),
  Type.Literal('hybrid'),
  Type.Literal('internal'),
  Type.Literal('nfc'),
  Type.Literal('smart-card'),
  Type.Literal('usb'),
]);
const AuthenticatorAttachment = Type.Union([Type.Literal('cross-platform'), Type.Literal('platform')]);
const ResidentKeyRequirement = Type.Union([
  Type.Literal('discouraged'),
  Type.Literal('preferred'),
  Type.Literal('required'),
]);
const AttestationConveyancePreference = Type.Union([
  Type.Literal('direct'),
  Type.Literal('enterprise'),
  Type.Literal('indirect'),
  Type.Literal('none'),
]);

const Extension = Type.Object({
  appid: Type.Optional(Type.String()),
  credProps: Type.Optional(Type.Boolean()),
  hmacCreateSecret: Type.Optional(Type.Boolean()),
});

const ClientExtentionResult = Type.Object({
  appid: Type.Optional(Type.Boolean()),
  credProps: Type.Optional(Type.Object({ rk: Type.Optional(Type.Boolean()) })),
  hmacCreateSecret: Type.Optional(Type.Boolean()),
});

const PublicKeyCredential = Type.Object({
  id: Type.String(),
  type: Type.Literal('public-key'),
  transports: Type.Optional(Type.Array(AuthenticatorTransportFuture)),
});

const RegistrationOptions = Type.Object({
  rp: Type.Object({
    name: Type.String(),
    id: Type.Optional(Type.String()),
  }),
  user: Type.Object({
    id: Type.String(),
    name: Type.String(),
    displayName: Type.String(),
  }),
  challenge: Type.String(),
  pubKeyCredParams: Type.Array(
    Type.Object({
      alg: Type.Number(),
      type: Type.Literal('public-key'),
    }),
  ),
  timeout: Type.Optional(Type.Number()),
  excludeCredentials: Type.Optional(Type.Array(PublicKeyCredential)),
  authenticatorSelection: Type.Optional(
    Type.Partial(
      Type.Object({
        authenticatorAttachment: AuthenticatorAttachment,
        requireResidentKey: Type.Boolean(),
        residentKey: ResidentKeyRequirement,
        userVerification: ResidentKeyRequirement,
      }),
    ),
  ),
  attestation: Type.Optional(AttestationConveyancePreference),
  extensions: Type.Optional(Extension),
});

const RegistrationVerification = Type.Object({
  id: Type.String(),
  rawId: Type.String(),
  response: Type.Object({
    clientDataJSON: Type.String(),
    attestationObject: Type.String(),
    authenticatorData: Type.Optional(Type.String()),
    transports: Type.Optional(Type.Array(AuthenticatorTransportFuture)),
    publicKeyAlgorithm: Type.Optional(Type.Number()),
    publicKey: Type.Optional(Type.String()),
  }),
  authenticatorAttachment: Type.Optional(AuthenticatorAttachment),
  clientExtensionResults: ClientExtentionResult,
  type: Type.Literal('public-key'),
});

const Authentication = Type.Object({
  challenge: Type.String(),
  timeout: Type.Optional(Type.Number()),
  rpId: Type.Optional(Type.String()),
  allowCredentials: Type.Optional(Type.Array(PublicKeyCredential)),
  userVerification: Type.Optional(ResidentKeyRequirement),
  extensions: Type.Optional(Extension),
});

const AuthenticationVerification = Type.Object({
  id: Type.String(),
  rawId: Type.String(),
  response: Type.Object({
    clientDataJSON: Type.String(),
    authenticatorData: Type.String(),
    signature: Type.String(),
    userHandle: Type.Optional(Type.String()),
  }),
  authenticatorAttachment: Type.Optional(AuthenticatorAttachment),
  clientExtensionResults: ClientExtentionResult,
  type: Type.Literal('public-key'),
});

const Auth = Type.Object({
  token: Type.String(),
  name: Type.String(),
  email: Type.String(),
  id: Type.Number(),
});

const RegistrationRequest = Type.Object({
  email: Type.String({ format: 'email', minLength: 3, maxLength: 100 }),
  name: Type.String({ minLength: 3, maxLength: 100 }),
});
const RegistrationResponse = Type.Object({ id: Type.Number(), response: RegistrationOptions });
const RegistrationVerificationRequest = Type.Object({ id: Type.Number(), response: RegistrationVerification });
const RegistrationVerificationResponse = Type.Union([
  Type.Object({ verified: Type.Literal(true), auth: Auth }),
  Type.Object({ verified: Type.Literal(false) }),
]);

const AuthenticationRequest = Type.Object({ email: Type.String() });
const AuthenticationResponse = Type.Object({ id: Type.Number(), response: Authentication });
const AuthenticationVerificationRequest = Type.Object({
  id: Type.Number(),
  response: AuthenticationVerification,
});
const AuthenticationVerificationResponse = Type.Union([
  Type.Object({ verified: Type.Literal(true), auth: Auth }),
  Type.Object({ verified: Type.Literal(false) }),
]);

const HttpError = Type.Object({ message: Type.String() });

export const auth: FastifyPluginAsync<{ prisma: PrismaClient; env: EnvType }> = async (app, { env, prisma }) => {
  const authRp = { rpID: new URL(env.ORIGIN).hostname, rpName: 'Calendar Todo', origin: env.ORIGIN };

  app
    .withTypeProvider<TypeBoxTypeProvider & { input: unknown }>()

    // Registration
    // =======================================
    .post(
      '/registration',
      { schema: { body: RegistrationRequest, response: { 200: RegistrationResponse } } },
      async ({ body }, res) => {
        const previousUser = await prisma.user.findFirst({
          select: { id: true, lists: { select: { id: true } }, authenticators: { select: { id: true } } },
          where: { email: body.email },
        });
        /**
         * Check for existing users but allow overwriting if the previous user is totally empty
         */
        if (previousUser && previousUser.lists.length && previousUser.authenticators.length) {
          throw new Error('User already registered with this email');
        }
        const { id } = previousUser
          ? await prisma.user.update({ select: { id: true }, data: body, where: { id: previousUser.id } })
          : await prisma.user.create({ select: { id: true }, data: body });

        const response = await generateRegistrationOptions({
          ...authRp,
          userID: String(id),
          userName: body.email,
          userDisplayName: body.name,
          attestationType: 'none',
        });
        await prisma.user.update({ where: { id }, data: { challenge: response.challenge } });
        await res.send({ id, response });
      },
    )
    .post(
      '/registration/verification',
      { schema: { body: RegistrationVerificationRequest, response: { 200: RegistrationVerificationResponse } } },
      async ({ body: { id, response } }, res) => {
        const { challenge, email, name } = await prisma.user.findFirstOrThrow({
          where: { id },
          select: { challenge: true, email: true, name: true },
        });
        const verification = await verifyRegistrationResponse({
          response,
          expectedChallenge: challenge,
          expectedOrigin: env.ORIGIN,
          expectedRPID: authRp.rpID,
        });
        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
          await prisma.user.update({ where: { id }, data: { challenge: '' } });
          await prisma.authenticator.create({
            data: {
              userId: id,
              counter: registrationInfo.counter,
              credentialID: Buffer.from(registrationInfo.credentialID).toString('base64url'),
              credentialDeviceType: registrationInfo.credentialDeviceType,
              credentialPublicKey: Buffer.from(registrationInfo.credentialPublicKey),
              credentialBackedUp: registrationInfo.credentialBackedUp,
              transports: response.response.transports,
            },
          });
          const token = await res.jwtSign({ id }, { expiresIn: '30 days' });
          res.send({ verified, auth: { name, email, token, id } });
        } else {
          res.send({ verified: false });
        }
      },
    )

    // Authentication
    // =======================================
    .post(
      '/authentication',
      {
        schema: {
          body: AuthenticationRequest,
          response: { 200: AuthenticationResponse, 404: HttpError, 401: HttpError },
        },
      },
      async ({ body }, res) => {
        const { id, authenticators } = await prisma.user.findFirstOrThrow({
          select: { id: true, authenticators: { select: { credentialID: true, transports: true } } },
          where: { email: body.email },
        });
        const response = await generateAuthenticationOptions({
          ...authRp,
          userVerification: 'preferred',
          allowCredentials: authenticators.map(({ credentialID, transports }) => ({
            id: Buffer.from(credentialID, 'base64url'),
            transports: transports as any[],
            type: 'public-key',
          })),
        });
        await prisma.user.update({ where: { id }, data: { challenge: response.challenge } });
        await res.send({ id, response });
      },
    )
    .post(
      '/authentication/verification',
      {
        schema: {
          body: AuthenticationVerificationRequest,
          response: { 200: AuthenticationVerificationResponse, 404: HttpError },
        },
      },
      async ({ body }, res) => {
        const { challenge, email, id, name } = await prisma.user.findFirstOrThrow({
          where: { id: body.id },
          select: { challenge: true, email: true, id: true, name: true },
        });
        const authenticator = await prisma.authenticator.findFirstOrThrow({
          where: { userId: id, credentialID: body.response.id },
        });

        const verification = await verifyAuthenticationResponse({
          response: body.response,
          expectedChallenge: challenge,
          expectedOrigin: env.ORIGIN,
          expectedRPID: authRp.rpID,
          authenticator: {
            ...authenticator,
            credentialID: Uint8Array.from(Buffer.from(authenticator.credentialID, 'base64url')),
            credentialPublicKey: Uint8Array.from(authenticator.credentialPublicKey),
            counter: Number(authenticator.counter),
            transports: authenticator.transports as any[],
          },
        });
        const { verified } = verification;
        if (verified) {
          await prisma.user.update({ where: { id }, data: { challenge: '' } });
          const token = await res.jwtSign({ id }, { expiresIn: '30 days' });
          res.send({ verified, auth: { id, name, email, token } });
        } else {
          res.send({ verified: false });
        }
      },
    );
};
