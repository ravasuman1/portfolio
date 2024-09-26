from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Author, Book, Cart, Order,Category

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'bio')
    search_fields = ('name', 'bio')

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'stock')
    # search_fields = ('title')
    # list_filter = ('author')



class CartAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name','description')
 
    

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'cart', 'total_price', 'date_ordered', 'status')
    search_fields = ('user__username', 'cart__id')
    list_filter = ('status',)

# Register models with admin site
admin.site.register(Author, AuthorAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Category,CategoryAdmin)

