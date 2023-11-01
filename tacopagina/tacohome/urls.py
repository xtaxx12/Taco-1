from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),
    path("base/", views.base, name="base"),
    path("menu/", views.menu, name="menu"),
    path("login/", views.login, name="login"),
    path("enviado_correctamente", views.enviar_correo, name="enviar_correo"),
]

"""urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) es una configuración necesaria para 
que Django pueda servir archivos de medios durante el desarrollo de tu aplicación. 
Permite acceder y mostrar los archivos multimedia cargados por los usuarios a través de sus respectivas URL.en fin nos sirve para 
cargar imagenes de los productos"""
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
