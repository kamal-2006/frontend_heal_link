/**
 * A collection of utility functions for consistent data handling across the frontend.
 */

/**
 * Safely gets the full name of a doctor from various possible data structures.
 * @param {object} doctor - The doctor object from an API response.
 * @returns {string} The doctor's full name or a fallback string.
 */
export const getDoctorName = (doctor) => {
  if (!doctor) {
    return 'Unknown Doctor';
  }

  // Structure 1: Direct properties (new enhanced structure from backend)
  if (doctor.firstName && doctor.lastName) {
    return `${doctor.firstName} ${doctor.lastName}`;
  }

  // Structure 2: Nested user object (fallback for older data)
  if (doctor.user && doctor.user.firstName && doctor.user.lastName) {
    return `${doctor.user.firstName} ${doctor.user.lastName}`;
  }

  // Fallback to other possible name fields
  if (doctor.name) return doctor.name;
  if (doctor.fullName) return doctor.fullName;
  if (doctor.displayName) return doctor.displayName;

  // If only partial name is available
  if (doctor.firstName) return doctor.firstName;
  if (doctor.lastName) return doctor.lastName;

  return 'Unknown Doctor';
};

/**
 * Safely gets the initials of a doctor for use in avatars.
 * @param {object} doctor - The doctor object from an API response.
 * @returns {string} The doctor's initials or a fallback string.
 */
export const getDoctorInitials = (doctor) => {
  if (!doctor) {
    return 'Dr';
  }

  let firstName = '';
  let lastName = '';

  // Structure 1: Direct properties (new enhanced structure from backend)
  if (doctor.firstName && doctor.lastName) {
    firstName = doctor.firstName;
    lastName = doctor.lastName;
  } else if (doctor.user && doctor.user.firstName && doctor.user.lastName) {
    // Structure 2: Nested user object (fallback for older data)
    firstName = doctor.user.firstName;
    lastName = doctor.user.lastName;
  }

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return `${firstName[0]}D`.toUpperCase();
  }
  
  if (doctor.name) {
    const words = doctor.name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return `${doctor.name[0]}D`.toUpperCase();
  }

  return 'Dr';
};

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} The title-cased string.
 */
export const toTitleCase = (str) => {
  if (!str) {
    return '';
  }
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
