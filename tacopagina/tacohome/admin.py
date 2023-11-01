from django.contrib import admin
from .models import CategoriaProd, Producto

# Register your models here.

class CategoriaProdAdmin(admin.ModelAdmin):

    
    list_display=("nombre",)

class ProductoAdmin(admin.ModelAdmin):
    list_display=("nombre","categorias","precio")

  

admin.site.register(CategoriaProd, CategoriaProdAdmin)

admin.site.register(Producto, ProductoAdmin)
