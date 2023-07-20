import { FC, useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

import Dialog from '../Dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleSave = () => {
  //   homeDispatch({ field: 'lightMode', value: state.theme });
  //   saveSettings(state);
  //   const isEmailValid = email.match(
  //     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  //   );
  // };

  return (
    <Dialog open={open} onClose={onClose}>
      <form>
        <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
          {t('Login')}
        </div>

        <label
          className="text-sm font-bold text-black dark:text-neutral-200"
          htmlFor="email-input"
        >
          {t('Email')}
        </label>

        <input
          id="email-input"
          autoComplete="email"
          className="w-full mt-2 mb-4 flex-1 rounded-md border border-neutral-600 bg-white dark:bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3
							text-neutral-700 dark:text-neutral-200"
          type="email"
          placeholder="someone@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        ></input>

        <label
          className="text-sm font-bold text-black dark:text-neutral-200"
          htmlFor="password-input"
        >
          {t('Password')}
        </label>

        <input
          id="password-input"
          autoComplete="current-password"
          className="w-full mt-2 flex-1 rounded-md border border-neutral-600 bg-white dark:bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3
							text-neutral-700 dark:text-neutral-200"
          type="password"
          placeholder="**********"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        ></input>

        <button
          type="button"
          className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={() => {
            // handleSave();
            onClose();
          }}
        >
          {t('Login')}
        </button>
      </form>
    </Dialog>
  );
};
