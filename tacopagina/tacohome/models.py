from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from PIL import Image
import os


class CategoriaProd(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoría de Producto"
        verbose_name_plural = "Categorías de Productos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to="tienda/%Y/%m/", null=True, blank=True)
    categorias = models.ForeignKey(CategoriaProd, on_delete=models.CASCADE, related_name='productos')
    precio = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.01)])
    descripcion = models.TextField(max_length=1000)
    disponible = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['-destacado', 'nombre']

    def __str__(self):
        return f"{self.nombre} - ${self.precio}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Optimizar imagen
        if self.imagen:
            img_path = self.imagen.path
            if os.path.exists(img_path):
                with Image.open(img_path) as img:
                    if img.height > 800 or img.width > 800:
                        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                        img.save(img_path, optimize=True, quality=85)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"Perfil de {self.user.username}"


class ContactMessage(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15, blank=True, null=True)
    mensaje = models.TextField()
    leido = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Mensaje de Contacto"
        verbose_name_plural = "Mensajes de Contacto"
        ordering = ['-created']

    def __str__(self):
        return f"Mensaje de {self.nombre} - {self.created.strftime('%d/%m/%Y')}"