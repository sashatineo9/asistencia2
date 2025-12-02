from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from models import db, User, Course, Student, Attendance

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///asistencia.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'cambiar-en-produccion-secret-key-muy-segura')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)

CORS(app)
jwt = JWTManager(app)

# Inicializar base de datos
db.init_app(app)

# Crear tablas al iniciar (solo en desarrollo)
with app.app_context():
    db.create_all()
    # Crear usuario administrador por defecto si no existe
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', role='administrador', full_name='Administrador Principal')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()


# ==================== AUTENTICACIÓN ====================

@app.route("/api/auth/login", methods=["POST"])
def login():
    """Endpoint de login"""
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Usuario y contraseña son obligatorios"}), 400
    
    user = User.query.filter_by(username=username, is_active=True).first()
    
    if not user or not user.check_password(password):
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401
    
    # Crear token JWT
    access_token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role, "username": user.username}
    )
    
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Obtener información del usuario actual"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.is_active:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    return jsonify(user.to_dict()), 200


# ==================== MIDDLEWARE DE AUTORIZACIÓN ====================

def require_role(roles):
    """Decorador para requerir roles específicos"""
    def decorator(f):
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get("role")
            
            if user_role not in roles:
                return jsonify({"error": "No tienes permisos para esta acción"}), 403
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator


# ==================== GESTIÓN DE CURSOS ====================

@app.route("/api/courses", methods=["GET"])
@jwt_required()
def get_courses():
    """Obtener lista de cursos"""
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor':
        # Profesores solo ven sus cursos
        courses = Course.query.filter_by(teacher_id=user_id, is_active=True).all()
    else:
        # Administradores ven todos los cursos
        courses = Course.query.filter_by(is_active=True).all()
    
    return jsonify([c.to_dict() for c in courses]), 200


@app.route("/api/courses", methods=["POST"])
@require_role(['administrador'])
def create_course():
    """Crear nuevo curso (solo administradores)"""
    data = request.get_json(force=True)
    name = data.get("name")
    code = data.get("code")
    teacher_id = data.get("teacher_id")
    
    if not name:
        return jsonify({"error": "El nombre del curso es obligatorio"}), 400
    
    # Verificar que el profesor existe si se asigna
    if teacher_id:
        teacher = User.query.filter_by(id=teacher_id, role='profesor', is_active=True).first()
        if not teacher:
            return jsonify({"error": "Profesor no encontrado"}), 404
    
    course = Course(name=name, code=code, teacher_id=teacher_id)
    db.session.add(course)
    db.session.commit()
    
    return jsonify(course.to_dict()), 201


