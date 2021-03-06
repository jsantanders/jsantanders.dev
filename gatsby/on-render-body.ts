import { GatsbySSR } from 'gatsby';
import React from 'react';

import { siteConfig } from './settings';

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
const katexStylesheet = require('!css-loader!../static/css/katex/katex.min.css')

const onRenderBody: GatsbySSR['onRenderBody'] = async ({
  setHeadComponents,
  setPreBodyComponents,
}) => {
  const { useKatex } = siteConfig

  if (useKatex) {
    setHeadComponents([
      React.createElement('style', {
        key: 'katex-inline-stylesheet',
        dangerouslySetInnerHTML: { __html: katexStylesheet.toString() },
      }),
    ])
  }

  setPreBodyComponents([
    React.createElement('script', {
      key: 'gatsby-plugin-dark-mode',
      dangerouslySetInnerHTML: {
        __html: `
        void function() {
          window.__onThemeChange = function() {}
          var preferredTheme
          try {
            preferredTheme = localStorage.getItem('theme')
          } catch (err) { }
          function setTheme(newTheme) {
            if (preferredTheme && document.body.classList.contains(preferredTheme)) {
              document.body.classList.replace(preferredTheme, newTheme)
            } else {
              document.body.classList.add(newTheme)
            }
            window.__theme = newTheme
            preferredTheme = newTheme
            window.__onThemeChange(newTheme)
          }
          window.__setPreferredTheme = function(newTheme) {
            setTheme(newTheme)
            try {
              localStorage.setItem('theme', newTheme)
            } catch (err) {}
          }
          var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
          darkQuery.addListener(function(e) {
            window.__setPreferredTheme(e.matches ? 'dark' : 'light')
          })
          setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))
        }()
            `,
      },
    }),
  ])
}

export default onRenderBody
