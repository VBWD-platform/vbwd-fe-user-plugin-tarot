import { type IPlugin, type IPlatformSDK } from 'vbwd-view-component';
import { userNavRegistry } from '@/plugins/userNavRegistry';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';
import th from './locales/th.json';
import zh from './locales/zh.json';

/**
 * Tarot Plugin - Tarot card reading with LLM interpretations
 */
export const tarotPlugin: IPlugin = {
  name: 'tarot',
  version: '1.0.0',
  description: 'Tarot card reading with AI-powered interpretations',
  _active: false,

  install(sdk: IPlatformSDK) {
    // Add Tarot route
    sdk.addRoute({
      path: '/dashboard/tarot',
      name: 'tarot',
      component: () => import('./src/Tarot.vue'),
      meta: { requiresAuth: true },
    });

    // Add translations for all 8 languages
    sdk.addTranslations('en', en);
    sdk.addTranslations('de', de);
    sdk.addTranslations('es', es);
    sdk.addTranslations('fr', fr);
    sdk.addTranslations('ja', ja);
    sdk.addTranslations('ru', ru);
    sdk.addTranslations('th', th);
    sdk.addTranslations('zh', zh);
  },

  activate() {
    userNavRegistry.register({
      pluginName: 'tarot',
      to: '/dashboard/tarot',
      labelKey: 'nav.tarot',
      testId: 'nav-tarot',
    });
  },

  deactivate() {
    userNavRegistry.unregister('tarot');
  },
};
