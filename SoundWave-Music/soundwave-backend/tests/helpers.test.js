const {
  formatDuration,
  formatNumber,
  formatRelativeTime,
  generateSlug,
  isValidEmail,
  isValidUsername,
  validatePassword,
  generateRandomToken,
  paginateData,
  sortData,
  filterData,
  debounce,
  throttle,
  cleanObject,
  isValidMongoId,
  levenshteinDistance,
} = require('../src/utils/helpers');

describe('utils/helpers', () => {
  describe('formatDuration', () => {
    test('formats seconds to MM:SS', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(5)).toBe('0:05');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(600)).toBe('10:00');
      expect(formatDuration(-1)).toBe('0:00');
      expect(formatDuration(undefined)).toBe('0:00');
    });
  });

  describe('formatNumber', () => {
    test('formats number with K/M', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(2500000)).toBe('2.5M');
    });
  });

  describe('formatRelativeTime', () => {
    test('formats relative time in French', () => {
      const now = new Date();
      expect(formatRelativeTime(new Date(now.getTime() - 30 * 1000))).toBe("À l'instant");
      expect(formatRelativeTime(new Date(now.getTime() - 2 * 60 * 1000))).toBe('Il y a 2 minutes');
      expect(formatRelativeTime(new Date(now.getTime() - 2 * 60 * 60 * 1000))).toBe('Il y a 2 heures');
      expect(formatRelativeTime(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000))).toBe('Il y a 2 jours');
    });
  });

  describe('generateSlug', () => {
    test('generates URL-friendly slug', () => {
      expect(generateSlug('Bonjour le Monde!')).toBe('bonjour-le-monde');
      expect(generateSlug('Été 2023  --  Promo')).toBe('ete-2023-promo');
    });
  });

  describe('isValidEmail', () => {
    test('validates email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid@com')).toBe(false);
      expect(isValidEmail('no-at-symbol.com')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    test('validates username rules', () => {
      expect(isValidUsername('user_name123')).toBe(true);
      expect(isValidUsername('ab')).toBe(false);
      expect(isValidUsername('contains-dash')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates password strength', () => {
      const strong = validatePassword('Abcdef1');
      expect(strong.isValid).toBe(true);

      const weak = validatePassword('abc');
      expect(weak.isValid).toBe(false);
      expect(weak.errors.length).toBeGreaterThan(0);
    });
  });

  describe('generateRandomToken', () => {
    test('generates token of specified length', () => {
      const token = generateRandomToken(10);
      expect(token).toHaveLength(10);
      const token2 = generateRandomToken();
      expect(token2).toHaveLength(32);
    });
  });

  describe('paginateData', () => {
    test('paginates an array', () => {
      const data = Array.from({ length: 25 }, (_, i) => i + 1);
      const { data: page1, pagination } = paginateData(data, 1, 10);
      expect(page1).toEqual([1,2,3,4,5,6,7,8,9,10]);
      expect(pagination).toMatchObject({ page: 1, limit: 10, total: 25, pages: 3, hasNext: true, hasPrev: false });

      const { data: page3 } = paginateData(data, 3, 10);
      expect(page3).toEqual([21,22,23,24,25]);
    });
  });

  describe('sortData', () => {
    test('sorts array of objects', () => {
      const items = [
        { name: 'Charlie', age: 30 },
        { name: 'alice', age: 25 },
        { name: 'Bob', age: 28 },
      ];
      const asc = sortData([...items], 'name', 'asc');
      expect(asc.map(i => i.name)).toEqual(['alice','Bob','Charlie']);
      const desc = sortData([...items], 'age', 'desc');
      expect(desc.map(i => i.age)).toEqual([30,28,25]);
    });
  });

  describe('filterData', () => {
    test('filters by text, equality and array inclusion', () => {
      const data = [
        { id: 1, name: 'Alpha', tag: 'x' },
        { id: 2, name: 'Beta', tag: 'y' },
        { id: 3, name: 'Gamma', tag: 'z' },
      ];
      expect(filterData(data, { name: 'a' }).length).toBe(3);
      expect(filterData(data, { tag: ['x','z'] }).map(i => i.id)).toEqual([1,3]);
      expect(filterData(data, { id: 2 })[0].name).toBe('Beta');
    });
  });

  describe('cleanObject', () => {
    test('removes null and undefined', () => {
      const obj = { a: 1, b: null, c: undefined, d: 0, e: '' };
      expect(cleanObject(obj)).toEqual({ a: 1, d: 0, e: '' });
    });
  });

  describe('isValidMongoId', () => {
    test('validates 24 hex chars', () => {
      expect(isValidMongoId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidMongoId('invalid-id')).toBe(false);
    });
  });

  describe('levenshteinDistance', () => {
    test('computes distance', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('flaw', 'lawn')).toBe(2);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    test('debounces calls', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      expect(fn).not.toBeCalled();
      jest.advanceTimersByTime(100);
      expect(fn).toBeCalledTimes(1);
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();
    test('throttles calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);
      throttled();
      throttled();
      expect(fn).toBeCalledTimes(1);
      jest.advanceTimersByTime(100);
      throttled();
      expect(fn).toBeCalledTimes(2);
    });
  });
});


