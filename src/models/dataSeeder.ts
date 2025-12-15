import AppVersionModel from './appVersion/AppVersion';

export const dataSeeder = async () => {
  try {
    if (typeof (AppVersionModel as any).seedData === 'function') {
      await (AppVersionModel as any).seedData();
    }

    return true;
  } catch (error) {
    return false;
  }
};
