'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className="bg-white shadow-lg rounded-3xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-primary-600">
            Asistencias CPFP N°6
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/calendar')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pastel-blue text-primary-600 hover:bg-pastel-purple transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden md:inline">Calendario</span>
          </motion.button>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pastel-pink">
            <User className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">
              {session?.user?.name || 'Usuario'}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Salir</span>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

