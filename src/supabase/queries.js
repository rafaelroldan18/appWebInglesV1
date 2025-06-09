import { supabase } from './supabaseClient';

// User Profile Queries
export const createUserProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('perfil_usuario')
    .insert([{
      id_usuario: profileData.user_id,
      nombre: profileData.first_name,
      apellido: profileData.last_name,
      rol: profileData.role,
      correo: profileData.email,
      url_avatar: profileData.avatar_url
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('perfil_usuario')
    .select('*')
    .eq('id_usuario', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (profileId, updates) => {
  const { data, error } = await supabase
    .from('perfil_usuario')
    .update({
      nombre: updates.first_name,
      apellido: updates.last_name,
      correo: updates.email,
      url_avatar: updates.avatar_url
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Student Management Queries
export const getStudentsList = async () => {
  const { data, error } = await supabase
    .from('perfil_usuario')
    .select(`
      id,
      nombre,
      apellido,
      correo,
      url_avatar,
      fecha_creacion,
      progreso_estudiante (
        nivel_actual,
        experiencia_total,
        ultima_actividad
      )
    `)
    .eq('rol', 'estudiante')
    .order('apellido', { ascending: true });

  if (error) throw error;

  return data.map(student => ({
    id: student.id,
    first_name: student.nombre,
    last_name: student.apellido,
    email: student.correo,
    avatar_url: student.url_avatar,
    progress: (student.progreso_estudiante?.experiencia_total || 0) / 10, // Convert to percentage
    lastActivity: student.progreso_estudiante?.ultima_actividad || student.fecha_creacion
  }));
};

export const getCoursesStats = async () => {
  const { data: students, error: studentsError } = await supabase
    .from('perfil_usuario')
    .select('id')
    .eq('rol', 'estudiante');

  if (studentsError) throw studentsError;

  const { data: progress, error: progressError } = await supabase
    .from('progreso_estudiante')
    .select('*');

  if (progressError) throw progressError;

  const now = new Date();
  const activeThreshold = new Date(now.setDate(now.getDate() - 7));

  return {
    totalStudents: students.length,
    averageProgress: progress.reduce((acc, curr) => acc + curr.experiencia_total, 0) / (progress.length || 1) / 10,
    activeStudents: progress.filter(p => new Date(p.ultima_actividad) > activeThreshold).length
  };
};

// Activity Queries
export const getActivities = async () => {
  const { data, error } = await supabase
    .from('actividad')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
};

export const getActivityById = async (activityId) => {
  const { data, error } = await supabase
    .from('actividad')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) throw error;
  return data;
};

// Progress Queries
export const getUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progreso_estudiante')
    .select('*')
    .eq('id_estudiante', userId)
    .maybeSingle();

  if (error) throw error;
  
  // Return default progress object if no record exists
  if (!data) {
    return {
      id_estudiante: userId,
      nivel_actual: 1,
      experiencia_total: 0,
      vocabulario_dominado: 0,
      puntos_gramatica: 0,
      racha_diaria: 0,
      ultima_actividad: null,
      niveles_habilidad: {
        vocabulario: 0,
        gramatica: 0,
        lectura: 0,
        escucha: 0,
        habla: 0,
        escritura: 0
      }
    };
  }
  
  return data;
};

export const updateUserProgress = async (userId, progressData) => {
  const { data, error } = await supabase
    .from('progreso_estudiante')
    .update(progressData)
    .eq('id_estudiante', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Games Queries
export const getAvailableGames = async () => {
  const { data, error } = await supabase
    .from('actividad')
    .select('*')
    .eq('formato', 'juego')
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
};

// Achievement Queries
export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('logro_usuario')
    .select(`
      *,
      logro (*)
    `)
    .eq('id_estudiante', userId);

  if (error) throw error;
  return data.map(achievement => achievement.logro);
};

// Activity Attempt Queries
export const createActivityAttempt = async (attemptData) => {
  const { data, error } = await supabase
    .from('intento_actividad')
    .insert([{
      id_usuario: attemptData.user_id,
      id_actividad: attemptData.activity_id,
      puntos_obtenidos: attemptData.points_earned,
      porcentaje_precision: attemptData.accuracy_percentage,
      tiempo_segundos: attemptData.time_spent,
      errores_cometidos: attemptData.mistakes_made,
      estado: attemptData.status,
      retroalimentacion: attemptData.feedback
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAttempts = async (userId) => {
  const { data, error } = await supabase
    .from('intento_actividad')
    .select(`
      *,
      actividad (*)
    `)
    .eq('id_usuario', userId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
};