from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """Modelo de usuario (profesor o administrador)"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'profesor' o 'administrador'
    full_name = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relaciones
    courses = db.relationship('Course', backref='teacher', lazy=True, foreign_keys='Course.teacher_id')
    
    def set_password(self, password):
        """Genera hash de la contraseña"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica la contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convierte el usuario a diccionario (sin contraseña)"""
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'full_name': self.full_name,
            'is_active': self.is_active
        }


class Course(db.Model):
    """Modelo de curso"""
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=True)  # Código del curso
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relaciones
    students = db.relationship('Student', backref='course', lazy=True, cascade='all, delete-orphan')
    attendances = db.relationship('Attendance', backref='course', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convierte el curso a diccionario"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'teacher_id': self.teacher_id,
            'teacher_name': self.teacher.full_name if self.teacher else None,
            'student_count': len(self.students),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Student(db.Model):
    """Modelo de alumno"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)
    dni = db.Column(db.String(20), nullable=True)  # Documento de identidad
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relaciones
    attendances = db.relationship('Attendance', backref='student', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convierte el alumno a diccionario"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'dni': self.dni,
            'course_id': self.course_id,
            'is_active': self.is_active
        }


class Attendance(db.Model):
    """Modelo de asistencia diaria"""
    __tablename__ = 'attendances'
    
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(1), nullable=False)  # 'P' = Presente, 'A' = Ausente
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Índice único para evitar duplicados
    __table_args__ = (db.UniqueConstraint('course_id', 'student_id', 'date', name='unique_attendance'),)
    
    def to_dict(self):
        """Convierte la asistencia a diccionario"""
        return {
            'id': self.id,
            'course_id': self.course_id,
            'student_id': self.student_id,
            'student_name': self.student.full_name if self.student else None,
            'date': self.date.isoformat() if self.date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

