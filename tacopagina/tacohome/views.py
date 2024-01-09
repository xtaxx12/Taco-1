from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login as auth_login
from .models import Producto
from django.contrib.auth.models import User
from .forms import RegistrationForm

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        # Validar contraseñas coincidentes
        if password1 != password2:
            return render(request, 'pagina/register.html', {'form': None, 'error_message': 'Las contraseñas no coinciden'})

        # Crear el usuario
        user = User.objects.create_user(username=username, password=password1)

        # Puedes personalizar esto según tus necesidades, por ejemplo, iniciar sesión automáticamente después del registro
        # auth_login(request, user)

        return redirect('login')  # Ajusta 'login' según la URL de tu vista de inicio de sesión
    else:
        return render(request, 'pagina/register.html', {'form': None})

def index(request):
    return render(request, "pagina/login.html")

def base(request):
    return render(request, "pagina/base.html")

def menu(request):
    productos = Producto.objects.all()
    return render(request, "pagina/menu.html", {"productos": productos})

def custom_login(request):
    if request.method == "POST":
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")

        # Autenticar al usuario
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Login exitoso
            auth_login(request, user)
            # Redirigir a la página deseada después de iniciar sesión
            return redirect('index')  # Utiliza el nombre 'index' según la URL de tu vista de inicio
        else:
            # Login fallido
            return render(request, "pagina/login.html", {"error_message": "Usuario o contraseña incorrectos"})

    # Si no es una solicitud POST, simplemente muestra la página de inicio de sesión
    return render(request, "pagina/login.html")

def enviar_correo(request):
    enviado_correctamente = False
    if request.method == "POST":
        email = request.POST.get("email", "")
        subject = "Gracias por ponerte en contacto con nosotros"
        message = f"Hola, \n\nGracias por ponerte en contacto con nosotros. Pronto te responderemos.\n\nAtentamente, \nEl equipo de Cooperativa Oro Verde \nEste canal fue creado para compartir información esencial \npara tu funcionamiento en nuestra plataforma. Los mensajes son automáticos, \npor lo tanto, no podremos responder tus comentarios por esta vía."
        from_email = email
        recipient_list = [email]
        try:
            send_mail(subject, message, from_email, recipient_list)
            enviado_correctamente = True
        except Exception as e:
            pass

    return render(
        request, "pagina/index.html", {
            "enviado_correctamente": enviado_correctamente}
    )
