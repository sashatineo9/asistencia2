const API_BASE = window.location.origin + '/api';
let currentUser = null;
let courses = [];
let students = [];
let users = [];
let teachers = [];

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
        if (currentUser.role !== 'administrador') {
            window.location.href = 'dashboard_profesor.html';
            return;
        }
        document.getElementById('userName').textContent = currentUser.full_name;
    } catch (e) {
        window.location.href = 'login.html';
    }
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    };
}

function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
    
    // Cargar datos según el tab
    if (tabName === 'courses') {
        loadCourses();
    } else if (tabName === 'students') {
        loadCoursesForSelect();
    } else if (tabName === 'users') {
        loadUsers();
    }
}

// ==================== GESTIÓN DE CURSOS ====================

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        courses = await response.json();
        renderCourses();
    } catch (error) {
        showMessage('coursesMessage', 'Error al cargar cursos', 'error');
    }
}

function renderCourses() {
    const tbody = document.querySelector('#coursesTable tbody');
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay cursos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.name}</td>
            <td>${course.code || '-'}</td>
            <td>${course.teacher_name || 'Sin asignar'}</td>
            <td>${course.student_count}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="editCourse(${course.id})">Editar</button>
                <button class="btn-danger" onclick="deleteCourse(${course.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE}/users?role=profesor`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            teachers = await response.json();
            const select = document.getElementById('courseTeacher');
            select.innerHTML = '<option value="">-- Sin asignar --</option>' +
                teachers.map(t => `<option value="${t.id}">${t.full_name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar profesores:', error);
    }
}

function openCourseModal(courseId = null) {
    loadTeachers();
    const modal = document.getElementById('courseModal');
    const form = document.getElementById('courseForm');
    const title = document.getElementById('courseModalTitle');
    
    if (courseId) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            title.textContent = 'Editar Curso';
            document.getElementById('courseId').value = course.id;
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseCode').value = course.code || '';
            document.getElementById('courseTeacher').value = course.teacher_id || '';
        }
    } else {
        title.textContent = 'Nuevo Curso';
        form.reset();
        document.getElementById('courseId').value = '';
    }
    
    modal.classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
    document.getElementById('courseForm').reset();
}

document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const courseId = document.getElementById('courseId').value;
    const name = document.getElementById('courseName').value;
    const code = document.getElementById('courseCode').value;
    const teacherId = document.getElementById('courseTeacher').value;
    
    const payload = {
        name,
        code: code || null,
        teacher_id: teacherId || null
    };
    
    try {
        let response;
        if (courseId) {
            response = await fetch(`${API_BASE}/courses/${courseId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(`${API_BASE}/courses`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al guardar curso');
        }
        
        showMessage('coursesMessage', 'Curso guardado correctamente', 'success');
        closeCourseModal();
        loadCourses();
    } catch (error) {
        showMessage('coursesMessage', error.message, 'error');
    }
});

function editCourse(courseId) {
    openCourseModal(courseId);
}

async function deleteCourse(courseId) {
    if (!confirm('¿Está seguro de eliminar este curso?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/courses/${courseId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar curso');
        }
        
        showMessage('coursesMessage', 'Curso eliminado correctamente', 'success');
        loadCourses();
    } catch (error) {
        showMessage('coursesMessage', error.message, 'error');
    }
}

// ==================== GESTIÓN DE ALUMNOS ====================

async function loadCoursesForSelect() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const coursesList = await response.json();
            const select = document.getElementById('studentCourseSelect');
            select.innerHTML = '<option value="">-- Seleccione un curso --</option>' +
                coursesList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar cursos:', error);
    }
}

