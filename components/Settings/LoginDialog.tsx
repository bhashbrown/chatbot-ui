import { signIn } from 'next-auth/react';
import { FC, MouseEventHandler, useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { SignUpBody } from '@/types/auth';

import HomeContext from '@/pages/api/home/home.context';

import Dialog from '../Dialog';
import Spinner from '../Spinner';
import TextField from '../TextField';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: FC<Props> = ({ open, onClose }) => {
  // TODO add login.json to /public/locales and translate the phrases below
  const { t } = useTranslation('login');
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [variant, setVariant] = useState<'Login' | 'Sign Up'>('Sign Up');

  const isEmailValid = (email: string) => {
    if (!email) {
      return false;
    }

    return email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    );
  };

  const handleLogin: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setIsProcessing(false);
      return setEmailError(
        t('Email address is required') || 'Email address is required',
      );
    }

    if (!isEmailValid(email)) {
      setIsProcessing(false);
      return setEmailError(
        t('Please enter a valid email address') ||
          'Please enter a valid email address',
      );
    }

    if (!password) {
      setIsProcessing(false);
      return setPasswordError(
        t('Password is required') || 'Password is required',
      );
    }

    try {
      const signUpBody: SignUpBody = { email, password };
      // create user if they don't exist
      const signUpResponse = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpBody),
      });

      if (!signUpResponse?.ok) {
        setIsProcessing(false);
        setGeneralError(
          t('There was an error while trying to sign up.') ||
            'There was an error while trying to sign up.',
        );
        return;
      }

      // login using credentials
      const signInResponse = await signIn('credentials', {
        redirect: true,
        email,
        password,
      });
      if (signInResponse?.error) {
        setIsProcessing(false);
        return setGeneralError(
          t('Unable to log in. Either the email or password is incorrect.') ||
            'Unable to log in. Either the email or password is incorrect.',
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setGeneralError(
        t('There was an error while trying to login.') ||
          'There was an error while trying to login.',
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form>
        <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
          {t(variant)}
        </div>
        {variant === 'Sign Up' ? (
          <p className="text-black dark:text-neutral-200 mt-1 mb-7">
            Create your account or{' '}
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                setVariant('Login');
              }}
              type="button"
            >
              sign into your existing account now.
            </button>
          </p>
        ) : (
          <p className="text-black dark:text-neutral-200 mt-1 mb-7">
            Sign into your account or{' '}
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                setVariant('Sign Up');
              }}
              type="button"
            >
              create an account today.
            </button>
          </p>
        )}

        <TextField
          id="email-input"
          autoComplete="email"
          error={!!emailError}
          helperText={emailError}
          label={t('Email') || 'Email'}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="someone@example.com"
          type="email"
          value={email}
        />
        <TextField
          id="password-input"
          autoComplete="password"
          error={!!passwordError}
          helperText={passwordError}
          label={t('Password') || 'Password'}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="**********"
          type="password"
          value={password}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 mt-2 mb-2 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          disabled={isProcessing}
          onClick={handleLogin}
        >
          <div className="flex justify-center items-center h-5">
            {isProcessing ? <Spinner /> : t(variant)}
          </div>
        </button>
        <p className="text-rose-500 mt-4 text-sm text-center">
          {t(generalError)}
        </p>
      </form>
    </Dialog>
  );
};
