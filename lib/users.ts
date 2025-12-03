import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import bcrypt from 'bcryptjs'

// Inicializar cliente de Google Sheets
let sheets: any = null

function getSheetsClient() {
  if (sheets) return sheets

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email || !privateKey) {
    throw new Error(
      'Google Sheets credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.'
    )
  }

  try {
    const auth = new JWT({
      email: email,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    sheets = google.sheets({ version: 'v4', auth })
    return sheets
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error)
    throw new Error('Failed to initialize Google Sheets client. Check your credentials.')
  }
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || ''

// Inicializar hoja de usuarios
async function initializeUsersSheet() {
  try {
    const sheetsClient = getSheetsClient()
    const response = await sheetsClient.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    
    const sheetExists = response.data.sheets?.some(
      (s: any) => s.properties.title === 'Usuarios'
    )

    if (!sheetExists) {
      await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Usuarios',
                },
              },
            },
          ],
        },
      })

      // Agregar encabezados
      await sheetsClient.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Usuarios!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['id', 'email', 'password', 'nombre']],
        },
      })
    } else {
      // Verificar si tiene encabezados
      const response = await sheetsClient.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Usuarios!A:D',
      })
      const rows = response.data.values || []
      if (rows.length === 0) {
        await sheetsClient.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Usuarios!A:D',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['id', 'email', 'password', 'nombre']],
          },
        })
      }
    }
  } catch (error) {
    console.error('Error inicializando hoja de usuarios:', error)
  }
}

// Obtener todos los usuarios
async function getAllUsers(): Promise<any[]> {
  await initializeUsersSheet()
  try {
    const sheetsClient = getSheetsClient()
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Usuarios!A:D',
    })
    const rows = response.data.values || []
    if (rows.length === 0) return []
    
    return rows.slice(1).map((row) => ({
      id: row[0] || '',
      email: row[1] || '',
      password: row[2] || '',
      nombre: row[3] || '',
    }))
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return []
  }
}

// Buscar usuario por email
export async function getUserByEmail(email: string) {
  const users = await getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

// Crear nuevo usuario
export async function createUser(email: string, password: string, nombre: string) {
  await initializeUsersSheet()
  
  // Verificar que el email no exista
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const userId = `user_${Date.now()}`
  
  try {
    const sheetsClient = getSheetsClient()
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Usuarios!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[userId, email.toLowerCase(), hashedPassword, nombre]],
      },
    })
    
    return {
      id: userId,
      email: email.toLowerCase(),
      nombre,
    }
  } catch (error) {
    console.error('Error creando usuario:', error)
    throw new Error('Error al crear el usuario')
  }
}

// Verificar credenciales
export async function verifyCredentials(email: string, password: string) {
  const user = await getUserByEmail(email)
  
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.nombre,
  }
}