@app.route("/api/courses/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course(course_id):
    """Obtener detalles de un curso"""
    course = Course.query.get_or_404(course_id)
    
    if not course.is_active:
        return jsonify({"error": "Curso no encontrado"}), 404
    
    # Verificar permisos
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor' and course.teacher_id != user_id:
        return jsonify({"error": "No tienes acceso a este curso"}), 403
    
    course_dict = course.to_dict()
    course_dict['students'] = [s.to_dict() for s in course.students if s.is_active]
    
    return jsonify(course_dict), 200


@app.route("/api/courses/<int:course_id>", methods=["PUT"])
@require_role(['administrador'])
def update_course(course_id):
    """Actualizar curso (solo administradores)"""
    course = Course.query.get_or_404(course_id)
    data = request.get_json(force=True)
    
    if 'name' in data:
        course.name = data['name']
    if 'code' in data:
        course.code = data['code']
    if 'teacher_id' in data:
        teacher_id = data['teacher_id']
        if teacher_id:
            teacher = User.query.filter_by(id=teacher_id, role='profesor', is_active=True).first()
            if not teacher:
                return jsonify({"error": "Profesor no encontrado"}), 404
        course.teacher_id = teacher_id
    
    db.session.commit()
    return jsonify(course.to_dict()), 200


@app.route("/api/courses/<int:course_id>", methods=["DELETE"])
@require_role(['administrador'])
def delete_course(course_id):
    """Eliminar curso (soft delete)"""
    course = Course.query.get_or_404(course_id)
    course.is_active = False
    db.session.commit()
    return jsonify({"message": "Curso eliminado correctamente"}), 200


# ==================== GESTIÓN DE ALUMNOS ====================

@app.route("/api/courses/<int:course_id>/students", methods=["GET"])
@jwt_required()
def get_students(course_id):
    """Obtener alumnos de un curso"""
    course = Course.query.get_or_404(course_id)
    
    # Verificar permisos
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor' and course.teacher_id != user_id:
        return jsonify({"error": "No tienes acceso a este curso"}), 403
    
    students = [s.to_dict() for s in course.students if s.is_active]
    return jsonify(students), 200


@app.route("/api/courses/<int:course_id>/students", methods=["POST"])
@require_role(['administrador'])
def create_student(course_id):
    """Agregar alumno a un curso (solo administradores)"""
    course = Course.query.get_or_404(course_id)
    
    if not course.is_active:
        return jsonify({"error": "Curso no encontrado"}), 404
    
    data = request.get_json(force=True)
    full_name = data.get("full_name")
    dni = data.get("dni")
    
    if not full_name:
        return jsonify({"error": "El nombre completo es obligatorio"}), 400
    
    student = Student(full_name=full_name, dni=dni, course_id=course_id)
    db.session.add(student)
    db.session.commit()
    
    return jsonify(student.to_dict()), 201


@app.route("/api/students/<int:student_id>", methods=["PUT"])
@require_role(['administrador'])
def update_student(student_id):
    """Actualizar alumno (solo administradores)"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json(force=True)
    
    if 'full_name' in data:
        student.full_name = data['full_name']
    if 'dni' in data:
        student.dni = data['dni']
    
    db.session.commit()
    return jsonify(student.to_dict()), 200


@app.route("/api/students/<int:student_id>", methods=["DELETE"])
@require_role(['administrador'])
def delete_student(student_id):
    """Eliminar alumno (soft delete)"""
    student = Student.query.get_or_404(student_id)
    student.is_active = False
    db.session.commit()
    return jsonify({"message": "Alumno eliminado correctamente"}), 200


# ==================== GESTIÓN DE ASISTENCIA ====================

@app.route("/api/courses/<int:course_id>/attendance/<date_str>", methods=["GET"])
@jwt_required()
def get_attendance(course_id, date_str):
    """Obtener asistencia de un curso en una fecha"""
    course = Course.query.get_or_404(course_id)
    
    # Verificar permisos
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor' and course.teacher_id != user_id:
        return jsonify({"error": "No tienes acceso a este curso"}), 403
    
    # Validar fecha
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido, use AAAA-MM-DD"}), 400
    
    # Obtener asistencias del día
    attendances = Attendance.query.filter_by(
        course_id=course_id,
        date=date
    ).all()
    
    # Crear diccionario con estado de cada alumno
    attendance_dict = {att.student_id: att.status for att in attendances}
    
    # Incluir todos los alumnos del curso
    result = []
    for student in course.students:
        if student.is_active:
            result.append({
                'student_id': student.id,
                'student_name': student.full_name,
                'status': attendance_dict.get(student.id, 'A')  # Por defecto ausente
            })
    
    return jsonify(result), 200


@app.route("/api/courses/<int:course_id>/attendance/<date_str>", methods=["POST"])
@jwt_required()
def set_attendance(course_id, date_str):
    """Guardar asistencia de un curso en una fecha"""
    course = Course.query.get_or_404(course_id)
    
    # Verificar permisos
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor' and course.teacher_id != user_id:
        return jsonify({"error": "No tienes acceso a este curso"}), 403
    
    # Validar fecha
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido, use AAAA-MM-DD"}), 400
    
    data = request.get_json(force=True) or {}
    # data esperado: [{"student_id": int, "status": "P"|"A"}, ...]
    
    if not isinstance(data, list):
        return jsonify({"error": "Formato inválido, se espera una lista"}), 400
    
    # Guardar/actualizar asistencias
    for item in data:
        student_id = item.get("student_id")
        status = item.get("status", "A")
        
        if status not in ['P', 'A']:
            continue
        
        # Buscar asistencia existente
        attendance = Attendance.query.filter_by(
            course_id=course_id,
            student_id=student_id,
            date=date
        ).first()
        
        if attendance:
            attendance.status = status
            attendance.created_by = user_id
        else:
            attendance = Attendance(
                course_id=course_id,
                student_id=student_id,
                date=date,
                status=status,
                created_by=user_id
            )
            db.session.add(attendance)
    
    db.session.commit()
    return jsonify({"message": "Asistencia guardada correctamente"}), 200


@app.route("/api/courses/<int:course_id>/attendance/report", methods=["GET"])
@jwt_required()
def get_attendance_report(course_id):
    """Obtener reporte de asistencia de un curso"""
    course = Course.query.get_or_404(course_id)
    
    # Verificar permisos
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = get_jwt_identity()
    
    if user_role == 'profesor' and course.teacher_id != user_id:
        return jsonify({"error": "No tienes acceso a este curso"}), 403
    
    # Obtener parámetros de fecha
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Attendance.query.filter_by(course_id=course_id)
    
    if start_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(Attendance.date >= start)
        except ValueError:
            pass
    
    if end_date:
        try:
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(Attendance.date <= end)
        except ValueError:
            pass
    
    attendances = query.all()
    
    # Agrupar por alumno
    report = {}
    for att in attendances:
        if att.student.is_active:
            student_id = att.student_id
            if student_id not in report:
                report[student_id] = {
                    'student_name': att.student.full_name,
                    'total_present': 0,
                    'total_absent': 0,
                    'total_days': 0
                }
            
            report[student_id]['total_days'] += 1
            if att.status == 'P':
                report[student_id]['total_present'] += 1
            else:
                report[student_id]['total_absent'] += 1
    
    # Calcular porcentajes
    for student_id in report:
        total = report[student_id]['total_days']
        if total > 0:
            report[student_id]['attendance_percentage'] = round(
                (report[student_id]['total_present'] / total) * 100, 2
            )
        else:
            report[student_id]['attendance_percentage'] = 0
    
    return jsonify(list(report.values())), 200


# ==================== GESTIÓN DE USUARIOS (Solo administradores) ====================

@app.route("/api/users", methods=["GET"])
@require_role(['administrador'])
def get_users():
    """Obtener lista de usuarios"""
    role_filter = request.args.get('role')
    query = User.query.filter_by(is_active=True)
    
    if role_filter:
        query = query.filter_by(role=role_filter)
    
    users = query.all()
    return jsonify([u.to_dict() for u in users]), 200


@app.route("/api/users", methods=["POST"])
@require_role(['administrador'])
def create_user():
    """Crear nuevo usuario"""
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    full_name = data.get("full_name")
    
    if not all([username, password, role, full_name]):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    if role not in ['profesor', 'administrador']:
        return jsonify({"error": "Rol inválido"}), 400
    
    # Verificar que el usuario no exista
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "El usuario ya existe"}), 400
    
    user = User(username=username, role=role, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201


if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
