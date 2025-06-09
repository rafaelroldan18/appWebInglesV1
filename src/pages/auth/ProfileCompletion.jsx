import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaUser, FaExclamationCircle, FaImage } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { createUserProfile } from '../../supabase/queries'
import { supabase } from '../../supabase/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_AVATARS = [
  'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
]

function ProfileCompletion() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: 'estudiante',
    avatar_url: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const { user, setProfile } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarSelect = (url) => {
    setFormData(prev => ({
      ...prev,
      avatar_url: url
    }))
    setSelectedFile(null)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, avatar_url: '' }))
    }
  }

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { first_name, last_name, role, avatar_url } = formData

    if (!first_name || !last_name || !role) {
      setError('Please fill in all required fields')
      return
    }
    
    try {
      setError('')
      setIsSubmitting(true)
      
      let finalAvatarUrl = avatar_url
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile)
      }

      const profileData = {
        user_id: user.id,
        first_name,
        last_name,
        role,
        email: user.email,
        avatar_url: finalAvatarUrl
      }

      const profile = await createUserProfile(profileData)
      setProfile(profile)
      
      toast.success('Profile created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Profile creation error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="mt-2 text-gray-600">Please provide some additional information to get started</p>
          </div>
          
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaExclamationCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Avatar
              </label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {DEFAULT_AVATARS.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAvatarSelect(url)}
                    className={`relative rounded-lg overflow-hidden aspect-square ${
                      formData.avatar_url === url ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <img 
                      src={url} 
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <label 
                  htmlFor="avatar_upload"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <FaImage className="mr-2" />
                  <span>{selectedFile ? selectedFile.name : 'Upload custom avatar'}</span>
                </label>
                <input
                  id="avatar_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Max file size: 2MB. Recommended: 150x150px</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="estudiante">Student</option>
                <option value="profesor">Teacher</option>
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileCompletion

if (import.meta.hot) {
  import.meta.hot.accept()
}