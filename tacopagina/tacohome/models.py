from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class CategoriaProd(models.Model):
    nombre=models.CharField(max_length=50)
    

    class Meta:
        verbose_name="categoriaProd"
        verbose_name_plural="categoriasProd"

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre=models.CharField(max_length=50)
    imagen=models.ImageField(upload_to="tienda", null=True, blank=True)
    categorias=models.ForeignKey(CategoriaProd, on_delete=models.CASCADE)
    precio=models.FloatField()
    descripcion = models.CharField(max_length=1000)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name="Producto"
        verbose_name_plural="Productos"
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username