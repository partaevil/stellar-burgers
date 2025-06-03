import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions'
  ],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  babel: async (options) => {
    return {
      ...options,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      plugins: [
        ...options.plugins,
        ['module-resolver', {
          root: ['./src'],
          alias: {
            '@pages': './src/pages',
            '@components': './src/components',
            '@ui': './src/components/ui',
            '@ui-pages': './src/components/ui/pages',
            '@utils-types': './src/utils/types',
            '@api': './src/utils/burger-api.ts',
            '@slices': './src/services/slices',
            '@selectors': './src/services/selectors'
          }
        }]
      ]
    };
  },
  webpackFinal: async (config) => {
    const rootDir = process.cwd();
    
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                ['module-resolver', {
                  root: ['./src'],
                  alias: {
                    '@pages': path.resolve(rootDir, 'src/pages'),
                    '@components': path.resolve(rootDir, 'src/components'),
                    '@ui': path.resolve(rootDir, 'src/components/ui'),
                    '@ui-pages': path.resolve(rootDir, 'src/components/ui/pages'),
                    '@utils-types': path.resolve(rootDir, 'src/utils/types'),
                    '@api': path.resolve(rootDir, 'src/utils/burger-api.ts'),
                    '@slices': path.resolve(rootDir, 'src/services/slices'),
                    '@selectors': path.resolve(rootDir, 'src/services/selectors')
                  }
                }]
              ]
            }
          }
        ],
        exclude: /node_modules/,
      });
    }

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@pages': path.resolve(rootDir, 'src/pages'),
        '@components': path.resolve(rootDir, 'src/components'),
        '@ui': path.resolve(rootDir, 'src/components/ui'),
        '@ui-pages': path.resolve(rootDir, 'src/components/ui/pages'),
        '@utils-types': path.resolve(rootDir, 'src/utils/types'),
        '@api': path.resolve(rootDir, 'src/utils/burger-api.ts'),
        '@slices': path.resolve(rootDir, 'src/services/slices'),
        '@selectors': path.resolve(rootDir, 'src/services/selectors')
      };
    }

    return config;
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        // disable SWC to use Babel instead
        useSWC: false 
      }
    }
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;