async function loadStudents() {
    const courseId = document.getElementById('studentCourseSelect').value;
    const btnNewStudent = document.getElementById('btnNewStudent');
    
    if (!courseId) {
        btnNewStudent.disabled = true;
        document.querySelector('#studentsTable tbody').innerHTML = '<tr><td colspan="4">Seleccione un curso</td></tr>';
        return;
    }
    
    btnNewStudent.disabled = false;
    
    try {
        const response = await fetch(`${API_BASE}/courses/${courseId}/students`, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        students = await response.json();
        renderStudents();
    } catch (error) {
        showMessage('studentsMessage', 'Error al cargar alumnos', 'error');
    }
}

function renderStudents() {
    const tbody = document.querySelector('#studentsTable tbody');
    const courseName = document.getElementById('studentCourseSelect').selectedOptions[0]?.text || '';
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No hay alumnos en este curso</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.full_name}</td>
            <td>${student.dni || '-'}</td>
            <td>${courseName}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="editStudent(${student.id})">Editar</button>
                <button class="btn-danger" onclick="deleteStudent(${student.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function openStudentModal(studentId = null) {
    const courseId = document.getElementById('studentCourseSelect').value;
    
    if (!courseId) {
        alert('Seleccione un curso primero');
        return;
    }
    
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const title = document.getElementById('studentModalTitle');
    
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            title.textContent = 'Editar Alumno';
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.full_name;
            document.getElementById('studentDni').value = student.dni || '';
        }
    } else {
        title.textContent = 'Nuevo Alumno';
        form.reset();
        document.getElementById('studentId').value = '';
    }
    
    modal.classList.add('active');
}

function closeStudentModal() {
    document.getElementById('studentModal').classList.remove('active');
    document.getElementById('studentForm').reset();
}

document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const courseId = document.getElementById('studentCourseSelect').value;
    const name = document.getElementById('studentName').value;
    const dni = document.getElementById('studentDni').value;
    
    const payload = {
        full_name: name,
        dni: dni || null
    };
    
    try {
        let response;
        if (studentId) {
            response = await fetch(`${API_BASE}/students/${studentId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(`${API_BASE}/courses/${courseId}/students`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al guardar alumno');
        }
        
        showMessage('studentsMessage', 'Alumno guardado correctamente', 'success');
        closeStudentModal();
        loadStudents();
    } catch (error) {
        showMessage('studentsMessage', error.message, 'error');
    }
});

function editStudent(studentId) {
    openStudentModal(studentId);
}

async function deleteStudent(studentId) {
    if (!confirm('¿Está seguro de eliminar este alumno?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/students/${studentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar alumno');
        }
        
        showMessage('studentsMessage', 'Alumno eliminado correctamente', 'success');
        loadStudents();
    } catch (error) {
        showMessage('studentsMessage', error.message, 'error');
    }
}

// ==================== GESTIÓN DE USUARIOS ====================

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        users = await response.json();
        renderUsers();
    } catch (error) {
        showMessage('usersMessage', 'Error al cargar usuarios', 'error');
    }
}

function renderUsers() {
    const tbody = document.querySelector('#usersTable tbody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.full_name}</td>
            <td>${user.role === 'administrador' ? 'Administrador' : 'Profesor'}</td>
            <td>${user.is_active ? 'Activo' : 'Inactivo'}</td>
        </tr>
    `).join('');
}

function openUserModal() {
    document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('userUsername').value;
    const password = document.getElementById('userPassword').value;
    const fullName = document.getElementById('userFullName').value;
    const role = document.getElementById('userRole').value;
    
    const payload = {
        username,
        password,
        full_name: fullName,
        role
    };
    
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear usuario');
        }
        
        showMessage('usersMessage', 'Usuario creado correctamente', 'success');
        closeUserModal();
        loadUsers();
    } catch (error) {
        showMessage('usersMessage', error.message, 'error');
    }
});

// ==================== UTILIDADES ====================

function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = `message ${type}`;
    el.style.display = 'block';
    
    setTimeout(() => {
        el.style.display = 'none';
    }, 3000);
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Inicializar
checkAuth();
loadCourses();
loadCoursesForSelect();

