import React, { useState } from 'react';
import { Heart, UserPlus, UserCheck, Loader } from 'lucide-react';

const FollowButton = ({ 
  userId, 
  isFollowing = false, 
  onFollow, 
  onUnfollow, 
  size = 'medium',
  variant = 'default'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localFollowing, setLocalFollowing] = useState(isFollowing);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (localFollowing) {
        if (onUnfollow) {
          await onUnfollow(userId);
        }
        setLocalFollowing(false);
      } else {
        if (onFollow) {
          await onFollow(userId);
        }
        setLocalFollowing(true);
      }
    } catch (error) {
      console.error('Follow/Unfollow failed:', error);
      // Revert the local state on error
      setLocalFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'flex items-center space-x-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      small: 'px-2 py-1 text-xs rounded',
      medium: 'px-3 py-1.5 text-sm rounded-md',
      large: 'px-4 py-2 text-base rounded-lg'
    };

    const variantStyles = {
      default: localFollowing
        ? 'bg-green-600 text-white hover:bg-green-700'
        : 'bg-blue-600 text-white hover:bg-blue-700',
      outline: localFollowing
        ? 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
        : 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
      ghost: localFollowing
        ? 'text-green-500 hover:bg-green-500/10'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader className="h-4 w-4 animate-spin" />;
    }
    
    if (localFollowing) {
      return <UserCheck className="h-4 w-4" />;
    }
    
    return <UserPlus className="h-4 w-4" />;
  };

  const getText = () => {
    if (isLoading) {
      return localFollowing ? 'Unfollowing...' : 'Following...';
    }
    
    return localFollowing ? 'Following' : 'Follow';
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={getButtonStyles()}
      aria-label={localFollowing ? 'Unfollow user' : 'Follow user'}
    >
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
};

export default FollowButton; 