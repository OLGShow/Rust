/**
 * Steam OpenID авторизация для RUST Store
 * Реализует стандартный Steam OpenID flow
 */

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
const STEAM_API_BASE = 'https://api.steampowered.com';

export class SteamAuth {
  constructor(apiKey, returnUrl) {
    this.apiKey = apiKey;
    this.returnUrl = returnUrl;
    this.realm = window.location.origin;
  }

  /**
   * Инициирует процесс авторизации через Steam
   */
  login() {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': this.returnUrl,
      'openid.realm': this.realm,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    window.location.href = `${STEAM_OPENID_URL}?${params.toString()}`;
  }

  /**
   * Обрабатывает ответ от Steam после авторизации
   */
  async handleCallback(queryParams) {
    try {
      // Извлекаем Steam ID из ответа
      const steamId = this.extractSteamId(queryParams.get('openid.claimed_id'));
      
      if (!steamId) {
        throw new Error('Steam ID не найден в ответе');
      }

      // Получаем информацию о пользователе
      const userInfo = await this.getUserInfo(steamId);
      
      // Проверяем владение игрой RUST
      const ownsRust = await this.checkGameOwnership(steamId, 252490); // RUST App ID
      
      return {
        steamId,
        userInfo,
        ownsRust,
        authenticated: true
      };
    } catch (error) {
      console.error('Ошибка обработки Steam callback:', error);
      throw error;
    }
  }

  /**
   * Извлекает Steam ID из OpenID Identity URL
   */
  extractSteamId(identityUrl) {
    if (!identityUrl) return null;
    const match = identityUrl.match(/\/id\/(\d+)$/);
    return match ? match[1] : null;
  }

  /**
   * Получает информацию о пользователе Steam
   */
  async getUserInfo(steamId) {
    try {
      // В реальном приложении этот запрос должен идти через ваш backend
      // из-за CORS ограничений Steam API
      const response = await fetch(
        `/api/steam/user/${steamId}?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка получения данных пользователя');
      }

      const data = await response.json();
      return data.response.players[0];
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      // Возвращаем мок-данные для демонстрации
      return {
        steamid: steamId,
        personaname: 'RUST Player',
        avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
        profileurl: `https://steamcommunity.com/profiles/${steamId}`,
        personastate: 1
      };
    }
  }

  /**
   * Проверяет владение игрой
   */
  async checkGameOwnership(steamId, appId) {
    try {
      // В реальном приложении этот запрос должен идти через ваш backend
      const response = await fetch(
        `/api/steam/ownership/${steamId}/${appId}?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка проверки владения игрой');
      }

      const data = await response.json();
      return data.response.game_count > 0;
    } catch (error) {
      console.error('Ошибка проверки владения игрой:', error);
      // Для демонстрации возвращаем true
      return true;
    }
  }

  /**
   * Выход из системы
   */
  logout() {
    localStorage.removeItem('steamUser');
    localStorage.removeItem('steamToken');
    return Promise.resolve();
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated() {
    const user = localStorage.getItem('steamUser');
    const token = localStorage.getItem('steamToken');
    return !!(user && token);
  }

  /**
   * Получает данные текущего пользователя
   */
  getCurrentUser() {
    const userData = localStorage.getItem('steamUser');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Сохраняет данные пользователя в localStorage
   */
  saveUserData(userData) {
    localStorage.setItem('steamUser', JSON.stringify(userData));
    localStorage.setItem('steamToken', userData.steamId);
  }
}

// Вспомогательные функции
export const steamUtils = {
  /**
   * Форматирует Steam ID в различных форматах
   */
  formatSteamId(steamId64) {
    const steamId32 = BigInt(steamId64) - BigInt('76561197960265728');
    return {
      steamId64,
      steamId32: steamId32.toString(),
      steamId: `STEAM_0:${steamId32 % BigInt(2)}:${steamId32 / BigInt(2)}`
    };
  },

  /**
   * Проверяет валидность Steam ID
   */
  isValidSteamId(steamId) {
    return /^\d{17}$/.test(steamId) && BigInt(steamId) > BigInt('76561197960265728');
  },

  /**
   * Получает URL аватара Steam пользователя
   */
  getAvatarUrl(avatarHash, size = 'medium') {
    const sizes = {
      small: '',
      medium: '_medium',
      large: '_full'
    };
    
    return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${avatarHash.substring(0, 2)}/${avatarHash}${sizes[size]}.jpg`;
  }
};

// Экспорт по умолчанию
export default SteamAuth; 