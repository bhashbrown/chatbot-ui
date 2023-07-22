import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { FC, MouseEventHandler, useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import Dialog from '../Dialog';
import Spinner from '../Spinner';

interface Props {
  open: boolean;
  onClose: () => void;
  userEmail: string | null | undefined;
}

export const LogoutDialog: FC<Props> = ({ open, onClose, userEmail }) => {
  // TODO add login.json to /public/locales and translate the phrases below
  const { t } = useTranslation('login');
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const [generalError, setGeneralError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const handleLogout: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setGeneralError('');
    try {
      await signOut();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setGeneralError(
        t('There was an error while trying to logout.') ||
          'There was an error while trying to logout.',
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div>
        <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
          {userEmail ?? t('User')}
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 mt-2 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          disabled={isProcessing}
          onClick={handleLogout}
        >
          <div className="flex justify-center items-center h-5">
            {isProcessing ? (
              <Spinner />
            ) : (
              <>
                <IconLogout className="text-neutral-900 mr-2" size={18} />
                {t('Logout')}
              </>
            )}
          </div>
        </button>
        <p className="text-rose-500 mt-4 text-sm text-center">
          {t(generalError)}
        </p>
      </div>
    </Dialog>
  );
};
