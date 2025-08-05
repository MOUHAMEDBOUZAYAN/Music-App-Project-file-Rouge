// Date and Time Formatters
export const formatDate = (date, options = {}) => {
  const {
    format = 'medium',
    locale = 'en-US',
    timeZone = 'UTC'
  } = options;

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const formatOptions = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    long: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    relative: null
  };

  if (format === 'relative') {
    return formatRelativeTime(dateObj);
  }

  return dateObj.toLocaleDateString(locale, {
    timeZone,
    ...formatOptions[format]
  });
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Time Formatters
export const formatDuration = (seconds, format = 'mm:ss') => {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  switch (format) {
    case 'mm:ss':
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    case 'hh:mm:ss':
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    case 'human':
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m ${remainingSeconds}s`;
    default:
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

export const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

// Number Formatters
export const formatNumber = (number, options = {}) => {
  const {
    compact = false,
    decimals = 0,
    locale = 'en-US',
    currency = null,
    percentage = false
  } = options;

  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  const num = parseFloat(number);

  if (compact) {
    return formatCompactNumber(num, locale);
  }

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  if (percentage) {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num / 100);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatCompactNumber = (number, locale = 'en-US') => {
  const formatter = Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  return formatter.format(number);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text Formatters
export const formatText = (text, options = {}) => {
  const {
    maxLength = null,
    ellipsis = '...',
    case: textCase = null,
    trim = true
  } = options;

  if (!text) return '';

  let formattedText = text;

  if (trim) {
    formattedText = formattedText.trim();
  }

  if (textCase) {
    switch (textCase) {
      case 'uppercase':
        formattedText = formattedText.toUpperCase();
        break;
      case 'lowercase':
        formattedText = formattedText.toLowerCase();
        break;
      case 'capitalize':
        formattedText = formattedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'title':
        formattedText = formattedText.replace(/\w\S*/g, txt => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
    }
  }

  if (maxLength && formattedText.length > maxLength) {
    formattedText = formattedText.substring(0, maxLength) + ellipsis;
  }

  return formattedText;
};

export const formatSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Music-specific Formatters
export const formatTrackNumber = (number, total = null) => {
  if (total) {
    return `${number.toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`;
  }
  return number.toString().padStart(2, '0');
};

export const formatGenre = (genre) => {
  if (!genre) return 'Unknown Genre';
  
  return genre
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatArtistName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'Unknown Artist';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

export const formatAlbumTitle = (title, year = null) => {
  if (!title) return 'Unknown Album';
  if (year) return `${title} (${year})`;
  return title;
};

// URL Formatters
export const formatUrl = (url, options = {}) => {
  const { protocol = 'https://', removeProtocol = false } = options;

  if (!url) return '';

  let formattedUrl = url;

  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = protocol + formattedUrl;
  }

  if (removeProtocol) {
    formattedUrl = formattedUrl.replace(/^https?:\/\//, '');
  }

  return formattedUrl;
};

export const formatEmail = (email) => {
  if (!email) return '';
  
  // Basic email validation and formatting
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email';
  }
  
  return email.toLowerCase().trim();
};

// Phone Number Formatter
export const formatPhoneNumber = (phone, format = 'international') => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 0) return '';

  switch (format) {
    case 'international':
      if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      return phone;
    case 'national':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phone;
    default:
      return phone;
  }
};

// Currency Formatters
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPrice = (price, currency = 'USD') => {
  if (price === 0) return 'Free';
  return formatCurrency(price, currency);
};

// Social Media Formatters
export const formatUsername = (username) => {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
};

export const formatHashtag = (tag) => {
  if (!tag) return '';
  return tag.startsWith('#') ? tag : `#${tag}`;
};

// Validation Formatters
export const formatValidationError = (error) => {
  if (!error) return '';
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An error occurred';
};

// Color Formatters
export const formatHexColor = (color) => {
  if (!color) return '#000000';
  
  // Remove # if present
  let hex = color.replace('#', '');
  
  // Ensure it's 6 characters
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Validate hex format
  if (!/^[0-9A-F]{6}$/i.test(hex)) {
    return '#000000';
  }
  
  return `#${hex.toUpperCase()}`;
};

export const formatRgbaColor = (r, g, b, a = 1) => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Utility Formatters
export const formatId = (id, prefix = '') => {
  if (!id) return '';
  return `${prefix}${id.toString().padStart(6, '0')}`;
};

export const formatPercentage = (value, total, decimals = 1) => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

export const formatList = (items, separator = ', ', conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(separator)} ${conjunction} ${lastItem}`;
};

// Export all formatters
export default {
  // Date and Time
  formatDate,
  formatRelativeTime,
  formatTimeAgo,
  formatDuration,
  
  // Numbers
  formatNumber,
  formatCompactNumber,
  formatFileSize,
  
  // Text
  formatText,
  formatSlug,
  formatInitials,
  
  // Music
  formatTrackNumber,
  formatGenre,
  formatArtistName,
  formatAlbumTitle,
  
  // URLs and Contact
  formatUrl,
  formatEmail,
  formatPhoneNumber,
  
  // Currency
  formatCurrency,
  formatPrice,
  
  // Social Media
  formatUsername,
  formatHashtag,
  
  // Validation
  formatValidationError,
  
  // Colors
  formatHexColor,
  formatRgbaColor,
  
  // Utilities
  formatId,
  formatPercentage,
  formatList
}; 