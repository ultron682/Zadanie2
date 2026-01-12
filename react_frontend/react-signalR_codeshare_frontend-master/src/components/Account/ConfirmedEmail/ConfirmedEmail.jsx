import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmedEmail.module.css';

const ConfirmedEmail = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.confirmedEmailContainer}>
      <h1>{t('emailConfirmedTitle')}</h1>
      <p>{t('emailConfirmedMessage')}</p>
      <Link to="/account/login" className={styles.loginLink}>
        {t('login')}
      </Link>
    </div>
  );
};

export default ConfirmedEmail;