import { useEffect } from 'react';
import cls from './DisclaimerPage.module.scss';

export const DisclaimerPage = () => {
  useEffect(() => {
    document.title = 'Disclaimer | Berlin Coffee Map';
  }, []);

  return (
    <section className={`${cls.DisclaimerPage} container`}>
      <h1 className={cls.title}>Disclaimer</h1>
      <p className={cls.updated}>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        The information provided by Berlin Coffee Map is for general informational purposes only. While we strive for
        accuracy, we make no representation or warranty of any kind regarding accuracy, adequacy, validity, reliability,
        availability, or completeness of any information on the Service.
      </p>

      <h2 className={cls.sectionTitle}>External Links</h2>
      <p>
        The Service may contain links to third-party websites. We do not endorse and are not responsible for the content
        or practices of such websites.
      </p>

      <h2 className={cls.sectionTitle}>Professional Disclaimer</h2>
      <p>
        Information on the Service does not constitute professional or legal advice. Any reliance you place on such
        information is strictly at your own risk.
      </p>

      <h2 className={cls.sectionTitle}>Reviews and Opinions</h2>
      <p>
        Reviews, ratings, and opinions are subjective and provided for convenience only. Your experience may differ.
      </p>

      <h2 className={cls.sectionTitle}>Contact</h2>
      <p>If you have any questions about this Disclaimer, please contact us via the Contact page.</p>
    </section>
  );
};
