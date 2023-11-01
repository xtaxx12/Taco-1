from django.shortcuts import render, get_object_or_404
from django.core.mail import send_mail
from django.http import HttpResponse
from .models import Producto

# Create your views here.


def index(request):
    return render(request, "pagina/index.html")


def base(request):
    return render(request, "pagina/base.html")


def menu(request):
    productos=Producto.objects.all()
    # le enviamos la variable posts que almacena todos los posts subidos para asi poder recorrerlos en un for
    return render(request, "pagina/menu.html", {"productos": productos})



def login(request):
    return render(request, "pagina/login.html")


def enviar_correo(request):
    # Variable que va a determinar si se envió el correo correctamente , nos servira para el if del template
    enviado_correctamente = False
    if request.method == "POST":
        email = request.POST.get(
            "email", ""
        )  # Obtenemos el correo electrónico ingresado por el usuario en home.html
        # Ahora enviamos el correo electrónico
        subject = "Gracias por ponerte en contacto con nosotros"
        message = f"Hola, \n\nGracias por ponerte en contacto con nosotros. Pronto te responderemos.\n\nAtentamente, \nEl equipo de Cooperativa Oro Verde \nEste canal fue creado para compartir informacion escencial \npara tu funcionamiento en nuestra plataforma.Los mensajes son automaticos, \npor lo tanto no podremos responder tus comentarios por esta via"
        from_email = email  # le mandamos la variable email para que envie el mensaje al correo ingresado por el usuario como remitente
        recipient_list = [email]
        try:
            send_mail(subject, message, from_email, recipient_list)
            # Actualizamos el valor de la variable a True si se envió correctamente
            enviado_correctamente = True
        except Exception as e:
            pass  # No es necesario hacer nada aquí, la variable seguirá siendo False

    # Enviamos el valor de "enviado_correctamente" como parte del contexto para usarlo en el if
    return render(
        request, "pagina/index.html", {
            "enviado_correctamente": enviado_correctamente}
    )


"""creamos una variable llamada posts y le enviamos todo lo que contenga la clase Post creada en models.py
y le mandamos en el return los posts"""

#def productos(request):
    #productos=Producto.objects.all()
    # le enviamos la variable posts que almacena todos los posts subidos para asi poder recorrerlos en un for
   # return render(request, "pagina/menu.html", {"productos": productos})

