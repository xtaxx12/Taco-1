from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import Producto, CategoriaProd
from .forms import RegistrationForm
import logging

logger = logging.getLogger(__name__)


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                messages.success(request, 'Cuenta creada exitosamente. Ya puedes iniciar sesión.')
                logger.info(f'Nuevo usuario registrado: {user.username}')
                return redirect('login')
            except Exception as e:
                logger.error(f'Error al registrar usuario: {e}')
                messages.error(request, 'Error al crear la cuenta. Intenta nuevamente.')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = RegistrationForm()
    
    return render(request, 'pagina/register.html', {'form': form})


def index(request):
    return render(request, "pagina/index.html")

def base(request):
    return render(request, "pagina/base.html")

def menu(request):
    try:
        # Filtros y búsqueda
        search_query = request.GET.get('search', '')
        categoria_id = request.GET.get('categoria', '')
        
        productos = Producto.objects.select_related('categorias').all()
        
        if search_query:
            productos = productos.filter(
                Q(nombre__icontains=search_query) | 
                Q(descripcion__icontains=search_query)
            )
        
        if categoria_id:
            productos = productos.filter(categorias_id=categoria_id)
        
        # Paginación
        paginator = Paginator(productos, 12)  # 12 productos por página
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        categorias = CategoriaProd.objects.all()
        
        context = {
            'productos': page_obj,
            'categorias': categorias,
            'search_query': search_query,
            'selected_categoria': categoria_id,
        }
        
        return render(request, "pagina/menu.html", context)
    except Exception as e:
        logger.error(f'Error en vista menu: {e}')
        messages.error(request, 'Error al cargar el menú.')
        return render(request, "pagina/menu.html", {'productos': []})

def custom_login(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:
            messages.error(request, "Todos los campos son requeridos")
            return render(request, "pagina/login.html")

        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                messages.success(request, f'¡Bienvenido {user.username}!')
                next_url = request.GET.get('next', 'index')
                return redirect(next_url)
            else:
                messages.error(request, "Credenciales incorrectas")
        except Exception as e:
            logger.error(f'Error en login: {e}')
            messages.error(request, "Error en el sistema. Intenta más tarde.")

    return render(request, "pagina/login.html")



def logout_view(request):
    """
    La función cierra la sesión del usuario y lo redirige a la página de inicio de sesión.
    
    :param request: el objeto de solicitud representa la solicitud HTTP actual. Contiene información
    sobre la solicitud, como el usuario que realiza la solicitud, el método HTTP utilizado y cualquier dato enviado con
    la solicitud
    :return: una respuesta de redireccionamiento a la página de 'inicio de sesión'.
    """
    logout(request)

    # Redirige a la página de inicio o a donde desees que vaya después de cerrar sesión
    return redirect('index')


def enviar_correo(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre", "").strip()
        email = request.POST.get("email", "").strip()
        telefono = request.POST.get("telefono", "").strip()
        mensaje = request.POST.get("mensaje", "").strip()
        
        # Validaciones básicas
        if not all([nombre, email, mensaje]):
            messages.error(request, "Todos los campos marcados son obligatorios")
            return redirect('index')
        
        try:
            # Email al cliente
            subject_cliente = "Gracias por contactarnos - Taco Home"
            message_cliente = f"""
            Hola {nombre},
            
            Gracias por ponerte en contacto con Taco Home. 
            Hemos recibido tu mensaje y te responderemos pronto.
            
            Tu mensaje:
            {mensaje}
            
            ¡Esperamos verte pronto en nuestro restaurante!
            
            Atentamente,
            El equipo de Taco Home
            """
            
            # Email interno
            subject_interno = f"Nuevo mensaje de contacto - {nombre}"
            message_interno = f"""
            Nuevo mensaje de contacto recibido:
            
            Nombre: {nombre}
            Email: {email}
            Teléfono: {telefono}
            
            Mensaje:
            {mensaje}
            """
            
            # Enviar emails
            send_mail(subject_cliente, message_cliente, 'noreply@tacohome.com', [email])
            send_mail(subject_interno, message_interno, email, ['tacohome2011@gmail.com'])
            
            messages.success(request, "¡Mensaje enviado correctamente! Te responderemos pronto.")
            logger.info(f'Mensaje de contacto enviado por: {email}')
            
        except Exception as e:
            logger.error(f'Error al enviar correo: {e}')
            messages.error(request, "Error al enviar el mensaje. Intenta nuevamente.")
    
    return redirect('index')
