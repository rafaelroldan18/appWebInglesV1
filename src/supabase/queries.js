import { supabase } from './supabaseClient';

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
    progress: (student.progreso_estudiante?.experiencia_total || 0) / 10,
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

export const getUnits = async () => {
  const { data, error } = await supabase
    .from('unidad_aprendizaje')
    .select('*')
    .eq('estado', 'publicado')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data;
};

export const getUnitById = async (unitId) => {
  const { data, error } = await supabase
    .from('unidad_aprendizaje')
    .select(`
      *,
      tema (
        *,
        actividad (*)
      )
    `)
    .eq('id', unitId)
    .single();

  if (error) throw error;
  return data;
};

export const getActivities = async () => {
  const { data, error } = await supabase
    .from('actividad')
    .select(`
      *,
      tema (
        *,
        unidad_aprendizaje (*)
      )
    `)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
};

export const getActivityById = async (activityId) => {
  const { data, error } = await supabase
    .from('actividad')
    .select(`
      *,
      tema (
        *,
        unidad_aprendizaje (*)
      )
    `)
    .eq('id', activityId)
    .single();

  if (error) throw error;
  return data;
};

export const getActivitiesByUnit = async (unitId) => {
  const { data, error } = await supabase
    .from('actividad')
    .select(`
      *,
      tema!inner (
        *,
        unidad_aprendizaje!inner (*)
      )
    `)
    .eq('tema.id_unidad', unitId)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data;
};

export const getUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progreso_estudiante')
    .select('*')
    .eq('id_estudiante', userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return {
      id_estudiante: userId,
      nivel_actual: 1,
      experiencia_total: 0,
      monedas: 0,
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

export const createUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progreso_estudiante')
    .insert([{
      id_estudiante: userId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getActivityIcon = (format) => {
  const icons = {
    quiz: '❓',
    match_up: '🎯',
    flashcards: '🎴',
    complete_sentence: '✍️',
    group_sort: '📊',
    anagram: '🔤',
    speaking_cards: '💬'
  };
  return icons[format] || '🎮';
};

export const getAvailableGames = async () => {
  const { data, error } = await supabase
    .from('actividad')
    .select(`
      *,
      tema (
        *,
        unidad_aprendizaje (*)
      )
    `)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data.map(activity => ({
    id: activity.id,
    title: activity.titulo,
    description: activity.descripcion,
    category: activity.tipo,
    difficulty: activity.dificultad === 'facil' ? 'Easy' : activity.dificultad === 'medio' ? 'Medium' : 'Hard',
    icon: getActivityIcon(activity.formato),
    xpReward: activity.puntos_maximos,
    format: activity.formato,
    content: activity.contenido,
    unit: activity.tema?.unidad_aprendizaje?.nombre
  }));
};

export const getMissions = async () => {
  const { data, error } = await supabase
    .from('mision')
    .select('*')
    .eq('estado', 'activo')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data;
};

export const getMissionsByType = async (type) => {
  const { data, error } = await supabase
    .from('mision')
    .select('*')
    .eq('estado', 'activo')
    .eq('tipo', type)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data;
};

export const getUserMissionProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progreso_mision')
    .select(`
      *,
      mision (*)
    `)
    .eq('id_estudiante', userId)
    .order('fecha_inicio', { ascending: false });

  if (error) throw error;
  return data;
};

export const startMission = async (userId, missionId) => {
  const { data, error } = await supabase
    .from('progreso_mision')
    .insert([{
      id_estudiante: userId,
      id_mision: missionId,
      estado: 'en_progreso'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMissionProgress = async (progressId, updates) => {
  const { data, error } = await supabase
    .from('progreso_mision')
    .update(updates)
    .eq('id', progressId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllAchievements = async () => {
  const { data, error } = await supabase
    .from('logro')
    .select('*')
    .order('recompensa_exp', { ascending: true });

  if (error) throw error;
  return data;
};

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('logro_usuario')
    .select(`
      *,
      logro (*)
    `)
    .eq('id_estudiante', userId)
    .order('fecha_obtencion', { ascending: false });

  if (error) throw error;
  return data.map(achievement => ({
    ...achievement.logro,
    fecha_obtencion: achievement.fecha_obtencion,
    progreso: achievement.progreso
  }));
};

export const unlockAchievement = async (userId, achievementId) => {
  const { data, error } = await supabase
    .from('logro_usuario')
    .insert([{
      id_estudiante: userId,
      id_logro: achievementId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createActivityAttempt = async (attemptData) => {
  const { data, error } = await supabase
    .from('intento_actividad')
    .insert([{
      id_usuario: attemptData.user_id,
      id_actividad: attemptData.activity_id,
      puntos_obtenidos: attemptData.points_earned,
      porcentaje_precision: attemptData.accuracy_percentage,
      tiempo_segundos: attemptData.time_spent,
      respuestas: attemptData.answers,
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

export const getRecentAttempts = async (userId, limit = 5) => {
  const { data, error } = await supabase
    .from('intento_actividad')
    .select(`
      *,
      actividad (
        titulo,
        tipo,
        formato
      )
    `)
    .eq('id_usuario', userId)
    .order('fecha_creacion', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
