import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind(), presetIcons()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--islas-c-divider-light)'
      })
    ],
    [
      'menu-item-before',
      {
        'margin-right': '12px',
        'margin-left': '12px',
        width: '1px',
        height: '24px',
        'background-color': 'var(--islas-c-divider-light)',
        content: '" "'
      }
    ]
  ],
  // 主题
  theme: {
    fontSize: {
      '6xl': ['3.5rem', '4rem']
    },
    breakpoints: {
      xs: '640px',
      sm: '768px',
      md: '960px',
      lg: '1280px'
    },
    colors: {
      brandLight: 'var(--islas-c-brand-light)',
      brandDark: 'var(--islas-c-brand-dark)',
      brand: 'var(--islas-c-brand)',
      text: {
        1: 'var(--islas-c-text-1)',
        2: 'var(--islas-c-text-2)',
        3: 'var(--islas-c-text-3)',
        4: 'var(--islas-c-text-4)'
      },
      divider: {
        default: 'var(--islas-c-divider)',
        light: 'var(--islas-c-divider-light)',
        dark: 'var(--islas-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--islas-c-gray-light-1)',
          2: 'var(--islas-c-gray-light-2)',
          3: 'var(--islas-c-gray-light-3)',
          4: 'var(--islas-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--islas-c-bg)',
        soft: 'var(--islas-c-bg-soft)',
        mute: 'var(--islas-c-bg-mute)'
      }
    }
  }
};

export default options;
