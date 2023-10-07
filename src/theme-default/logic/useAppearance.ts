const classList = document.documentElement.classList;

const APPEARANCE_KEY = 'appearance';

// 设置暗黑模式
const setClassList = (isDark: boolean = false) => {
  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};

const updateApperance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'dark');
};

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  updateApperance();
  // 监听缓存自动切换暗黑模式
  window.addEventListener('storage', updateApperance);
}

export function toggle() {
  if (classList.contains('dark')) {
    setClassList(false);
    localStorage.setItem(APPEARANCE_KEY, 'light');
  } else {
    setClassList(true);
    localStorage.setItem(APPEARANCE_KEY, 'dark');
  }
}
