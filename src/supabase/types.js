/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} user_id
 * @property {string} first_name
 * @property {string} last_name
 * @property {'student' | 'teacher'} role
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Class
 * @property {string} id
 * @property {string} course_id
 * @property {string} name
 * @property {string} created_at
 */

/**
 * @typedef {Object} StudentClass
 * @property {string} id
 * @property {string} student_id
 * @property {string} class_id
 * @property {string} created_at
 */

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {'quiz' | 'game' | 'challenge'} type
 * @property {'easy' | 'medium' | 'hard'} difficulty
 * @property {number} max_points
 * @property {any} content
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ActivityAttempt
 * @property {string} id
 * @property {string} user_id
 * @property {string} activity_id
 * @property {number} points_earned
 * @property {'completed' | 'in_progress' | 'failed'} status
 * @property {any} [answers]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} id
 * @property {string} user_id
 * @property {number} current_level
 * @property {number} total_points
 * @property {number} daily_streak
 * @property {string} [last_activity]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [icon]
 * @property {any} condition
 * @property {number} reward_points
 * @property {string} created_at
 */

/**
 * @typedef {Object} UserAchievement
 * @property {string} id
 * @property {string} user_id
 * @property {string} achievement_id
 * @property {string} earned_at
 * @property {string} created_at
 */

/**
 * @typedef {Object} GamificationLevel
 * @property {string} id
 * @property {number} level
 * @property {string} name
 * @property {number} required_points
 * @property {string} [icon]
 * @property {string} created_at
 */

export {};