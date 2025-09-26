from django.contrib import admin
from .models import CategoriaProd, Producto, UserProfile, ContactMessage

# Register your models here.

@admin.register(CategoriaProd)
class CategoriaProdAdmin(admin.ModelAdmin):
    list_display = ("nombre", "activo", "created", "updated")
    list_filter = ("activo", "created")
    search_fields = ("nombre", "descripcion")
    list_editable = ("activo",)
    readonly_fields = ("created", "updated")

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categorias", "precio", "disponible", "destacado", "created")
    list_filter = ("categorias", "disponible", "destacado", "created")
    search_fields = ("nombre", "descripcion")
    list_editable = ("disponible", "destacado")
    readonly_fields = ("created", "updated")
    fieldsets = (
        ("Información Básica", {
            "fields": ("nombre", "categorias", "precio", "descripcion")
        }),
        ("Imagen", {
            "fields": ("imagen",)
        }),
        ("Estado", {
            "fields": ("disponible", "destacado")
        }),
        ("Fechas", {
            "fields": ("created", "updated"),
            "classes": ("collapse",)
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "telefono", "created")
    search_fields = ("user__username", "user__email", "telefono")
    readonly_fields = ("created", "updated")

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("nombre", "email", "leido", "created")
    list_filter = ("leido", "created")
    search_fields = ("nombre", "email", "mensaje")
    list_editable = ("leido",)
    readonly_fields = ("created",)
    fieldsets = (
        ("Información de Contacto", {
            "fields": ("nombre", "email", "telefono")
        }),
        ("Mensaje", {
            "fields": ("mensaje",)
        }),
        ("Estado", {
            "fields": ("leido", "created")
        }),
    )
