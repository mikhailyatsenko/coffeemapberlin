import { useEffect } from 'react';
import cls from './PrivacyPolicyPage.module.scss';

export const PrivacyPolicyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, []);
  return (
    <section className={`${cls.PrivacyPolicyPage} container`}>
      <h1 className={cls.title}>Privacy Policy</h1>
      <p className={cls.updated}>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        We value your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use
        Berlin Coffee Map (the “Service”).
      </p>

      <h2 className={cls.sectionTitle}>Information We Collect</h2>
      <p>
        - Usage data such as pages visited and interactions to help us improve the Service.
        <br />- Optional account information if you sign in, such as your email address.
      </p>

      <h2 className={cls.sectionTitle}>How We Use Information</h2>
      <p>
        We use information to operate, maintain, and improve the Service, personalize content, and ensure security and
        abuse prevention.
      </p>

      <h2 className={cls.sectionTitle}>Cookies</h2>
      <p>
        We may use cookies or similar technologies to remember preferences and analyze usage. You can disable cookies in
        your browser, but some features may not function properly.
      </p>

      <h2 className={cls.sectionTitle}>Third-Party Services</h2>
      <p>
        We may use third-party services (e.g., analytics, maps, authentication). These providers have their own privacy
        policies governing the use of your information.
      </p>

      <h2 className={cls.sectionTitle}>Data Retention</h2>
      <p>
        We retain information only as long as necessary for the purposes described in this Policy or as required by law.
      </p>

      <h2 className={cls.sectionTitle}>Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your personal information. Contact
        us if you wish to exercise these rights.
      </p>

      <h2 className={cls.sectionTitle}>Contact</h2>
      <p>For questions about this Policy, please contact us via the Contact page.</p>
    </section>
  );
};
