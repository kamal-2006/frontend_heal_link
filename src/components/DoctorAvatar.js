import { useState } from "react";
import { getDoctorInitials } from "@/utils/doctorUtils";

/**
 * DoctorAvatar component - displays doctor's profile photo or initials fallback
 * @param {Object} props
 * @param {Object} props.doctor - The doctor object
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg', 'xl' 
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showBorder - Whether to show border
 * @param {string} props.alt - Alt text for the image
 * @returns {JSX.Element}
 */
export default function DoctorAvatar({ 
  doctor, 
  size = 'md', 
  className = '', 
  showBorder = false,
  alt = null
}) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

  const borderClass = showBorder ? 'ring-4 ring-white ring-opacity-50 shadow-lg' : '';
  
  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowImage = doctor?.user?.profilePicture && !imageError;
  const altText = alt || `Dr. ${doctor?.user?.firstName || ''} ${doctor?.user?.lastName || ''}`.trim();
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${borderClass} ${className}`}>
      {shouldShowImage ? (
        <img
          src={`http://localhost:5000/${doctor.user.profilePicture}`}
          alt={altText}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
          {getDoctorInitials(doctor)}
        </div>
      )}
    </div>
  );
}