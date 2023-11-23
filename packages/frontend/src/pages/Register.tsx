import { startRegistration } from '@simplewebauthn/browser';
import { usePostAuthRegistrationMutation, usePostAuthRegistrationVerificationMutation } from '../store/api.generated';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/auth.slice';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getErrorMessage } from '../helpers';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import spinnerSvg from '../assets/spinner.svg';

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, registerStatus] = usePostAuthRegistrationMutation();
  const [verify, verifyStatus] = usePostAuthRegistrationVerificationMutation();
  const [isBrowserRegistration, setIsBrowserRegistration] = useState(false);
  const onSubmit = async (data: { email: string; name: string }) => {
    const registration = await register({ body: data });
    if ('data' in registration) {
      const { id, response } = registration.data;
      try {
        setIsBrowserRegistration(true);
        const data = await startRegistration(response);
        const verification = await verify({ body: { id, response: data } });
        if ('data' in verification && verification.data.verified) {
          dispatch(setUser(verification.data.auth));
          navigate('/');
        }
      } finally {
        setIsBrowserRegistration(false);
      }
    }
  };

  const isLoading = registerStatus.isLoading || verifyStatus.isLoading;
  const isError = registerStatus.isError || verifyStatus.isError;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register for your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            const email = event.currentTarget.elements.namedItem('email');
            const name = event.currentTarget.elements.namedItem('name');
            if (email instanceof HTMLInputElement && name instanceof HTMLInputElement) {
              onSubmit({ email: email.value, name: name.value });
            }
          }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className="form-input block w-full input"
              />
            </div>
          </div>

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
                {getErrorMessage(registerStatus.error)}
                {getErrorMessage(verifyStatus.error)}
              </p>
            )}
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center btn">
              {isLoading ? (
                <>
                  <img src={spinnerSvg} className="mr-2 invert animate-spin" aria-hidden="true" />
                  Validating ...
                </>
              ) : isBrowserRegistration ? (
                <>
                  <img src={spinnerSvg} className="mr-2 invert animate-spin" aria-hidden="true" />
                  Chosing authentication method ...
                </>
              ) : (
                <>Register with passwordless login</>
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="btn-text">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
