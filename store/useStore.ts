import { create } from 'zustand'

interface Course {
  id: string
  nombre: string
  año: string
  profesor: string
}

interface Student {
  id: string
  nombre: string
  dni: string
}

interface Store {
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  removeCourse: (id: string) => void
  updateCourse: (id: string, course: Partial<Course>) => void
}

export const useStore = create<Store>((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  removeCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
  updateCourse: (id, updates) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}))

