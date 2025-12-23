# 🌮 Taco Home - Sistema de Gestión de Restaurante

![Django](https://img.shields.io/badge/Django-4.2.2-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Taco Home** es una aplicación web moderna desarrollada en Django para la gestión integral de un restaurante de comida TEX-MEX. Ofrece una experiencia de usuario optimizada, diseño responsivo y funcionalidades completas para la administración de productos, usuarios y pedidos.

## ✨ Características Principales

### 🎨 **Frontend & UX**
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y desktop
- **Interfaz Moderna**: UI/UX intuitiva con animaciones suaves (AOS)
- **Accesibilidad**: Cumple con estándares WCAG 2.1
- **Performance**: Carga rápida con lazy loading y optimización de imágenes
- **PWA Ready**: Preparado para funcionar como Progressive Web App

### 🔧 **Funcionalidades**
- **Catálogo de Productos**: Gestión completa de menú con categorías
- **Sistema de Usuarios**: Registro, login y perfiles de usuario
- **Búsqueda Avanzada**: Filtros por categoría y búsqueda de texto
- **Paginación**: Navegación eficiente de productos
- **Formulario de Contacto**: Sistema de mensajería integrado
- **Panel de Administración**: Interface administrativa completa
- **Gestión de Imágenes**: Optimización automática de imágenes

### 🛡️ **Seguridad & Performance**
- **Variables de Entorno**: Configuración segura con python-decouple
- **Validación de Formularios**: Validación robusta del lado servidor
- **Protección CSRF**: Seguridad contra ataques de falsificación
- **Optimización de Consultas**: Select_related para mejor performance
- **Logging**: Sistema de logs para monitoreo y debugging

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- PostgreSQL 13+
- pip (gestor de paquetes de Python)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/taco-home.git
cd taco-home
```

### 2. Crear Entorno Virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias
```bash
cd tacopagina
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
# Configuración de Base de Datos
DB_NAME=TacoHome
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_HOST=localhost
DB_PORT=5432

# Configuración de Django
SECRET_KEY=tu-secret-key-super-segura-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-app-password
```

### 5. Configurar Base de Datos
```bash
# Crear la base de datos en PostgreSQL
createdb TacoHome

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### 6. Cargar Datos de Prueba (Opcional)
```bash
python manage.py loaddata fixtures/initial_data.json
```

### 7. Ejecutar el Servidor
```bash
python manage.py runserver
```

La aplicación estará disponible en: `http://localhost:8000`

## 📁 Estructura del Proyecto

```
tacopagina/
├── manage.py
├── requirements.txt
├── .env.example
├── tacopagina/           # Configuración principal
│   ├── settings.py       # Configuraciones mejoradas
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── tacohome/             # App principal
│   ├── models.py         # Modelos optimizados
│   ├── views.py          # Vistas mejoradas
│   ├── forms.py          # Formularios con validación
│   ├── urls.py
│   ├── admin.py
│   ├── static/           # Archivos estáticos
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   └── menu.css  # CSS específico del menú
│   │   ├── js/
│   │   │   └── script.js
│   │   └── images/
│   └── templates/        # Templates HTML
│       └── pagina/
│           ├── base.html     # Template base mejorado
│           ├── index.html    # Página principal
│           ├── menu.html     # Menú optimizado
│           ├── login.html
│           └── register.html
└── media/                # Archivos subidos por usuarios
    └── tienda/
```

## 🎯 Mejoras Implementadas

### 🔒 **Seguridad**
- ✅ Variables de entorno para datos sensibles
- ✅ Configuración de seguridad para producción
- ✅ Validación robusta de formularios
- ✅ Protección contra ataques comunes

### 🏗️ **Arquitectura**
- ✅ Modelos optimizados con validadores
- ✅ Vistas con manejo de errores
- ✅ Formularios con validación personalizada
- ✅ Sistema de logging implementado

### 🎨 **Frontend**
- ✅ Diseño responsivo completo
- ✅ Componentes reutilizables
- ✅ Animaciones y transiciones suaves
- ✅ Optimización de performance

### 📱 **UX/UI**
- ✅ Navegación intuitiva
- ✅ Feedback visual para acciones
- ✅ Estados de carga
- ✅ Mensajes de error/éxito claros

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Ejecutar servidor de desarrollo
python manage.py runserver

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic
```

### Testing
```bash
# Ejecutar tests
python manage.py test

# Ejecutar tests con coverage
coverage run --source='.' manage.py test
coverage report
```

## 🚀 Despliegue en Producción

### Configuración para Producción
1. Cambiar `DEBUG=False` en el archivo `.env`
2. Configurar `ALLOWED_HOSTS` con tu dominio
3. Configurar servidor web (Nginx + Gunicorn recomendado)
4. Configurar base de datos de producción
5. Configurar servicio de email (SendGrid, Mailgun, etc.)

### Ejemplo con Gunicorn
```bash
# Instalar Gunicorn
pip install gunicorn

# Ejecutar con Gunicorn
gunicorn tacopagina.wsgi:application --bind 0.0.0.0:8000
```

## 📊 Funcionalidades Futuras

- [ ] Sistema de carrito de compras
- [ ] Procesamiento de pagos (Stripe/PayPal)
- [ ] Sistema de pedidos en línea
- [ ] Notificaciones push
- [ ] API REST para aplicación móvil
- [ ] Sistema de reservas
- [ ] Programa de fidelidad
- [ ] Dashboard de analytics

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: Joel Rojas
- **Diseño UX/UI**: Joel Rojas
- **QA Testing**: Joel Rojas]

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 📧 Email: tacohome2011@gmail.com
- 📱 Teléfono: +593 968058769
- 🌐 Website: [[PORTFOLIO]](https://i-portfolio-swart.vercel.app/)

## 🙏 Agradecimientos

- Django Community por el excelente framework
- Font Awesome por los iconos
- AOS Library por las animaciones
- PostgreSQL por la base de datos robusta

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
