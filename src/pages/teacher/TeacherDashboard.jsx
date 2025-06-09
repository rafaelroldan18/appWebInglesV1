import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FaUserGraduate, FaChartBar, FaClipboardList, FaUserPlus } from 'react-icons/fa'
import { getStudentsList, getCoursesStats } from '../../supabase/queries'

function TeacherDashboard() {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageProgress: 0,
    activeStudents: 0
  })
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({
    email: '',
    first_name: '',
    last_name: ''
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const studentsData = await getStudentsList()
      const statsData = await getCoursesStats()
      setStudents(studentsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    // Implementation for adding a new student
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.nombre} {profile?.apellido}!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaUserGraduate className="text-primary-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
                <p className="text-2xl font-bold text-primary-600">{stats.totalStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaChartBar className="text-accent-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Average Progress</h3>
                <p className="text-2xl font-bold text-accent-600">{stats.averageProgress}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaClipboardList className="text-secondary-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Students</h3>
                <p className="text-2xl font-bold text-secondary-600">{stats.activeStudents}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Student Management */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
              <button
                onClick={() => setIsAddingStudent(true)}
                className="btn-primary flex items-center"
              >
                <FaUserPlus className="mr-2" />
                Add Student
              </button>
            </div>

            {/* Add Student Form */}
            {isAddingStudent && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 border rounded-lg"
              >
                <form onSubmit={handleAddStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={newStudent.first_name}
                        onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={newStudent.last_name}
                        onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingStudent(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Student
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Students List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.avatar_url && (
                            <img
                              src={student.avatar_url}
                              alt={`${student.first_name}'s avatar`}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(student.progress)}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          View Details
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold mb-2">Progress Report</h3>
                <p className="text-gray-600">Generate detailed progress reports for all students</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold mb-2">Activity Report</h3>
                <p className="text-gray-600">View student activity and engagement metrics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard

if (import.meta.hot) {
  import.meta.hot.accept()
}