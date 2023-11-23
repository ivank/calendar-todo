import { startAuthentication } from '@simplewebauthn/browser';
import {
  usePostAuthAuthenticationMutation,
  usePostAuthAuthenticationVerificationMutation,
} from '../store/api.generated';
import { setUser } from '../store/auth.slice';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import spinnerSvg from '../assets/spinner.svg';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { getErrorMessage } from '../helpers';
import { useDispatch } from 'react-redux';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authenticate, authenticateStatus] = usePostAuthAuthenticationMutation();
  const [verify, verifyStatus] = usePostAuthAuthenticationVerificationMutation();
  const [isBrowserAuthentication, setIsBrowserAuthentication] = useState(false);
  const onSubmit = async (email: string) => {
    const authentication = await authenticate({ body: { email } });
    if ('data' in authentication) {
      const { id, response } = authentication.data;
      try {
        setIsBrowserAuthentication(true);
        const data = await startAuthentication(response);
        setIsBrowserAuthentication(false);
        const verification = await verify({ body: { id, response: data } });

        if ('data' in verification && verification.data.verified) {
          dispatch(setUser(verification.data.auth));
          navigate('/');
        }
      } finally {
        setIsBrowserAuthentication(false);
      }
    }
  };
  const isLoading = authenticateStatus.isLoading || verifyStatus.isLoading;
  const isError = authenticateStatus.isError || verifyStatus.isError;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit((event.currentTarget.elements.namedItem('email') as HTMLInputElement).value);
          }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email webauthn"
                required
                className={classNames('form-input block w-full input', { 'input-error': isError })}
              />
              {isError && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {isError && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {getErrorMessage(authenticateStatus.error)}
                {getErrorMessage(verifyStatus.error)}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center btn"
              disabled={isLoading || isBrowserAuthentication}
            >
              {isLoading ? (
                <>
                  <img src={spinnerSvg} className="mr-2 invert animate-spin" aria-hidden="true" />
                  Validating ...
                </>
              ) : isBrowserAuthentication ? (
                <>
                  <img src={spinnerSvg} className="mr-2 invert animate-spin" aria-hidden="true" />
                  Chosing authentication method ...
                </>
              ) : (
                <>Passwordless signin</>
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="btn-text">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};
