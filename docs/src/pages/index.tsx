import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { MuiColorInputValue } from 'mui-color-input';
import { MuiColorInput } from 'mui-color-input';
import React, { useState } from 'react';
import DocusaurusImageUrl from '@site/static/img/logo.jpg';
import styles from './index.module.css';

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  const [color, setColor] = useState<MuiColorInputValue>('#ffffff');

  const handleChangeColor = (newColor: MuiColorInputValue) => {
    setColor(newColor);
  };

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img
          src={DocusaurusImageUrl as string}
          width={100}
          alt="MUI color input"
        />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className={clsx('hero__subtitle', styles.subtitle)}>
          A color input designed for the React library{' '}
          <Link target="_blank" href="https://mui.com">
            MUI
          </Link>{' '}
          built with{' '}
          <Link
            target="_blank"
            href="https://www.npmjs.com/package/@ctrl/tinycolor"
          >
            TinyColor
          </Link>
          .
        </p>
        <MuiColorInput
          value={color}
          onChange={handleChangeColor}
          sx={{
            '&.MuiColorInput-TextField input': {
              color: `var(--ifm-color-black)`,
            },
            "[data-theme='dark'] &.MuiColorInput-TextField input": {
              color: `var(--ifm-color-white)`,
            },
            "[data-theme='dark'] &.MuiColorInput-TextField fieldset": {
              borderColor: `var(--ifm-color-white) !important`,
            },
            '&.MuiColorInput-TextField fieldset': {
              borderColor: `var(--ifm-color-black) !important`,
            },
          }}
        />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

const Home = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />
      <button className="opacity-2.5 border-2 border-red-100 text-red-600">
        tailwindcss
      </button>
    </Layout>
  );
};

export default Home;
